import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

import {
  Building2,
  LucideAngularModule
} from 'lucide-angular';

@Component({
  selector: 'app-select-organization',
  imports: [LucideAngularModule],
  templateUrl: './select-organization.html',
  styleUrl: './select-organization.css',
})

export class SelectOrganization {
  organizations: any[] = [];

  icon = Building2;

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const systems = this.auth.getSystems();

    // Agrupar por organización
    const orgMap = new Map<number, any[]>();

    systems.forEach((s: any) => {
      if (!orgMap.has(s.organization_id)) {
        orgMap.set(s.organization_id, []);
      }
      orgMap.get(s.organization_id)!.push(s);
    });

    this.organizations = Array.from(orgMap.entries()).map(([orgId, systems]) => ({
      organization_id: orgId,
      organization_name: systems[0].organization_name,
      systems
    }));

    // Auto redirect si solo hay una
    if (this.organizations.length === 1) {
      this.selectOrganization(this.organizations[0]);
    }
  }

  selectOrganization(org: any) {
    const systems = org.systems;

    // Guardamos organización seleccionada
    localStorage.setItem('org_selected', JSON.stringify(org));

    if (systems.length === 1) {
      this.auth.setCurrentSystem(systems[0]);
      this.router.navigate([`/sistemas/${systems[0].subsystem.key}`]);
      return;
    }

    // Tiene varios sistemas → seleccionar sistema
    this.router.navigate(['/seleccionar-sistema']);
  }
}
