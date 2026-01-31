import { Injectable, signal, WritableSignal } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class BreadcrumbService {
  private _breadcrumbs = signal<string[]>([]);
  //private _breadcrumbs: WritableSignal<string[]> = signal<string[]>([]);
  readonly breadcrumbs = this._breadcrumbs.asReadonly();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService
  ) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.build());
  }

  private build() {
    const crumbs: string[] = [];
    let current = this.route.root;

    while (current.firstChild) {
      current = current.firstChild;

      // IGNORA rutas sin path real
      if (!current.routeConfig?.path) continue;

      const label = current.snapshot.data['breadcrumb'];

      if (label !== null && label !== undefined) {
        crumbs.push(label);
      }
    }

    const systemName = this.auth.getCurrentSystem()?.subsystem_name ?? 'Sistema';

    this._breadcrumbs.set([
      systemName,
      ...crumbs
    ]);
  }

  /** 👇 OPCIONAL: reemplazar por índice */
  replaceAt(index: number, label: string) {
    this._breadcrumbs.update(bc => {
      if (!bc[index]) return bc;
      const copy = [...bc];
      copy[index] = label;
      return copy;
    });
  }
}
