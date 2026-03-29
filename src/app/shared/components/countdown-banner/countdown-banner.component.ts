import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressService } from '../../../core/services/progress.service';
import { LucideAngularModule, Flame, Target, Clock } from 'lucide-angular';

@Component({
  selector: 'app-countdown-banner',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './countdown-banner.component.html',
})
export class CountdownBannerComponent {
  private progressService = inject(ProgressService);

  readonly icons = { Flame, Target, Clock };

  daysRemaining = computed(() => this.progressService.getDaysRemaining());
  readiness    = computed(() => this.progressService.calculateReadiness());
  streak       = computed(() => this.progressService.getStreak());

  urgencyLevel = computed(() => {
    const d = this.daysRemaining();
    if (d <= 3) return 'critical' as const;
    if (d <= 9) return 'warning'  as const;
    return 'normal' as const;
  });

  /** Extra box-shadow to ring the banner with urgency colour */
  urgencyRingStyle = computed(() => {
    switch (this.urgencyLevel()) {
      case 'critical': return '0 0 0 1px rgba(232,125,138,0.35), 0 0 16px rgba(232,125,138,0.12)';
      case 'warning':  return '0 0 0 1px rgba(232,169,192,0.25)';
      default:         return null;
    }
  });

  /** Inline color for the days-remaining number, interpolated continuously from Gold to Rose to Fail */
  urgencyDaysColor = computed<string>(() => {
    const d = this.daysRemaining();
    const clamped = Math.max(0, Math.min(26, d));
    let h, s, l;
    
    // gold -> rose (26 days to 10 days)
    // gold: H=36, S=60, L=79
    // rose: H=338, S=59, L=79 (use -22 for math)
    if (clamped >= 10) {
      const t = (clamped - 10) / 16; 
      h = -22 + t * 58;
      s = 59 + t * 1;
      l = 79;
    } else {
      // rose -> fail (10 days to 0 days)
      // rose: H=-22, S=59, L=79
      // fail: H=-7, S=72, L=70 
      const t = clamped / 10;
      h = -7 - t * 15;
      s = 72 - t * 13;
      l = 70 + t * 9;
    }
    
    h = (h < 0 ? h + 360 : h) % 360;
    return `hsl(${h.toFixed(1)}, ${s.toFixed(1)}%, ${l.toFixed(1)}%)`;
  });

  /** Animation class for the days-remaining number */
  urgencyDaysClass = computed(() => {
    switch (this.urgencyLevel()) {
      case 'critical': return 'animate-pulse-fast';
      case 'warning':  return 'animate-pulse-medium';
      default:         return '';
    }
  });

  /** The color of the filled readiness arc */
  readinessColor = computed(() => {
    const r = this.readiness();
    if (r >= 80) return 'var(--color-drift-sage)';
    if (r >= 50) return 'var(--color-drift-gold)';
    return 'var(--color-drift-rose)';
  });

  /** Calculate scale, opacity, and offsets for trailing streak wisps */
  streakWisps = computed(() => {
    const s = this.streak();
    if (s <= 7) return [];
    const numWisps = s > 14 ? 3 : 2;
    return Array.from({length: numWisps}, (_, i) => ({
      scale: 1 - 0.2 * (i + 1),
      opacity: 0.5 - 0.15 * (i + 1),
      offsetX: -(i + 1) * 8
    }));
  });
}
