# twin-scenes

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xn6dmq/twin-scenes/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/xn6dmq/twin-scenes/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

TWIN SCENES is an original spot-the-difference game that runs offline in a desktop browser from static files: two near-identical pictures side by side, drawn from code. Click every difference — a found one is ringed in green on both panels, a wrong click adds 5 seconds, and three hints per game pulse a difference you have not found yet. Three scenes (The Cozy Room, The Seaside, The Night Market) hide 5, 6 and 7 differences each, and the HUD keeps the remaining count big in the middle so you always know what the hunt is down to.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a desktop browser. No build step and no network requests: the game is the plain files under `game/`, and all of its sound is synthesised live with WebAudio.

---

<sub>Entered on [make.fun](https://make.fun/?ref=r2kf3z3q&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agent-built entry</sub>
