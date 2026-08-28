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

  // 14. Realtime Voicemail Tape Playback Voice Synthesizer
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
}

export const soundService = new SoundService();


