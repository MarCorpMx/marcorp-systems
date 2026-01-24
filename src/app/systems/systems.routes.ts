import { Routes } from '@angular/router';
import { SystemLayout } from '../core/layouts/system-layout/system-layout';
import { authGuard } from '../core/guards/auth-guard';
import { systemAccessGuard } from '../core/guards/system-access-guard';

export const SYSTEMS_ROUTES: Routes = [

  {
    path: '',
    component: SystemLayout, // LAYOUT ENVOLVENTE
    canMatch: [authGuard],
    children: [

      // ========================
      // SISTEMA CITAS
      // ========================
      {
        path: 'citas',
        canMatch: [systemAccessGuard],
        data: { systemKey: 'citas' },
        loadChildren: () =>
          import('./citas/citas.routes')
            .then(m => m.CITAS_ROUTES)
      },

      // ========================
      // SISTEMA ESCOLAR
      // ========================
      {
        path: 'escolar',
        canMatch: [systemAccessGuard],
        data: { systemKey: 'escolar' },
        loadChildren: () =>
          import('./escolar/escolar.routes')
            .then(m => m.ESCOLAR_ROUTES)
      },

      // ========================
      // SISTEMA INVENTARIOS
      // ========================
      {
        path: 'inventarios',
        canMatch: [systemAccessGuard],
        data: { systemKey: 'inventarios' },
        loadChildren: () =>
          import('./inventarios/inventarios.routes')
            .then(m => m.INVENTARIOS_ROUTES)
      },
    ]
  }

];
