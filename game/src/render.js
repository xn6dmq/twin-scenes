// Drawing only: the game state in, pixels out. Both panels are painted by the
// scene painter (the twin gets the round's differences), found differences get a
// green ring on both panels, a hint pulses gold, and a wrong click flashes a red
// cross. The HUD keeps the remaining count big in the middle: it is the number
// the player plays for.
import { FONT, HINT_BTN, PANEL, ROUNDS, VIEW } from './config.js';
import { SCENES } from './scenes.js';
import { PHASE_CLEAR, PHASE_ROUND_CLEAR, PHASE_TITLE, roundDiffs } from './world.js';

const BG = '#1c1f27';
const HUD_INK = '#eef1f5';
const MUTED = '#9aa3b2';
const FOUND_RING = '#39d353';
const HINT_RING = '#f2c94c';
const MISS = '#e5534b';

export function formatTime(seconds) {
  const whole = Math.floor(seconds);
  const mm = String(Math.floor(whole / 60)).padStart(2, '0');
  const ss = String(whole % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext('2d');
  const view = { scale: 1, x: 0, y: 0 };

  function resize() {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    view.scale = Math.min(canvas.width / VIEW.w, canvas.height / VIEW.h);
    view.x = (canvas.width - VIEW.w * view.scale) / 2;
    view.y = (canvas.height - VIEW.h * view.scale) / 2;
  }

  function text(value, x, y, size, color, align = 'left', weight = 400) {
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(value, x, y);
  }

  function ring(x, y, r, color, width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawPanel(side, state) {
    const round = ROUNDS[state.roundIndex];
    const scene = SCENES[round.scene];
    const diffs = roundDiffs(state.roundIndex);
    const originX = side === 'left' ? PANEL.leftX : PANEL.rightX;
    const active = side === 'left' ? new Set() : new Set(diffs.map((d) => d.id));

    ctx.save();
    ctx.beginPath();
    ctx.rect(originX, PANEL.y, PANEL.w, PANEL.h);
    ctx.clip();
    ctx.translate(originX, PANEL.y);
    scene.paint(ctx, active);

    // found markers: a ring on both panels at the difference's centre
    for (const diff of diffs) {
      if (!state.found.has(diff.id)) continue;
      const mark = state.marks.find((m) => m.diffId === diff.id);
      const pop = mark ? 1 + mark.t * 0.6 : 1;
      ring(diff.x, diff.y, diff.r * 0.62 * pop, FOUND_RING, 5);
      ring(diff.x, diff.y, diff.r * 0.62 * pop + 5, 'rgba(57,211,83,0.35)', 3);
    }
    // the hinted difference pulses gold
    if (state.hintId) {
      const diff = diffs.find((d) => d.id === state.hintId);
      if (diff) {
        const pulse = 1 + Math.sin(performance.now() / 130) * 0.12;
        ring(diff.x, diff.y, diff.r * 0.8 * pulse, HINT_RING, 4);
      }
    }
    // wrong clicks flash a cross, on the panel that was clicked
    for (const flash of state.flashes) {
      if (flash.side !== side) continue;
      ctx.strokeStyle = MISS;
      ctx.globalAlpha = Math.min(1, flash.t * 1.4);
      ctx.lineWidth = 6;
      const s = 16;
      ctx.beginPath();
      ctx.moveTo(flash.x - s, flash.y - s); ctx.lineTo(flash.x + s, flash.y + s);
      ctx.moveTo(flash.x + s, flash.y - s); ctx.lineTo(flash.x - s, flash.y + s);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    ctx.restore();

    // frame and label
    ctx.strokeStyle = '#0d0f14';
    ctx.lineWidth = 3;
    ctx.strokeRect(originX, PANEL.y, PANEL.w, PANEL.h);
    text(side === 'left' ? 'ORIGINAL' : 'TWIN', originX + 4, PANEL.y - 10, 19, MUTED, 'left', 600);
  }

  function drawHud(state, game) {
    text('TWIN SCENES', 22, 40, 25, HUD_INK, 'left', 700);
    text(ROUNDS[state.roundIndex].title, 22, 72, 19, MUTED);
    const left = game.remaining();
    text(`REMAINING ${left}`, VIEW.w / 2, 52, 40, left <= 2 ? HINT_RING : HUD_INK, 'center', 800);
    text(`found ${state.found.size} of ${roundDiffs(state.roundIndex).length}`, VIEW.w / 2, 84, 18, MUTED, 'center');
    text(`TIME ${formatTime(state.elapsed)}`, 862, 40, 23, HUD_INK, 'left', 600);
    text(`SCORE ${state.score}`, 862, 72, 19, MUTED);
    // hint button
    ctx.fillStyle = state.hintsLeft > 0 ? '#2c6e49' : '#3a4152';
    ctx.fillRect(HINT_BTN.x, HINT_BTN.y, HINT_BTN.w, HINT_BTN.h);
    text(`HINT × ${state.hintsLeft}`, HINT_BTN.x + HINT_BTN.w / 2, HINT_BTN.y + 37, 22, '#ffffff', 'center', 700);
  }

  function overlay(lines, prompt) {
    ctx.fillStyle = 'rgba(10,12,17,0.62)';
    ctx.fillRect(0, 0, VIEW.w, VIEW.h);
    const w = 680;
    const h = 150 + lines.length * 36 + 70;
    const x = (VIEW.w - w) / 2;
    const y = (VIEW.h - h) / 2;
    ctx.fillStyle = '#252b38';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#3a4152';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    lines.forEach((line, i) => {
      const isTitle = i === 0;
      text(line, VIEW.w / 2, y + (isTitle ? 84 : 118 + (i - 1) * 36), isTitle ? 52 : 22, isTitle ? HUD_INK : MUTED, 'center', isTitle ? 800 : 400);
    });
    text(prompt, VIEW.w / 2, y + h - 28, 22, HINT_RING, 'center', 600);
  }

  function draw(state, best, game) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(view.scale, 0, 0, view.scale, view.x, view.y);
    drawPanel('left', state);
    drawPanel('right', state);
    drawHud(state, game);
    if (state.phase === PHASE_TITLE) {
      overlay([
        'TWIN SCENES',
        'Two pictures, almost twins. Click every difference.',
        'A wrong click adds 5 seconds. Three hints per game.',
        best > 0 ? `Best score ${best}` : '',
      ], 'Click or press Enter to start');
    } else if (state.phase === PHASE_ROUND_CLEAR) {
      overlay([
        'ROUND CLEAR!',
        `${ROUNDS[state.roundIndex].title} — every difference found.`,
        `Score ${state.score} · Time ${formatTime(state.elapsed)}`,
      ], 'Click or press Enter for the next round');
    } else if (state.phase === PHASE_CLEAR) {
      overlay([
        'ALL CLEAR!',
        `Every difference in all ${ROUNDS.length} scenes found.`,
        `Final score ${state.score} · Time ${formatTime(state.elapsed)} · Mistakes ${state.mistakes}`,
        best > 0 ? `Best score ${best}` : '',
      ], 'Click or press R to play again');
    }
  }

  resize();
  window.addEventListener('resize', resize);
  return { draw };
}
