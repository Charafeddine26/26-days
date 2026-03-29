import { Injectable, inject, signal } from '@angular/core';
import { ProgressService } from './progress.service';
import {
  DriftMapState,
  DriftElement,
  DriftConnection,
  DriftBeacon,
  DriftUnlock,
  DriftUnlockEvent,
  DriftElementState,
  DriftWeek,
} from '../models/drift.model';

/**
 * Organic constellation positions — week-based clusters in an 800×560 viewBox.
 * Week 1: lower-left  |  Week 2: lower-right
 * Week 3: upper-left  |  Week 4: upper-right
 */
const NODE_POSITIONS: ReadonlyArray<{ x: number; y: number }> = [
  // Week 1 (days 1–7) — lower-left
  { x: 112, y: 492 }, // Day 1  — entry
  { x: 178, y: 456 }, // Day 2
  { x:  88, y: 422 }, // Day 3
  { x: 215, y: 418 }, // Day 4
  { x: 155, y: 382 }, // Day 5
  { x: 258, y: 454 }, // Day 6
  { x: 292, y: 390 }, // Day 7  — week bridge

  // Week 2 (days 8–14) — lower-right
  { x: 378, y: 468 }, // Day 8
  { x: 338, y: 424 }, // Day 9
  { x: 432, y: 406 }, // Day 10
  { x: 482, y: 474 }, // Day 11
  { x: 535, y: 430 }, // Day 12
  { x: 462, y: 366 }, // Day 13
  { x: 605, y: 384 }, // Day 14 — week bridge

  // Week 3 (days 15–21) — upper-left
  { x: 352, y: 310 }, // Day 15
  { x: 278, y: 286 }, // Day 16
  { x: 208, y: 262 }, // Day 17
  { x: 138, y: 228 }, // Day 18
  { x: 192, y: 185 }, // Day 19
  { x: 272, y: 182 }, // Day 20
  { x: 354, y: 198 }, // Day 21 — week bridge

  // Week 4 (days 22–26) — upper-right
  { x: 548, y: 290 }, // Day 22
  { x: 616, y: 240 }, // Day 23
  { x: 670, y: 206 }, // Day 24
  { x: 714, y: 166 }, // Day 25
  { x: 750, y: 118 }, // Day 26 — apex
];

/** Cluster centroid positions for week beacon diamonds */
const WEEK_BEACONS: ReadonlyArray<{ week: DriftWeek; x: number; y: number }> = [
  { week: 1, x: 185, y: 431 },
  { week: 2, x: 462, y: 422 },
  { week: 3, x: 256, y: 236 },
  { week: 4, x: 660, y: 204 },
];

const WEEK_RANGES: Record<DriftWeek, [number, number]> = {
  1: [1, 7],
  2: [8, 14],
  3: [15, 21],
  4: [22, 26],
};

@Injectable({ providedIn: 'root' })
export class DriftStateService {
  private progressService = inject(ProgressService);

  private readonly _pendingUnlock = signal<DriftUnlockEvent | null>(null);

  // ---- Map state ----

  getMapState(): DriftMapState {
    const statuses = Array.from({ length: 26 }, (_, i) =>
      this.progressService.getDayStatus(i + 1)
    );

    // Lowest available day is "active" — the most immediate next challenge
    const firstAvailable = statuses.findIndex((s) => s === 'available');
    const activeDay = firstAvailable >= 0 ? firstAvailable + 1 : null;

    const elements: DriftElement[] = statuses.map((status, i) => {
      const dayNumber = i + 1;
      const pos = NODE_POSITIONS[i];
      const week = this.weekOf(dayNumber);

      let state: DriftElementState;
      if (status === 'completed') {
        state = 'radiant';
      } else if (status === 'available') {
        state = dayNumber === activeDay ? 'active' : 'awakening';
      } else {
        state = 'dormant';
      }

      return { dayNumber, week, x: pos.x, y: pos.y, state, status };
    });

    const connections: DriftConnection[] = Array.from({ length: 25 }, (_, i) => ({
      fromDay: i + 1,
      toDay: i + 2,
      lit: elements[i].status === 'completed',
      crossWeek: this.weekOf(i + 1) !== this.weekOf(i + 2),
    }));

    const weekComplete = this.computeWeekComplete(elements);

    const beacons: DriftBeacon[] = WEEK_BEACONS.map((b) => ({
      ...b,
      activated: weekComplete[b.week],
    }));

    const completedCount = elements.filter((e) => e.status === 'completed').length;

    return {
      elements,
      connections,
      beacons,
      weekComplete,
      ambientIntensity: completedCount / 26,
      completedCount,
    };
  }

  // ---- Unlock event stream ----

  /**
   * Called by challenge/boss-battle components immediately after completeDay().
   * Persists an unlock event that HomeComponent will consume on next visit.
   * If the day JSON provides custom driftUnlocks, pass them; otherwise the service
   * builds sensible defaults.
   */
  triggerUnlock(
    dayNumber: number,
    isBoss: boolean,
    jsonUnlocks?: DriftUnlock[]
  ): void {
    const unlocks =
      jsonUnlocks && jsonUnlocks.length > 0
        ? jsonUnlocks
        : this.buildDefaultUnlocks(dayNumber, isBoss);

    this._pendingUnlock.set({ completedDay: dayNumber, isBoss, unlocks });
  }

  /**
   * HomeComponent calls this on init to retrieve and clear any pending unlock event.
   */
  consumePendingUnlock(): DriftUnlockEvent | null {
    const event = this._pendingUnlock();
    this._pendingUnlock.set(null);
    return event;
  }

  // ---- Private helpers ----

  private buildDefaultUnlocks(dayNumber: number, isBoss: boolean): DriftUnlock[] {
    const unlocks: DriftUnlock[] = [];

    // The completed node blooms
    unlocks.push({
      type: 'node',
      targetDay: dayNumber,
      animationStyle: isBoss ? 'gold-bloom' : 'bloom',
      delayMs: 120,
    });

    if (isBoss) {
      // Cascade-redraw all connections within the completed week for dramatic effect
      const [weekStart] = WEEK_RANGES[this.weekOf(dayNumber)];
      for (let d = weekStart; d < dayNumber; d++) {
        if (d >= 1) {
          unlocks.push({
            type: 'connection',
            targetDay: d,
            animationStyle: 'draw',
            delayMs: 280 + (d - weekStart) * 75,
          });
        }
      }
    } else {
      // Draw just the outgoing connection
      if (dayNumber < 26) {
        unlocks.push({
          type: 'connection',
          targetDay: dayNumber,
          animationStyle: 'draw',
          delayMs: 500,
        });
      }
    }

    // Awaken the next day's node
    if (dayNumber < 26) {
      const nextDelay = isBoss ? 800 : 980;
      unlocks.push({
        type: 'next-node',
        targetDay: dayNumber + 1,
        animationStyle: 'awaken',
        delayMs: nextDelay,
      });
    }

    return unlocks;
  }

  private computeWeekComplete(
    elements: DriftElement[]
  ): Record<DriftWeek, boolean> {
    const result = { 1: false, 2: false, 3: false, 4: false } as Record<
      DriftWeek,
      boolean
    >;
    for (const week of [1, 2, 3, 4] as DriftWeek[]) {
      const [start, end] = WEEK_RANGES[week];
      result[week] = elements
        .slice(start - 1, end)
        .every((e) => e.status === 'completed');
    }
    return result;
  }

  private weekOf(day: number): DriftWeek {
    if (day <= 7) return 1;
    if (day <= 14) return 2;
    if (day <= 21) return 3;
    return 4;
  }
}
