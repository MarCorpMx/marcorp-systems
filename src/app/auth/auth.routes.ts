import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../layout/auth-layout/auth-layout')
        .then(m => m.AuthLayout),

    children: [
      {
        path: 'iniciar-sesion',
        loadComponent: () =>
          import('./login/login').then(m => m.Login),
         data: { leftTitle: 'Administra tus citas y clientes desde un solo lugar.' }
      },
      {
        path: 'registrarse',
        loadComponent: () =>
          import('./register/register').then(m => m.Register),
        data: { leftTitle: 'Administra tus citas y clientes desde un solo lugar.' }
      },
      {
        path: 'recuperar-contrasena',
        loadComponent: () =>
          import('./recover-password/recover-password')
            .then(m => m.RecoverPassword),
            data: { leftTitle: 'Recupera el acceso y continúa gestionando tu agenda.' }
      },
      {
        path: '',
        redirectTo: 'iniciar-sesion',
        pathMatch: 'full'
      }
    ]
  }
];
