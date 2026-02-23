import { inject } from '@angular/core';
import { CanMatchFn, Router, Route, UrlSegment } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const systemAccessGuard: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const systemKey = route.data?.['systemKey'];
  const systems = auth.getSystems();

  if (!systems || systems.length === 0) {
    router.navigate(['/seleccionar-sistema']);
    return false;
  }


  const hasAccess = systems.some(
    (s: any) => s.subsystem.key === systemKey
  );

  if (!hasAccess) {
    router.navigate(['/seleccionar-sistema']);
    return false;
  }

  // Guardar sistema actual
  /*const system = systems.find(
    (s: any) => s.subsystem_key === systemKey
  );*/

  const system = systems.find(
    (s: any) => s.subsystem.key=== systemKey
  );

  auth.setCurrentSystem(system);

  return true;
};
