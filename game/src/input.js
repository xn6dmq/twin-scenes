// Pointer and keyboard input, reported in the game's logical 1280 x 720
// coordinates whatever size the canvas is shown at.

export function attachInput(canvas, handlers) {
  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function onPointer(event) {
    const p = toLogical(event);
    handlers.onPointer(p.x, p.y);
  }

  function onKey(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handlers.onKey('start');
    } else if (event.key === 'h' || event.key === 'H') {
      handlers.onKey('hint');
    } else if (event.key === 'r' || event.key === 'R') {
      handlers.onKey('restart');
    } else if (event.key === 'm' || event.key === 'M') {
      handlers.onKey('mute');
    }
  }

  canvas.addEventListener('pointerdown', onPointer);
  window.addEventListener('keydown', onKey);
  return function detach() {
    canvas.removeEventListener('pointerdown', onPointer);
    window.removeEventListener('keydown', onKey);
  };
}
