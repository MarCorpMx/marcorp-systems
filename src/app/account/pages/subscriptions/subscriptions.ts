import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

interface Plan {
  id: number;
  name: string;
  price: string;
  description: string;
  features: string[];
  current?: boolean;
}

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})
export class Subscriptions {
  loading = signal(true);

  plans = signal<Plan[]>([]);

  hasPlan = computed(() => this.plans().length > 0);

  constructor() {
    // Simulación API
    setTimeout(() => {
      this.plans.set([
        {
          id: 1,
          name: 'Starter',
          price: '$0',
          description: 'Ideal para comenzar',
          features: [
            '1 organización',
            '50 citas al mes',
            'Soporte básico'
          ]
        },
        {
          id: 2,
          name: 'Pro',
          price: '$299 MXN / mes',
          description: 'Para negocios en crecimiento',
          features: [
            'Organizaciones ilimitadas',
            'Citas ilimitadas',
            'Recordatorios automáticos',
            'Soporte prioritario'
          ],
          current: true
        },
        {
          id: 3,
          name: 'Business',
          price: '$699 MXN / mes',
          description: 'Operación completa',
          features: [
            'Todo en Pro',
            'Equipo avanzado',
            'Reportes',
            'Soporte dedicado'
          ]
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  upgrade(plan: Plan) {
    console.log('Cambiar a plan:', plan.name);
  }
  

}
