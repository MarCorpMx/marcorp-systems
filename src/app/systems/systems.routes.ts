import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { systemAccessGuard } from '../core/guards/system-access-guard';

export const SYSTEMS_ROUTES: Routes = [
  /*{
    path: 'select',
    loadComponent: () =>
      import('./select-system/select-system')
        .then(m => m.SelectSystem),
    canActivate: [authGuard]
  },*/

  // ========================
  // SISTEMA CITAS
  // ========================
  {
    path: 'citas',
    canMatch: [authGuard, systemAccessGuard],
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
    canMatch: [authGuard, systemAccessGuard],
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
    canMatch: [authGuard, systemAccessGuard],
    data: { systemKey: 'inventarios' },
    loadChildren: () =>
      import('./inventarios/inventarios.routes')
        .then(m => m.INVENTARIOS_ROUTES)
  },

  /*{
    path: 'appointments',
    canMatch: [systemAccessGuard],
    loadChildren: () =>
      import('./appointments/appointments.routes')
        .then(m => m.APPOINTMENTS_ROUTES)
  },*/

  /*{
    path: 'school',
    canMatch: [systemAccessGuard],
    loadChildren: () =>
      import('./school/school.routes')
        .then(m => m.SCHOOL_ROUTES)
  },*/

];
