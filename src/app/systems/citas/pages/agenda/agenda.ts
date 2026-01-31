import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Calendar,
  CheckCircle,
  Clock,
  XCircle,
  UserX,
  Check,
  MessageCircle,
  Mail
} from 'lucide-angular';

interface Reminder {
  whatsapp: boolean;
  email: boolean;
  sent: boolean;
}

type AppointmentStatus = 'confirmada' | 'pendiente' | 'cancelada' | 'no_asistio';

interface Appointment {
  time: string;          // o Date si lo manejas así
  client: string;
  service: string;
  status: AppointmentStatus;
  reminders?: Reminder;
}

@Component({
  selector: 'app-agenda',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})

export class Agenda implements OnInit {
  readonly Calendar = Calendar;
  readonly CheckCircle = CheckCircle;
  readonly Clock = Clock;
  readonly XCircle = XCircle;
  readonly UserX = UserX;
  readonly Check = Check;
  readonly MessageCircle = MessageCircle;
  readonly Mail = Mail;

  loading = true;
  tieneDatos = true;

  
  appointments: Appointment[] = [
    {
      time: '10:00',
      client: 'Ana López',
      service: 'Psicoterapia individual',
      status: 'confirmada',
      reminders: {
        whatsapp: true,
        email: true,
        sent: true
      }
    },
    {
      time: '11:30',
      client: 'Marlem Pérez',
      service: 'Terapia de pareja',
      status: 'pendiente',
      reminders: {
        whatsapp: true,
        email: false,
        sent: false
      }
    },
    {
      time: '12:30',
      client: 'Claudia Pérez',
      service: 'Consulta',
      status: 'cancelada',
      reminders: {
        whatsapp: true,
        email: true,
        sent: true
      }
    },
    {
      time: '15:00',
      client: 'Monse Islas',
      service: 'Consulta',
      status: 'no_asistio',
      reminders: {
        whatsapp: true,
        email: true,
        sent: false
      }
    }
  ];

  getStatusIcon(status: string) {
    return {
      confirmada: this.CheckCircle,
      pendiente: this.Clock,
      cancelada: this.XCircle,
      no_asistio: this.UserX
    }[status];
  }

  getStatusClasses(status: string) {
    return {
      confirmada: 'bg-green-500/10 text-green-400',
      pendiente: 'bg-yellow-500/10 text-yellow-400',
      cancelada: 'bg-red-500/10 text-red-400',
      no_asistio: 'bg-gray-500/10 text-gray-400'
    }[status];
  }

  getStatusLabel(status: string) {
    return {
      confirmada: 'Confirmada',
      pendiente: 'Pendiente',
      cancelada: 'Cancelada',
      no_asistio: 'No asistió'
    }[status];
  }

  ngOnInit() {
    // 🔥 Simulación de carga
    setTimeout(() => {
      this.loading = false;

      // 👉 CAMBIA esto para probar estados

      // EMPTY
      //this.appointments = [];

      // DATA
      if (this.tieneDatos) {
        /*this.appointments = [
          {
            time: '10:00',
            client: 'Ana López',
            service: 'Psicoterapia individual',
            status: 'confirmada'
          },
          {
            time: '11:30',
            client: 'Juan Pérez',
            service: 'Terapia de pareja',
            status: 'pendiente'
          }
        ];*/
      }

    }, 1200);
  }

}
