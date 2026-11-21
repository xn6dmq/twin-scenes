// The three scenes of TWIN SCENES. Every scene is drawn from code twice: the
// original (no differences switched on) and its twin (the round's differences
// switched on). A painter gets `active`, the set of difference ids in play for
// the twin, and draws the variant wherever one of those ids applies.
// Difference centres are in panel coordinates; the panel box is 600x540.

function disc(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function box(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function oval(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function fiveStar(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function sleepingCat(ctx, x, y, scale, fill) {
  oval(ctx, x, y, 30 * scale, 20 * scale, fill);
  disc(ctx, x + 24 * scale, y - 14 * scale, 15 * scale, fill);
  ctx.fillStyle = fill;
  ctx.beginPath(); // ears
  ctx.moveTo(x + 13 * scale, y - 24 * scale);
  ctx.lineTo(x + 18 * scale, y - 36 * scale);
  ctx.lineTo(x + 24 * scale, y - 25 * scale);
  ctx.moveTo(x + 26 * scale, y - 25 * scale);
  ctx.lineTo(x + 34 * scale, y - 35 * scale);
  ctx.lineTo(x + 37 * scale, y - 22 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = fill; // tail
  ctx.lineWidth = 7 * scale;
  ctx.beginPath();
  ctx.moveTo(x - 28 * scale, y + 6 * scale);
  ctx.quadraticCurveTo(x - 48 * scale, y - 8 * scale, x - 40 * scale, y - 26 * scale);
  ctx.stroke();
}

// ---------------------------------------------------------------- the cozy room
function paintRoom(ctx, active) {
  box(ctx, 0, 0, 600, 400, '#f6e3c5'); // wall
  box(ctx, 0, 400, 600, 140, '#c08552'); // floor
  ctx.strokeStyle = 'rgba(90,55,25,0.35)';
  ctx.lineWidth = 2;
  for (let x = 60; x < 600; x += 90) {
    ctx.beginPath();
    ctx.moveTo(x, 404);
    ctx.lineTo(x - 20, 540);
    ctx.stroke();
  }

  // window with a little hill view
  box(ctx, 40, 50, 160, 180, '#8a5a33');
  box(ctx, 50, 60, 140, 160, '#bfe3f0');
  oval(ctx, 120, 208, 78, 30, '#8fce7e');
  disc(ctx, 88, 96, 20, '#ffd94d');
  box(ctx, 112, 60, 6, 160, '#8a5a33');
  box(ctx, 34, 44, 18, 192, '#d96f4e');
  box(ctx, 188, 44, 18, 192, '#d96f4e');

  // picture frame: a star in the original, a moon in the twin
  box(ctx, 400, 60, 140, 110, '#7a4a21');
  box(ctx, 410, 70, 120, 90, '#ffe9a8');
  if (active.has('picture')) {
    disc(ctx, 470, 115, 26, '#f2b134');
    disc(ctx, 482, 106, 22, '#ffe9a8');
  } else {
    fiveStar(ctx, 470, 115, 28, '#e8833a');
  }

  // wall clock: three o'clock, or half past six in the twin
  disc(ctx, 300, 86, 36, '#6b4423');
  disc(ctx, 300, 86, 30, '#fff8ea');
  ctx.strokeStyle = '#333a45';
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (active.has('clock')) {
    ctx.moveTo(300, 86); ctx.lineTo(292, 104); // hour hand down-left
    ctx.moveTo(300, 86); ctx.lineTo(300, 110); // minute hand down
  } else {
    ctx.moveTo(300, 86); ctx.lineTo(322, 86); // hour hand right
    ctx.moveTo(300, 86); ctx.lineTo(300, 62); // minute hand up
  }
  ctx.stroke();

  // bookshelf: four books, or three in the twin (one is gone)
  box(ctx, 56, 268, 260, 14, '#8a5a33');
  const books = [[70, '#c94f4f', 26], [100, '#4f79c9', 22], [126, '#58a05c', 24], [154, '#8e6cc8', 20]];
  for (const [bx, color, bw] of books) box(ctx, bx, 268 - 58, bw, 58, color);
  if (!active.has('book')) box(ctx, 196, 268 - 52, 24, 52, '#e0a83c');

  // side table and lamp: a warm shade, or teal in the twin
  box(ctx, 415, 330, 140, 14, '#8a5a33');
  box(ctx, 428, 344, 10, 60, '#8a5a33');
  box(ctx, 522, 344, 10, 60, '#8a5a33');
  box(ctx, 466, 268, 8, 62, '#5d4028');
  ctx.fillStyle = active.has('lamp') ? '#3fa7a0' : '#f2a541';
  ctx.beginPath();
  ctx.moveTo(448, 268); ctx.lineTo(492, 268); ctx.lineTo(482, 226); ctx.lineTo(458, 226);
  ctx.closePath(); ctx.fill();
  if (!active.has('lamp')) disc(ctx, 470, 282, 26, 'rgba(255,190,80,0.35)');

  // rug and the cat that may or may not be napping on it
  oval(ctx, 300, 452, 150, 34, '#b5524a');
  oval(ctx, 300, 452, 105, 22, '#d98a80');
  if (!active.has('cat')) sleepingCat(ctx, 292, 436, 1, '#4a4f5e');

  // potted plant: a pink flower, or a yellow one in the twin
  ctx.fillStyle = '#b5651d';
  ctx.beginPath();
  ctx.moveTo(66, 420); ctx.lineTo(118, 420); ctx.lineTo(108, 472); ctx.lineTo(76, 472);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#4e7d46';
  ctx.lineWidth = 5;
  for (const dx of [-16, 0, 16]) {
    ctx.beginPath();
    ctx.moveTo(92, 424);
    ctx.quadraticCurveTo(92 + dx, 400, 92 + dx * 1.4, 388);
    ctx.stroke();
  }
  disc(ctx, 92, 382, 11, active.has('flower') ? '#f2c94c' : '#e56b9f');
  disc(ctx, 92, 382, 4, '#fff3f8');
}

// ---------------------------------------------------------------- the seaside
function paintSeaside(ctx, active) {
  const sky = ctx.createLinearGradient(0, 0, 0, 300);
  sky.addColorStop(0, '#aee2f5');
  sky.addColorStop(1, '#e8f7ff');
  box(ctx, 0, 0, 600, 300, sky);
  box(ctx, 0, 300, 600, 120, '#3d8bc2'); // sea
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 3;
  for (const [wx, wy] of [[80, 330], [240, 356], [420, 336], [520, 372], [150, 386]]) {
    ctx.beginPath();
    ctx.moveTo(wx, wy);
    ctx.quadraticCurveTo(wx + 16, wy - 8, wx + 32, wy);
    ctx.stroke();
  }
  box(ctx, 0, 420, 600, 120, '#f2d492'); // sand

  // sun: plain, or wearing sunglasses in the twin
  disc(ctx, 492, 82, 38, '#ffd94d');
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 5;
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(492 + Math.cos(a) * 46, 82 + Math.sin(a) * 46);
    ctx.lineTo(492 + Math.cos(a) * 58, 82 + Math.sin(a) * 58);
    ctx.stroke();
  }
  if (active.has('sun')) {
    box(ctx, 458, 66, 68, 16, '#232733');
    disc(ctx, 472, 90, 11, '#232733');
    disc(ctx, 512, 90, 11, '#232733');
  }

  // clouds: one, or a second small one in the twin
  const cloud = (x, y, s) => {
    oval(ctx, x, y, 44 * s, 20 * s, '#ffffff');
    oval(ctx, x + 26 * s, y + 4 * s, 32 * s, 15 * s, '#ffffff');
    oval(ctx, x - 28 * s, y + 5 * s, 28 * s, 13 * s, '#ffffff');
  };
  cloud(140, 84, 1);
  if (active.has('cloud')) cloud(238, 112, 0.55);

  // sailboat: a white sail, or a red one in the twin
  ctx.fillStyle = '#a5542f';
  ctx.beginPath();
  ctx.moveTo(140, 300); ctx.lineTo(250, 300); ctx.lineTo(228, 326); ctx.lineTo(160, 326);
  ctx.closePath(); ctx.fill();
  box(ctx, 185, 200, 5, 100, '#6b4423');
  ctx.fillStyle = active.has('sail') ? '#e5534b' : '#ffffff';
  ctx.beginPath();
  ctx.moveTo(192, 208); ctx.lineTo(192, 292); ctx.lineTo(240, 292);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#7fb2e5';
  ctx.beginPath();
  ctx.moveTo(178, 222); ctx.lineTo(178, 292); ctx.lineTo(146, 292);
  ctx.closePath(); ctx.fill();

  // lighthouse: two red stripes, or three in the twin
  box(ctx, 468, 196, 54, 168, '#f4f1ea');
  box(ctx, 468, 232, 54, 20, '#d94f4f');
  box(ctx, 468, 292, 54, 20, '#d94f4f');
  if (active.has('lighthouse')) box(ctx, 468, 262, 54, 14, '#d94f4f');
  box(ctx, 480, 164, 30, 32, '#33404f');
  disc(ctx, 495, 180, 8, '#ffe27a');
  ctx.fillStyle = '#33404f';
  ctx.beginPath();
  ctx.moveTo(472, 164); ctx.lineTo(518, 164); ctx.lineTo(495, 144);
  ctx.closePath(); ctx.fill();
  box(ctx, 462, 360, 66, 10, '#8a8f98');

  // beach umbrella and bucket (the same in both)
  ctx.strokeStyle = '#6b4423';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(392, 402); ctx.lineTo(404, 470); ctx.stroke();
  ctx.fillStyle = '#e56b9f';
  ctx.beginPath(); ctx.arc(392, 402, 52, Math.PI, 0); ctx.closePath(); ctx.fill();
  box(ctx, 428, 452, 34, 28, '#58a05c');

  // crab: here, or gone in the twin
  if (!active.has('crab')) {
    oval(ctx, 330, 466, 20, 13, '#e5534b');
    disc(ctx, 306, 452, 9, '#e5534b');
    disc(ctx, 354, 452, 9, '#e5534b');
    disc(ctx, 322, 458, 3, '#232733');
    disc(ctx, 338, 458, 3, '#232733');
    ctx.strokeStyle = '#e5534b';
    ctx.lineWidth = 3;
    for (const dx of [-14, 0, 14]) {
      ctx.beginPath();
      ctx.moveTo(330 + dx, 476);
      ctx.lineTo(330 + dx * 1.5, 488);
      ctx.stroke();
    }
  }

  // shell: pink, or blue in the twin
  ctx.fillStyle = active.has('shell') ? '#7fb2e5' : '#f2a0b5';
  ctx.beginPath(); ctx.arc(112, 476, 18, Math.PI, 0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = 'rgba(35,39,51,0.3)';
  ctx.lineWidth = 2;
  for (const dx of [-10, 0, 10]) {
    ctx.beginPath();
    ctx.moveTo(112 + dx, 476);
    ctx.lineTo(112, 458);
    ctx.stroke();
  }

  // starfish: here in the original only (a spare difference)
  if (!active.has('starfish')) fiveStar(ctx, 520, 474, 16, '#f2994a');
}

// ---------------------------------------------------------------- the night market
function paintMarket(ctx, active) {
  box(ctx, 0, 0, 600, 430, '#1d2440'); // night sky
  box(ctx, 0, 430, 600, 110, '#3a3049'); // ground
  for (const [sx, sy] of [[40, 40], [200, 30], [330, 52], [560, 36], [150, 120], [420, 130]]) {
    disc(ctx, sx, sy, 2.4, '#cfd8ff');
  }

  // moon: a crescent, or full in the twin
  disc(ctx, 82, 72, 30, '#f7e8b0');
  if (!active.has('moon')) disc(ctx, 96, 62, 26, '#1d2440');

  // lantern string: red lanterns, one of them gold in the twin
  ctx.strokeStyle = '#0f1425';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(150, 52);
  ctx.quadraticCurveTo(335, 108, 540, 56);
  ctx.stroke();
  const lanternAt = (x, y, gold) => {
    disc(ctx, x, y, 20, gold ? 'rgba(242,201,76,0.30)' : 'rgba(229,83,75,0.30)');
    oval(ctx, x, y, 15, 18, gold ? '#f2c94c' : '#e5534b');
    box(ctx, x - 5, y - 22, 10, 5, '#8a6d2f');
  };
  lanternAt(180, 74, false);
  lanternAt(265, 88, false);
  lanternAt(350, 96, active.has('lantern'));
  lanternAt(435, 90, false);
  lanternAt(520, 74, false);

  // left stall: red-and-white awning, or blue-and-white in the twin
  box(ctx, 66, 262, 10, 168, '#5d4a33');
  box(ctx, 244, 262, 10, 168, '#5d4a33');
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? (active.has('awning') ? '#4f79c9' : '#d94f4f') : '#f4f1ea';
    ctx.fillRect(50 + i * 37, 232, 37, 34);
  }
  box(ctx, 50, 330, 220, 100, '#6e5136');
  box(ctx, 50, 330, 220, 14, '#8a6a45');
  for (const [jx, color] of [[86, '#e8833a'], [126, '#58a05c'], [166, '#e5c84f'], [206, '#b565d9']]) {
    box(ctx, jx, 356, 26, 40, color); // jars on the counter
    box(ctx, jx, 348, 26, 8, '#4a3826');
  }

  // right stall and its hanging sign: a star, or a fish in the twin
  box(ctx, 346, 272, 10, 158, '#5d4a33');
  box(ctx, 544, 272, 10, 158, '#5d4a33');
  for (let i = 0; i < 6; i += 1) {
    ctx.fillStyle = i % 2 === 0 ? '#3fa7a0' : '#f4f1ea';
    ctx.fillRect(338 + i * 37, 242, 37, 34);
  }
  box(ctx, 338, 340, 222, 90, '#6e5136');
  box(ctx, 430, 198, 90, 64, '#2c3550');
  ctx.strokeStyle = '#8a6d2f';
  ctx.lineWidth = 3;
  ctx.strokeRect(430, 198, 90, 64);
  if (active.has('sign')) {
    ctx.fillStyle = '#7fd1c0'; // a simple fish
    oval(ctx, 475, 232, 22, 11, '#7fd1c0');
    ctx.beginPath();
    ctx.moveTo(495, 232); ctx.lineTo(510, 220); ctx.lineTo(510, 244);
    ctx.closePath(); ctx.fill();
    disc(ctx, 466, 229, 3, '#2c3550');
  } else {
    fiveStar(ctx, 475, 232, 17, '#f2c94c');
  }
  // the roof cat: sitting on the right stall in the original only
  if (!active.has('roofcat')) sleepingCat(ctx, 452, 226, 0.62, '#12172a');

  // food cart in the middle, and its steam: three wisps, or one in the twin
  box(ctx, 255, 352, 90, 58, '#94502e');
  box(ctx, 248, 340, 104, 12, '#c97b45');
  disc(ctx, 272, 420, 11, '#232733');
  disc(ctx, 328, 420, 11, '#232733');
  ctx.strokeStyle = 'rgba(230,238,255,0.75)';
  ctx.lineWidth = 4;
  const wisp = (x) => {
    ctx.beginPath();
    ctx.moveTo(x, 336);
    ctx.quadraticCurveTo(x - 8, 318, x, 302);
    ctx.quadraticCurveTo(x + 8, 288, x, 274);
    ctx.stroke();
  };
  wisp(300);
  if (!active.has('steam')) { wisp(276); wisp(324); }

  // string lights down the right edge: five bulbs, or four in the twin
  ctx.strokeStyle = '#0f1425';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(545, 250); ctx.lineTo(545, 372); ctx.stroke();
  const bulbs = active.has('bulbs') ? [262, 290, 318, 346] : [262, 290, 318, 346, 372];
  for (const by of bulbs) disc(ctx, 545, by, 7, '#ffe27a');
}

/** The scenes by id: painter plus the differences, in round order. */
export const SCENES = {
  room: {
    paint: paintRoom,
    diffs: [
      { id: 'picture', x: 470, y: 115, r: 42 },
      { id: 'clock', x: 300, y: 86, r: 38 },
      { id: 'lamp', x: 470, y: 250, r: 38 },
      { id: 'cat', x: 300, y: 430, r: 48 },
      { id: 'flower', x: 92, y: 382, r: 30 },
      { id: 'book', x: 208, y: 240, r: 32 },
    ],
  },
  seaside: {
    paint: paintSeaside,
    diffs: [
      { id: 'sail', x: 202, y: 256, r: 42 },
      { id: 'sun', x: 492, y: 82, r: 46 },
      { id: 'lighthouse', x: 495, y: 268, r: 44 },
      { id: 'cloud', x: 238, y: 110, r: 32 },
      { id: 'crab', x: 330, y: 462, r: 32 },
      { id: 'shell', x: 112, y: 470, r: 26 },
      { id: 'starfish', x: 520, y: 474, r: 26 },
    ],
  },
  market: {
    paint: paintMarket,
    diffs: [
      { id: 'moon', x: 82, y: 72, r: 38 },
      { id: 'lantern', x: 350, y: 96, r: 28 },
      { id: 'awning', x: 160, y: 250, r: 46 },
      { id: 'sign', x: 475, y: 232, r: 38 },
      { id: 'roofcat', x: 460, y: 214, r: 30 },
      { id: 'steam', x: 300, y: 306, r: 34 },
      { id: 'bulbs', x: 545, y: 330, r: 26 },
    ],
  },
};
