import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../layout/auth-layout/auth-layout')
        .then(m => m.AuthLayout),

    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./login/login')
            .then(m => m.Login),
        data: { leftTitle: 'Bienvenido de nuevo al núcleo central de operaciones.' }
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./register/register')
            .then(m => m.Register),
        data: { leftTitle: 'Únete a la red y comienza a transformar el futuro digital.' }
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./recover-password/recover-password')
            .then(m => m.RecoverPassword),
        data: { leftTitle: 'Recupera tu acceso' }
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
