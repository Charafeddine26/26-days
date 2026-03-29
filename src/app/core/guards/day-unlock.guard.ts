import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProgressService } from '../services/progress.service';

export const dayUnlockGuard: CanActivateFn = (route) => {
  const progressService = inject(ProgressService);
  const router = inject(Router);

  const dayNumber = Number(route.paramMap.get('dayNumber'));
  if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 26) {
    return router.createUrlTree(['/']);
  }

  if (progressService.isDayAvailable(dayNumber)) {
    return true;
  }

  return router.createUrlTree(['/']);
};
