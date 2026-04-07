import { Component, OnInit, inject } from '@angular/core';
import {
  LucideAngularModule,
  MessageCircle,
  Mail,
  Bell,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-angular';

import { Notification } from '../../../../services/notification.service';
import { CitasNotificationService } from '../../../../core/services/citas-notification.service';
// import { ReminderService } from

type Channel = 'whatsapp' | 'email';


interface Reminder {
  id: number;

  name: string;           // template_name
  event: string;          // appointment_created
  channel: Channel;

  active: boolean;        // is_enabled
  delay_minutes?: number;

  //recipient_type: 'client' | 'admin' | 'custom';
  recipients: {
    client: boolean;
    admin: boolean;
  }
}


@Component({
  selector: 'app-recordatorios',
  imports: [LucideAngularModule],
  templateUrl: './recordatorios.html',
  styleUrl: './recordatorios.css',
})

export class Recordatorios implements OnInit {
  readonly MessageCircle = MessageCircle;
  readonly Mail = Mail;
  readonly Bell = Bell;
  readonly Plus = Plus;
  readonly CheckCircle = CheckCircle;
  readonly XCircle = XCircle;

  loading = true;

  channels = {
    whatsapp: true,
    email: true,
    sms: false // 🔒 futuro
  };

  //templates: ReminderTemplate[] = [];
  reminders: Reminder[] = [];

  private notify = inject(Notification);
  private reminderService = inject(CitasNotificationService);

  ngOnInit() {

    this.loadReminders();

  }

  loadReminders() {
    this.loading = true;

    this.reminderService.getRules().subscribe({
      next: (res) => {
        //console.log("diana:", res);
        //this.reminders = res;
        //this.loading = false;
      }
    });

    // 🔥 MOCK (luego API)
    setTimeout(() => {
      this.reminders = [
        {
          id: 1,
          name: 'Confirmación de cita',
          event: 'appointment_created',
          //channel: 'whatsapp',
          channel: 'email',
          active: true,
          recipients: {
            client: true,
            admin: true
          }
        },
        {
          id: 2,
          name: 'Recordatorio 24h antes',
          event: 'appointment_reminder',
          channel: 'email',
          active: true,
          delay_minutes: -1440,
          recipients: {
            client: true,
            admin: true
          }
        },
        {
          id: 3,
          name: 'Cancelación',
          event: 'appointment_cancelled',
          channel: 'email',
          //active: false,
          active: true,
          recipients: {
            client: true,
            admin: true
          }
        },
        {
          id: 4,
          name: 'Cita reagendada',
          event: 'appointment_rescheduled',
          channel: 'email',
          active: true,
          recipients: {
            client: true,
            admin: true
          }
        }
      ];

      this.loading = false;
    }, 800);
  }

  toggleReminder(reminder: Reminder) {
    const original = reminder.active;

    reminder.active = !reminder.active;

    // 🔥 luego API
    /*
    this.reminderService.toggle(reminder.id).subscribe({
      error: () => {
        reminder.active = original;
        this.notify.error('No se pudo actualizar');
      }
    });
    */
  }

  toggleRecipient(reminder: Reminder, type: 'client' | 'admin') {
    reminder.recipients[type] = !reminder.recipients[type];

    // 🔥 luego API
    /*
    this.reminderService.updateRecipients(reminder.id, reminder.recipients)
      .subscribe({
        error: () => {
          reminder.recipients[type] = !reminder.recipients[type];
          this.notify.error('No se pudo actualizar');
        }
      });
    */
  }



  getChannelIcon(channel: Channel) {
    return channel === 'whatsapp'
      ? this.MessageCircle
      : this.Mail;
  }

  getEventLabel(event: string) {
    return {
      appointment_created: 'Confirmación',
      appointment_reminder: 'Recordatorio',
      appointment_cancelled: 'Cancelación',
      appointment_rescheduled: 'Reagendada',
    }[event] || event;
  }

  getChannelLabel(channel: Channel) {
    return channel === 'whatsapp'
      ? 'WhatsApp'
      : 'Email';
  }

}
