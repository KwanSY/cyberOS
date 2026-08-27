// Web Audio API procedural sound synthesizer (Zero external audio assets required)

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx?.currentTime || 0);
    } else if (!muted && this.ambientGain && this.isAmbientRunning) {
      this.ambientGain.gain.setValueAtTime(0.02, this.ctx?.currentTime || 0);
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // 1. Mechanical Keyboard Click (with pitch variation)
  public playKeyClick(variation = 1.0) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Noise/Thump burst
    const pitchJitter = 0.85 + Math.random() * 0.3;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440 * variation * pitchJitter, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.035);

    filter.type = 'highpass';
    filter.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  // 2. Terminal Confirmation / Boot Beep
  public playBeep(freq = 900, duration = 0.08) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.01);
  }

  // 3. System Error Buzzer
  public playBuzzer() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(110, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // 4. Card Pickup Snap (Pleasant crisp chime)
  public playCardSnap() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1174.66, now); // D6
    osc2.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.21);
    osc2.stop(now + 0.21);
  }

  // 5. Heavy Stamp Thud (Official conviction stamp)
  public playStampThud() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Sub-bass heavy thump
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.35);

    subGain.gain.setValueAtTime(0.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    // Mechanical slap/click
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(350, now);
    clickOsc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    clickGain.gain.setValueAtTime(0.25, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);

    subOsc.start(now);
    clickOsc.start(now);
    subOsc.stop(now + 0.36);
    clickOsc.stop(now + 0.1);
  }

  // 6. Victory Fanfare Arpeggio
  public playVictoryFanfare() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C5, E5, G5, C6, E6, G6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.09;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = idx === notes.length - 1 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      const duration = idx === notes.length - 1 ? 0.6 : 0.15;
      gain.gain.setValueAtTime(0.18, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration + 0.02);
    });
  }

  // 7. Ambient 50Hz CRT / Power Transformer Hum
  public toggleAmbientHum(enable?: boolean): boolean {
    const shouldEnable = enable !== undefined ? enable : !this.isAmbientRunning;
    const ctx = this.initCtx();
    if (!ctx) return false;

    if (shouldEnable && !this.isAmbientRunning) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(50, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      gain.gain.setValueAtTime(this.isMuted ? 0 : 0.015, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.ambientNode = osc;
      this.ambientGain = gain;
      this.isAmbientRunning = true;
    } else if (!shouldEnable && this.isAmbientRunning) {
      if (this.ambientNode) {
        try {
          this.ambientNode.stop();
          this.ambientNode.disconnect();
        } catch (_) {}
        this.ambientNode = null;
      }
      this.isAmbientRunning = false;
    }
    return this.isAmbientRunning;
  }
}

export const soundService = new SoundService();
