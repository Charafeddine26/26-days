import { DriftUnlock } from './drift.model';

export type ChallengeType = 'predict' | 'debug' | 'complete' | 'refactor' | 'build';

export interface CodeRegion {
  startLine: number;
  endLine: number;
}

export interface ChallengeTest {
  description: string;
  testCode: string;
  hidden?: boolean;
}

export interface ChallengeFile {
  name: string;
  content: string;
  readOnly?: boolean;
  language?: string;
}

export interface Challenge {
  id: string;
  dayNumber: number;
  order: number;
  type: ChallengeType;
  difficulty: 'gentle' | 'steady' | 'demanding' | 'boss';
  concepts: string[];
  week: 1 | 2 | 3 | 4;
  title: string;
  narrativeHook: string;
  instructions: string;
  environment?: 'worker' | 'stackblitz';
  starterCode: string;
  files?: ChallengeFile[];
  readOnlyRegions?: CodeRegion[];
  solution: string;
  predictPrompt?: string;
  predictAnswer?: string;
  predictChoices?: string[];
  tests: ChallengeTest[];
  explainGate?: {
    prompt: string;
    keywords: string[];
    minLength: number;
  };
  hints: string[];
  xpReward: number;
  language?: string;
  bonusXp?: {
    noHints: number;
    firstTry: number;
    speedBonus: number;
    speedThresholdMs: number;
  };
  timeLimitMinutes?: number;
}

export interface Day {
  dayNumber: number;
  week: 1 | 2 | 3 | 4;
  title: string;
  narrativeIntro: string;
  narrativeOutro: string;
  phmChapters: number[];
  phmConnectionNote: string;
  challengeIds: string[];
  concepts: string[];
  conceptsPreview: string;
  /** Optional per-day customisation of unlock animations. Falls back to service defaults when absent. */
  driftUnlocks?: DriftUnlock[];
}

export interface ExecutionResult {
  status: 'pass' | 'fail' | 'error' | 'timeout';
  output: string[];
  testResults: TestResult[];
  error?: string;
  executionTime: number;
}

export interface TestResult {
  description: string;
  passed: boolean;
  expected?: string;
  received?: string;
}
