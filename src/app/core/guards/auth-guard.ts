import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');
  const isAuthenticated = inject(AuthService).isAuthenticated();

  //if (!token) {
  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};

