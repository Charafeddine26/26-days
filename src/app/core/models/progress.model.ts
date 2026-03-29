export interface ChallengeProgress {
  challengeId: string;
  completed: boolean;
  completedAt?: string;
  xpEarned: number;
  hintsUsed: number;
  attempts: number;
  timeSpentMs: number;
  firstTry: boolean;
  /** Challenge display title, saved at completion time so history needs no HTTP calls */
  title?: string;
  /** Final code submitted at completion — shown in expandable history rows */
  codeSnapshot?: string;
  /** Explain-gate answer text, if the challenge required one */
  explanation?: string;
}

export interface DayProgress {
  dayNumber: number;
  completed: boolean;
  completedAt?: string;
  challenges: Record<string, ChallengeProgress>;
}

export interface PlayerProgress {
  startDate: string;
  currentXp: number;
  totalXpEarned: number;
  completedDays: number[];
  dayProgress: Record<number, DayProgress>;
  streakDays: string[];
  settings: PlayerSettings;
}

export interface PlayerSettings {
  calendarLock: boolean;
  soundVolume: number;
}

export interface LevelInfo {
  level: number;
  name: string;
  minXp: number;
  maxXp: number;
}

// ---- Skill system ----

export type SkillId =
  | 'js-fundamentals'
  | 'js-advanced'
  | 'typescript'
  | 'async-patterns'
  | 'angular-core'
  | 'angular-advanced';

/** 0 = dormant, 1 = bronze, 2 = silver, 3 = gold */
export type SkillLevel = 0 | 1 | 2 | 3;

export interface SkillInfo {
  id: SkillId;
  label: string;
  /** Days whose completion contributes to this skill */
  days: number[];
  level: SkillLevel;
  completedDays: number;
  totalDays: number;
}

/** Fixed day-to-skill assignment for the 26-day course curriculum */
export const SKILL_DAY_MAP: Record<SkillId, number[]> = {
  'js-fundamentals':  [1, 2, 3, 4, 5, 6, 7],
  'js-advanced':      [8, 9, 10, 11],
  'typescript':       [12, 13, 14],
  'async-patterns':   [15, 16, 17, 18],
  'angular-core':     [19, 20, 21, 22],
  'angular-advanced': [23, 24, 25, 26],
};

export const SKILL_LABELS: Record<SkillId, string> = {
  'js-fundamentals':  'JS Fondamentaux',
  'js-advanced':      'JS Avancé',
  'typescript':       'TypeScript',
  'async-patterns':   'Async & Patterns',
  'angular-core':     'Angular Core',
  'angular-advanced': 'Angular Avancé',
};

// ---- Level thresholds ----

export const LEVEL_THRESHOLDS: LevelInfo[] = [
  { level: 1, name: 'Apprenti Curieux',     minXp: 0,    maxXp: 299 },
  { level: 2, name: 'Commis Logique',       minXp: 300,  maxXp: 749 },
  { level: 3, name: 'Demi-Chef Syntaxe',    minXp: 750,  maxXp: 1499 },
  { level: 4, name: 'Chef de Partie',       minXp: 1500, maxXp: 2499 },
  { level: 5, name: 'Sous-Chef Algorithme', minXp: 2500, maxXp: 3999 },
  { level: 6, name: 'Chef de Cuisine',      minXp: 4000, maxXp: 5999 },
  { level: 7, name: 'Chef Executif',        minXp: 6000, maxXp: 8499 },
  { level: 8, name: 'Maitre du Code',       minXp: 8500, maxXp: Infinity },
];

export const STREAK_MULTIPLIERS: Record<number, number> = {
  3:  1.1,
  7:  1.25,
  14: 1.5,
  21: 2.0,
};
