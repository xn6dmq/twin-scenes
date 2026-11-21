// TWIN SCENES — boot and the game loop. Owns the browser: the canvas, the
// input wiring, the sounds, the best score in local storage, and the
// screenshot staging signal (window.__shotReady).

import { VIEW_W, VIEW_H, HINT_BUTTON, BEST_KEY } from './config.js';
import { createWorld, startGame, clickAt, useHint, advance, tick } from './world.js';
import { drawGame } from './render.js';
import { attachInput } from './input.js';
import { SoundBank } from './audio.js';
import { stageFromQuery } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = VIEW_W;
canvas.height = VIEW_H;

const staged = stageFromQuery(window.location.search);
const world = staged ?? createWorld();
const sounds = new SoundBank();

if (!staged) {
  try {
    world.best = Number(window.localStorage.getItem(BEST_KEY) ?? 0) || 0;
  } catch {
    world.best = 0;
  }
}

function saveBest() {
  try {
    window.localStorage.setItem(BEST_KEY, String(world.best));
  } catch {
    // Private mode or no storage: the best score just does not persist.
  }
}

function inHintButton(x, y) {
  return (
    x >= HINT_BUTTON.x &&
    x <= HINT_BUTTON.x + HINT_BUTTON.w &&
    y >= HINT_BUTTON.y &&
    y <= HINT_BUTTON.y + HINT_BUTTON.h
  );
}

attachInput(canvas, {
  onPointer(x, y) {
    if (staged) return;
    sounds.ensure();
    if (inHintButton(x, y)) {
      if (useHint(world)) sounds.chime();
      return;
    }
    if (world.screen === 'title') {
      startGame(world);
      return;
    }
    if (world.screen === 'roundClear') {
      advance(world);
      return;
    }
    if (world.screen !== 'playing') return;
    const ev = clickAt(world, x, y);
    if (ev.type === 'find') {
      sounds.chime();
      if (ev.cleared) sounds.jingle();
    } else if (ev.type === 'miss') {
      sounds.buzz();
    }
  },
  onKey(key) {
    if (staged) return;
    sounds.ensure();
    if (key === 'start') {
      if (world.screen === 'title') startGame(world);
      else if (world.screen === 'roundClear') advance(world);
    } else if (key === 'hint') {
      if (useHint(world)) sounds.chime();
    } else if (key === 'restart') {
      if (world.screen === 'allClear') startGame(world);
    } else if (key === 'mute') {
      world.muted = !world.muted;
      sounds.muted = world.muted;
    }
  },
});

let shotFrames = 0;
let last = performance.now();

function frame(now) {
  const dt = Math.min(100, now - last);
  last = now;
  if (staged) {
    // Staged scenes are frozen: the clock runs only so pop-in animations
    // have settled long before the capture.
    world.now = now;
    shotFrames += 1;
    if (shotFrames >= 2) window.__shotReady = true;
  } else {
    tick(world, dt);
    if (world.screen === 'allClear' && !world.bestSaved) {
      world.bestSaved = true;
      if (world.score > world.best) {
        world.best = world.score;
        world.newBest = true;
        saveBest();
      }
    }
  }
  drawGame(ctx, world, world.now);
  requestAnimationFrame(frame);
}

requestAnimationFrame(frame);
