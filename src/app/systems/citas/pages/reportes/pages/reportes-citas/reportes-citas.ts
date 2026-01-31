import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AppointmentReport {
  id: number;
  date: string;
  time: string;
  client: string;
  service: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  price: number;
}

@Component({
  selector: 'app-reportes-citas',
  imports: [CommonModule],
  templateUrl: './reportes-citas.html',
  styleUrl: './reportes-citas.css',
})
export class ReportesCitas {
  loading = true;

  appointments: AppointmentReport[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.appointments = [
        {
          id: 1,
          date: '2026-01-20',
          time: '10:00',
          client: 'Ana Martínez',
          service: 'Terapia individual',
          status: 'completed',
          price: 600
        },
        {
          id: 2,
          date: '2026-01-21',
          time: '12:00',
          client: 'Carlos Ruiz',
          service: 'Terapia de pareja',
          status: 'confirmed',
          price: 800
        },
        {
          id: 3,
          date: '2026-01-22',
          time: '09:00',
          client: 'Laura Gómez',
          service: 'Evaluación inicial',
          status: 'cancelled',
          price: 500
        }
      ];

      this.loading = false;
    }, 1200);
  }

  getStatusLabel(status: string) {
    return {
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No asistió'
    }[status];
  }

  getStatusClasses(status: string) {
    return {
      confirmed: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      no_show: 'bg-yellow-100 text-yellow-700'
    }[status];
  }

  get totalAmount() {
    return this.appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.price, 0);
  }

}
