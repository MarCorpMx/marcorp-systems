import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  Plus,
  Clock,
  DollarSign,
  MapPin,
  Video,
  Palette
} from 'lucide-angular';

type ServiceMode = 'online' | 'presencial';

interface Service {
  id: number;
  name: string;
  duration: number; // minutos
  price: number;
  color: string;    // hex o tailwind-ready
  mode: ServiceMode;
  active: boolean;
}

@Component({
  selector: 'app-servicios',
  imports: [LucideAngularModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})

export class Servicios implements OnInit {
  readonly Plus = Plus;
  readonly Clock = Clock;
  readonly DollarSign = DollarSign;
  readonly MapPin = MapPin;
  readonly Video = Video;
  readonly Palette = Palette;

  loading = true;

  services: Service[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      // cambia para probar empty
      this.services = [
        {
          id: 1,
          name: 'Psicoterapia individual',
          duration: 60,
          price: 600,
          color: '#7C3AED',
          mode: 'presencial',
          active: true
        },
        {
          id: 2,
          name: 'Terapia de pareja',
          duration: 90,
          price: 900,
          color: '#0EA5E9',
          mode: 'online',
          active: true
        }
      ];
    }, 1200);
  }

  getModeLabel(mode: ServiceMode) {
    return mode === 'online' ? 'Online' : 'Presencial';
  }

  getModeIcon(mode: ServiceMode) {
    return mode === 'online' ? this.Video : this.MapPin;
  }

}
