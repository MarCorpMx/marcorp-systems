import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  
  constructor(
    private api: Api, 
    private router: Router) { }

  // REGISTER
  register(data: any): Observable<any> {
    return this.api.post('auth/register', data);
  }

  // LOGIN (email o username)
  login(data: { email?: string; username?: string; login?: string; password: string }) {
    return this.api.post<any>('auth/login', data).pipe(
      tap(res => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('systems', JSON.stringify(res.systems));

        this.redirectToSystem();
      })
    );
  }

  redirectToSystem() {
    const systems = this.getSystems();

    if (!systems || systems.length === 0) {
      // No tiene sistemas
      //this.router.navigate(['/auth/login']);
      this.router.navigate(['/no-systems']);
      return;
    }

    if (systems.length === 1) {
      // Solo un sistema → entrar directo
      this.setCurrentSystem(systems[0]);
      this.router.navigate([`/systems/${systems[0].subsystem_key}`]);
      return;
    }

    // Más de un sistema → seleccionar
    this.router.navigate(['/select-system']);
  }

  // LOGOUT
  logout() {
    return this.api.post('auth/logout', {}).pipe(
      tap(() => this.clearSession())
    );
  }

  // CLEAR SESSION
  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('systems');
    localStorage.removeItem('current_system');
  }

  // HELPERS
  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }

  getUser() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }

  getSystems() {
    return JSON.parse(localStorage.getItem('systems') || '[]');
  }

  getCurrentSystem() {
    return JSON.parse(localStorage.getItem('current_system') || 'null');
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setCurrentSystem(system: any) {
    localStorage.setItem('current_system', JSON.stringify(system));
  }
}
