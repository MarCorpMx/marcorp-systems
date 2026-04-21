import { Routes } from '@angular/router';
import { SystemLayout } from './core/layouts/system-layout/system-layout';

// Guards 
import { authGuard } from './core/guards/auth-guard';
import { systemAccessGuard } from './core/guards/system-access-guard';
import { appGuard } from './core/guards/app-guard';

export const routes: Routes = [
  // Default -> auth
  // ESPAÑOL (UX / Marketing)

  {
    path: '',
    redirectTo: 'iniciar-sesion',
    pathMatch: 'full'
  },

  {
    path: 'onboarding/email-expired',
    loadComponent: () =>
      import('./onboarding/pages/email-expired/email-expired')
        .then(c => c.EmailExpired)
  },



  // AUTH (una sola vez)
  {
    path: '',
    loadChildren: () =>
      import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },

  /* =====================
     |  RUTAS PROTEGIDAS
     ===================== */

  // ONBOARDING
  {
    path: 'onboarding',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./onboarding/onboarding.routes')
        .then(m => m.ONBOARDING_ROUTES)
  },

  // Datos de cuenta del usuario
  {
    path: 'account',
    canActivate: [authGuard, appGuard],
    loadChildren: () =>
      import('./account/account.routes')
        .then(m => m.ACCOUNT_ROUTES)
  },


  // SELECT ORGANIZATION (cuando un usuario esta trabajando en varias organizaciones)
  {
    path: 'seleccionar-organizacion',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./systems/select-organization/select-organization')
        .then(c => c.SelectOrganization)
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
    canMatch: [authGuard, appGuard],
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
