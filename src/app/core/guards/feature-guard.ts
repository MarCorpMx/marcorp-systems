import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const featureGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  let current = route;
  let featureKey = current.data?.['feature'];

  // sube por la jerarquía hasta encontrar feature
  while (!featureKey && current.parent) {
    current = current.parent;
    featureKey = current.data?.['feature'];
  }

  if (!featureKey) return true;

  const canAccess = auth.canUseFeature(featureKey);

  if (!canAccess) {
    router.navigate(['/sistemas/citas/dashboard']);
    return false;
  }

  return true;
};
