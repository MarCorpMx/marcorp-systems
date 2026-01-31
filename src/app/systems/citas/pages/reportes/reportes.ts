import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ReportCard {
  id: string;
  title: string;
  value: string;
  description: string;
  trend?: 'up' | 'down' | 'neutral';
}

@Component({
  selector: 'app-reportes',
  imports: [CommonModule, RouterLink],
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes implements OnInit {
  loading = true;

  reports: ReportCard[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.reports = [
        {
          id: 'appointments',
          title: 'Citas',
          value: '128',
          description: 'Citas en el período seleccionado',
          trend: 'up'
        },
        {
          id: 'income',
          title: 'Ingresos',
          value: '$18,500',
          description: 'Ingresos totales',
          trend: 'up'
        },
        {
          id: 'clients',
          title: 'Clientes',
          value: '42',
          description: 'Clientes activos',
          trend: 'neutral'
        },
        {
          id: 'cancelled',
          title: 'Cancelaciones',
          value: '9',
          description: 'Citas canceladas',
          trend: 'down'
        }
      ];

      this.loading = false;
    }, 1200);
  }

}
