// TWIN SCENES — layout, rounds and scoring constants.
// The playfield is a fixed 1280 x 720 logical canvas. Two picture panels sit
// side by side; every difference is addressed in panel-local coordinates
// (each panel is 600 wide and 540 tall, origin at its top-left corner).

export const VIEW_W = 1280;
export const VIEW_H = 720;

export const PANEL_W = 600;
export const PANEL_H = 540;
export const PANEL_Y = 118;
export const LEFT_X = 20;
export const RIGHT_X = 660;

export const HINT_BUTTON = { x: 1082, y: 22, w: 176, h: 54 };

export const POINTS_PER_FIND = 100;
export const MISTAKE_PENALTY = 25;
export const WRONG_TIME_PENALTY_S = 5;
export const HINTS_PER_GAME = 3;
export const HINT_PULSE_MS = 2500;
export const FLASH_MS = 450;
export const MARKER_POP_MS = 260;

export const BEST_KEY = 'twin-scenes-best';

export const ROUNDS = [
  { name: 'Round 1 — The Cozy Room', scene: 'cozy', diffs: 5 },
  { name: 'Round 2 — The Seaside', scene: 'seaside', diffs: 6 },
  { name: 'Round 3 — The Night Market', scene: 'market', diffs: 7 },
];

export function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return String(m).padStart(2, '0') + ':' + String(r).padStart(2, '0');
}
