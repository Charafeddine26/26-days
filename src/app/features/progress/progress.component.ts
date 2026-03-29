import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { SkillId, SkillInfo, SkillLevel } from '../../core/models/progress.model';
import { LucideAngularModule, ChevronLeft, Star, Zap, Flame, Target, ChevronDown, ChevronUp } from 'lucide-angular';

// ---- Skill constellation layout ----

interface SkillNode extends SkillInfo {
  x: number;
  y: number;
}

interface SkillEdge {
  fromId: SkillId;
  toId: SkillId;
}

const SKILL_POSITIONS: Record<string, { x: number; y: number }> = {
  'js-fundamentals':  { x: 250, y: 40  },
  'js-advanced':      { x: 328, y: 85  },
  'typescript':       { x: 328, y: 175 },
  'async-patterns':   { x: 250, y: 220 },
  'angular-core':     { x: 172, y: 175 },
  'angular-advanced': { x: 172, y: 85  },
};

const SKILL_EDGES: SkillEdge[] = [
  { fromId: 'js-fundamentals',  toId: 'js-advanced'      },
  { fromId: 'js-advanced',      toId: 'typescript'       },
  { fromId: 'typescript',       toId: 'async-patterns'   },
  { fromId: 'async-patterns',   toId: 'angular-core'     },
  { fromId: 'angular-core',     toId: 'angular-advanced' },
  { fromId: 'angular-advanced', toId: 'js-fundamentals'  },
];

// ---- History entry ----

export interface HistoryEntry {
  dayNumber: number;
  challengeId: string;
  title: string;
  xp: number;
  attempts: number;
  timeSpentMs: number;
  hintsUsed: number;
  firstTry: boolean;
  date: string;
  codeSnapshot?: string;
  explanation?: string;
}

@Component({
  selector: 'app-progress',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './progress.component.html',
})
export class ProgressComponent {
  private router = inject(Router);
  private progressService = inject(ProgressService);

  readonly icons = { ChevronLeft, Star, Zap, Flame, Target, ChevronDown, ChevronUp };

  // ---- Stats ----
  level        = computed(() => this.progressService.getLevel());
  levelProgress= computed(() => Math.round(this.progressService.getLevelProgress() * 100));
  xp           = computed(() => this.progressService.getProgress().currentXp);
  streak       = computed(() => this.progressService.getStreak());
  readiness    = computed(() => this.progressService.calculateReadiness());
  completedDays= computed(() => this.progressService.getProgress().completedDays.length);

  // ---- Skill constellation ----
  skillNodes = computed<SkillNode[]>(() =>
    this.progressService.getSkills().map((s) => ({
      ...s,
      ...SKILL_POSITIONS[s.id],
    }))
  );

  skillEdges = computed(() => {
    const nodeMap = new Map(this.skillNodes().map((n) => [n.id, n]));
    return SKILL_EDGES.map((e) => ({
      ...e,
      from: nodeMap.get(e.fromId)!,
      to: nodeMap.get(e.toId)!,
      lit: (nodeMap.get(e.fromId)?.level ?? 0) > 0 && (nodeMap.get(e.toId)?.level ?? 0) > 0,
    }));
  });

  hoveredSkill   = signal<SkillNode | null>(null);
  tooltipPos     = signal<{ x: number; y: number }>({ x: 0, y: 0 });

  /** Set of completed day numbers — used by the tooltip day-dot grid */
  readonly completedDaySet = computed(
    () => new Set(this.progressService.getProgress().completedDays)
  );

  onSkillEnter(skill: SkillNode, event: MouseEvent): void {
    this.hoveredSkill.set(skill);
    this.tooltipPos.set({ x: event.clientX + 16, y: event.clientY - 48 });
  }

  onSkillLeave(): void {
    this.hoveredSkill.set(null);
  }

  onSkillMapMouseMove(event: MouseEvent): void {
    if (this.hoveredSkill()) {
      this.tooltipPos.set({ x: event.clientX + 16, y: event.clientY - 48 });
    }
  }

  // ---- Challenge history ----
  challengeHistory = computed<HistoryEntry[]>(() => {
    const progress = this.progressService.getProgress();
    const entries: HistoryEntry[] = [];

    for (const [dayNum, dp] of Object.entries(progress.dayProgress)) {
      for (const [, cp] of Object.entries(dp.challenges)) {
        if (cp.completed) {
          entries.push({
            dayNumber:    Number(dayNum),
            challengeId:  cp.challengeId,
            title:        cp.title || cp.challengeId,
            xp:           cp.xpEarned,
            attempts:     cp.attempts,
            timeSpentMs:  cp.timeSpentMs,
            hintsUsed:    cp.hintsUsed,
            firstTry:     cp.firstTry,
            date:         cp.completedAt || '',
            codeSnapshot: cp.codeSnapshot,
            explanation:  cp.explanation,
          });
        }
      }
    }

    return entries.sort((a, b) => b.date.localeCompare(a.date));
  });

  expandedId = signal<string | null>(null);

  toggleExpand(id: string): void {
    this.expandedId.update((curr) => (curr === id ? null : id));
  }

  // ---- Visual helpers ----

  /** RGB triplet for skill level ring color */
  skillLevelRgb(level: SkillLevel): string {
    switch (level) {
      case 0: return '74,68,104';      // ghost
      case 1: return '205,160,80';     // bronze
      case 2: return '184,169,232';    // silver-lavender
      case 3: return '232,207,169';    // gold
    }
  }

  skillLevelLabel(level: SkillLevel): string {
    switch (level) {
      case 0: return 'Dormant';
      case 1: return 'Bronze';
      case 2: return 'Argent';
      case 3: return 'Or';
    }
  }

  skillNodeRadius(level: SkillLevel): number {
    switch (level) {
      case 0: return 7;
      case 1: return 9;
      case 2: return 10;
      case 3: return 12;
    }
  }

  skillNodeFillOpacity(level: SkillLevel): number {
    switch (level) {
      case 0: return 0.08;
      case 1: return 0.35;
      case 2: return 0.55;
      case 3: return 0.82;
    }
  }

  skillNodeStrokeOpacity(level: SkillLevel): number {
    switch (level) {
      case 0: return 0.15;
      case 1: return 0.65;
      case 2: return 0.80;
      case 3: return 0.95;
    }
  }

  skillNodeFilter(level: SkillLevel, rgb: string): string {
    switch (level) {
      case 0: return 'none';
      case 1: return `drop-shadow(0 0 4px rgba(${rgb},0.45))`;
      case 2: return `drop-shadow(0 0 6px rgba(${rgb},0.60))`;
      case 3: return `drop-shadow(0 0 9px rgba(${rgb},0.72)) drop-shadow(0 0 20px rgba(${rgb},0.30))`;
    }
  }

  /** Outer ring only appears at silver+ */
  showOuterRing(level: SkillLevel): boolean {
    return level >= 2;
  }

  outerRingRadius(level: SkillLevel): number {
    return level === 3 ? 20 : 16;
  }

  outerRingOpacity(level: SkillLevel): number {
    return level === 3 ? 0.28 : 0.18;
  }

  formatTime(ms: number): string {
    if (!ms) return '—';
    if (ms < 60_000) return `${Math.round(ms / 1000)}s`;
    const m = Math.floor(ms / 60_000);
    const s = Math.round((ms % 60_000) / 1000);
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }

  formatDate(iso: string): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
