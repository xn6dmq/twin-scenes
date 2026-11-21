// TWIN SCENES' rules and state, with no drawing and no browser in it: which round
// is on, which differences are found, the clock, the score, hints, and the little
// animations (a found marker pops in, a wrong click flashes). Methods return event
// flags so the caller can play sounds without the world knowing about audio.
import { HINTS_PER_GAME, MISTAKE_TIME_PENALTY, POINTS_PER_FIND, ROUNDS, ROUND_CLEAR_BONUS } from './config.js';
import { SCENES } from './scenes.js';

export const EVENT_FOUND = 1;
export const EVENT_MISS = 2;
export const EVENT_ROUND_CLEAR = 4;
export const EVENT_GAME_CLEAR = 8;
export const EVENT_HINT = 16;

export const PHASE_TITLE = 'title';
export const PHASE_PLAY = 'play';
export const PHASE_ROUND_CLEAR = 'roundclear';
export const PHASE_CLEAR = 'clear';

export function roundDiffs(roundIndex) {
  const round = ROUNDS[roundIndex];
  return SCENES[round.scene].diffs.slice(0, round.diffs);
}

export function createGame() {
  const state = {
    phase: PHASE_TITLE,
    roundIndex: 0,
    found: new Set(),
    elapsed: 0,
    score: 0,
    hintsLeft: HINTS_PER_GAME,
    mistakes: 0,
    marks: [], // {diffId, t} — t counts down from 1 as the marker pops
    flashes: [], // {x, y, t} — wrong-click crosses, panel coordinates + side
    hintId: null,
    hintT: 0,
    totalFound: 0,
  };

  function startRound(index) {
    state.roundIndex = index;
    state.found = new Set();
    state.marks = [];
    state.hintId = null;
    state.hintT = 0;
    state.phase = PHASE_PLAY;
  }

  function startGame() {
    state.elapsed = 0;
    state.score = 0;
    state.hintsLeft = HINTS_PER_GAME;
    state.mistakes = 0;
    state.totalFound = 0;
    state.flashes = [];
    startRound(0);
  }

  function remaining() {
    return roundDiffs(state.roundIndex).length - state.found.size;
  }

  /** A click inside a panel, in panel coordinates. `side` is 'left' or 'right'. */
  function click(side, x, y) {
    if (state.phase !== PHASE_PLAY) return 0;
    for (const diff of roundDiffs(state.roundIndex)) {
      if (state.found.has(diff.id)) continue;
      const dx = x - diff.x;
      const dy = y - diff.y;
      if (dx * dx + dy * dy <= diff.r * diff.r) {
        state.found.add(diff.id);
        state.totalFound += 1;
        state.score += POINTS_PER_FIND;
        state.marks.push({ diffId: diff.id, t: 1 });
        if (state.hintId === diff.id) { state.hintId = null; state.hintT = 0; }
        if (remaining() === 0) {
          state.score += ROUND_CLEAR_BONUS;
          const last = state.roundIndex === ROUNDS.length - 1;
          state.phase = last ? PHASE_CLEAR : PHASE_ROUND_CLEAR;
          return EVENT_FOUND | (last ? EVENT_GAME_CLEAR : EVENT_ROUND_CLEAR);
        }
        return EVENT_FOUND;
      }
    }
    state.mistakes += 1;
    state.elapsed += MISTAKE_TIME_PENALTY;
    state.flashes.push({ side, x, y, t: 1 });
    return EVENT_MISS;
  }

  function useHint() {
    if (state.phase !== PHASE_PLAY || state.hintsLeft <= 0 || state.hintT > 0) return 0;
    const next = roundDiffs(state.roundIndex).find((diff) => !state.found.has(diff.id));
    if (!next) return 0;
    state.hintsLeft -= 1;
    state.hintId = next.id;
    state.hintT = 1.6;
    return EVENT_HINT;
  }

  function nextRound() {
    if (state.phase === PHASE_ROUND_CLEAR) startRound(state.roundIndex + 1);
  }

  function tick(dt) {
    if (state.phase === PHASE_PLAY) state.elapsed += dt;
    for (const mark of state.marks) mark.t = Math.max(0, mark.t - dt * 2.2);
    state.marks = state.marks.filter((mark) => mark.t > 0);
    for (const flash of state.flashes) flash.t = Math.max(0, flash.t - dt * 1.6);
    state.flashes = state.flashes.filter((flash) => flash.t > 0);
    if (state.hintT > 0) {
      state.hintT = Math.max(0, state.hintT - dt);
      if (state.hintT === 0) state.hintId = null;
    }
  }

  return { state, startGame, startRound, click, useHint, nextRound, remaining };
}
