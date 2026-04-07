import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';


type Channel = 'whatsapp' | 'email';

export interface Reminder {
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

@Injectable({
  providedIn: 'root',
})

export class CitasNotificationService {

  private endpoint = 'me/notification-rules';

  constructor(private api: Api) { }

  getRules(): Observable<Reminder> {
    return this.api.get<Reminder>(this.endpoint);
  }

  toggle(event: string, channel: string, active: boolean) {
    return this.api.patch(`${this.endpoint}/${event}/${channel}`, {
      active
    });
  }

  updateRecipients(event: string, channel: string, recipients: any) {
    return this.api.patch(
      `${this.endpoint}/${event}/${channel}/recipients`,
      { recipients }
    );
  }

}
