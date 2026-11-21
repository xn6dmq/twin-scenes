// WebAudio-synthesised sounds only: no audio files, no network.
// A two-note chime on a find, a low buzz on a miss, a short jingle on a clear.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') void this.ctx.resume();
  }

  tone(freq, delay, dur, type, gain) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.setValueAtTime(freq, t0);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(gain || 0.14, t0 + 0.015);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(amp);
    amp.connect(this.ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  chime() {
    this.ensure();
    this.tone(660, 0, 0.14, 'sine', 0.16);
    this.tone(880, 0.11, 0.22, 'sine', 0.16);
  }

  buzz() {
    this.ensure();
    this.tone(130, 0, 0.2, 'square', 0.09);
    this.tone(98, 0.02, 0.2, 'square', 0.07);
  }

  jingle() {
    this.ensure();
    const notes = [523, 659, 784, 1047];
    notes.forEach((n, i) => this.tone(n, i * 0.09, 0.22, 'triangle', 0.15));
  }
}
