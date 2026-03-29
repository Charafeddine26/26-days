export type DriftElementState = 'dormant' | 'awakening' | 'active' | 'radiant';
export type DriftWeek = 1 | 2 | 3 | 4;
export type DriftUnlockAnimStyle = 'bloom' | 'gold-bloom' | 'draw' | 'awaken';

export interface DriftElement {
  dayNumber: number;
  week: DriftWeek;
  x: number;
  y: number;
  state: DriftElementState;
  status: 'completed' | 'available' | 'locked';
}

export interface DriftConnection {
  fromDay: number;
  toDay: number;
  lit: boolean;
  crossWeek: boolean;
}

export interface DriftBeacon {
  week: DriftWeek;
  x: number;
  y: number;
  /** true when all days in this week are completed */
  activated: boolean;
}

export interface DriftUnlock {
  type: 'node' | 'connection' | 'next-node';
  targetDay: number;
  animationStyle: DriftUnlockAnimStyle;
  delayMs: number;
}

export interface DriftUnlockEvent {
  completedDay: number;
  isBoss: boolean;
  unlocks: DriftUnlock[];
}

export interface DriftMapState {
  elements: DriftElement[];
  connections: DriftConnection[];
  beacons: DriftBeacon[];
  weekComplete: Record<DriftWeek, boolean>;
  /** 0–1 fraction of 26 days completed. Drives ambient nebula intensity. */
  ambientIntensity: number;
  completedCount: number;
}
