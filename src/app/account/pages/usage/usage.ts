import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface UsageItem {
  id: string;
  label: string;
  used: number;
  limit: number;
  unit?: string;
}

@Component({
  selector: 'app-usage',
  imports: [CommonModule],
  templateUrl: './usage.html',
  styleUrl: './usage.css',
})
export class Usage {
  loading = signal(true);

  usage = signal<UsageItem[]>([]);

  hasData = computed(() => this.usage().length > 0);

  constructor() {
    // Simulación API
    setTimeout(() => {
      this.usage.set([
        {
          id: 'appointments',
          label: 'Citas',
          used: 320,
          limit: 500
        },
        {
          id: 'clients',
          label: 'Clientes',
          used: 210,
          limit: 300
        },
        {
          id: 'team',
          label: 'Miembros del equipo',
          used: 3,
          limit: 5
        },
        {
          id: 'organizations',
          label: 'Organizaciones',
          used: 1,
          limit: 3
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  percentage(item: UsageItem) {
    return Math.min(
      Math.round((item.used / item.limit) * 100),
      100
    );
  }

}
