import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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

  sections: ConfigSection[] = [
    {
      id: 1,
      title: 'Consultorio',
      description: 'Nombre, dirección, datos de contacto y branding.',
      icon: this.Building2
    },
    {
      id: 2,
      title: 'Horarios generales',
      description: 'Días laborales, duración de citas y descansos.',
      icon: this.Clock
    },
    {
      id: 3,
      title: 'Notificaciones',
      description: 'Recordatorios automáticos y avisos del sistema.',
      icon: this.Bell
    },
    {
      id: 4,
      title: 'Facturación',
      description: 'Pagos, ingresos y comprobantes.',
      icon: this.CreditCard
    },
    {
      id: 5,
      title: 'Sistema',
      description: 'Opciones avanzadas y comportamiento del sistema.',
      icon: this.Sliders
    }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      // Para probar EMPTY:
      // this.sections = [];

    }, 1200);
  }

}
