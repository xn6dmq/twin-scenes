// TWIN SCENES — drawing, the HUD and the overlay screens.
// Reads the world state and paints the whole 1280 x 720 frame.

import {
  VIEW_W,
  VIEW_H,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  LEFT_X,
  RIGHT_X,
  HINT_BUTTON,
  ROUNDS,
  HINT_PULSE_MS,
  MARKER_POP_MS,
  formatTime,
} from './config.js';
import { paintScene, activeDifferences } from './scenes.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function drawPanel(ctx, w, x, side, now) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, PANEL_Y, PANEL_W, PANEL_H);
  ctx.clip();
  paintScene(ctx, x, PANEL_Y, w.round, side === 'left' ? 'orig' : 'twin');
  ctx.restore();

  // Found markers ring the difference on BOTH panels.
  const diffs = activeDifferences(w.round);
  for (const d of diffs) {
    if (!w.found.includes(d.id)) continue;
    const age = now - (w.foundAt[d.id] ?? 0);
    const pop = age < MARKER_POP_MS ? 1.35 - 0.35 * (age / MARKER_POP_MS) : 1;
    const alpha = Math.min(1, age / 90 + 0.25);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x + d.x, PANEL_Y + d.y, d.r * pop, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + d.x, PANEL_Y + d.y, d.r * pop + 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // A hint pulses an unfound difference in gold on both panels.
  if (w.hintPulse) {
    const d = w.hintPulse.diff;
    if (!w.found.includes(d.id)) {
      const frac = 1 - (w.hintPulse.until - now) / HINT_PULSE_MS;
      const pulse = 1 + 0.16 * Math.sin(now / 130);
      ctx.save();
      ctx.globalAlpha = 0.55 + 0.45 * Math.sin(frac * Math.PI);
      ctx.strokeStyle = '#f5b301';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x + d.x, PANEL_Y + d.y, d.r * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Wrong-click flashes: a red cross where the player clicked.
  for (const f of w.flashes) {
    if (f.panel !== side) continue;
    const left = Math.max(0, f.until - now) / 450;
    const cx = x + f.x;
    const cy = PANEL_Y + f.y;
    ctx.save();
    ctx.globalAlpha = Math.min(1, left + 0.3);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 14, cy - 14);
    ctx.lineTo(cx + 14, cy + 14);
    ctx.moveTo(cx + 14, cy - 14);
    ctx.lineTo(cx - 14, cy + 14);
    ctx.stroke();
    ctx.restore();
  }

  ctx.strokeStyle = '#2c3e5a';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, PANEL_Y, PANEL_W, PANEL_H);
}

function drawHud(ctx, w) {
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.font = 'bold 30px system-ui, sans-serif';
  ctx.fillText('TWIN SCENES', 20, 36);
  ctx.fillStyle = '#9fb3d1';
  ctx.font = '17px system-ui, sans-serif';
  ctx.fillText(ROUNDS[w.round].name, 20, 64);

  // Remaining counter, centred at the top.
  const diffs = activeDifferences(w.round);
  const left = diffs.length - w.found.length;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#9fb3d1';
  ctx.font = 'bold 13px system-ui, sans-serif';
  ctx.fillText('R E M A I N I N G', 640, 26);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px system-ui, sans-serif';
  ctx.fillText(String(left), 640, 68);
  ctx.fillStyle = '#9fb3d1';
  ctx.font = '16px system-ui, sans-serif';
  ctx.fillText(`FOUND ${w.found.length} OF ${diffs.length}`, 640, 96);

  // Time and score, top right, left of the hint button.
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.fillText(`TIME ${formatTime(w.elapsed)}`, 1060, 38);
  ctx.fillText(`SCORE ${w.score}`, 1060, 66);

  // Hint button.
  rr(ctx, HINT_BUTTON.x, HINT_BUTTON.y, HINT_BUTTON.w, HINT_BUTTON.h, 10);
  ctx.fillStyle = w.hintsLeft > 0 ? '#1e3a5f' : '#2a3446';
  ctx.fill();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = w.hintsLeft > 0 ? '#ffffff' : '#7a8799';
  ctx.font = 'bold 20px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`HINT (${w.hintsLeft})`, HINT_BUTTON.x + HINT_BUTTON.w / 2, HINT_BUTTON.y + 35);

  // Panel labels, kept to the outer edges so they never meet the centred
  // FOUND counter in the middle of the HUD.
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ORIGINAL', LEFT_X, 110);
  ctx.textAlign = 'right';
  ctx.fillText('TWIN', RIGHT_X + PANEL_W, 110);
}

