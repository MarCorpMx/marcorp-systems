import { Routes } from '@angular/router';

export const INVENTARIOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./inventarios-layout/inventarios-layout')
        .then(m => m.InventariosLayout),
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
