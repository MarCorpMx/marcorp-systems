import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Organization {
  id: number;
  name: string;
  role: string;
  members: number;
  active: boolean;
}

@Component({
  selector: 'app-organizations',
  imports: [CommonModule],
  templateUrl: './organizations.html',
  styleUrl: './organizations.css',
})
export class Organizations {
  loading = signal(true);

  organizations = signal<Organization[]>([]);

  hasData = computed(() => this.organizations().length > 0);

  constructor() {
    // Simulación de carga
    setTimeout(() => {
      this.organizations.set([
        {
          id: 1,
          name: 'Punto de Calma',
          role: 'Administrador',
          members: 4,
          active: true
        },
        {
          id: 2,
          name: 'Marcorp',
          role: 'Colaborador',
          members: 8,
          active: false
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  setActive(org: Organization) {
    this.organizations.update(list =>
      list.map(o => ({ ...o, active: o.id === org.id }))
    );
  }

  createOrganization() {
    console.log('Crear organización');
  }

}
