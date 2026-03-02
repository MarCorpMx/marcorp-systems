import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface NonWorkingDay {
  id: number;
  date: string;
  reason: string;
}

@Injectable({
  providedIn: 'root',
})
export class NonWorkingDayService {
  private endpoint = 'me/staff-members';

  constructor(private api: Api) { }

  getAll(professionalId: number): Observable<{ data: NonWorkingDay[] }> {
    return this.api.get<{ data: NonWorkingDay[] }>(
      `${this.endpoint}/${professionalId}/non-working-days`
    );
  }

  create(professionalId: number, data: Partial<NonWorkingDay>) {
    return this.api.post(
      `${this.endpoint}/${professionalId}/non-working-days`,
      data
    );
  }

  delete(professionalId: number, dayId: number) {
    return this.api.delete(
      `${this.endpoint}/${professionalId}/non-working-days/${dayId}`
    );
  }
}
