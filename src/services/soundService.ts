// Web Audio API procedural sound synthesizer (Zero external audio assets required)

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private ambientNode: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning: boolean = false;

  public initCtx() {
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

  // 8. Tape Rewind Sound (for Bad Ending rewind)
  public playTapeRewind() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Frequency sweeps up and oscillates rapidly
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(3200, now + 0.8);
    osc.frequency.exponentialRampToValueAtTime(800, now + 1.2);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1500, now);
    filter.Q.setValueAtTime(3, now);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  // 9. Privilege Override Siren / CRT Glitch Beep
  public playPrivilegeOverrideAlarm() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    [0, 0.15, 0.3, 0.45].forEach((offset, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(idx % 2 === 0 ? 880 : 1200, now + offset);
      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.13);
    });
  }

  // 10. Trace Step Hop Beep
  public playTraceStepBeep(hopIndex = 0) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 500 + hopIndex * 150;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + 200, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 11. Spatial Reality Door Knocking & Heavy Boots Footsteps (Tier 1.5 Fourth-Wall Breaker)
  public playSpatialDoorKnock() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Heavy tactical footsteps approaching (3 pairs of heavy thuds)
    const footstepOffsets = [0.0, 0.25, 0.5, 0.75, 1.0, 1.25];
    footstepOffsets.forEach((t) => {
      const stepOsc = ctx.createOscillator();
      const stepGain = ctx.createGain();
      stepOsc.type = 'sine';
      stepOsc.frequency.setValueAtTime(80, now + t);
      stepOsc.frequency.exponentialRampToValueAtTime(30, now + t + 0.08);

      stepGain.gain.setValueAtTime(0.18 + t * 0.08, now + t);
      stepGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.08);

      stepOsc.connect(stepGain);
      stepGain.connect(ctx.destination);

      stepOsc.start(now + t);
      stepOsc.stop(now + t + 0.09);
    });

    // Intense Realistic Wood Door Pounding / Sledgehammer Bangs
    const knockTimings = [1.6, 1.78, 1.95, 2.2, 2.38, 2.56, 2.85, 3.05, 3.25];
    knockTimings.forEach((t, i) => {
      // Deep wood door hollow resonance
      const lowOsc = ctx.createOscillator();
      const lowGain = ctx.createGain();
      lowOsc.type = 'triangle';
      lowOsc.frequency.setValueAtTime(110 + (i % 3) * 15, now + t);
      lowOsc.frequency.exponentialRampToValueAtTime(35, now + t + 0.12);

      lowGain.gain.setValueAtTime(0.45, now + t);
      lowGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.12);

      lowOsc.connect(lowGain);
      lowGain.connect(ctx.destination);

      lowOsc.start(now + t);
      lowOsc.stop(now + t + 0.13);

      // Sharp knuckle/metal door frame impact crack
      const crackOsc = ctx.createOscillator();
      const crackGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      crackOsc.type = 'sawtooth';
      crackOsc.frequency.setValueAtTime(650, now + t);
      crackOsc.frequency.exponentialRampToValueAtTime(100, now + t + 0.04);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(500, now + t);

      crackGain.gain.setValueAtTime(0.3, now + t);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.04);

      crackOsc.connect(filter);
      filter.connect(crackGain);
      crackGain.connect(ctx.destination);

      crackOsc.start(now + t);
      crackOsc.stop(now + t + 0.05);
    });
  }

  // 12. Corporate Firewall Meltdown & Breach Alarm
  public playMeltdownAlarm() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.linearRampToValueAtTime(760, now + 0.4);
    osc.frequency.linearRampToValueAtTime(380, now + 0.8);
    osc.frequency.linearRampToValueAtTime(760, now + 1.2);
    osc.frequency.linearRampToValueAtTime(380, now + 1.6);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.05);
  }

  // 13. Public Broadcast Fanfare Alert
  public playBroadcastAlert() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    const now = ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + idx * 0.12);
      gain.gain.setValueAtTime(0.18, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.36);
    });
  }

  // 14. Bad Ending Somber Ominous Drone & Tragedy Music System
  private badEndingNodes: Array<{ osc?: OscillatorNode; node?: AudioNode; gain: GainNode; timerId?: number }> = [];

  public playBadEndingDrone() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    this.stopBadEndingDrone();

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.linearRampToValueAtTime(0.4, now + 2.0); // Enhanced volume
    masterGain.connect(ctx.destination);
    this.badEndingNodes.push({ node: masterGain, gain: masterGain });

    // Layer 1: Deep D-Minor Sub & Harmonic Bed (55Hz, 73.42Hz, 110Hz, 146.83Hz)
    const frequencies = [55.0, 73.42, 110.0, 146.83];
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.linearRampToValueAtTime(freq * (1 + (idx % 2 === 0 ? 0.003 : -0.003)), now + 12.0);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(idx === 0 ? 140 : 420, now);
      filter.frequency.linearRampToValueAtTime(idx === 0 ? 95 : 300, now + 10.0);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(idx === 0 ? 0.25 : 0.16, now + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      this.badEndingNodes.push({ osc, gain });
    });

    // Layer 2: Cold Wind Hollow Noise (Atmospheric desolation)
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.4;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(480, now);
    noiseFilter.frequency.linearRampToValueAtTime(750, now + 6);
    noiseFilter.frequency.linearRampToValueAtTime(360, now + 14);
    noiseFilter.Q.setValueAtTime(4.0, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 3.0);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(masterGain);

    whiteNoise.start(now);
    this.badEndingNodes.push({ node: whiteNoise, gain: noiseGain });

    // Layer 3: Sparse Sad Bell / Piano Solitary Drops (D4 -> F4 -> A4 -> C5 -> D4)
    const sadNotes = [293.66, 349.23, 440.0, 523.25, 440.0, 349.23, 293.66];
    sadNotes.forEach((pitch, i) => {
      const dropTime = now + 1.2 + i * 2.6; // One sad note every 2.6s
      const noteOsc = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const noteFilter = ctx.createBiquadFilter();

      noteOsc.type = 'sine';
      noteOsc.frequency.setValueAtTime(pitch, dropTime);
      noteOsc.frequency.exponentialRampToValueAtTime(pitch * 0.99, dropTime + 2.2);

      noteFilter.type = 'lowpass';
      noteFilter.frequency.setValueAtTime(1200, dropTime);

      noteGain.gain.setValueAtTime(0.001, dropTime);
      noteGain.gain.linearRampToValueAtTime(0.24, dropTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, dropTime + 2.4);

      noteOsc.connect(noteFilter);
      noteFilter.connect(noteGain);
      noteGain.connect(masterGain);

      noteOsc.start(dropTime);
      noteOsc.stop(dropTime + 2.5);
      this.badEndingNodes.push({ osc: noteOsc, gain: noteGain });
    });
  }

  public stopBadEndingDrone() {
    if (this.badEndingNodes.length > 0) {
      this.badEndingNodes.forEach(({ osc, node, gain }) => {
        try {
          if (this.ctx) {
            gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
          }
          if (osc) osc.stop(this.ctx ? this.ctx.currentTime + 0.85 : 0);
          if (node && 'stop' in node) (node as AudioScheduledSourceNode).stop();
        } catch (_) {}
      });
      this.badEndingNodes = [];
    }
  }

  // 15. Realtime Voicemail Tape Playback Voice Synthesizer
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v && v.length > 0) {
          this.cachedVoices = v;
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  private getChineseVoices(): { female?: SpeechSynthesisVoice; male?: SpeechSynthesisVoice } {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return {};
    }
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      this.cachedVoices = voices;
    }
    const zh = this.cachedVoices.filter(
      (v) =>
        v.lang.toLowerCase().includes('zh') ||
        v.lang.toLowerCase().includes('cmn') ||
        v.lang.toLowerCase().includes('chinese')
    );

    // Explicit male voices across Windows / Chrome / macOS / Android / Edge
    let male = zh.find((v) =>
      /kangkang|yunxi|yunjian|yunyang|zhiwei|danny|hanhan|george|male|男|成熟/i.test(v.name)
    );

    // Explicit female voices
    let female = zh.find((v) =>
      /huihui|yaoyao|xiaoxiao|xiaoyi|tingting|sinji|female|女|温和/i.test(v.name)
    );

    if (!male && zh.length > 1) {
      male = zh.find((v) => v !== female);
    }
    if (!female && zh.length > 0) {
      female = zh[0];
    }

    return { female, male };
  }

  public playVoicemailLine(speaker: string, text: string) {
    if (this.isMuted) return;
    const ctx = this.initCtx();

    const isSuMan = speaker === '苏曼';

    // 1. Acoustic Vocal Formant & Telephone Squelch Layer (Web Audio)
    if (ctx) {
      const now = ctx.currentTime;

      // Tape squelch pulse
      const squelchOsc = ctx.createOscillator();
      const squelchGain = ctx.createGain();
      const squelchFilter = ctx.createBiquadFilter();

      squelchOsc.type = isSuMan ? 'sine' : 'sawtooth';
      squelchOsc.frequency.setValueAtTime(isSuMan ? 880 : 320, now);
      squelchOsc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

      squelchFilter.type = 'bandpass';
      squelchFilter.frequency.setValueAtTime(isSuMan ? 2200 : 800, now);
      squelchFilter.Q.setValueAtTime(2.5, now);

      squelchGain.gain.setValueAtTime(0.12, now);
      squelchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      squelchOsc.connect(squelchFilter);
      squelchFilter.connect(squelchGain);
      squelchGain.connect(ctx.destination);

      squelchOsc.start(now);
      squelchOsc.stop(now + 0.13);

      // Deep Male Vocal Resonance Bed for Liang Shaohui (Formant synthesis for deep authority)
      if (!isSuMan) {
        const maleFormant = ctx.createOscillator();
        const maleGain = ctx.createGain();
        const maleFilter = ctx.createBiquadFilter();

        maleFormant.type = 'sawtooth';
        maleFormant.frequency.setValueAtTime(105, now); // 105Hz deep masculine pitch
        maleFormant.frequency.linearRampToValueAtTime(98, now + 1.8);

        maleFilter.type = 'lowpass';
        maleFilter.frequency.setValueAtTime(320, now);

        maleGain.gain.setValueAtTime(0.08, now);
        maleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

        maleFormant.connect(maleFilter);
        maleFilter.connect(maleGain);
        maleGain.connect(ctx.destination);

        maleFormant.start(now);
        maleFormant.stop(now + 2.3);
      }
    }

    // 2. Web Speech Synthesis with strict voice binding & emotional prosody
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel previous utterance

      // Clean up punctuation and bracket codes
      const speechText = text.replace(/\[\[/g, '').replace(/\]\]/g, '').replace(/[“”"']/g, '');

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'zh-CN';

      const { female, male } = this.getChineseVoices();

      if (isSuMan) {
        // Su Man: female voice, slightly higher pitch, earnest and emotional
        utterance.pitch = 1.3;
        utterance.rate = 1.05;
        if (female) utterance.voice = female;
      } else {
        // Liang Shaohui: authoritative male voice, extremely deep pitch & calm cadence
        utterance.pitch = 0.35; // deeply lowered pitch
        utterance.rate = 0.88; // deliberate, menacing pace
        if (male) {
          utterance.voice = male;
        } else if (female) {
          // If fallback, lowest possible pitch
          utterance.pitch = 0.25;
          utterance.rate = 0.85;
          utterance.voice = female;
        }
      }

      window.speechSynthesis.speak(utterance);
    }
  }

  public stopVoicemailPlayback() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  // 16. Glass Shatter & High-Frequency Glitch Synthesis (Chapter 3 Sandbox Collapse)
  public playGlassShatter() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A. Explosive high crack noise burst
    const bufferSize = ctx.sampleRate * 0.8;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const highFilter = ctx.createBiquadFilter();
    highFilter.type = 'highpass';
    highFilter.frequency.setValueAtTime(3200, now);
    highFilter.frequency.exponentialRampToValueAtTime(800, now + 0.6);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    whiteNoise.connect(highFilter);
    highFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    whiteNoise.start(now);

    // B. Multiple resonant shards tinkle frequencies
    const shardFreqs = [2400, 3100, 4200, 5600, 6800, 8200];
    shardFreqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f * (0.95 + Math.random() * 0.1), now + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(f * 0.4, now + idx * 0.04 + 0.5);

      gain.gain.setValueAtTime(0.12, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.55);
    });

    // C. Piercing low resonance collapse drone
    const lowOsc = ctx.createOscillator();
    const lowGain = ctx.createGain();
    lowOsc.type = 'sawtooth';
    lowOsc.frequency.setValueAtTime(140, now);
    lowOsc.frequency.exponentialRampToValueAtTime(28, now + 1.2);
    lowGain.gain.setValueAtTime(0.35, now);
    lowGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    lowOsc.connect(lowGain);
    lowGain.connect(ctx.destination);
    lowOsc.start(now);
    lowOsc.stop(now + 1.25);
  }

  // 17. Tor Onion Proxy 3-Hop Routing Beep
  public playTorHopBeep(hop: number = 1) {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    const baseFreq = 700 + hop * 280;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.06);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  // 18. Emerald Matrix Mesh Broadcast Sound
  public playMatrixBroadcast() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C major high sparkle
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + idx * 0.08 + 0.4);

      gain.gain.setValueAtTime(0.14, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.48);
    });
  }

  // 19. Glitch Static Noise Burst (Real IP alert / Tier 2 meta break)
  public playGlitchStatic() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(940, now);
    osc.frequency.linearRampToValueAtTime(220, now + 0.15);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.3);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  }

  // 20. Typewriter Tick
  public playTypewriterTick() {
    if (this.isMuted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(1600 + Math.random() * 400, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }
}

export const soundService = new SoundService();



