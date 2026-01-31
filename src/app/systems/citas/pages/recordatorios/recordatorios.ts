import { Component, OnInit } from '@angular/core';
import {
  LucideAngularModule,
  MessageCircle,
  Mail,
  Bell,
  Plus,
  CheckCircle,
  XCircle
} from 'lucide-angular';

type Channel = 'whatsapp' | 'email';

interface ReminderTemplate {
  id: number;
  name: string;
  channel: Channel;
  active: boolean;
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

  templates: ReminderTemplate[] = [];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      this.templates = [
        {
          id: 1,
          name: 'Confirmación de cita',
          channel: 'whatsapp',
          active: true
        },
        {
          id: 2,
          name: 'Recordatorio 24h antes',
          channel: 'email',
          active: true
        },
        {
          id: 3,
          name: 'Cancelación',
          channel: 'whatsapp',
          active: false
        }
      ];
    }, 1200);
  }

  getChannelIcon(channel: Channel) {
    return channel === 'whatsapp'
      ? this.MessageCircle
      : this.Mail;
  }

  getChannelLabel(channel: Channel) {
    return channel === 'whatsapp'
      ? 'WhatsApp'
      : 'Email';
  }

}
