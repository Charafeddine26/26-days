import { Routes } from '@angular/router';
import { dayUnlockGuard } from './core/guards/day-unlock.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
  },
  {
    path: 'day/:dayNumber',
    loadComponent: () =>
      import('./features/day/day.component').then((m) => m.DayComponent),
    canActivate: [dayUnlockGuard],
  },
  {
    path: 'day/:dayNumber/challenge/:challengeId',
    loadComponent: () =>
      import('./features/challenge/challenge.component').then((m) => m.ChallengeComponent),
    canActivate: [dayUnlockGuard],
  },
  {
    path: 'day/:dayNumber/boss',
    loadComponent: () =>
      import('./features/boss-battle/boss-battle.component').then((m) => m.BossBattleComponent),
    canActivate: [dayUnlockGuard],
  },
  {
    path: 'day/:dayNumber/complete',
    loadComponent: () =>
      import('./features/day-complete/day-complete.component').then((m) => m.DayCompleteComponent),
  },
  {
    path: 'progress',
    loadComponent: () =>
      import('./features/progress/progress.component').then((m) => m.ProgressComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
