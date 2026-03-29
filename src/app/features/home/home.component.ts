import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProgressService } from '../../core/services/progress.service';
import { DriftStateService } from '../../core/services/drift-state.service';
import {
  DriftElement,
  DriftConnection,
  DriftBeacon,
  DriftMapState,
  DriftUnlock,
  DriftWeek,
} from '../../core/models/drift.model';
import { LucideAngularModule, BarChart3, Settings } from 'lucide-angular';
import { CountdownBannerComponent } from '../../shared/components/countdown-banner/countdown-banner.component';
import { ParticleFieldComponent } from '../../shared/components/particle-field/particle-field.component';
import { ChallengeService } from '../../core/services/challenge.service';
import { gsap } from 'gsap';

interface DayMetaEntry {
  title: string;
  conceptsPreview: string;
  totalChallenges: number;
}

interface WeekLabel {
  week: number;
  x: number;
  y: number;
  text: string;
}

interface StarNode {
  x: number;
  y: number;
  r: number;
  fill: string;
  opacity: number;
}

const EMPTY_MAP: DriftMapState = {
  elements: [],
  connections: [],
  beacons: [],
  weekComplete: { 1: false, 2: false, 3: false, 4: false },
  ambientIntensity: 0,
  completedCount: 0,
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, CountdownBannerComponent, ParticleFieldComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private router = inject(Router);
  private progressService = inject(ProgressService);
  private driftState = inject(DriftStateService);
  private challengeService = inject(ChallengeService);

  readonly icons = { BarChart3, Settings };

  mapState = signal<DriftMapState>(EMPTY_MAP);

  hoveredElement = signal<DriftElement | null>(null);
  tooltipPos = signal<{ x: number; y: number }>({ x: 0, y: 0 });
  shakingDay = signal<number | null>(null);

  // Unlock animation state
  /** Maps day number → animation style for in-progress node blooms */
  readonly bloomingNodes = signal<ReadonlyMap<number, DriftUnlock['animationStyle']>>(new Map());
  readonly drawingConnections = signal<ReadonlySet<number>>(new Set());
  readonly awakenNodes = signal<ReadonlySet<number>>(new Set());
  readonly activatingBeaconWeek = signal<DriftWeek | null>(null);

  // Day metadata for enriched hover tooltips
  readonly dayMeta = signal<ReadonlyMap<number, DayMetaEntry>>(new Map());

  // Streak-broken interstitial
  showStreakBroken = signal(false);

  // Proximity & Idle Tracking
  cursorPos = signal<{ x: number; y: number } | null>(null);
  cursorSvgPos = signal<{ x: number; y: number } | null>(null);
  isIdle = signal(false);
  isAwakening = signal(false);
  private idleTimeoutId: any;

  readonly weekLabels: WeekLabel[] = [
    { week: 1, x: 168, y: 530, text: 'Semaine I' },
    { week: 2, x: 460, y: 516, text: 'Semaine II' },
    { week: 3, x: 218, y: 154, text: 'Semaine III' },
    { week: 4, x: 648, y: 104, text: 'Semaine IV' },
  ];

  readonly starField: StarNode[] = Array.from({ length: 110 }, () => {
    // 85% white/grey, 15% tinted
    const isTinted = Math.random() > 0.85;
    const accent = isTinted
      ? ['rgba(184,169,232', 'rgba(169,216,232', 'rgba(232,169,192'][Math.floor(Math.random() * 3)]
      : 'rgba(237,232,245';
    return {
      x: Math.random() * 800,
      y: Math.random() * 560,
      r: Math.random() * 0.8 + 0.3,
      fill: `${accent},1)`, // we apply opacity below
      opacity: Math.random() * 0.12 + 0.02,
    };
  });

  readonly weekRegions = [
    { week: 1, path: 'M 40,400 C 60,320 200,340 300,420 C 350,470 320,540 200,560 C 90,580 40,510 40,400 Z' },
    { week: 2, path: 'M 320,400 C 400,320 540,290 660,360 C 760,420 720,520 580,540 C 420,560 300,480 320,400 Z' },
    { week: 3, path: 'M 50,180 C 70,80 240,40 380,120 C 480,180 400,320 220,300 C 100,280 40,260 50,180 Z' },
    { week: 4, path: 'M 450,150 C 520,60 720,40 760,180 C 800,300 680,380 540,320 C 420,260 400,220 450,150 Z' },
  ];

  ngOnInit(): void {
    this.resetIdleTimer();
    if (!this.progressService.hasStarted()) {
      this.router.navigate(['/onboarding']);
      return;
    }

    const state = this.driftState.getMapState();
    this.mapState.set(state);
    this.preloadDayMeta(state.elements);

    if (this.progressService.checkStreakBroken()) {
      this.showStreakBroken.set(true);
      setTimeout(() => this.showStreakBroken.set(false), 2000);
    }

    const unlock = this.driftState.consumePendingUnlock();
    if (unlock) {
      this.playUnlockAnimation(unlock.unlocks, unlock.isBoss, unlock.completedDay);
    }
  }

  ngOnDestroy(): void {
    clearTimeout(this.idleTimeoutId);
  }

  private resetIdleTimer(): void {
    if (this.isIdle()) {
      this.isIdle.set(false);
      this.isAwakening.set(true);
      setTimeout(() => this.isAwakening.set(false), 600);
    }
    clearTimeout(this.idleTimeoutId);
    this.idleTimeoutId = setTimeout(() => {
      this.isIdle.set(true);
    }, 30000);
  }

  // ---- Unlock animation playback ----

  private playUnlockAnimation(
    unlocks: DriftUnlock[],
    isBoss: boolean,
    completedDay: number
  ): void {
    for (const u of unlocks) {
      setTimeout(() => this.applyUnlock(u), u.delayMs);
    }

    if (isBoss) {
      const week = Math.ceil(completedDay / 7) as DriftWeek;
      setTimeout(() => {
        this.activatingBeaconWeek.set(week);
        setTimeout(() => this.activatingBeaconWeek.set(null), 1100);
      }, 720);
    }
  }

  private applyUnlock(u: DriftUnlock): void {
    const DURATIONS: Record<DriftUnlock['animationStyle'], number> = {
      'bloom':      750,
      'gold-bloom': 980,
      'draw':       680,
      'awaken':     560,
    };
    const duration = DURATIONS[u.animationStyle];

    if (u.type === 'node') {
      this.bloomingNodes.update((m) => new Map([...m, [u.targetDay, u.animationStyle]]));
      setTimeout(() => {
        this.bloomingNodes.update((m) => { const n = new Map(m); n.delete(u.targetDay); return n; });
      }, duration);
    } else if (u.type === 'connection') {
      this.drawingConnections.update((s) => new Set([...s, u.targetDay]));
      setTimeout(() => {
        this.drawingConnections.update((s) => { const n = new Set(s); n.delete(u.targetDay); return n; });
      }, duration);
    } else {
      this.awakenNodes.update((s) => new Set([...s, u.targetDay]));
      setTimeout(() => {
        this.awakenNodes.update((s) => { const n = new Set(s); n.delete(u.targetDay); return n; });
      }, duration);
    }
  }

  // ---- Interaction ----

  onNodeClick(el: DriftElement): void {
    if (el.status === 'locked') {
      this.triggerShake(el.dayNumber);
      return;
    }
    this.animateNodeClick(el.dayNumber);
    setTimeout(() => this.router.navigate(['/day', el.dayNumber]), 260);
  }

  onNodeEnter(el: DriftElement, event: MouseEvent): void {
    this.hoveredElement.set(el);
    this.updateTooltipPos(event);
  }

  onNodeLeave(): void {
    this.hoveredElement.set(null);
  }

  onContainerMouseMove(event: MouseEvent): void {
    this.resetIdleTimer();
    this.cursorPos.set({ x: event.clientX, y: event.clientY });

    const svgRect = document.querySelector('.constellation-svg')?.getBoundingClientRect();
    if (svgRect) {
      const scaleX = 800 / svgRect.width;
      const scaleY = 560 / svgRect.height;
      this.cursorSvgPos.set({
        x: (event.clientX - svgRect.left) * scaleX,
        y: (event.clientY - svgRect.top) * scaleY
      });
    }

    if (this.hoveredElement()) {
      this.updateTooltipPos(event);
    }
  }

  private updateTooltipPos(event: MouseEvent): void {
    const x = Math.min(event.clientX + 16, window.innerWidth - 220);
    const y = Math.max(event.clientY - 48, 10);
    this.tooltipPos.set({ x, y });
  }

  private triggerShake(day: number): void {
    this.shakingDay.set(day);
    setTimeout(() => this.shakingDay.set(null), 600);
  }

  // ---- Visual helpers ----

  private getDistanceToCursor(x: number, y: number): number {
    const cp = this.cursorSvgPos();
    if (!cp || this.isIdle()) return Infinity;
    return Math.sqrt((x - cp.x) ** 2 + (y - cp.y) ** 2);
  }

  private getDistToSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projY = y1 + t * (y2 - y1);
    return Math.sqrt((px - projX) ** 2 + (py - projY) ** 2);
  }

  /** RGB triplet string for each week accent color */
  weekAccent(week: number): string {
    const map: Record<number, string> = {
      1: '169,232,192',  // sage
      2: '169,216,232',  // ice
      3: '232,169,192',  // rose
      4: '232,207,169',  // gold
    };
    return map[week] ?? '184,169,232';
  }

  nodeRadius(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 11;
      case 'active':    return 11;
      case 'awakening': return 9.5;
      case 'dormant':   return 8;
    }
  }

  nodeFillOpacity(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 0.88;
      case 'active':    return 0.72;
      case 'awakening': return 0.42;
      case 'dormant':   return 0.1;
    }
  }

  nodeStrokeOpacity(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 0.95;
      case 'active':    return 0.8;
      case 'awakening': return 0.52;
      case 'dormant':   return 0.18;
    }
  }

  nodeStrokeWidth(el: DriftElement): number {
    if (this.isBoss(el.dayNumber) && el.status === 'completed') return 0; // handled by boss geom
    switch (el.state) {
      case 'radiant':   return 1.5;
      case 'active':    return 1.2;
      case 'awakening': return 0.8;
      case 'dormant':   return 0.5;
    }
  }

  nodeFilter(el: DriftElement): string {
    if (el.state === 'dormant') return 'none';
    const rgb = this.weekAccent(el.week);
    
    const dist = this.getDistanceToCursor(el.x, el.y);
    const proxBonus = dist < 50 ? (1 - dist / 50) * 0.4 : 0;

    switch (el.state) {
      case 'radiant':
        return `drop-shadow(0 0 ${8 + proxBonus * 10}px rgba(${rgb},${0.7 + proxBonus})) drop-shadow(0 0 22px rgba(${rgb},0.28))`;
      case 'active':
        return `drop-shadow(0 0 ${6 + proxBonus * 10}px rgba(${rgb},${0.6 + proxBonus}))`;
      case 'awakening':
        return `drop-shadow(0 0 ${4 + proxBonus * 10}px rgba(${rgb},${0.38 + proxBonus}))`;
    }
  }

  isBoss(dayNumber: number): boolean {
    return dayNumber === 7 || dayNumber === 14 || dayNumber === 21 || dayNumber === 26;
  }

  bossHexPoints(cx: number, cy: number, r: number): string {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6; // slightly rotated 30deg
      points.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return points.join(' ');
  }

  outlineDayNumber(el: DriftElement): string {
    return this.isBoss(el.dayNumber) && el.status !== 'completed' ? 'X' : el.dayNumber.toString();
  }

  orbitRadius(el: DriftElement, layer: 1 | 2): number {
    const base = this.nodeRadius(el);
    return layer === 1 ? base + 4 : base + 8;
  }

  glowRingRadius(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 19;
      case 'active':    return 17;
      case 'awakening': return 15;
      default:          return 0;
    }
  }

  glowRingStrokeOpacity(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 0.32;
      case 'active':    return 0.24;
      case 'awakening': return 0.15;
      default:          return 0;
    }
  }

  glowRingStrokeWidth(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 7;
      case 'active':    return 6;
      case 'awakening': return 5;
      default:          return 0;
    }
  }

  nodeTextOpacity(el: DriftElement): number {
    switch (el.state) {
      case 'radiant':   return 1;
      case 'active':    return 0.92;
      case 'awakening': return 0.7;
      case 'dormant':   return 0.28;
    }
  }

  nodeGroupClass(el: DriftElement): string {
    const classes = ['constellation-node-group'];
    if (el.state === 'awakening') classes.push('node-pulse-awakening');
    if (el.state === 'active')    classes.push('node-pulse-active');
    if (el.dayNumber === this.shakingDay()) classes.push('constellation-shake');
    const bloomStyle = this.bloomingNodes().get(el.dayNumber);
    if (bloomStyle === 'gold-bloom') classes.push('node-gold-bloom-in');
    else if (bloomStyle)             classes.push('node-bloom-in');
    if (this.awakenNodes().has(el.dayNumber)) classes.push('node-awaken-in');
    return classes.join(' ');
  }

  connectionClass(conn: DriftConnection): string {
    if (this.drawingConnections().has(conn.fromDay)) return 'connection-drawing';
    return '';
  }

  connectionLength(conn: DriftConnection): number {
    const els = this.mapState().elements;
    const from = els[conn.fromDay - 1];
    const to = els[conn.toDay - 1];
    if (!from || !to) return 100;
    // Length approximation for the curved path
    const directLen = Math.sqrt((to.x - from.x) ** 2 + (to.y - from.y) ** 2);
    return Math.round(directLen * 1.05);
  }

  connectionPathData(conn: DriftConnection, from: DriftElement, to: DriftElement): string {
    // Generate deterministic control points
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Create an orthogonal offset for the control point
    const pseudoRandom = (conn.fromDay * 9301 + 49297) % 233280 / 233280.0;
    const dir = pseudoRandom > 0.5 ? 1 : -1;
    const offsetMagnitude = dist * (0.15 + (pseudoRandom * 0.15)); // 15-30% of length
    
    // Normalize orthogonal vector
    const nx = -dy / dist;
    const ny = dx / dist;

    // Midpoint
    const mx = from.x + dx * 0.5;
    const my = from.y + dy * 0.5;

    // Control point
    const cx = mx + nx * offsetMagnitude * dir;
    const cy = my + ny * offsetMagnitude * dir;

    return `M ${from.x},${from.y} Q ${cx},${cy} ${to.x},${to.y}`;
  }

  connectionStroke(conn: DriftConnection): string {
    let proxBonus = 0;
    const cp = this.cursorSvgPos();
    if (cp && !this.isIdle()) {
       const from = this.mapState().elements[conn.fromDay - 1];
       const to = this.mapState().elements[conn.toDay - 1];
       if (from && to) {
         const dist = this.getDistToSegment(cp.x, cp.y, from.x, from.y, to.x, to.y);
         if (dist < 40) proxBonus = (1 - dist / 40) * 0.15;
       }
    }

    if (!conn.lit && !this.drawingConnections().has(conn.fromDay)) {
      return `rgba(184,169,232,${0.06 + proxBonus})`; 
    }
    const rgb = this.weekAccent(this.mapState().elements[conn.fromDay - 1].week);
    return `rgba(${rgb},${Math.min(1, 0.85 + proxBonus * 2)})`; 
  }

  connectionGlow(conn: DriftConnection): string {
    const rgb = this.weekAccent(this.mapState().elements[conn.fromDay - 1].week);
    return `rgba(${rgb},0.25)`;
  }

  connectionStrokeWidth(conn: DriftConnection): number {
    return conn.lit || this.drawingConnections().has(conn.fromDay) ? 1.5 : 0.75;
  }

  connectionDasharray(conn: DriftConnection): string {
    // Don't apply cross-week dash when the draw animation is active
    if (this.drawingConnections().has(conn.fromDay)) return 'none';
    if (!conn.crossWeek) return 'none';
    return conn.lit ? '7 4' : '4 7';
  }

  /** Diamond points for a beacon centered at (x,y) with half-size s */
  beaconPoints(b: DriftBeacon, s = 9): string {
    return `${b.x},${b.y - s} ${b.x + s},${b.y} ${b.x},${b.y + s} ${b.x - s},${b.y}`;
  }

  beaconFilter(b: DriftBeacon): string {
    if (!b.activated) return 'none';
    const rgb = this.weekAccent(b.week);
    return `drop-shadow(0 0 5px rgba(${rgb},0.55)) drop-shadow(0 0 14px rgba(${rgb},0.25))`;
  }

  beaconClass(b: DriftBeacon): string {
    const classes = ['constellation-beacon'];
    if (b.activated) classes.push('beacon-active');
    if (this.activatingBeaconWeek() === b.week) classes.push('beacon-activating');
    return classes.join(' ');
  }

  statusLabel(el: DriftElement): string {
    if (el.status === 'completed') return 'Complété';
    if (el.status === 'available') return el.state === 'active' ? 'En cours' : 'Disponible';
    return 'Verrouillé';
  }

  isWeekComplete(week: number): boolean {
    return this.mapState().weekComplete[week as DriftWeek] ?? false;
  }

  romanWeek(week: number): string {
    return ['I', 'II', 'III', 'IV'][week - 1] ?? '';
  }

  goToProgress(): void { this.router.navigate(['/progress']); }
  goToSettings(): void { this.router.navigate(['/settings']); }

  // ---- Day metadata (lazy-loaded for tooltip enrichment) ----

  private preloadDayMeta(elements: DriftElement[]): void {
    const toLoad = elements.filter(e => e.status !== 'locked').map(e => e.dayNumber);
    for (const dn of toLoad) {
      this.challengeService.loadDay(dn).subscribe(({ day, challenges }) => {
        this.dayMeta.update(m => new Map([...m, [dn, {
          title: day.title,
          conceptsPreview: day.conceptsPreview ?? '',
          totalChallenges: challenges.length,
        }]]));
      });
    }
  }

  challengeProgressFor(dayNumber: number): number {
    const dp = this.progressService.getDayProgress(dayNumber);
    if (!dp) return 0;
    return Object.values(dp.challenges).filter(c => c.completed).length;
  }

  // ---- GSAP effects ----

  private animateNodeClick(dayNumber: number): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const groups = document.querySelectorAll<SVGGElement>('.constellation-node-group');
    groups.forEach((g, i) => {
      if (i === dayNumber - 1) {
        gsap.to(g, { scale: 1.3, duration: 0.22, ease: 'power2.out', transformOrigin: '50% 50%' });
      } else {
        gsap.to(g, { opacity: 0.15, duration: 0.2, ease: 'power1.out' });
      }
    });
  }

  // ---- Streak interstitial ----

  dismissStreakBroken(): void {
    this.showStreakBroken.set(false);
  }
}
