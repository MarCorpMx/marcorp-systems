import { Routes } from '@angular/router';
import { SystemLayout } from './core/layouts/system-layout/system-layout';

// Guards 
import { authGuard } from './core/guards/auth-guard';
import { systemAccessGuard } from './core/guards/system-access-guard';

export const routes: Routes = [
  // Default -> auth
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  // MÓDULO DE AUTENTICACIÓN (lazy) (login, register, forgot-password)
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },

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
    path: 'select-system',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./systems/select-system/select-system')
        .then(c => c.SelectSystem)
  },

  // SISTEMAS (lazy + protegido [Citas, Escolar, Inventario])
  {
    path: 'systems',
    canMatch: [authGuard],
    loadChildren: () =>
      import('./systems/systems.routes')
        .then(m => m.SYSTEMS_ROUTES)
  },

  // RUTA NO EXISTENTE
  {
    path: '**',
    redirectTo: 'auth'
  }


];
