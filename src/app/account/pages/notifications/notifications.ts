import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NotificationOption {
  key: string;
  label: string;
  description: string;
  email: boolean;
  whatsapp: boolean;
  system: boolean;
}

interface NotificationGroup {
  id: number;
  title: string;
  description: string;
  options: NotificationOption[];
}

@Component({
  selector: 'app-notifications',
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class Notifications implements OnInit {
  loading = signal(true);
  saving = signal(false);

  notificationGroups: NotificationGroup[] = [];

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.loading.set(true);

    // 🔥 Simulación API
    setTimeout(() => {
      this.notificationGroups = [
        {
          id: 1,
          title: 'Citas',
          description: 'Notificaciones relacionadas con tus citas',
          options: [
            {
              key: 'appointment_created',
              label: 'Nueva cita',
              description: 'Cuando se agenda una nueva cita',
              email: true,
              whatsapp: true,
              system: true
            },
            {
              key: 'appointment_cancelled',
              label: 'Cita cancelada',
              description: 'Cuando una cita es cancelada',
              email: true,
              whatsapp: false,
              system: true
            }
          ]
        },
        {
          id: 2,
          title: 'Recordatorios',
          description: 'Avisos previos a las citas',
          options: [
            {
              key: 'appointment_reminder',
              label: 'Recordatorio de cita',
              description: 'Antes de una cita programada',
              email: false,
              whatsapp: true,
              system: true
            }
          ]
        }
      ];

      this.loading.set(false);
    }, 1200);
  }

  save() {
    this.saving.set(true);

    // 👉 aquí luego va API
    setTimeout(() => {
      this.saving.set(false);
    }, 1000);
  }

}
