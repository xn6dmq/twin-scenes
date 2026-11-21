// Every sound is synthesised with WebAudio: no audio files. A tiny envelope per
// blip, a two-note chime when a difference is found, a low buzz for a wrong
// click, and a short rising jingle when the last round is cleared. M mutes.

export function createAudio() {
  let context = null;
  let muted = false;

  function ensure() {
    if (context === null) {
      const AudioCtor = window.AudioContext || window.webkitAudioContext;
      if (AudioCtor) context = new AudioCtor();
    }
    if (context && context.state === 'suspended') context.resume();
    return context;
  }

  function tone(freq, at, dur, type, gain) {
    if (muted) return;
    const ctx = ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    const t0 = ctx.currentTime + at;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0, t0);
    amp.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  return {
    unlock() { ensure(); },
    toggleMute() { muted = !muted; return muted; },
    click() { tone(660, 0, 0.07, 'triangle', 0.12); },
    found() { tone(784, 0, 0.12, 'sine', 0.2); tone(1175, 0.07, 0.2, 'sine', 0.2); },
    miss() { tone(140, 0, 0.18, 'sawtooth', 0.1); },
    hint() { tone(1047, 0, 0.1, 'sine', 0.14); tone(1047, 0.16, 0.1, 'sine', 0.14); },
    roundClear() { tone(523, 0, 0.14, 'triangle', 0.18); tone(659, 0.1, 0.14, 'triangle', 0.18); tone(784, 0.2, 0.24, 'triangle', 0.18); },
    gameClear() {
      tone(523, 0, 0.16, 'triangle', 0.2);
      tone(659, 0.12, 0.16, 'triangle', 0.2);
      tone(784, 0.24, 0.16, 'triangle', 0.2);
      tone(1047, 0.36, 0.4, 'triangle', 0.22);
    },
  };
}
