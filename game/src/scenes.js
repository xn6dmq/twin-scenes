// TWIN SCENES — the three scene painters and their difference tables.
// Every scene is drawn procedurally on Canvas 2D; the twin panel is the same
// painter with the round's differences applied. All coordinates are
// panel-local: each panel is 600 wide and 540 tall, origin top-left.
// A difference flagged `spare` is drawn identically on both panels, so the
// round's counted differences are exactly the unflagged ones.

import { makeRandom } from './random.js';

export const DIFFERENCES = [
  [
    // Round 1 — The Cozy Room (5 counted, 1 spare)
    { id: 'picture', x: 470, y: 115, r: 42 },
    { id: 'clock', x: 300, y: 86, r: 38 },
    { id: 'lamp', x: 470, y: 250, r: 38 },
    { id: 'cat', x: 300, y: 430, r: 48 },
    { id: 'flower', x: 92, y: 382, r: 30 },
    { id: 'book', x: 208, y: 240, r: 32, spare: true },
  ],
  [
    // Round 2 — The Seaside (6 counted, 1 spare)
    { id: 'sail', x: 202, y: 256, r: 42 },
    { id: 'sun', x: 492, y: 82, r: 46 },
    { id: 'lighthouse', x: 495, y: 268, r: 44 },
    { id: 'cloud', x: 238, y: 110, r: 32 },
    { id: 'crab', x: 330, y: 462, r: 32 },
    { id: 'shell', x: 112, y: 470, r: 26 },
    { id: 'starfish', x: 520, y: 474, r: 26, spare: true },
  ],
  [
    // Round 3 — The Night Market (7 counted)
    { id: 'moon', x: 82, y: 72, r: 38 },
    { id: 'lantern', x: 350, y: 96, r: 28 },
    { id: 'awning', x: 160, y: 250, r: 46 },
    { id: 'sign', x: 475, y: 232, r: 38 },
    { id: 'roofcat', x: 460, y: 214, r: 30 },
    { id: 'steam', x: 300, y: 306, r: 34 },
    { id: 'lights', x: 545, y: 330, r: 26 },
  ],
];

export function activeDifferences(roundIndex) {
  return DIFFERENCES[roundIndex].filter((d) => !d.spare);
}

export function paintScene(ctx, ox, oy, roundIndex, variant) {
  ctx.save();
  ctx.translate(ox, oy);
  if (roundIndex === 0) paintCozyRoom(ctx, variant);
  else if (roundIndex === 1) paintSeaside(ctx, variant);
  else paintNightMarket(ctx, variant);
  ctx.restore();
}

// ---- small drawing helpers (panel-local) ----

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
}

function rect(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.rect(x, y, w, h);
}

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

function fill(ctx, color) {
  ctx.fillStyle = color;
  ctx.fill();
}

function starPath(ctx, cx, cy, rOuter, rInner, points) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * i) / points - Math.PI / 2;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// ---- Round 1: The Cozy Room ----

