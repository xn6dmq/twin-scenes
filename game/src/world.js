// TWIN SCENES — state, rules and events. Pure logic: no drawing, no browser.
// The renderer reads this state; the boot code in main.js owns the browser.

import {
  ROUNDS,
  POINTS_PER_FIND,
  MISTAKE_PENALTY,
  WRONG_TIME_PENALTY_S,
  HINTS_PER_GAME,
  HINT_PULSE_MS,
  FLASH_MS,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  LEFT_X,
  RIGHT_X,
} from './config.js';
import { activeDifferences } from './scenes.js';

export function createWorld() {
  return {
    screen: 'title', // 'title' | 'playing' | 'roundClear' | 'allClear'
    round: 0,
    found: [],
    foundAt: {},
    mistakes: 0,
    hintsLeft: HINTS_PER_GAME,
    score: 0,
    elapsed: 0, // seconds, while playing
    totalFound: 0,
    flashes: [], // { panel, x, y, until } in panel-local coords
    hintPulse: null, // { diff, until }
    now: 0, // ms clock advanced by tick()
    muted: false,
    best: 0,
    bestSaved: false,
    newBest: false,
  };
}

export function startGame(w) {
  w.screen = 'playing';
  w.round = 0;
  w.found = [];
  w.foundAt = {};
  w.mistakes = 0;
  w.hintsLeft = HINTS_PER_GAME;
  w.score = 0;
  w.elapsed = 0;
  w.totalFound = 0;
  w.flashes = [];
  w.hintPulse = null;
  w.bestSaved = false;
  w.newBest = false;
}

export function roundClearBonus(w) {
  return 100 + 20 * w.hintsLeft;
}

export function remaining(w) {
  return activeDifferences(w.round).length - w.found.length;
}

export function panelAt(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { panel: 'left', lx: x - LEFT_X, ly: y - PANEL_Y };
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { panel: 'right', lx: x - RIGHT_X, ly: y - PANEL_Y };
  return null;
}

export function clickAt(w, x, y) {
  if (w.screen !== 'playing') return { type: 'none' };
  const hit = panelAt(x, y);
  if (!hit) return { type: 'none' };
  const diffs = activeDifferences(w.round);
  for (const d of diffs) {
    if (w.found.includes(d.id)) continue;
    const dx = hit.lx - d.x;
    const dy = hit.ly - d.y;
    if (dx * dx + dy * dy <= d.r * d.r) {
      w.found.push(d.id);
      w.foundAt[d.id] = w.now;
      w.score += POINTS_PER_FIND;
      w.totalFound += 1;
      const cleared = w.found.length === diffs.length;
      if (cleared) {
        w.score += roundClearBonus(w);
        w.screen = 'roundClear';
      }
      return { type: 'find', diff: d, cleared };
    }
  }
  w.mistakes += 1;
  w.score = Math.max(0, w.score - MISTAKE_PENALTY);
  w.elapsed += WRONG_TIME_PENALTY_S;
  w.flashes.push({ panel: hit.panel, x: hit.lx, y: hit.ly, until: w.now + FLASH_MS });
  return { type: 'miss' };
}

export function useHint(w) {
  if (w.screen !== 'playing' || w.hintsLeft <= 0) return null;
  const unfound = activeDifferences(w.round).filter((d) => !w.found.includes(d.id));
  if (unfound.length === 0) return null;
  const diff = unfound[Math.floor(Math.random() * unfound.length)];
  w.hintsLeft -= 1;
  w.hintPulse = { diff, until: w.now + HINT_PULSE_MS };
  return diff;
}

// Advance from a round-clear screen: next round, or the all-clear summary.
export function advance(w) {
  if (w.screen !== 'roundClear') return false;
  if (w.round + 1 < ROUNDS.length) {
    w.round += 1;
    w.found = [];
    w.foundAt = {};
    w.flashes = [];
    w.hintPulse = null;
    w.screen = 'playing';
    return true;
  }
  w.screen = 'allClear';
  return true;
}

export function tick(w, dtMs) {
  w.now += dtMs;
  if (w.screen === 'playing') w.elapsed += dtMs / 1000;
  w.flashes = w.flashes.filter((f) => f.until > w.now);
  if (w.hintPulse && w.hintPulse.until <= w.now) w.hintPulse = null;
}
