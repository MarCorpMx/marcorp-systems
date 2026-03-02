import { Component, OnInit, inject, DestroyRef  } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbService } from '../../../../../core/services/breadcrumb.service';
import {
  LucideAngularModule,
  User,
  Phone,
  Mail,
  Calendar,
  FileText
} from 'lucide-angular';

import { ClientDetailApi } from '../../../../../core/models/client.model';
import { ClientService } from '../../../../../core/services/client.service';
import { Notification } from '../../../../../services/notification.service';
import { AppDatePipe } from '../../../../../shared/pipes/app-date-pipe';
import { AppPhonePipe } from '../../../../../shared/pipes/app-phone-pipe';
import { APPOINTMENT_STATUS_CONFIG, AppointmentStatus } from '../../../../../shared/config/appointment-status.config';

/*interface AppointmentHistory {
  date: string;
  service: string;
  status: 'confirmada' | 'cancelada' | 'no_asistio';
}*/

interface Note {
  date: string;
  content: string;
}

@Component({
  selector: 'app-cliente-detalle',
  imports: [LucideAngularModule, TitleCasePipe, AppDatePipe, AppPhonePipe, CommonModule],
  templateUrl: './cliente-detalle.html',
  styleUrl: './cliente-detalle.css',
})

export class ClienteDetalle implements OnInit {
  readonly User = User;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  protected readonly statusConfig = APPOINTMENT_STATUS_CONFIG;
  breadcrumbService = inject(BreadcrumbService);

  loading = true;

  client: ClientDetailApi | null = null;
  /*client = {
    name: 'Ana López',
    status: 'activo',
    phone: '777 123 4567',
    email: 'ana@email.com',
    tags: ['Ansiedad', 'Seguimiento']
  };*/

  history: ClientDetailApi['history'] = [];
  /*history: AppointmentHistory[] = [
    { date: '10 Ene 2026', service: 'Psicoterapia', status: 'confirmada' },
    { date: '20 Dic 2025', service: 'Psicoterapia', status: 'cancelada' }
  ];*/

  notes: ClientDetailApi['notes'] = [];
  /*notes: Note[] = [
    { date: '10 Ene 2026', content: 'Paciente mostró mejoría notable.' },
    { date: '15 Dic 2025', content: 'Se recomienda seguimiento semanal.' }
  ];*/

  route = inject(ActivatedRoute);
  destroyRef = inject(DestroyRef);
  clientService = inject(ClientService);
  notify = inject(Notification);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.notify.error('ID de cliente inválido');
      console.error('ID de cliente inválido');
      this.loading = false;
      return;
    }

    this.clientService
      .getClient(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.client = data;
          this.history = data.history;
          this.notes = data.notes;

          console.log('client: ', data);
          console.log('history: ', data.history);
          console.log('notes: ', data.notes);

          this.breadcrumbService.replaceAt(2, data.name);
          this.loading = false;
        },
        error: (err) => {
          console.error('Error cargando cliente', err);
          this.loading = false;
        }
      });
    console.log("todo okko ", id);

  }



  getStatusClasses(status: string) {
    return {
      confirmada: 'text-green-400',
      cancelada: 'text-red-400',
      no_asistio: 'text-gray-400'
    }[status];
  }

}
