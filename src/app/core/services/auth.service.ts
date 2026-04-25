import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, finalize, map, catchError } from 'rxjs/operators';
import { Api } from './api';
import { ThemeService } from './theme.service';
import { HttpHeaders } from '@angular/common/http';
import { LoadingService } from './loading.service';


@Injectable({
  providedIn: 'root',
})

export class AuthService {

  isLoggingOut = false;

  private currentSystem = signal<any>(
    JSON.parse(localStorage.getItem('current_system') || 'null')
  );

  private api = inject(Api);
  private router = inject(Router);
  private theme = inject(ThemeService);
  private loadingService = inject(LoadingService);


  private handleAuthSuccess(res: any) {
    localStorage.setItem('auth_token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('systems', JSON.stringify(res.systems));
    localStorage.setItem('organization', JSON.stringify(res.organization));



    //console.log('dataSystem:', JSON.stringify(res.systems, null, 2));
    //console.log('dataUser:', JSON.stringify(res.user, null, 2));
    //console.log('dataOrganization :', JSON.stringify(res.organization, null, 2));
    console.log('dataBackend :', JSON.stringify(res, null, 2));

    //this.redirectToSystem();
    this.handlePostLoginRedirect(res.organization);
  }

  handlePostLoginRedirect(organization: any) {

    // ONBOARDING PRIMERO
    if (!organization?.onboarding_completed_at) {
      const route = this.getOnboardingRoute(organization.onboarding_step);
      this.router.navigate([route]);
      return;
    }

    // si ya terminó - flujo normal
    this.redirectToSystem();
  }

  // Mapeo de rutas para onboarding
  getOnboardingRoute(step: string): string {

    switch (step) {
      case 'email_pending':
        return '/onboarding/email';

      case 'business_setup':
        return '/onboarding/business';

      case 'branch_setup':
        return '/onboarding/branch';

      case 'staff_confirmed':
        return '/onboarding/branch';

      case 'service_created':
        return '/onboarding/service';

      case 'availability_set':
        return '/onboarding/availability';

      case 'completed':
        return '/onboarding/completed';

      default:
        return '/onboarding/email';
    }
  }

  // REGISTER
  register(data: any): Observable<any> {
    return this.api.post('auth/register', data, {
      loader: 'global'
    }).pipe(
      tap(res => this.handleAuthSuccess(res)) // auto-login
    );
  }

  // LOGIN (email o username)
  login(data: { login?: string; password: string }) {
    return this.api.post<any>('auth/login', data, {
      loader: 'global'
    }).pipe(
      tap(res => this.handleAuthSuccess(res))
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
  /*logout() {
    const start = Date.now();
    this.loadingService.showGlobal(true);

    return this.api.post('auth/logout', {}, {
      loader: 'none'
    }).pipe(
      tap(() => {
        setTimeout(() => {
          this.clearSession();
          this.redirectToLogin();
          this.loadingService.hide();
        }, 600);
      })
    );
  }*/

  logout(): Observable<void> {
    const start = Date.now();
    const minTime = 500;

    this.loadingService.showGlobal(true);

    return this.api.post('auth/logout', {}, {
      loader: 'none'
    }).pipe(
      finalize(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(minTime - elapsed, 0);

        setTimeout(() => {
          this.finishLogout();
          this.loadingService.showGlobal(false);
          this.loadingService.hide();
        }, remaining);
      }),
      map(() => void 0),
      catchError(() => {
        // aunque falle backend, seguimos logout
        this.finishLogout();
        return of(void 0);
      })
    );
  }

  private finishLogout() {
    this.clearSession();
    this.redirectToLogin();
  }

  refreshAuthContext(): Observable<any> {
    //this.loadingService.showGlobal(true);

    return this.api.get<any>('me', {
      //loader: 'none'
    }).pipe(
      tap((res) => {
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('systems', JSON.stringify(res.systems));
        localStorage.setItem('organization', JSON.stringify(res.organization));

        if (res.systems?.length) {
          this.setCurrentSystem(res.systems[0]);
        }
      }),
      finalize(() => {
        this.loadingService.showGlobal(false);
        this.loadingService.hide();
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
    localStorage.removeItem('organization');
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

  getOrganization() {
    return JSON.parse(localStorage.getItem('organization') || 'null');
  }

  /*getCurrentSystem() {
    return JSON.parse(localStorage.getItem('current_system') || 'null');
  }*/
  getCurrentSystem() {
    return this.currentSystem();
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

  /*setCurrentSystem(system: any) {
    localStorage.setItem('current_system', JSON.stringify(system));
    this.theme.setCurrentSystem(system);
    //document.body.setAttribute('data-system', system.subsystem_key);
  }*/

  setCurrentSystem(system: any) {

    if (!system) return;

    localStorage.setItem('current_system', JSON.stringify(system));

    // ESTO ES LO IMPORTANTE
    this.currentSystem.set(system);

    this.theme.setCurrentSystem(system);
  }

  getAuthContext() {
    const user = this.getUser();
    const system = this.getCurrentSystemSafe();

    if (!user || !system) return null;

    return {
      user,
      organization_id: system.organization_id,
      organization_name: system.organization_name,
      subsystem: system.subsystem,
      role: system.role,
      plan: system.plan_key,
      features: system.features
    };
  }

  private currentBranchSignal = signal<any>(
    JSON.parse(localStorage.getItem('current_branch') || 'null')
  );

  currentBranch$ = this.currentBranchSignal.asReadonly();

  // rombi implemando 25/04/26
  getCurrentBranch() {
    return this.currentBranchSignal();
  }

  // rombi implemando 25/04/26
  setCurrentBranch(branch: any) {
    localStorage.setItem('current_branch', JSON.stringify(branch));
    this.currentBranchSignal.set(branch);
  }

  /*setCurrentBranch(branch: any) {
    localStorage.setItem('current_branch', JSON.stringify(branch));
  }

  getCurrentBranch() {
    return JSON.parse(localStorage.getItem('current_branch') || 'null');
  }*/

  canUseFeature(key: string): boolean {
    const system = this.getCurrentSystemSafe();
    if (!system?.features) return false;

    const feature = system.features.find((f: any) => f.key === key);

    return feature?.enabled ?? false;
  }

  canViewFeature(key: string): boolean {
    const system = this.getCurrentSystemSafe();
    if (!system?.features) return false;

    const feature = system.features.find((f: any) => f.key === key);

    return feature?.visible ?? false;
  }

  getFeatureLimit(key: string): number | null {
    const system = this.getCurrentSystemSafe();
    if (!system?.features) return null;

    const feature = system.features.find((f: any) => f.key === key);

    return feature?.limit ?? null;
  }




}
