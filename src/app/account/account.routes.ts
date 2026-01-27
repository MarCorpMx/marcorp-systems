import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth-guard';
import { AccountLayout } from './account-layout/account-layout';

export const ACCOUNT_ROUTES: Routes = [
  /*{
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/account-dashboard/account-dashboard')
        .then(c => c.AccountDashboard)
  }*/
  {
    path: '',
    canActivate: [authGuard],
    component: AccountLayout,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', data: { title: 'Perfil' }, loadComponent: () => import('./pages/profile/profile').then(m => m.Profile) },
      { path: 'security', data: { title: 'Seguridad' }, loadComponent: () => import('./pages/security/security').then(m => m.Security) },
      { path: 'organizations', data: { title: 'Organizaciones' }, loadComponent: () => import('./pages/organizations/organizations').then(m => m.Organizations) },
      { path: 'permissions', data: { title: 'Permisos' }, loadComponent: () => import('./pages/permissions/permissions').then(m => m.Permissions) },
      { path: 'subscriptions', data: { title: 'Suscripciones' }, loadComponent: () => import('./pages/subscriptions/subscriptions').then(m => m.Subscriptions) },
      { path: 'usage', data: { title: 'Uso y límites' }, loadComponent: () => import('./pages/usage/usage').then(m => m.Usage) },
      { path: 'billing', data: { title: 'Facturación' }, loadComponent: () => import('./pages/billing/billing').then(m => m.Billing) },
      { path: 'team', data: { title: 'Equipo' }, loadComponent: () => import('./pages/team/team').then(m => m.Team) },
      { path: 'notifications', data: { title: 'Notificaciones' }, loadComponent: () => import('./pages/notifications/notifications').then(m => m.Notifications) },
      { path: 'support', data: { title: 'Soporte' }, loadComponent: () => import('./pages/support/support').then(m => m.Support) },
    ]
  }

  /*🔹 2. Agrupar visualmente por plan (futuro)

Tu estructura es perfecta para esto:

{
  path: 'billing',
  canActivate: [subscriptionGuard],
}


Y ocultar en el sidebar si el plan no lo permite.
*/


];
