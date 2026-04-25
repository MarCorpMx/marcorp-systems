import { Routes } from '@angular/router';
import { ClienteDetalle } from './pages/clientes/cliente-detalle/cliente-detalle';
import { featureGuard } from '../../core/guards/feature-guard';

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
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard),
        data: {
          breadcrumb: 'Dashboard',
          feature: 'dashboard'
        },
      },
      {
        path: 'agenda',
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/agenda/agenda')
            .then(m => m.Agenda),
        data: {
          breadcrumb: 'Agenda',
          feature: 'agenda'
        },
      },
      {
        path: 'clientes',
        canActivate: [featureGuard],
        canActivateChild: [featureGuard],
        data: { breadcrumb: 'Clientes', feature: 'clients' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/clientes/clientes')
                .then(m => m.Clientes)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/clientes/cliente-detalle/cliente-detalle')
                .then(m => m.ClienteDetalle),
            data: { breadcrumb: 'Detalle' }
          }
        ]
      },

      {
        path: 'servicios',
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/servicios/servicios')
            .then(m => m.Servicios),
        data: {
          breadcrumb: 'Servicios',
          feature: 'services'
        }
      },
      {
        path: 'disponibilidad',
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/disponibilidad/disponibilidad')
            .then(m => m.Disponibilidad),
        data: {
          breadcrumb: 'Disponibilidad',
          feature: 'schedule'
        }
      },
      {
        path: 'recordatorios',
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/recordatorios/recordatorios')
            .then(m => m.Recordatorios),
        data: {
          breadcrumb: 'Recordatorios',
          feature: 'reminders'
        }
      },
      {
        path: 'reportes',
        canActivate: [featureGuard],
        data: { breadcrumb: 'Reportes', feature: 'reports' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/reportes/reportes')
                .then(m => m.Reportes)
          },
          {
            path: 'citas',
            loadComponent: () =>
              import('./pages/reportes/pages/reportes-citas/reportes-citas')
                .then(m => m.ReportesCitas),
            data: { breadcrumb: 'Citas' }
          }
        ]
      },

      {
        path: 'equipo',
        canActivate: [featureGuard],
        loadComponent: () =>
          import('./pages/equipo/equipo')
            .then(m => m.Equipo),
        data: {
          breadcrumb: 'Equipo',
          feature: 'team'
        }
      },

      {
        path: 'configuracion',
        canActivate: [featureGuard],
        data: { breadcrumb: 'Configuración', feature: 'settings' },
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/configuracion/configuracion')
                .then(m => m.Configuracion)
          },
          {
            path: 'perfil',
            canActivate: [featureGuard],
            loadComponent: () =>
              import('./pages/configuracion/perfil/perfil')
                .then(m => m.Perfil),
            data: { breadcrumb: 'Perfil del negocio', feature: 'profile' }
          },
          {
            path: 'sucursales',
            canActivate: [featureGuard],
            loadComponent: () =>
              import('./pages/configuracion/sucursales/sucursales')
                .then(m => m.Sucursales),
            data: { breadcrumb: 'Sucursales', feature: 'branches' }
          },
          {
            path: 'agenda',
            canActivate: [featureGuard],
            loadComponent: () =>
              import('./pages/configuracion/agenda/agenda')
                .then(m => m.Agenda),
            data: { breadcrumb: 'Horario de atención', feature: 'schedule_config' }
          },
          {
            path: 'pagos',
            canActivate: [featureGuard],
            loadComponent: () =>
              import('./pages/configuracion/pagos/pagos')
                .then(m => m.Pagos),
            data: { breadcrumb: 'Pagos y Facturación', feature: 'payments' }
          },
          {
            path: 'avanzado',
            canActivate: [featureGuard],
            loadComponent: () =>
              import('./pages/configuracion/avanzado/avanzado')
                .then(m => m.Avanzado),
            data: { breadcrumb: 'Avanzado', feature: 'advanced' }
          }
        ]
      },

      // branches - Sucursaales
      // payments -> Pagos y facturación
      // advanced - Avanzado


      /*{
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/configuracion/configuracion')
            .then(m => m.Configuracion),
        data: {
          breadcrumb: 'Configuración'
        }
      }*/
    ]
  }
];