function paintCozyRoom(ctx, variant) {
  const twin = variant === 'twin';

  // Wall and wooden floor.
  rect(ctx, 0, 0, 600, 340);
  fill(ctx, '#f6e7c6');
  rect(ctx, 0, 340, 600, 200);
  fill(ctx, '#8b5a2b');
  ctx.strokeStyle = '#6e451f';
  ctx.lineWidth = 2;
  [380, 420, 460, 500].forEach((y) => line(ctx, 0, y, 600, y));
  ctx.lineWidth = 1.5;
  [120, 300, 480].forEach((x) => line(ctx, x, 340, x, 380));
  [60, 240, 420, 560].forEach((x) => line(ctx, x, 380, x, 420));
  [180, 360, 540].forEach((x) => line(ctx, x, 420, x, 460));
  [90, 270, 450].forEach((x) => line(ctx, x, 460, x, 500));
  [150, 330, 510].forEach((x) => line(ctx, x, 500, x, 540));
  rect(ctx, 0, 334, 600, 8);
  fill(ctx, '#a9805a');

  // Window, top left, with sky, hill, sun and red curtains.
  rect(ctx, 40, 28, 180, 152);
  fill(ctx, '#6b4423');
  ctx.save();
  rect(ctx, 50, 38, 160, 132);
  ctx.clip();
  rect(ctx, 50, 38, 160, 132);
  fill(ctx, '#87ceeb');
  circle(ctx, 182, 68, 18);
  fill(ctx, '#ffd23f');
  circle(ctx, 130, 205, 72);
  fill(ctx, '#5da24a');
  ctx.restore();
  line(ctx, 130, 38, 130, 170);
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 3;
  line(ctx, 50, 104, 210, 104);
  rect(ctx, 34, 22, 26, 166);
  fill(ctx, '#c0392b');
  rect(ctx, 200, 22, 26, 166);
  fill(ctx, '#c0392b');
  ctx.strokeStyle = '#96281b';
  ctx.lineWidth = 2;
  line(ctx, 42, 26, 42, 184);
  line(ctx, 50, 26, 50, 184);
  line(ctx, 208, 26, 208, 184);
  line(ctx, 216, 26, 216, 184);

  // Framed picture, top right: a star in the original, a moon in the twin.
  rect(ctx, 418, 58, 104, 114);
  fill(ctx, '#6b4423');
  rect(ctx, 428, 68, 84, 94);
  fill(ctx, '#dfe9f5');
  if (!twin) {
    starPath(ctx, 470, 115, 27, 11, 5);
    fill(ctx, '#f5b301');
  } else {
    circle(ctx, 470, 115, 24);
    fill(ctx, '#f5b301');
    circle(ctx, 481, 108, 20);
    fill(ctx, '#dfe9f5');
  }

  // Round wall clock near the top centre: 3 o'clock, or half past six.
  circle(ctx, 300, 86, 34);
  fill(ctx, '#ffffff');
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#222222';
  for (let i = 0; i < 12; i++) {
    const a = (Math.PI * i) / 6;
    circle(ctx, 300 + Math.sin(a) * 27, 86 - Math.cos(a) * 27, i % 3 === 0 ? 2.5 : 1.5);
    ctx.fill();
  }
  ctx.strokeStyle = '#222222';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  if (!twin) {
    line(ctx, 300, 86, 320, 86);
    ctx.lineWidth = 3;
    line(ctx, 300, 86, 300, 60);
  } else {
    line(ctx, 300, 86, 295, 105);
    ctx.lineWidth = 3;
    line(ctx, 300, 86, 300, 112);
  }
  circle(ctx, 300, 86, 3.5);
  fill(ctx, '#222222');

  // Bookshelf on the left, with coloured books on two shelves.
  rect(ctx, 60, 200, 200, 148);
  fill(ctx, '#7a4a21');
  const shelf1 = [
    [70, 16, '#c0392b'], [88, 14, '#2980b9'], [104, 18, '#27ae60'],
    [124, 12, '#f39c12'], [138, 20, '#8e44ad'], [160, 14, '#16a085'],
    [176, 16, '#e67e22'], [194, 22, '#f1c40f'],
  ];
  const shelf2 = [
    [70, 18, '#e74c3c'], [90, 12, '#3498db'], [104, 16, '#2ecc71'],
    [122, 20, '#9b59b6'], [144, 14, '#f39c12'], [160, 18, '#1abc9c'],
    [180, 12, '#e67e22'], [194, 16, '#c0392b'], [212, 18, '#2980b9'],
    [232, 14, '#27ae60'],
  ];
  shelf1.forEach(([x, w, c]) => { rect(ctx, x, 212, w, 56); fill(ctx, c); });
  shelf2.forEach(([x, w, c]) => { rect(ctx, x, 282, w, 53); fill(ctx, c); });
  rect(ctx, 66, 268, 188, 8);
  fill(ctx, '#5a3413');
  rect(ctx, 66, 335, 188, 8);
  fill(ctx, '#5a3413');

  // Side table with a lamp on the right: orange shade, or teal.
  rect(ctx, 420, 308, 110, 12);
  fill(ctx, '#7a4a21');
  rect(ctx, 428, 320, 8, 62);
  fill(ctx, '#5a3413');
  rect(ctx, 514, 320, 8, 62);
  fill(ctx, '#5a3413');
  ellipse(ctx, 470, 308, 16, 5);
  fill(ctx, '#3a3a3a');
  ctx.strokeStyle = '#3a3a3a';
  ctx.lineWidth = 4;
  line(ctx, 470, 306, 470, 268);
  circle(ctx, 470, 272, 10);
  fill(ctx, '#fff7cc');
  ctx.beginPath();
  ctx.moveTo(448, 268);
  ctx.lineTo(492, 268);
  ctx.lineTo(500, 232);
  ctx.lineTo(440, 232);
  ctx.closePath();
  fill(ctx, twin ? '#14b8a6' : '#f59e0b');

  // Oval rug with a cat napping on it — the cat is gone in the twin.
  ellipse(ctx, 300, 432, 145, 44);
  fill(ctx, '#b23a48');
  ellipse(ctx, 300, 432, 115, 32);
  fill(ctx, '#d98a94');
  ctx.strokeStyle = '#8e2f3c';
  ctx.lineWidth = 2;
  ctx.stroke();
  if (!twin) {
    ellipse(ctx, 300, 434, 48, 15);
    fill(ctx, '#9aa0a6');
    circle(ctx, 340, 420, 15);
    fill(ctx, '#9aa0a6');
    ctx.beginPath();
    ctx.moveTo(330, 408);
    ctx.lineTo(334, 394);
    ctx.lineTo(340, 406);
    ctx.closePath();
    fill(ctx, '#9aa0a6');
    ctx.beginPath();
    ctx.moveTo(344, 406);
    ctx.lineTo(350, 393);
    ctx.lineTo(352, 408);
    ctx.closePath();
    fill(ctx, '#9aa0a6');
    ctx.beginPath();
    ctx.moveTo(256, 428);
    ctx.quadraticCurveTo(238, 420, 244, 404);
    ctx.quadraticCurveTo(250, 414, 258, 420);
    ctx.closePath();
    fill(ctx, '#9aa0a6');
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    line(ctx, 288, 424, 288, 440);
    line(ctx, 304, 424, 304, 442);
    line(ctx, 318, 426, 318, 440);
    line(ctx, 336, 418, 344, 418);
  }

  // Potted plant at bottom left: pink flower, or yellow.
  ctx.beginPath();
  ctx.moveTo(68, 428);
  ctx.lineTo(116, 428);
  ctx.lineTo(110, 464);
  ctx.lineTo(74, 464);
  ctx.closePath();
  fill(ctx, '#c96f4a');
  ctx.strokeStyle = '#3d8b40';
  ctx.lineWidth = 4;
  line(ctx, 92, 428, 92, 392);
  ellipse(ctx, 78, 410, 14, 6);
  ctx.save();
  ctx.translate(78, 410);
  ctx.rotate(-0.6);
  ellipse(ctx, 0, 0, 14, 6);
  fill(ctx, '#4caf50');
  ctx.restore();
  ellipse(ctx, 106, 408, 14, 6);
  ctx.save();
  ctx.translate(106, 408);
  ctx.rotate(0.6);
  ellipse(ctx, 0, 0, 14, 6);
  fill(ctx, '#4caf50');
  ctx.restore();
  const petal = twin ? '#ffd23f' : '#f27fb0';
  for (let i = 0; i < 5; i++) {
    const a = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    circle(ctx, 92 + Math.cos(a) * 11, 382 + Math.sin(a) * 11, 9);
    fill(ctx, petal);
  }
  circle(ctx, 92, 382, 7);
  fill(ctx, '#f7b731');
}

