import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChallengeService } from '../../core/services/challenge.service';
import { ProgressService } from '../../core/services/progress.service';
import { Day, Challenge } from '../../core/models/challenge.model';
import {
  LucideAngularModule,
  ChevronLeft,
  CircleCheck,
  Lock,
  Play,
  BookOpen,
} from 'lucide-angular';

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './day.component.html',
})
export class DayComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private challengeService = inject(ChallengeService);
  private progressService = inject(ProgressService);

  readonly icons = { ChevronLeft, CircleCheck, Lock, Play, BookOpen };

  day = signal<Day | null>(null);
  challenges = signal<Challenge[]>([]);
  dayNumber = signal(0);

  challengeStatuses = computed(() => {
    const cs = this.challenges();
    const dn = this.dayNumber();
    return cs.map((c, i) => ({
      challenge: c,
      status: this.progressService.getChallengeStatus(dn, c.id, i),
    }));
  });

  dayCompleted = computed(() => {
    return this.progressService.getDayStatus(this.dayNumber()) === 'completed';
  });

  ngOnInit(): void {
    const dn = Number(this.route.snapshot.paramMap.get('dayNumber')) || 1;
    this.dayNumber.set(dn);

    this.challengeService.loadDay(dn).subscribe({
      next: ({ day, challenges }) => {
        this.day.set(day);
        this.challenges.set(challenges);
      },
      error: (err) => console.error('Failed to load day:', err),
    });
  }

  goToChallenge(challenge: Challenge): void {
    if (challenge.difficulty === 'boss') {
      this.router.navigate(['/day', this.dayNumber(), 'boss']);
    } else {
      this.router.navigate(['/day', this.dayNumber(), 'challenge', challenge.id]);
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  difficultyLabel(d: string): string {
    switch (d) {
      case 'gentle': return 'Gentle';
      case 'steady': return 'Steady';
      case 'demanding': return 'Demanding';
      case 'boss': return 'Boss';
      default: return d;
    }
  }

  difficultyColor(d: string): string {
    switch (d) {
      case 'gentle': return 'text-drift-sage';
      case 'steady': return 'text-drift-ice';
      case 'demanding': return 'text-drift-gold';
      case 'boss': return 'text-drift-rose';
      default: return 'text-drift-text-secondary';
    }
  }

  typeLabel(t: string): string {
    switch (t) {
      case 'predict': return 'Predict';
      case 'debug': return 'Debug';
      case 'complete': return 'Complete';
      case 'refactor': return 'Refactor';
      case 'build': return 'Build';
      default: return t;
    }
  }
}
