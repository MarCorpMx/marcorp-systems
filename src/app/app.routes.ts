import { Routes } from '@angular/router';
import { SystemLayout } from './core/layouts/system-layout/system-layout';

// Guards 
import { authGuard } from './core/guards/auth-guard';
import { systemAccessGuard } from './core/guards/system-access-guard';

export const routes: Routes = [
  // Default -> auth
  // ESPAÑOL (UX / Marketing)
  
  /*{
    path: 'iniciar-sesion',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'registrarse',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'recuperar-contrasena',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },*/


  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },
  // AUTH (una sola vez)
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  // RUTAS PROTEGIDAS

  // Datos de cuenta del usuario
  {
    path: 'account',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./account/account.routes')
        .then(m => m.ACCOUNT_ROUTES)
  },

  // SELECT SYSTEM (cuando un usuario tiene varios sistemas)
  {
    path: 'seleccionar-sistema',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./systems/select-system/select-system')
        .then(c => c.SelectSystem)
  },

  // SISTEMAS (lazy + protegido [Citas, Escolar, Inventario])
  {
    path: 'sistemas',
    canMatch: [authGuard],
    loadChildren: () =>
      import('./systems/systems.routes')
        .then(m => m.SYSTEMS_ROUTES)
  },

  // RUTA NO EXISTENTE
  {
    path: '**',
    redirectTo: 'iniciar-sesion'
  }


];
