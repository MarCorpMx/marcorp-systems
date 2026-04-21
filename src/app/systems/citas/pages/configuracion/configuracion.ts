import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  LucideAngularModule,
  Building2,
  Clock,
  Bell,
  CreditCard,
  Sliders,
  MapPin,
  Settings
} from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';

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
  /*readonly Building2 = Building2;
  readonly Clock = Clock;
  readonly Bell = Bell;
  readonly CreditCard = CreditCard;
  readonly Sliders = Sliders;
  readonly MapPin = MapPin;*/

  ICON_MAP: any = {
    Building2,
    Clock,
    Bell,
    CreditCard,
    Sliders,
    MapPin,
    Settings
  };

  private auth = inject(AuthService);
  private router = inject(Router);

  loading = false;

  system = this.auth.getCurrentSystemSafe();
  sections: any[] = [];
  //currentPlanKey = 'basic'; // esto luego vendrá del backend - rombi

  //constructor(private router: Router) { }

  /*
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
      title: 'Sucursales',
      description: 'Administra tus ubicaciones físicas o virtuales.',
      icon: MapPin,
      route: '/sistemas/citas/configuracion/sucursales',
      requiredPlan: 'pro' 
    },
    {
      id: 3,
      title: 'Horario de atención',
      description: 'Define reglas generales como duración, descansos y políticas de reserva.',
      icon: this.Clock,
      route: '/sistemas/citas/configuracion/agenda'
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
  */

  ngOnInit() {
    console.log('features:', this.system?.features);

    if (!this.system?.features) return;

    this.sections = this.system.features
      .filter((f: any) => f.parent === 'settings' && Number(f.visible) === 1)
      .map((f: any) => ({
        ...f,
        iconComponent: this.ICON_MAP[f.icon] || this.ICON_MAP['Settings']
      }))
      .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0));

    console.log('sections:', this.sections);
  }



  handleBlocked(feature: any) {
    console.log('Feature bloqueada:', feature.key);

    // aquí puedes abrir modal PRO
  }

  /*isLocked(section: ConfigSection): boolean {
    if (!section.requiredPlan) return false;

    const hierarchy = ['free', 'basic', 'pro', 'premium', 'founder_lifetime'];

    return (
      hierarchy.indexOf(this.currentPlanKey) <
      hierarchy.indexOf(section.requiredPlan)
    );
  }*/

  goTo(section: ConfigSection) {
    this.router.navigateByUrl(section.route);
  }

}
