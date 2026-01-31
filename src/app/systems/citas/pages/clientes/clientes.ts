import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  UserCheck,
  UserX,
  Tag,
  Calendar,
  FileText
} from 'lucide-angular';

interface Client {
  id: number;
  name: string;
  lastAppointment: string;
  notesCount: number;
  tags: string[];
  status: 'activo' | 'inactivo' | 'riesgo';
}

@Component({
  selector: 'app-clientes',
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

export class Clientes implements OnInit {
  readonly UserCheck = UserCheck;
  readonly UserX = UserX;
  readonly Tag = Tag;
  readonly Calendar = Calendar;
  readonly FileText = FileText;

  loading = true;
  clients: Client[] = [];

  ngOnInit() {
    // Simulación de carga
    setTimeout(() => {
      this.loading = false;

      // EMPTY
      //this.clients = [];

      // DATA de prueba
      this.clients = [
        {
          id: 1,
          name: 'Ana López',
          lastAppointment: '10:00 · 28/01/2026',
          notesCount: 3,
          tags: ['frecuente', 'online'],
          status: 'activo'
        },
        {
          id: 2,
          name: 'Juan Pérez',
          lastAppointment: '11:30 · 27/01/2026',
          notesCount: 1,
          tags: ['nuevo', 'presencial'],
          status: 'riesgo'
        },
        {
          id: 3,
          name: 'Claudia Sánchez',
          lastAppointment: 'Cancelada · 25/01/2026',
          notesCount: 0,
          tags: ['riesgo'],
          status: 'inactivo'
        }
      ];
    }, 1200);
  }

  // Status classes para badges
  getStatusClasses(status: string) {
    return {
      activo: 'bg-green-500/10 text-green-400',
      inactivo: 'bg-gray-500/10 text-gray-400',
      riesgo: 'bg-yellow-500/10 text-yellow-400'
    }[status];
  }

}
