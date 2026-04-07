import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppointmentModel, CreateAppointmentDto } from '../models/appointment.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})

export class CitasAgendaService {

  constructor(private api: Api) { }

  /*
  GET    /api/me/appointments
  POST   /api/me/appointments
  GET    /api/me/appointments/{id}
  PUT    /api/me/appointments/{id}
  DELETE /api/me/appointments/{id}
  */

  private endpoint = 'me/appointments';

  getAll(params?: { date?: string }): Observable<{ data: AppointmentModel[] }> {
    return this.api.get<{ data: AppointmentModel[] }>(
      this.endpoint,
      { params }
    );
  }

  getById(id: number): Observable<AppointmentModel> {
    return this.api.get<AppointmentModel>(`${this.endpoint}/${id}`);
  }

  create(data: CreateAppointmentDto): Observable<AppointmentModel> {
    return this.api.post<AppointmentModel>(this.endpoint, data);
  }

  update(id: number, data: CreateAppointmentDto): Observable<AppointmentModel> {
    return this.api.put<AppointmentModel>(`${this.endpoint}/${id}`, data);
  }

  updateStatus(id: number, data: { status: string; note?: string }) {
    return this.api.patch(`${this.endpoint}/${id}/status`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

}