// ---- Round 2: The Seaside ----

function paintSeaside(ctx, variant) {
  const twin = variant === 'twin';

  // Sky, sea band and sandy beach.
  rect(ctx, 0, 0, 600, 220);
  fill(ctx, '#bfe6f7');
  rect(ctx, 0, 220, 600, 160);
  fill(ctx, '#2f7fc1');
  rect(ctx, 0, 380, 600, 160);
  fill(ctx, '#f0d69c');
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  [[80, 250], [260, 240], [430, 258], [150, 300], [340, 310], [500, 296], [90, 350], [280, 352], [460, 348]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 16, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();
  });

  // Sun top right: plain, or wearing dark sunglasses.
  ctx.strokeStyle = '#f5b301';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i++) {
    const a = (Math.PI * i) / 4;
    line(ctx, 492 + Math.cos(a) * 42, 82 + Math.sin(a) * 42, 492 + Math.cos(a) * 54, 82 + Math.sin(a) * 54);
  }
  circle(ctx, 492, 82, 34);
  fill(ctx, '#ffd23f');
  if (twin) {
    circle(ctx, 478, 80, 11);
    fill(ctx, '#222222');
    circle(ctx, 506, 80, 11);
    fill(ctx, '#222222');
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 3;
    line(ctx, 489, 80, 495, 80);
    line(ctx, 467, 78, 458, 72);
    line(ctx, 517, 78, 526, 72);
  }

  // White cloud top left, and a second small cloud in the twin only.
  function cloud(cx, cy, s) {
    circle(ctx, cx - 22 * s, cy + 4 * s, 16 * s);
    fill(ctx, '#ffffff');
    circle(ctx, cx, cy - 8 * s, 20 * s);
    fill(ctx, '#ffffff');
    circle(ctx, cx + 22 * s, cy + 4 * s, 16 * s);
    fill(ctx, '#ffffff');
    rect(ctx, cx - 36 * s, cy - 2 * s, 72 * s, 16 * s);
    fill(ctx, '#ffffff');
  }
  cloud(120, 78, 1);
  if (twin) cloud(238, 110, 0.72);

  // Sailboat on the sea: white sail, or red.
  ctx.beginPath();
  ctx.moveTo(140, 300);
  ctx.lineTo(235, 300);
  ctx.lineTo(220, 326);
  ctx.lineTo(155, 326);
  ctx.closePath();
  fill(ctx, '#8b5a2b');
  ctx.strokeStyle = '#6e451f';
  ctx.lineWidth = 5;
  line(ctx, 185, 300, 185, 195);
  ctx.beginPath();
  ctx.moveTo(188, 202);
  ctx.lineTo(188, 292);
  ctx.lineTo(242, 292);
  ctx.closePath();
  fill(ctx, twin ? '#e23b3b' : '#ffffff');
  ctx.beginPath();
  ctx.moveTo(185, 195);
  ctx.lineTo(207, 201);
  ctx.lineTo(185, 207);
  ctx.closePath();
  fill(ctx, '#e23b3b');

  // Striped lighthouse on the right: two red stripes, or three.
  ctx.beginPath();
  ctx.moveTo(472, 380);
  ctx.lineTo(528, 380);
  ctx.lineTo(520, 185);
  ctx.lineTo(480, 185);
  ctx.closePath();
  ctx.save();
  ctx.clip();
  rect(ctx, 470, 180, 60, 205);
  fill(ctx, '#f5f0e6');
  const bands = twin ? [[220, 242], [272, 294], [322, 344]] : [[235, 260], [305, 330]];
  bands.forEach(([y1, y2]) => { rect(ctx, 470, y1, 60, y2 - y1); fill(ctx, '#d23b3b'); });
  ctx.restore();
  ctx.beginPath();
  ctx.moveTo(472, 380);
  ctx.lineTo(528, 380);
  ctx.lineTo(520, 185);
  ctx.lineTo(480, 185);
  ctx.closePath();
  ctx.strokeStyle = '#8a8378';
  ctx.lineWidth = 3;
  ctx.stroke();
  rect(ctx, 470, 166, 60, 20);
  fill(ctx, '#222222');
  circle(ctx, 500, 158, 11);
  fill(ctx, '#ffe9a8');
  ellipse(ctx, 480, 384, 26, 8);
  fill(ctx, '#9a938a');
  ellipse(ctx, 524, 386, 22, 7);
  fill(ctx, '#9a938a');

  // Beach umbrella and a green bucket on the sand.
  ctx.strokeStyle = '#7a4a21';
  ctx.lineWidth = 5;
  line(ctx, 380, 380, 380, 470);
  ctx.beginPath();
  ctx.arc(380, 382, 58, Math.PI, 0);
  ctx.closePath();
  fill(ctx, '#e23b3b');
  ctx.save();
  ctx.beginPath();
  ctx.arc(380, 382, 58, Math.PI, 0);
  ctx.closePath();
  ctx.clip();
  for (let i = 0; i < 6; i += 2) {
    ctx.beginPath();
    ctx.moveTo(380, 382);
    ctx.arc(380, 382, 58, Math.PI + (i * Math.PI) / 6, Math.PI + ((i + 1) * Math.PI) / 6);
    ctx.closePath();
    fill(ctx, '#ffffff');
  }
  ctx.restore();
  ctx.strokeStyle = '#b02a2a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(380, 382, 58, Math.PI, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(420, 450);
  ctx.lineTo(455, 450);
  ctx.lineTo(450, 480);
  ctx.lineTo(425, 480);
  ctx.closePath();
  fill(ctx, '#27ae60');
  ctx.strokeStyle = '#1e8449';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(437, 450, 14, Math.PI, 0);
  ctx.stroke();

  // Small crab — present in the original only.
  if (!twin) {
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    line(ctx, 316, 456, 306, 448);
    line(ctx, 316, 462, 304, 462);
    line(ctx, 316, 468, 306, 476);
    line(ctx, 344, 456, 354, 448);
    line(ctx, 344, 462, 356, 462);
    line(ctx, 344, 468, 354, 476);
    ellipse(ctx, 330, 462, 17, 11);
    fill(ctx, '#e74c3c');
    circle(ctx, 310, 452, 6);
    fill(ctx, '#e74c3c');
    circle(ctx, 350, 452, 6);
    fill(ctx, '#e74c3c');
    circle(ctx, 324, 450, 2.5);
    fill(ctx, '#222222');
    circle(ctx, 336, 450, 2.5);
    fill(ctx, '#222222');
  }

  // Shell on the sand: pink, or blue.
  ctx.beginPath();
  ctx.arc(112, 470, 18, Math.PI, 0);
  ctx.closePath();
  fill(ctx, twin ? '#7fb3f7' : '#f7a8b8');
  ctx.strokeStyle = twin ? '#4a7fc1' : '#d67b90';
  ctx.lineWidth = 2;
  line(ctx, 112, 470, 112, 452);
  line(ctx, 112, 470, 100, 456);
  line(ctx, 112, 470, 124, 456);
  line(ctx, 112, 470, 94, 464);
  line(ctx, 112, 470, 130, 464);

  // Starfish on the sand (drawn the same on both panels).
  starPath(ctx, 520, 474, 16, 7, 5);
  fill(ctx, '#f39c12');
}

