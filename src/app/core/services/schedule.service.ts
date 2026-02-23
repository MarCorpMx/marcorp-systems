import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { ScheduleSettings } from '../models/schedule-settings.model';

@Injectable({
  providedIn: 'root',
})

export class ScheduleService {

  constructor(private api: Api) {}

  getSchedule(): Observable<ScheduleSettings> {
    return this.api.get<ScheduleSettings>('me/schedule-settings');
  }

  updateSchedule(payload: ScheduleSettings): Observable<ScheduleSettings> {
    return this.api.put<ScheduleSettings>('me/schedule-settings', payload);
  }
  
}
