import { Routes } from '@angular/router';

// Guards (los dejamos para después, pero ya bien referenciados)
import { authGuard } from './core/guards/auth-guard';
import { systemAccessGuard } from './core/guards/system-access-guard';

export const routes: Routes = [
     // Página por defecto → manda a /auth
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  // 🔹 MÓDULO DE AUTENTICACIÓN (lazy)
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes')
        .then(m => m.AUTH_ROUTES)
  },

  
];
