import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Challenge, Day } from '../models/challenge.model';

@Injectable({ providedIn: 'root' })
export class ChallengeService {
  private http = inject(HttpClient);

  loadDay(dayNumber: number): Observable<{ day: Day; challenges: Challenge[] }> {
    const padded = String(dayNumber).padStart(2, '0');
    return this.http.get<any>(`assets/challenges/day-${padded}.json`).pipe(
      map((data) => ({
        day: {
          dayNumber: data.dayNumber,
          week: data.week,
          title: data.title,
          narrativeIntro: data.narrativeIntro,
          narrativeOutro: data.narrativeOutro,
          phmChapters: data.phmChapters,
          phmConnectionNote: data.phmConnectionNote,
          challengeIds: data.challengeIds,
          concepts: data.concepts,
          conceptsPreview: data.conceptsPreview,
        } as Day,
        challenges: data.challenges as Challenge[],
      }))
    );
  }

  getChallenge(dayNumber: number, challengeId: string): Observable<Challenge> {
    return this.loadDay(dayNumber).pipe(
      map(({ challenges }) => {
        const c = challenges.find((ch) => ch.id === challengeId);
        if (!c) throw new Error(`Challenge ${challengeId} not found`);
        return c;
      })
    );
  }
}
