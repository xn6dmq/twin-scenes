// Screenshot staging: the page query string stages one of three scenes so the
// maker can capture real renders of the game — the title screen, mid-round
// play, and the all-clear summary. After the staged scene has been painted
// twice, window.__shotReady is set by main.js.

import { createWorld } from './world.js';
import { activeDifferences } from './scenes.js';

export function stageFromQuery(search) {
  const params = new URLSearchParams(search);
  const shot = params.get('shot');
  if (!shot) return null;
  const w = createWorld();

  if (shot === 'start') {
    // Title screen over the first scene, nothing found yet.
    w.screen = 'title';
    w.round = 0;
  } else if (shot === 'play') {
    // Mid-round play in round 1: three of five differences already found.
    w.screen = 'playing';
    w.round = 0;
    const diffs = activeDifferences(0);
    for (let i = 0; i < 3; i++) {
      const d = diffs[i];
      w.found.push(d.id);
      w.foundAt[d.id] = -10000;
    }
    w.score = 300;
    w.elapsed = 47;
    w.mistakes = 1;
    w.totalFound = 3;
  } else if (shot === 'end') {
    // All-clear summary over the finished night market.
    w.screen = 'allClear';
    w.round = 2;
    const diffs = activeDifferences(2);
    for (const d of diffs) {
      w.found.push(d.id);
      w.foundAt[d.id] = -10000;
    }
    w.score = 2140;
    w.elapsed = 192;
    w.mistakes = 4;
    w.hintsLeft = 1;
    w.totalFound = 18;
    w.best = 2140;
  } else {
    return null;
  }
  return w;
}
