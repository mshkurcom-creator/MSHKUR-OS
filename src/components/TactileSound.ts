/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class TactileFeedbackEngine {
  private ctx: AudioContext | null = null;

  init() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser:", e);
    }
  }

  playChime(type: 'select' | 'success' | 'gold' | 'neon') {
    this.init();
    if (!this.ctx) return;

    // Direct resume for user interaction gates
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'select') {
        // Light wooden high chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(880, now); // A5 note
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.15);
      } else if (type === 'success') {
        // High luxury feedback bell chord (chime C6 -> E6 -> G6)
        this.playSingleTone(1046.50, 0.05, 0.35, 'sine'); // C6
        setTimeout(() => this.playSingleTone(1318.51, 0.04, 0.35, 'sine'), 60); // E6
        setTimeout(() => this.playSingleTone(1567.98, 0.05, 0.45, 'sine'), 120); // G6
      } else if (type === 'gold') {
        // Dreamy low luxury sine sweep
        osc.type = 'sine';
        osc.frequency.setValueAtTime(329.63, now); // E4
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.3); // E5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'neon') {
        // Cybernetic blip
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.1);
      }
    } catch (e) {
      console.error("Failed playing feedback chime:", e);
    }
  }

  private playSingleTone(freq: number, startGain: number, duration: number, waveform: OscillatorType = 'sine') {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;
      osc.type = waveform;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(startGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.start(now);
      osc.stop(now + duration + 0.05);
    } catch (e) {
      // Ignored
    }
  }
}

export const chimeEngine = new TactileFeedbackEngine();
