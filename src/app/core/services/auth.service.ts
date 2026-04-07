import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Api } from './api';
import { ThemeService } from './theme.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})

export class AuthService {

  isLoggingOut = false;

  constructor(
    private api: Api,
    private router: Router,
    private theme: ThemeService
  ) { }

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

        console.log("los sitemas carnal: ", JSON.stringify(res.systems));
        console.log("el usuario:", res.user);

        this.redirectToSystem();
      })
    );
  }

  /*redirectToSystem() {
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
      this.router.navigate([`/sistemas/${systems[0].subsystem.key}`]);
      return;
    }

    // Más de un sistema → seleccionar
    this.router.navigate(['/seleccionar-sistema']);
  }*/

  redirectToSystem() {
    const systems = this.getSystems();

    if (!systems || systems.length === 0) {
      this.router.navigate(['/no-systems']);
      return;
    }

    // Agrupar por organización
    const orgMap = new Map<number, any[]>();

    systems.forEach((s: any) => {
      if (!orgMap.has(s.organization_id)) {
        orgMap.set(s.organization_id, []);
      }
      orgMap.get(s.organization_id)!.push(s);
    });

    const organizations = Array.from(orgMap.entries()).map(([orgId, systems]) => ({
      organization_id: orgId,
      organization_name: systems[0].organization_name,
      systems
    }));

    // CASOS

    // 1 sola organización
    if (organizations.length === 1) {
      const org = organizations[0];

      // 1 solo sistema
      if (org.systems.length === 1) {
        this.setCurrentSystem(org.systems[0]);
        this.router.navigate([`/sistemas/${org.systems[0].subsystem.key}`]);
        return;
      }

      // varios sistemas en misma org
      this.router.navigate(['/seleccionar-sistema']);
      return;
    }

    // múltiples organizaciones
    this.router.navigate(['/seleccionar-organizacion']);
  }

  // LOGOUT
  logout() {
    return this.api.post('auth/logout', {}).pipe(
      tap(() => {
        this.clearSession();
        this.redirectToLogin();
      })
    );
  }

  redirectToLogin() {
    this.router.navigate(['/auth/login']);
  }

  // CLEAR SESSION
  clearSession() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('systems');
    localStorage.removeItem('current_system');

    this.theme.clearTheme();
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

  getCurrentSystemSafe() {
    const current = this.getCurrentSystem();

    if (current) return current;

    // fallback por si aún no está seteado
    const systems = this.getSystems();
    return systems.length ? systems[0] : null;
  }

  getRole(): string | null {
    const system = this.getCurrentSystemSafe();
    return system?.role || null;
  }

  getOrganizationId(): number | null {
    const system = this.getCurrentSystemSafe();
    return system?.organization_id || null;
  }

  getStaffId(): number | null {
    const user = this.getUser();
    return user?.staff_member_id || null;
  }

  isStaff(): boolean {
    return this.getRole() === 'staff';
  }

  isAdmin(): boolean {
    return ['admin', 'owner'].includes(this.getRole() || '');
  }

  isReceptionist(): boolean {
    return this.getRole() === 'receptionist';
  }

  setCurrentSystem(system: any) {
    localStorage.setItem('current_system', JSON.stringify(system));
    this.theme.setCurrentSystem(system);
    //document.body.setAttribute('data-system', system.subsystem_key);
  }


}
