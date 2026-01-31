import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

interface Permission {
  key: string;
  label: string;
  enabled: boolean;
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
}

@Component({
  selector: 'app-permissions',
  imports: [CommonModule],
  templateUrl: './permissions.html',
  styleUrl: './permissions.css',
})
export class Permissions {
  loading = signal(true);

  roles = signal<Role[]>([]);

  hasData = computed(() => this.roles().length > 0);

  constructor() {
    // Simulación API
    setTimeout(() => {
      this.roles.set([
        {
          id: 1,
          name: 'Administrador',
          description: 'Acceso total al sistema',
          permissions: [
            { key: 'users.manage', label: 'Administrar usuarios', enabled: true },
            { key: 'appointments.manage', label: 'Administrar citas', enabled: true },
            { key: 'settings.manage', label: 'Modificar configuración', enabled: true }
          ]
        },
        {
          id: 2,
          name: 'Colaborador',
          description: 'Acceso limitado a operaciones',
          permissions: [
            { key: 'appointments.view', label: 'Ver citas', enabled: true },
            { key: 'appointments.edit', label: 'Editar citas', enabled: false }
          ]
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  togglePermission(role: Role, permission: Permission) {
    permission.enabled = !permission.enabled;
  }

  createRole() {
    console.log('Crear rol');
  }

}
