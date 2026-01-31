import { Routes } from '@angular/router';
import { ClienteDetalle } from './pages/clientes/cliente-detalle/cliente-detalle';

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
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard),
        data: {
          breadcrumb: 'Dashboard'
        },
      },
      {
        path: 'agenda',
        loadComponent: () =>
          import('./pages/agenda/agenda')
            .then(m => m.Agenda),
        data: {
          breadcrumb: 'Agenda'
        },
      },

      /*{
        path: 'clientes',
        loadComponent: () =>
          import('./pages/clientes/clientes')
            .then(m => m.Clientes),
            data: {
          breadcrumb: 'Clientes'
        },
      },
      {
        path: 'clientes/:id',
        loadComponent: () =>
          import('./pages/clientes/cliente-detalle/cliente-detalle')
            .then(m => m.ClienteDetalle),
            data: {
        breadcrumb: 'Detalle'
      }
      },*/

      {
        path: 'clientes',
        data: { breadcrumb: 'Clientes' },
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
        loadComponent: () =>
          import('./pages/servicios/servicios')
            .then(m => m.Servicios),
        data: {
          breadcrumb: 'Servicios'
        }
      },
      {
        path: 'horarios',
        loadComponent: () =>
          import('./pages/horarios/horarios')
            .then(m => m.Horarios),
        data: {
          breadcrumb: 'Horarios'
        }
      },
      {
        path: 'recordatorios',
        loadComponent: () =>
          import('./pages/recordatorios/recordatorios')
            .then(m => m.Recordatorios),
        data: {
          breadcrumb: 'Recordatorios'
        }
      },

      /*{
        path: 'reportes',
        loadComponent: () =>
          import('./pages/reportes/reportes')
            .then(m => m.Reportes),
        data: {
          breadcrumb: 'Reportes'
        }
      },*/
      {
        path: 'reportes',
        data: { breadcrumb: 'Reportes' },
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
        loadComponent: () =>
          import('./pages/equipo/equipo')
            .then(m => m.Equipo),
        data: {
          breadcrumb: 'Equipo'
        }
      },
      {
        path: 'configuracion',
        loadComponent: () =>
          import('./pages/configuracion/configuracion')
            .then(m => m.Configuracion),
        data: {
          breadcrumb: 'Configuración'
        }
      }
    ]
  }
];
