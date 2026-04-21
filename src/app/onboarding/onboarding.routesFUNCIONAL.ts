import { Routes } from '@angular/router';
import { onboardingGuard } from './guards/onboarding-guard';

export const ONBOARDING_ROUTES: Routes = [
  {
    path: '',
    canActivate: [onboardingGuard],
    loadComponent: () =>
      import('./pages/onboarding-layout/onboarding-layout')
        .then(m => m.OnboardingLayout),
    children: [
      {
        path: 'email',
        //canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./pages/email-verification/email-verification')
            .then(m => m.EmailVerification),
      },
      {
        path: 'business',
        //canActivate: [onboardingGuard],
        loadComponent: () =>
          import('./pages/business-setup/business-setup')
            .then(m => m.BusinessSetup),
      },
      
      {
        path: 'service',
        loadComponent: () =>
          import('./pages/service-create/service-create')
            .then(m => m.ServiceCreate),
      },
      {
        path: 'availability',
        loadComponent: () =>
          import('./pages/availability-setup/availability-setup')
            .then(m => m.AvailabilitySetup),
      },
      {
        path: 'completed',
        loadComponent: () =>
          import('./pages/onboarding-completed/onboarding-completed')
            .then(m => m.OnboardingCompleted),
      },
      {
        path: '',
        redirectTo: 'email',
        pathMatch: 'full',
      }
    ]
  }
];