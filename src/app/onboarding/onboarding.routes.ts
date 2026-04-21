import { Routes } from '@angular/router';
import { onboardingGuard } from './guards/onboarding-guard';

import { OnboardingLayout } from './pages/onboarding-layout/onboarding-layout';
import { EmailVerification } from './pages/email-verification/email-verification';
import { BusinessSetup } from './pages/business-setup/business-setup';
import { ServiceCreate } from './pages/service-create/service-create';
import { AvailabilitySetup } from './pages/availability-setup/availability-setup';
import { OnboardingCompleted } from './pages/onboarding-completed/onboarding-completed';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    component: OnboardingLayout,
    canActivate: [onboardingGuard],
    children: [
      //{ path: 'email-expired', component: EmailExpired },
      { path: 'email', component: EmailVerification },
      { path: 'business', component: BusinessSetup },
      // { path: 'branch', component: BranchSetup },
      { path: 'service', component: ServiceCreate },
      { path: 'availability', component: AvailabilitySetup },
      { path: 'completed', component: OnboardingCompleted },
      { path: '', redirectTo: 'email', pathMatch: 'full' }
    ]
  }
]; 