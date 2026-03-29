import { Injectable } from '@angular/core';
import {
  PlayerProgress,
  DayProgress,
  ChallengeProgress,
  LevelInfo,
  SkillId,
  SkillInfo,
  SkillLevel,
  LEVEL_THRESHOLDS,
  STREAK_MULTIPLIERS,
  SKILL_DAY_MAP,
  SKILL_LABELS,
} from '../models/progress.model';

const STORAGE_KEY = '26days_progress';
const TOTAL_DAYS = 26;

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private progress!: PlayerProgress;

  constructor() {
    this.load();
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.progress = JSON.parse(raw);
      } catch {
        this.progress = this.createDefault();
      }
    } else {
      this.progress = this.createDefault();
    }
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
  }

  private createDefault(): PlayerProgress {
    return {
      startDate: '',
      currentXp: 0,
      totalXpEarned: 0,
      completedDays: [],
      dayProgress: {},
      streakDays: [],
      settings: { calendarLock: true, soundVolume: 0.7 },
    };
  }

  hasStarted(): boolean {
    return !!this.progress.startDate;
  }

  setStartDate(date: string): void {
    this.progress.startDate = date;
    this.save();
  }

  getProgress(): PlayerProgress {
    return this.progress;
  }

  getStartDate(): string {
    return this.progress.startDate;
  }

  // --- Day status ---

  getDayStatus(dayNumber: number): 'completed' | 'available' | 'locked' {
    if (this.progress.completedDays.includes(dayNumber)) return 'completed';
    if (this.isDayAvailable(dayNumber)) return 'available';
    return 'locked';
  }

  isDayAvailable(dayNumber: number): boolean {
    if (dayNumber === 1) return true;
    if (this.progress.completedDays.includes(dayNumber)) return true;

    const prevCompleted = this.progress.completedDays.includes(dayNumber - 1);
    if (!prevCompleted) return false;

    if (this.progress.settings.calendarLock && this.progress.startDate) {
      const start = new Date(this.progress.startDate);
      const unlockDate = new Date(start);
      unlockDate.setDate(start.getDate() + dayNumber - 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      unlockDate.setHours(0, 0, 0, 0);
      if (today < unlockDate) return false;
    }

    return true;
  }

  getDayProgress(dayNumber: number): DayProgress | undefined {
    return this.progress.dayProgress[dayNumber];
  }

  getChallengeStatus(dayNumber: number, challengeId: string, challengeOrder: number): 'completed' | 'available' | 'locked' {
    const dp = this.progress.dayProgress[dayNumber];
    if (dp?.challenges[challengeId]?.completed) return 'completed';

    if (challengeOrder === 0) return 'available';

    // Check if all previous challenges in the day are completed
    if (dp) {
      const completedCount = Object.values(dp.challenges).filter(c => c.completed).length;
      if (completedCount >= challengeOrder) return 'available';
    }

    return 'locked';
  }

  // --- Challenge completion ---

  completeChallenge(
    dayNumber: number,
    challengeId: string,
    data: {
      xpEarned: number;
      hintsUsed: number;
      attempts: number;
      timeSpentMs: number;
      firstTry: boolean;
      title?: string;
      codeSnapshot?: string;
      explanation?: string;
    }
  ): void {
    if (!this.progress.dayProgress[dayNumber]) {
      this.progress.dayProgress[dayNumber] = {
        dayNumber,
        completed: false,
        challenges: {},
      };
    }

    const dp = this.progress.dayProgress[dayNumber];
    if (dp.challenges[challengeId]?.completed) return; // Already completed

    dp.challenges[challengeId] = {
      challengeId,
      completed: true,
      completedAt: new Date().toISOString(),
      ...data,
    };

    this.save();
  }

  completeDay(dayNumber: number, totalChallenges: number): boolean {
    const dp = this.progress.dayProgress[dayNumber];
    if (!dp) return false;

    const completedCount = Object.values(dp.challenges).filter(c => c.completed).length;
    if (completedCount >= totalChallenges) {
      dp.completed = true;
      dp.completedAt = new Date().toISOString();
      if (!this.progress.completedDays.includes(dayNumber)) {
        this.progress.completedDays.push(dayNumber);
        this.progress.completedDays.sort((a, b) => a - b);
      }
      this.recordStreakDay();
      this.save();
      return true;
    }
    return false;
  }

  // --- XP & Levels ---

  private _pendingLevelUp: LevelInfo | null = null;

  addXp(amount: number): void {
    const prevLevel = this.getLevel();
    const multiplier = this.getStreakMultiplier();
    const finalXp = Math.round(amount * multiplier);
    this.progress.currentXp += finalXp;
    this.progress.totalXpEarned += finalXp;
    this.save();
    const newLevel = this.getLevel();
    if (newLevel.level > prevLevel.level) {
      if (!this._pendingLevelUp || newLevel.level > this._pendingLevelUp.level) {
        this._pendingLevelUp = newLevel;
      }
    }
  }

  /** Retrieve and clear the level-up that occurred since last check. */
  consumePendingLevelUp(): LevelInfo | null {
    const l = this._pendingLevelUp;
    this._pendingLevelUp = null;
    return l;
  }

  getLevel(): LevelInfo {
    const xp = this.progress.currentXp;
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i].minXp) return LEVEL_THRESHOLDS[i];
    }
    return LEVEL_THRESHOLDS[0];
  }

  getLevelProgress(): number {
    const level = this.getLevel();
    if (level.maxXp === Infinity) return 1;
    const xpInLevel = this.progress.currentXp - level.minXp;
    const levelRange = level.maxXp - level.minXp;
    return Math.min(xpInLevel / levelRange, 1);
  }

  // --- Streak ---

  getStreak(): number {
    const days = this.progress.streakDays;
    if (days.length === 0) return 0;

    const today = this.dateToString(new Date());
    const yesterday = this.dateToString(new Date(Date.now() - 86400000));

    let streak = 0;
    const sorted = [...days].sort().reverse();

    if (sorted[0] !== today && sorted[0] !== yesterday) return 0;

    let expected = sorted[0];
    for (const day of sorted) {
      if (day === expected) {
        streak++;
        const d = new Date(expected);
        d.setDate(d.getDate() - 1);
        expected = this.dateToString(d);
      } else if (day < expected) {
        break;
      }
    }

    return streak;
  }

  private getStreakMultiplier(): number {
    const streak = this.getStreak();
    let multiplier = 1;
    for (const [threshold, mult] of Object.entries(STREAK_MULTIPLIERS)) {
      if (streak >= Number(threshold)) multiplier = mult;
    }
    return multiplier;
  }

  private recordStreakDay(): void {
    const today = this.dateToString(new Date());
    if (!this.progress.streakDays.includes(today)) {
      this.progress.streakDays.push(today);
    }
  }

  /**
   * Call once on home load. Returns true if the player had a streak on the
   * previous visit that has since broken (missed at least one day).
   * Persists the current streak so the next call uses it as the baseline.
   */
  checkStreakBroken(): boolean {
    const LAST_KEY = '26days_last_streak';
    const raw = localStorage.getItem(LAST_KEY);
    const lastKnown = raw !== null ? Number(raw) : 0;
    const current = this.getStreak();
    localStorage.setItem(LAST_KEY, String(current));
    return lastKnown > 0 && current === 0;
  }

  private dateToString(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  // --- Readiness ---

  calculateReadiness(): number {
    return Math.round((this.progress.completedDays.length / TOTAL_DAYS) * 100);
  }

  // --- Skills ---

  getSkills(): SkillInfo[] {
    const completed = new Set(this.progress.completedDays);
    return (Object.keys(SKILL_DAY_MAP) as SkillId[]).map((id) => {
      const days = SKILL_DAY_MAP[id];
      const completedCount = days.filter((d) => completed.has(d)).length;
      const ratio = days.length > 0 ? completedCount / days.length : 0;

      let level: SkillLevel;
      if (ratio === 0)         level = 0;
      else if (ratio <= 0.40)  level = 1;
      else if (ratio <= 0.75)  level = 2;
      else                     level = 3;

      return { id, label: SKILL_LABELS[id], days, level, completedDays: completedCount, totalDays: days.length };
    });
  }

  // --- Days remaining ---

  getDaysRemaining(): number {
    if (!this.progress.startDate) return TOTAL_DAYS;
    const start = new Date(this.progress.startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + TOTAL_DAYS);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000);
    return Math.max(0, diff);
  }

  // --- Settings ---

  updateSettings(partial: Partial<PlayerProgress['settings']>): void {
    Object.assign(this.progress.settings, partial);
    this.save();
  }

  // --- Export / Import / Reset ---

  exportProgress(): string {
    return JSON.stringify(this.progress, null, 2);
  }

  importProgress(json: string): boolean {
    try {
      const data = JSON.parse(json) as PlayerProgress;
      if (!data.dayProgress || !data.settings) return false;
      this.progress = data;
      this.save();
      return true;
    } catch {
      return false;
    }
  }

  resetAll(): void {
    this.progress = this.createDefault();
    localStorage.removeItem(STORAGE_KEY);
    this.save();
  }

  /** Dev/testing only — marks all 26 days as completed so every day is navigable. */
  devUnlockAll(): void {
    for (let d = 1; d <= 26; d++) {
      if (!this.progress.completedDays.includes(d)) {
        this.progress.completedDays.push(d);
      }
    }
    this.progress.completedDays.sort((a, b) => a - b);
    this.save();
  }
}
