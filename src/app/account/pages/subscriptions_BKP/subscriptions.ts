import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions {
  systems = signal<any[]>([]);
  loading = signal<string | null>(null);

  constructor(private auth: AuthService) {
    this.systems.set(this.auth.getSystems());
  }

  availableSystems = [
    {
      key: 'citas',
      name: 'Sistema de Citas',
      description: 'Agenda, clientes y gestión de citas',
      color: '#10b981'
    },
    {
      key: 'escolar',
      name: 'Sistema Escolar',
      description: 'Alumnos, clases, calificaciones',
      color: '#6366f1'
    },
    {
      key: 'inventarios',
      name: 'Inventarios',
      description: 'Control de stock y movimientos',
      color: '#f59e0b'
    }
  ]

  hasSystem(key: string): boolean {
    return this.systems().some(s => s.subsystem_key === key);
  }

  addSystem(system: any) {
    this.loading.set(system.key);

    // 🔜 luego aquí irá la API real
    setTimeout(() => {
      this.systems.update(s => [
        ...s,
        {
          subsystem_key: system.key,
          subsystem_name: system.name,
          is_paid: false,
          roles: ['user']
        }
      ]);

      localStorage.setItem('systems', JSON.stringify(this.systems()));
      this.loading.set(null);
    }, 900);
  }

}
