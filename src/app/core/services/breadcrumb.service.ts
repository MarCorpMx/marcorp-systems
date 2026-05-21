import { Injectable, signal, WritableSignal, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from './auth.service';
import { BusinessCatalogService } from './business-catalog.service';

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

  private businessCatalog = inject(BusinessCatalogService);

  private build() {
    const crumbs: string[] = [];
    let current = this.route.root;

    const niche = this.auth.getOrganization()?.business_niche || 'default';

    while (current.firstChild) {
      current = current.firstChild;

      // IGNORA rutas sin path real
      if (!current.routeConfig?.path) continue;

      const label = current.snapshot.data['breadcrumb'];

      if (label !== null && label !== undefined) {
        //crumbs.push(label);
        crumbs.push(
          this.businessCatalog.getMenuLabel(
            niche,
            label.toLowerCase(), // key
            label
          )
        );
      }
    }

    const systemName = this.auth.getCurrentSystem()?.subsystem.name ?? 'Sistema';

    this._breadcrumbs.set([
      systemName,
      ...crumbs
    ]);
  }

  /** OPCIONAL: reemplazar por índice */
  replaceAt(index: number, label: string) {
    this._breadcrumbs.update(bc => {
      if (!bc[index]) return bc;
      const copy = [...bc];
      copy[index] = label;
      return copy;
    });
  }
}
