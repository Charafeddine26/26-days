import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../../core/services/challenge.service';
import { ProgressService } from '../../core/services/progress.service';
import { AudioService } from '../../core/services/audio.service';
import { Day } from '../../core/models/challenge.model';
import { ChallengeProgress, LevelInfo } from '../../core/models/progress.model';
import { LucideAngularModule, Sparkles, Flame, ArrowRight, Trophy, Zap, Star } from 'lucide-angular';

export interface ChallengeRow {
  title: string;
  xpEarned: number;
  firstTry: boolean;
  speedBonus: boolean;
}

@Component({
  selector: 'app-day-complete',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './day-complete.component.html',
})
export class DayCompleteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private challengeService = inject(ChallengeService);
  private progressService = inject(ProgressService);
  private audio = inject(AudioService);

  readonly icons = { Sparkles, Flame, ArrowRight, Trophy, Zap, Star };
  readonly Infinity = Infinity;

  day = signal<Day | null>(null);
  dayNumber = signal(0);
  totalXpEarned = signal(0);
  challengeRows = signal<ChallengeRow[]>([]);
  leveledUpTo = signal<LevelInfo | null>(null);

  displayedWords = signal<string[]>([]);
  showReturnButton = signal(false);

  streak = computed(() => this.progressService.getStreak());
  currentLevel = computed(() => this.progressService.getLevel());
  levelProgress = computed(() => this.progressService.getLevelProgress());

  ngOnInit(): void {
    const dn = Number(this.route.snapshot.paramMap.get('dayNumber')) || 1;
    this.dayNumber.set(dn);

    const dp = this.progressService.getDayProgress(dn);
    if (dp) {
      const challenges = Object.values(dp.challenges);
      const totalXp = challenges.reduce((sum, c) => sum + (c.xpEarned || 0), 0);
      this.totalXpEarned.set(totalXp);
      this.challengeRows.set(challenges.map((c: ChallengeProgress) => ({
        title: c.title ?? c.challengeId,
        xpEarned: c.xpEarned,
        firstTry: c.firstTry,
        speedBonus: c.timeSpentMs > 0 && c.timeSpentMs < 60_000,
      })));
    }

    // Consume any pending level-up detected during this session
    const levelUp = this.progressService.consumePendingLevelUp();
    this.leveledUpTo.set(levelUp);

    this.challengeService.loadDay(dn).subscribe({
      next: ({ day }) => {
        this.day.set(day);
        if (levelUp) {
          this.audio.playLevelUp();
        } else {
          this.audio.playDayComplete();
        }

        // Narrative word-by-word reveal
        const words = (day.narrativeOutro || '').split(' ');
        let i = 0;
        const interval = setInterval(() => {
          if (i < words.length) {
            this.displayedWords.update(w => [...w, words[i]]);
            i++;
          } else {
            clearInterval(interval);
            setTimeout(() => this.showReturnButton.set(true), 2000);
          }
        }, 60);
      },
      error: (err) => console.error('Failed to load day:', err),
    });
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
