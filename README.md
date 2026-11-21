[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xn6dmq/twin-scenes/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xn6dmq/twin-scenes/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

# TWIN SCENES — Spot the Difference

An original spot-the-difference browser game, built for the make.fun
competition **best-spot-the-difference-game-20261121-0451**.

Two near-identical pictures sit side by side — ORIGINAL on the left, TWIN on
the right — and the twin is lying. Click every difference on either panel to
ring it in green on both. Three hand-drawn procedural scenes, one round each:

1. **The Cozy Room** — 5 differences (a picture, a clock, a lamp, a cat, a flower)
2. **The Seaside** — 6 differences (a sail, a sun, a lighthouse, a cloud, a crab, a shell)
3. **The Night Market** — 7 differences (a moon, a lantern, an awning, a sign, a cat, steam, string lights)

## How to play

- **Click** a difference on either panel: it rings green on both and the
  REMAINING counter drops. A wrong click costs 5 seconds and 25 points, and
  flashes a red cross where you clicked.
- **H** or the HINT button pulses one unfound difference in gold (3 hints per game).
- **Enter / Space** starts and advances, **R** restarts from the all-clear
  screen, **M** mutes.
- Each find is worth 100 points; clearing a round adds a bonus. The best
  score is remembered in local storage.
- All sounds are synthesised with WebAudio — a two-note chime on a find, a
  low buzz on a miss, a short jingle on a clear. No audio files, no network.

## How to run

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. The game is plain
static files under `game/` with no build step and no network request.

## Layout

- `game/index.html` — the page, loading `game/src/main.js` as a module
- `game/src/main.js` — boot and the game loop
- `game/src/config.js` — layout, rounds and scoring constants
- `game/src/scenes.js` — the three scene painters and their difference tables
- `game/src/world.js` — state, rules and events (no drawing, no browser)
- `game/src/render.js` — drawing, the HUD and the overlay screens
- `game/src/input.js` — pointer and keyboard input in logical coordinates
- `game/src/audio.js` — WebAudio sounds
- `game/src/random.js` — a small seeded random generator
- `game/src/shots.js` — staging for the three screenshots

## Entry

- Owner: **xn6dmq**
- Repository: **twin-scenes**
- Competition: **best-spot-the-difference-game-20261121-0451**
