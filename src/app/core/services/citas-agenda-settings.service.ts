import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface AgendaSettings {
  appointment_duration: number;
  break_between_appointments: number;
  minimum_notice_hours: number;
  cancellation_limit_hours: number;
  allow_online_booking: boolean;
  allow_cancellation: boolean;
}

export interface WeeklySchedule {
  day_of_week: number;
  start_time: string;
  end_time: string;
}

// Respuesta en onboarding
export interface UpdateAgendaResponse {
  message: string;
  organization?: {
    id: number;
    name: string;
    onboarding_step: string;
    onboarding_completed_at: string | null;
  };
}

@Injectable({
  providedIn: 'root',
})

/*
    |--------------------------------------------------------------------------
    | citas/configuracion/agenda
    |--------------------------------------------------------------------------
    */

export class AgendaSettingsService {
  private endpoint = 'me/staff-members';

  constructor(private api: Api) { }

  getAgenda(professionalId: number): Observable<any> {
    return this.api.get(
      `${this.endpoint}/${professionalId}/agenda`
    );
  }

  updateAgenda(professionalId: number, data: any) {
    return this.api.put<UpdateAgendaResponse>(
      `${this.endpoint}/${professionalId}/agenda`,
      data
    );
  }

  // Bloqueos individuales
  createBlock(professionalId: number, data: any) {
    return this.api.post(
      `${this.endpoint}/${professionalId}/blocked-slots`,
      data
    );
  }

  updateBlock(professionalId: number, blockedSlot: number, data: any) {
    return this.api.put(
      `${this.endpoint}/${professionalId}/blocked-slots/${blockedSlot}`,
      data
    );
  }

  deleteBlock(professionalId: number, blockedSlot: number) {
    return this.api.delete(
      `${this.endpoint}/${professionalId}/blocked-slots/${blockedSlot}`
    );
  }


}
