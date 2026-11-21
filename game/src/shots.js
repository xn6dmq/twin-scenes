// The screenshot scenes behind ?shot=start|play|end. Each sets the real game state
// directly (no fake rendering): start is the title over the first scene, play is
// round 1 with three of its five differences already ringed and two still hidden,
// end is the all-clear summary over the finished night market.
import { PHASE_CLEAR, roundDiffs } from './world.js';

export function stageShot(name, game) {
  const { state } = game;
  if (name === 'play') {
    game.startGame();
    const diffs = roundDiffs(0);
    for (const diff of diffs.slice(0, 3)) state.found.add(diff.id);
    state.totalFound = 3;
    state.score = 300;
    state.elapsed = 47;
    state.mistakes = 1;
    return;
  }
  if (name === 'end') {
    game.startGame();
    game.startRound(2);
    for (const diff of roundDiffs(2)) state.found.add(diff.id);
    state.totalFound = 18;
    state.score = 2140;
    state.elapsed = 192;
    state.mistakes = 4;
    state.hintsLeft = 1;
    state.phase = PHASE_CLEAR;
    return;
  }
  // 'start' and anything else: a fresh game still on its title screen.
  state.roundIndex = 0;
}
