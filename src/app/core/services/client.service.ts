import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PaginatedResponse } from '../../shared/models/pagination.model';
import { ClientApi, ClientDetailApi } from '../models/client.model';


@Injectable({
  providedIn: 'root',
})

export class ClientService {

  constructor(private api: Api) { }

  /**
   * GET /api/me/clients
   */
  getClients(page: number = 1, search?: string):
    Observable<PaginatedResponse<ClientApi>> {

    let endpoint = `me/clients?page=${page}`;

    if (search) {
      endpoint += `&search=${encodeURIComponent(search)}`;
    }

    return this.api.get<PaginatedResponse<ClientApi>>(endpoint);
  }

  getClientList(search?: string): Observable<ClientApi[]> {
    let endpoint = `me/clients/list`;

    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }

    return this.api.get<ClientApi[]>(endpoint);
  }

  /**
   * GET /api/me/clients/{id}
   */
  getClient(id: number): Observable<ClientDetailApi> {
    return this.api.get<ClientDetailApi>(`me/clients/${id}`);
  }

  /**
   * POST /api/me/clients
   */
  createClient(data: any) {
    return this.api.post('me/clients', data);
  }

  /**
   * PUT /api/me/clients/{id}
   */
  updateClient(id: number, data: any) {
    return this.api.put(`me/clients/${id}`, data);
  }

  /**
   * DELETE /api/me/clients/{id}
   */
  deleteClient(id: number) {
    return this.api.delete(`me/clients/${id}`);
  }

}
