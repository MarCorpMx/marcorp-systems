import { Component, OnInit, inject } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { BreadcrumbService } from '../../../../../core/services/breadcrumb.service';
import {
  LucideAngularModule,
  User,
  Phone,
  Mail,
  Calendar,
  FileText
} from 'lucide-angular';

interface AppointmentHistory {
  date: string;
  service: string;
  status: 'confirmada' | 'cancelada' | 'no_asistio';
}

interface Note {
  date: string;
  content: string;
}


@Component({
  selector: 'app-cliente-detalle',
  imports: [LucideAngularModule, TitleCasePipe],
  templateUrl: './cliente-detalle.html',
  styleUrl: './cliente-detalle.css',
})

export class ClienteDetalle implements OnInit {
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  breadcrumbService = inject(BreadcrumbService);

  loading = true;

  client = {
    name: 'Ana López',
    status: 'activo',
    phone: '777 123 4567',
    email: 'ana@email.com',
    tags: ['Ansiedad', 'Seguimiento']
  };

  history: AppointmentHistory[] = [
    { date: '10 Ene 2026', service: 'Psicoterapia', status: 'confirmada' },
    { date: '20 Dic 2025', service: 'Psicoterapia', status: 'cancelada' }
  ];

  notes: Note[] = [
    { date: '10 Ene 2026', content: 'Paciente mostró mejoría notable.' },
    { date: '15 Dic 2025', content: 'Se recomienda seguimiento semanal.' }
  ];

  ngOnInit() {
    setTimeout(() => this.loading = false, 1200);

    const clientName = 'Ana López'; // simulado
    this.breadcrumbService.replaceAt(2, clientName);
  }

  

  getStatusClasses(status: string) {
    return {
      confirmada: 'text-green-400',
      cancelada: 'text-red-400',
      no_asistio: 'text-gray-400'
    }[status];
  }

}
