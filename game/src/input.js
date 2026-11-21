// Pointer and keyboard input, in the game's 1280x720 logical coordinates. The
// canvas fills the window, so a click is mapped through its bounding box. Clicks
// are queued (not held), keys are one-shot actions; the main loop drains both
// every frame.

export const KEY_START = 1;
export const KEY_HINT = 2;
export const KEY_RESTART = 4;
export const KEY_MUTE = 8;

const KEYMAP = new Map([
  ['Space', KEY_START],
  ['Enter', KEY_START],
  ['KeyH', KEY_HINT],
  ['KeyR', KEY_RESTART],
  ['KeyM', KEY_MUTE],
]);

export function createInput(canvas, view) {
  const clicks = [];
  let keys = 0;

  canvas.addEventListener('pointerdown', (event) => {
    const box = canvas.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * view.w;
    const y = ((event.clientY - box.top) / box.height) * view.h;
    clicks.push({ x, y });
  });
  window.addEventListener('keydown', (event) => {
    const flag = KEYMAP.get(event.code);
    if (flag && !event.repeat) {
      keys |= flag;
      event.preventDefault();
    }
  });

  return {
    takeClicks() {
      const taken = clicks.slice();
      clicks.length = 0;
      return taken;
    },
    takeKeys() {
      const taken = keys;
      keys = 0;
      return taken;
    },
  };
}
