import { Injectable, inject } from '@angular/core';
import { ProgressService } from './progress.service';

@Injectable({ providedIn: 'root' })
export class AudioService {
  private progressService = inject(ProgressService);
  private ctx?: AudioContext;

  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    return this.ctx;
  }

  private get volume(): number {
    return this.progressService.getProgress().settings.soundVolume;
  }

  private playTone(
    freq: number,
    startTime: number,
    duration: number,
    gainLevel: number,
    type: OscillatorType = 'sine'
  ): void {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(gainLevel * this.volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /** Short ascending arpeggio — played on challenge complete. */
  playSuccess(): void {
    if (this.volume === 0) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    // C5 → E5 → G5
    this.playTone(523.25, now,        0.28, 0.28);
    this.playTone(659.25, now + 0.10, 0.28, 0.28);
    this.playTone(783.99, now + 0.20, 0.42, 0.32);
  }

  /** Richer chime — played when the day-complete screen loads. */
  playDayComplete(): void {
    if (this.volume === 0) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    // Triad stagger
    [523.25, 659.25, 783.99].forEach((f, i) =>
      this.playTone(f, now + i * 0.08, 0.6, 0.22)
    );
    // High octave flourish
    this.playTone(1046.5, now + 0.30, 0.8, 0.18);
  }

  /** Dramatic glissando + sustained chord — played on level-up. */
  playLevelUp(): void {
    if (this.volume === 0) return;
    const ctx = this.getCtx();
    const now = ctx.currentTime;
    const scale = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    scale.forEach((f, i) => this.playTone(f, now + i * 0.065, 0.45, 0.18));
    // Sustained tonic chord after the run
    [523.25, 659.25, 783.99].forEach(f =>
      this.playTone(f, now + 0.55, 1.4, 0.14)
    );
  }
}
