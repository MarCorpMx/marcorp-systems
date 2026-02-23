import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { SubscriptionService } from '../../../core/services/subscription.service';


interface Feature {
  key: string;
  name: string;
  enabled: boolean;
  limit: number | null;
}

interface Plan {
  id: number;
  key:string;
  name: string;
  price: string;
  description: string;
  features: Feature[];
  highlight?: string;
  current?: boolean;
}

interface PlanView {
  key: string;
  name: string;
  price: number;
  description: string;

  features: {
    key: string;
    name: string;
    enabled: boolean;
    limit: number | null;
  }[];

  isCurrent: boolean;
  highlight?: boolean;
}

@Component({
  selector: 'app-subscriptions',
  imports: [CommonModule],
  templateUrl: './subscriptions.html',
  styleUrl: './subscriptions.css',
})

export class Subscriptions {
  private auth = inject(AuthService);
  private subscriptionsApi = inject(SubscriptionService);

  currentSystem = this.auth.getCurrentSystem();
  currentPlanKey = signal<string | null>(null);

  plans = signal<Plan[]>([]);
  loading = signal(false);
  hasPlan = computed(() => this.plans().length > 0);


  constructor() {
    // Simulación API
    /*setTimeout(() => {
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
    }, 1200);*/
  }

  ngOnInit() {
    this.loadPlans();
    /*console.log('Plan:', this.currentPlanKey);
    console.log('ID Organización:', this.organizationId);
    console.log('Subsystem:', this.subsystemKey);*/
  }

  async loadPlans() {
    this.loading.set(true);

    const { organization_id, subsystem } = this.currentSystem;

    const [current, plans] = await Promise.all([
      firstValueFrom(
        this.subscriptionsApi.getCurrentPlan(organization_id, subsystem.key)
      ),
      firstValueFrom(
        this.subscriptionsApi.getPlans(subsystem.key)
      )
    ]);


    this.currentPlanKey.set(current.plan.key);

    this.plans.set(
      plans.map(plan => ({
        ...plan,
        current: plan.key === current.plan.key,
        highlight: plan.key === 'basic', // Plan recomendado
        features: plan.features ?? []
      }))
    );

    console.log(plans);
    //console.log(JSON.stringify(plan));

    this.loading.set(false);
  }

  upgrade(plan: Plan) {
    console.log('Cambiar a plan:', plan.name);
  }

  goToUpgrade() {

  }


}
