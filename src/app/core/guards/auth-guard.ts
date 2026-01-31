import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = inject(AuthService).isAuthenticated();

  const publicRoutes = [
    '/iniciar-sesion',
    '/registrarse',
    '/recuperar-contrasena'
  ];

  // Permitir rutas públicas
  if (publicRoutes.includes(state.url)) {
    return true;
  }

  //if (!token) {
  if (!isAuthenticated) {
    //router.navigate(['/auth/login']);
    router.navigate(['/iniciar-sesion']);
    return false;
  }

  return true;
};

