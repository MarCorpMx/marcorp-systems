import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { OnboardingService } from '../services/onboarding.service';
import { ONBOARDING_ROUTES_MAP } from '../models/onboarding.model';

export const onboardingGuard: CanActivateFn = (route, state) => {

  const onboarding = inject(OnboardingService);
  const router = inject(Router);

  const step = onboarding.getStep();
  const completed = onboarding.isCompleted();


  // 1. Si ya terminó onboarding → no debe entrar aquí
  if (completed) {
    return router.createUrlTree(['/']);
  }

  // 2. Seguridad extra (por si algo viene raro)
  if (!step || !ONBOARDING_ROUTES_MAP[step]) {
    return router.createUrlTree(['/onboarding/email']);
  }

  const expectedRoute = ONBOARDING_ROUTES_MAP[step];

  // 3. Si intenta entrar a otra ruta distinta → lo regresamos
  if (state.url !== expectedRoute) {
    return router.createUrlTree([expectedRoute]);
  }

  // 4. Todo correcto
  return true;

};