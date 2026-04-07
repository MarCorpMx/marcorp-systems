import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { Notification } from '../../services/notification.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  const notification = inject(Notification);

  const token = authService.getToken();

  const authReq = token
    ? req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    : req;

  return next(authReq).pipe(
    catchError((error) => {


      // 🔥 CLAVE: ignorar TODO si ya se está deslogueando
      if (authService.isLoggingOut) {
        return throwError(() => error);
      }

      // 🔥 SOLO manejar 401
      if (error.status === 401) {

        // 🔥 si no hay token → ignorar
        if (!authService.getToken()) {
          return throwError(() => error);
        }

        notification.error('Tu sesión ha expirado');

        authService.clearSession();
        authService.redirectToLogin();

        return throwError(() => error);
      }

      if (error.status === 403) {
        notification.error('No tienes permisos para esta acción');
      }

      if (error.status === 422 && error.error?.errors) {
        const firstError = Object.values(error.error.errors)[0] as string[];
        notification.error(firstError[0]);
      }

      if (error.status >= 500) {
        notification.error('Error interno del servidor');
      }

      return throwError(() => error);
    })
  );
};
