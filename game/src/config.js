// TWIN SCENES — the numbers the whole game agrees on. The playfield is a fixed
// 1280x720 logical area; the renderer scales it to fit the window, so every
// coordinate below is in that logical space.

export const VIEW = { w: 1280, h: 720 };

// The two picture panels. A scene painter fills a PANEL.w x PANEL.h box whose
// top-left corner is (leftX, y) on the left and (rightX, y) on the right.
export const PANEL = { w: 600, h: 540, y: 118, leftX: 20, rightX: 660 };

// One round per scene; a round plays the first `diffs` differences of its scene.
export const ROUNDS = [
  { scene: 'room', title: 'Round 1 · The Cozy Room', diffs: 5 },
  { scene: 'seaside', title: 'Round 2 · The Seaside', diffs: 6 },
  { scene: 'market', title: 'Round 3 · The Night Market', diffs: 7 },
];

export const HINTS_PER_GAME = 3;
export const POINTS_PER_FIND = 100;
export const ROUND_CLEAR_BONUS = 150;
export const MISTAKE_TIME_PENALTY = 5; // seconds added to the clock per wrong click

// The HINT button in the HUD, in logical coordinates; clicks land here too.
export const HINT_BTN = { x: 1082, y: 22, w: 176, h: 54 };

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
export const BEST_KEY = 'twin-scenes.best';
