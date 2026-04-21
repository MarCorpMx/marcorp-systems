import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

import { StaffListItem } from '../models/staff.model';

export interface Professional {
  id: number;
  name: string;
  email?: string;
  is_active: boolean;
}

export interface ProfessionalFilters {
  active?: boolean;
  public?: boolean;
  exclude_role?: string;
  subsystem?: string;
}

@Injectable({
  providedIn: 'root',
})

export class ProfessionalsService {
  private endpoint = 'me/staff-members';

  constructor(private api: Api) { }

  // getAll(): Observable<{ data: Professional[] }> {
  //   return this.api.get<{ data: Professional[] }>(this.endpoint);
  // }

  getAll(filters?: ProfessionalFilters): Observable<{ data: Professional[] }> {

    let params: Record<string, any> = {};

    if (filters) {

      if (filters.active !== undefined) {
        params['active'] = filters.active ? 1 : 0;
      }

      if (filters.public !== undefined) {
        params['public'] = filters.public ? 1 : 0;
      }

      if (filters.exclude_role) {
        params['exclude_role'] = filters.exclude_role;
      }

      if (filters.subsystem) {
        params['subsystem'] = filters.subsystem;
      }

    }

    return this.api.get<{ data: Professional[] }>(this.endpoint, {
      params
    });
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

  // cargar staff dinámicamente
  getStaffByVariant(variantId: number) {
    return this.api.get<StaffListItem[]>(
      `me/service-variants/${variantId}/staff`
    );
  }

  // Servicios del staff
  getStaffVariants(staffId: number) {
    return this.api.get<{ data: number[] }>(
      `me/staff-members/${staffId}/service-variants`
    );
  }

  syncStaffVariants(staffId: number, payload: { service_variant_ids: number[] }) {
    return this.api.put(
      `me/staff-members/${staffId}/service-variants`,
      payload
    );
  }

}