// ---- Round 3: The Night Market ----

function paintNightMarket(ctx, variant) {
  const twin = variant === 'twin';

  // Dark night sky, stars, and dark ground.
  rect(ctx, 0, 0, 600, 360);
  fill(ctx, '#141d42');
  rect(ctx, 0, 360, 600, 180);
  fill(ctx, '#2b2438');
  const rng = makeRandom(7);
  for (let i = 0; i < 46; i++) {
    const x = rng() * 600;
    const y = rng() * 330;
    ctx.globalAlpha = 0.35 + rng() * 0.6;
    circle(ctx, x, y, 0.8 + rng() * 1.3);
    fill(ctx, '#ffffff');
  }
  ctx.globalAlpha = 1;

  // Pale moon top left: a crescent, or full.
  circle(ctx, 82, 72, 26);
  fill(ctx, '#f5eeda');
  if (!twin) {
    circle(ctx, 95, 65, 22);
    fill(ctx, '#141d42');
  }

  // A string of red paper lanterns sagging across the top.
  function wireY(x) {
    const t = x / 600;
    return (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 132 + t * t * 70;
  }
  ctx.strokeStyle = '#0a0f24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(20, wireY(20));
  ctx.quadraticCurveTo(300, 132, 580, wireY(580));
  ctx.stroke();
  [90, 160, 230, 300, 350, 410, 480, 540].forEach((x) => {
    const y = wireY(x);
    const middle = x === 350;
    ellipse(ctx, x, y + 14, 15, 19);
    fill(ctx, middle && twin ? '#f5b301' : '#e23b3b');
    ctx.strokeStyle = '#8e1f1f';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    rect(ctx, x - 6, y - 6, 12, 5);
    fill(ctx, '#f5b301');
    ctx.strokeStyle = '#f5b301';
    ctx.lineWidth = 2;
    line(ctx, x, y + 33, x, y + 41);
  });

  // Left stall with a striped awning and coloured jars on its counter.
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 8;
  line(ctx, 90, 265, 90, 395);
  line(ctx, 250, 265, 250, 395);
  rect(ctx, 80, 330, 180, 62);
  fill(ctx, '#7a4a21');
  ctx.strokeStyle = '#5a3413';
  ctx.lineWidth = 2;
  line(ctx, 80, 352, 260, 352);
  line(ctx, 80, 372, 260, 372);
  const awningA = twin ? '#3b82f6' : '#e23b3b';
  for (let i = 0; i < 10; i++) {
    rect(ctx, 75 + i * 19, 225, 19, 42);
    fill(ctx, i % 2 === 0 ? awningA : '#ffffff');
  }
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(75 + i * 19 + 9.5, 267, 9.5, 0, Math.PI);
    fill(ctx, i % 2 === 0 ? awningA : '#ffffff');
  }
  const jars = [[120, 310, '#e74c3c'], [160, 305, '#27ae60'], [200, 312, '#f39c12']];
  jars.forEach(([x, y, c]) => {
    rr(ctx, x - 14, y, 28, 30, 6);
    fill(ctx, c);
    rect(ctx, x - 10, y - 6, 20, 7);
    fill(ctx, '#d9c9a8');
  });

  // Right stall with a striped awning and a hanging sign.
  ctx.strokeStyle = '#5a3a1a';
  ctx.lineWidth = 8;
  line(ctx, 390, 265, 390, 395);
  line(ctx, 540, 265, 540, 395);
  rect(ctx, 380, 330, 160, 62);
  fill(ctx, '#7a4a21');
  ctx.strokeStyle = '#5a3413';
  ctx.lineWidth = 2;
  line(ctx, 380, 352, 540, 352);
  line(ctx, 380, 372, 540, 372);
  for (let i = 0; i < 10; i++) {
    rect(ctx, 375 + i * 19, 225, 19, 42);
    fill(ctx, i % 2 === 0 ? '#27ae60' : '#ffffff');
  }
  for (let i = 0; i < 10; i++) {
    ctx.beginPath();
    ctx.arc(375 + i * 19 + 9.5, 267, 9.5, 0, Math.PI);
    fill(ctx, i % 2 === 0 ? '#27ae60' : '#ffffff');
  }
  // Hanging sign: a gold star in the original, a teal fish in the twin.
  ctx.strokeStyle = '#3a2f1a';
  ctx.lineWidth = 2;
  line(ctx, 458, 225, 458, 214);
  line(ctx, 492, 225, 492, 214);
  rr(ctx, 448, 214, 54, 36, 6);
  fill(ctx, '#3a2f1a');
  if (!twin) {
    starPath(ctx, 475, 232, 14, 6, 5);
    fill(ctx, '#f5b301');
  } else {
    ellipse(ctx, 475, 232, 15, 8);
    fill(ctx, '#14b8a6');
    ctx.beginPath();
    ctx.moveTo(488, 232);
    ctx.lineTo(498, 224);
    ctx.lineTo(498, 240);
    ctx.closePath();
    fill(ctx, '#14b8a6');
    circle(ctx, 466, 230, 2);
    fill(ctx, '#0e1526');
  }
  // A cat sitting on the right stall roof — present in the original only.
  if (!twin) {
    ellipse(ctx, 452, 212, 13, 11);
    fill(ctx, '#1a1a2e');
    circle(ctx, 462, 196, 9);
    fill(ctx, '#1a1a2e');
    ctx.beginPath();
    ctx.moveTo(455, 189);
    ctx.lineTo(457, 180);
    ctx.lineTo(461, 188);
    ctx.closePath();
    fill(ctx, '#1a1a2e');
    ctx.beginPath();
    ctx.moveTo(465, 188);
    ctx.lineTo(469, 180);
    ctx.lineTo(471, 189);
    ctx.closePath();
    fill(ctx, '#1a1a2e');
    ctx.beginPath();
    ctx.moveTo(440, 218);
    ctx.quadraticCurveTo(430, 212, 436, 202);
    ctx.quadraticCurveTo(442, 208, 444, 216);
    ctx.closePath();
    fill(ctx, '#1a1a2e');
  }

  // Small food cart in the middle with steam rising.
  rect(ctx, 250, 322, 104, 26);
  for (let i = 0; i < 6; i++) {
    rect(ctx, 250 + i * 18, 322, 18, 26);
    fill(ctx, i % 2 === 0 ? '#e23b3b' : '#ffffff');
  }
  rect(ctx, 258, 348, 88, 84);
  fill(ctx, '#0f766e');
  rect(ctx, 250, 348, 104, 12);
  fill(ctx, '#115e59');
  circle(ctx, 278, 438, 10);
  fill(ctx, '#222222');
  circle(ctx, 326, 438, 10);
  fill(ctx, '#222222');
  circle(ctx, 278, 438, 4);
  fill(ctx, '#9aa0a6');
  circle(ctx, 326, 438, 4);
  fill(ctx, '#9aa0a6');
  ctx.strokeStyle = 'rgba(255,255,255,0.75)';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  const wisps = twin ? [300] : [286, 300, 314];
  wisps.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 330);
    ctx.bezierCurveTo(x - 7, 318, x + 7, 310, x - 3, 298);
    ctx.bezierCurveTo(x - 7, 290, x + 4, 286, x, 280);
    ctx.stroke();
  });

  // A string of glowing bulbs down the right edge: five, or four.
  ctx.strokeStyle = '#0a0f24';
  ctx.lineWidth = 2.5;
  line(ctx, 545, 250, 545, 430);
  const bulbYs = twin ? [272, 308, 380, 414] : [272, 308, 344, 380, 414];
  bulbYs.forEach((y) => {
    circle(ctx, 545, y, 12);
    ctx.fillStyle = 'rgba(255,217,122,0.25)';
    ctx.fill();
    circle(ctx, 545, y, 7);
    fill(ctx, '#ffd97a');
  });
}
