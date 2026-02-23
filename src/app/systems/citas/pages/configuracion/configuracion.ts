import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Building2,
  Clock,
  Bell,
  CreditCard,
  Sliders
} from 'lucide-angular';

interface ConfigSection {
  id: number;
  title: string;
  description: string;
  icon: any;
  route: string;
  requiredPlan?: string; // opcional para control por plan
}

@Component({
  selector: 'app-configuracion',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css',
})

export class Configuracion implements OnInit {
  readonly Building2 = Building2;
  readonly Clock = Clock;
  readonly Bell = Bell;
  readonly CreditCard = CreditCard;
  readonly Sliders = Sliders;

  loading = true;
  currentPlanKey = 'basic'; // esto luego vendrá del backend - rombi

  constructor(private router: Router) { }

  sections: ConfigSection[] = [
    {
      id: 1,
      title: 'Perfil del negocio',
      description: 'Nombre comercial, dirección, contacto y branding.',
      icon: this.Building2,
      route: '/sistemas/citas/configuracion/perfil'
    },
    {
      id: 2,
      title: 'Preferencias de agenda',
      description: 'Duración por defecto, tiempos de descanso y reglas.',
      icon: this.Clock,
      route: '/sistemas/citas/configuracion/agenda'
    },
    {
      id: 3,
      title: 'Notificaciones',
      description: 'Canales, plantillas y comportamiento de recordatorios.',
      icon: this.Bell,
      route: '/citas/configuracion/notificaciones'
    },
    {
      id: 4,
      title: 'Pagos y facturación',
      description: 'Métodos de pago y configuración fiscal.',
      icon: this.CreditCard,
      route: '/citas/configuracion/pagos',
      requiredPlan: 'pro'
    },
    {
      id: 5,
      title: 'Avanzado',
      description: 'Integraciones, seguridad y opciones técnicas.',
      icon: this.Sliders,
      route: '/citas/configuracion/avanzado'
    }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      // Para probar EMPTY:
      // this.sections = [];

    }, 1200);
  }

  isLocked(section: ConfigSection): boolean {
    if (!section.requiredPlan) return false;

    const hierarchy = ['free', 'basic', 'pro', 'premium', 'founder_lifetime'];

    return (
      hierarchy.indexOf(this.currentPlanKey) <
      hierarchy.indexOf(section.requiredPlan)
    );
  }

  goTo(section: ConfigSection) {
    this.router.navigateByUrl(section.route);
  }

}
