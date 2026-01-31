import { Routes } from '@angular/router';

export const ESCOLAR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./escolar-layout/escolar-layout')
        .then(m => m.EscolarLayout),
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard),
            data: {
          breadcrumb: 'Dashboard'
        },
      }
    ]
  }
];