function dim(ctx) {
  ctx.fillStyle = 'rgba(8, 12, 26, 0.72)';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
}

function card(ctx, x, y, w, h) {
  rr(ctx, x, y, w, h, 18);
  ctx.fillStyle = '#16213a';
  ctx.fill();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function centred(ctx, text, y, font, color) {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillText(text, VIEW_W / 2, y);
}

function drawTitle(ctx, w, now) {
  dim(ctx);
  card(ctx, 290, 130, 700, 440);
  centred(ctx, 'TWIN SCENES', 230, 'bold 58px system-ui, sans-serif', '#ffffff');
  centred(ctx, 'Two pictures. One is lying. Find every difference.', 280, '20px system-ui, sans-serif', '#c7d3e8');
  centred(ctx, 'Click a difference on either panel to ring it in green.', 330, '18px system-ui, sans-serif', '#9fb3d1');
  centred(ctx, 'A wrong click costs 5 seconds and 25 points.', 358, '18px system-ui, sans-serif', '#9fb3d1');
  centred(ctx, 'H or the HINT button pulses one unfound difference (3 per game).', 386, '18px system-ui, sans-serif', '#9fb3d1');
  centred(ctx, 'M mutes the sounds. 3 rounds, 18 differences in all.', 414, '18px system-ui, sans-serif', '#9fb3d1');
  if (w.best > 0) centred(ctx, `BEST SCORE  ${w.best}`, 462, 'bold 20px system-ui, sans-serif', '#f5b301');
  if (Math.floor(now / 500) % 2 === 0) {
    centred(ctx, 'Press ENTER to start', 520, 'bold 24px system-ui, sans-serif', '#ffffff');
  }
}

function drawRoundClear(ctx, w) {
  dim(ctx);
  card(ctx, 340, 170, 600, 360);
  centred(ctx, 'ROUND CLEAR!', 260, 'bold 50px system-ui, sans-serif', '#22c55e');
  centred(ctx, ROUNDS[w.round].name, 312, '20px system-ui, sans-serif', '#c7d3e8');
  centred(ctx, `TIME  ${formatTime(w.elapsed)}      MISTAKES  ${w.mistakes}`, 372, '20px system-ui, sans-serif', '#ffffff');
  centred(ctx, `SCORE  ${w.score}      FOUND  ${w.totalFound} / 18`, 408, '20px system-ui, sans-serif', '#ffffff');
  const next = w.round + 1 < ROUNDS.length ? `Press ENTER for ${ROUNDS[w.round + 1].name}` : 'Press ENTER to see your results';
  centred(ctx, next, 478, 'bold 22px system-ui, sans-serif', '#ffffff');
}

function drawAllClear(ctx, w) {
  dim(ctx);
  card(ctx, 290, 130, 700, 460);
  centred(ctx, 'ALL CLEAR!', 226, 'bold 56px system-ui, sans-serif', '#f5b301');
  centred(ctx, 'Every difference found. The twins confess.', 276, '20px system-ui, sans-serif', '#c7d3e8');
  centred(ctx, `FINAL SCORE  ${w.score}`, 336, 'bold 30px system-ui, sans-serif', '#ffffff');
  centred(ctx, `TIME  ${formatTime(w.elapsed)}      MISTAKES  ${w.mistakes}`, 384, '20px system-ui, sans-serif', '#ffffff');
  centred(ctx, `DIFFERENCES FOUND  ${w.totalFound} / 18      HINTS LEFT  ${w.hintsLeft}`, 420, '20px system-ui, sans-serif', '#ffffff');
  if (w.newBest) centred(ctx, 'NEW BEST SCORE!', 462, 'bold 22px system-ui, sans-serif', '#f5b301');
  else if (w.best > 0) centred(ctx, `BEST SCORE  ${w.best}`, 462, '20px system-ui, sans-serif', '#9fb3d1');
  centred(ctx, 'Press R to play again', 528, 'bold 22px system-ui, sans-serif', '#ffffff');
}

export function drawGame(ctx, w, now) {
  ctx.fillStyle = '#0e1526';
  ctx.fillRect(0, 0, VIEW_W, VIEW_H);
  drawPanel(ctx, w, LEFT_X, 'left', now);
  drawPanel(ctx, w, RIGHT_X, 'right', now);
  drawHud(ctx, w);
  if (w.screen === 'title') drawTitle(ctx, w, now);
  else if (w.screen === 'roundClear') drawRoundClear(ctx, w);
  else if (w.screen === 'allClear') drawAllClear(ctx, w);
}
