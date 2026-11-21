// Boot and the one loop: clicks and keys in, the game state advances with the real
// clock, the renderer paints. Screens live in the game state (title, play, round
// clear, all clear); this file only routes input to the right verb and plays the
// sounds the returned events call for.
//
// ?shot=start|play|end (with &seed=N) stages that scene instead of running the
// loop, paints it twice and sets window.__shotReady for a screenshot.
import { BEST_KEY, HINT_BTN, PANEL, VIEW } from './config.js';
import { createGame, EVENT_FOUND, EVENT_GAME_CLEAR, EVENT_HINT, EVENT_MISS, EVENT_ROUND_CLEAR, PHASE_CLEAR, PHASE_PLAY, PHASE_ROUND_CLEAR, PHASE_TITLE } from './world.js';
import { createRenderer } from './render.js';
import { createInput, KEY_HINT, KEY_MUTE, KEY_RESTART, KEY_START } from './input.js';
import { createAudio } from './audio.js';
import { stageShot } from './shots.js';

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');

const canvas = document.getElementById('game');
const status = document.getElementById('status');
const game = createGame();
const renderer = createRenderer(canvas);
const audio = createAudio();

function readBest() {
  try {
    return Number.parseInt(window.localStorage.getItem(BEST_KEY) ?? '0', 10) || 0;
  } catch {
    return 0;
  }
}

function saveBest(value) {
  try {
    window.localStorage.setItem(BEST_KEY, String(value));
  } catch {
    // Storage can be off (private windows): the best then lasts this visit only.
  }
}

let best = readBest();

function playEvents(events) {
  if (events & EVENT_GAME_CLEAR) audio.gameClear();
  else if (events & EVENT_ROUND_CLEAR) audio.roundClear();
  else if (events & EVENT_FOUND) audio.found();
  if (events & EVENT_MISS) audio.miss();
  if (events & EVENT_HINT) audio.hint();
}

function advance() {
  const { state } = game;
  if (state.phase === PHASE_TITLE) {
    game.startGame();
    status.textContent = 'Playing. Find every difference between the two pictures.';
  } else if (state.phase === PHASE_ROUND_CLEAR) {
    game.nextRound();
  } else if (state.phase === PHASE_CLEAR) {
    game.startGame();
  }
}

function handleClick({ x, y }) {
  audio.unlock();
  const { state } = game;
  if (state.phase !== PHASE_PLAY) {
    advance();
    return;
  }
  if (x >= HINT_BTN.x && x <= HINT_BTN.x + HINT_BTN.w && y >= HINT_BTN.y && y <= HINT_BTN.y + HINT_BTN.h) {
    playEvents(game.useHint());
    return;
  }
  for (const side of ['left', 'right']) {
    const originX = side === 'left' ? PANEL.leftX : PANEL.rightX;
    if (x >= originX && x < originX + PANEL.w && y >= PANEL.y && y < PANEL.y + PANEL.h) {
      playEvents(game.click(side, x - originX, y - PANEL.y));
      return;
    }
  }
}

function handleKeys(keys) {
  if (keys & KEY_MUTE) audio.toggleMute();
  if (keys & KEY_HINT) playEvents(game.useHint());
  if (keys & KEY_START) { audio.unlock(); advance(); }
  if ((keys & KEY_RESTART) && game.state.phase === PHASE_CLEAR) game.startGame();
}

if (shot) {
  stageShot(shot, game);
  let painted = 0;
  const paint = () => {
    renderer.draw(game.state, best, game);
    painted += 1;
    if (painted < 2) requestAnimationFrame(paint);
    else window.__shotReady = true;
  };
  requestAnimationFrame(paint);
} else {
  const input = createInput(canvas, VIEW);
  let last = performance.now();
  let wasPhase = game.state.phase;
  const frame = (now) => {
    requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    for (const click of input.takeClicks()) handleClick(click);
    handleKeys(input.takeKeys());
    game.tick(dt);
    if (game.state.phase === PHASE_CLEAR && wasPhase !== PHASE_CLEAR && game.state.score > best) {
      best = game.state.score;
      saveBest(best);
    }
    wasPhase = game.state.phase;
    renderer.draw(game.state, best, game);
  };
  status.textContent = 'Twin Scenes. Click or press Enter to start.';
  requestAnimationFrame(frame);
}
