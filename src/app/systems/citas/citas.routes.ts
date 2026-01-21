import { Routes } from '@angular/router';

export const CITAS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./citas-layout/citas-layout')
        .then(m => m.CitasLayout),
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
            .then(m => m.Dashboard)
      }
    ]
  }
];
