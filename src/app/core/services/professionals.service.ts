import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface Professional {
  id: number;
  name: string;
  email?: string;
  is_active: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class ProfessionalsService {
  private endpoint = 'me/staff-members';

  constructor(private api: Api) { }

  getAll(): Observable<{ data: Professional[] }> {
    return this.api.get<{ data: Professional[] }>(this.endpoint);
  }

  getById(id: number): Observable<{ data: Professional }> {
    return this.api.get<{ data: Professional }>(`${this.endpoint}/${id}`);
  }

  create(data: Partial<Professional>) {
    return this.api.post(`${this.endpoint}`, data);
  }

  update(id: number, data: Partial<Professional>) {
    return this.api.put(`${this.endpoint}/${id}`, data);
  }

  delete(id: number) {
    return this.api.delete(`${this.endpoint}/${id}`);
  }

}
