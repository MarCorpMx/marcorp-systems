import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

export const appGuard: CanActivateFn = () => {

    const auth = inject(AuthService);
    const router = inject(Router);

    const organization = auth.getOrganization();

    if (!organization) {
        return router.createUrlTree(['/auth/login']);
    }

    if (!organization.onboarding_completed_at) {
        const route = auth.getOnboardingRoute(organization.onboarding_step);
        return router.createUrlTree([route]);
    }

    return true;
};