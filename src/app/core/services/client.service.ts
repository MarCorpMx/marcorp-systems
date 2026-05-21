import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { PaginatedResponse } from '../../shared/models/pagination.model';
import { ClientApi, ClientDetailApi, ClientPayload, ClientSelectItem, PetSelectItem } from '../models/client.model';


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

  getClientList(search?: string): Observable<ClientSelectItem[]> {
    let endpoint = `me/clients/list`;

    if (search) {
      endpoint += `?search=${encodeURIComponent(search)}`;
    }

    return this.api.get<ClientSelectItem[]>(endpoint);
  }

  /**
   * GET /api/me/clients/{id}
   */
  /*getClient(id: number): Observable<ClientDetailApi> {
    return this.api.get<ClientDetailApi>(`me/clients/${id}`);
  }*/
  getClient(id: number): Observable<{
    message: string;
    data: ClientDetailApi;
  }> {

    return this.api.get<{
      message: string;
      data: ClientDetailApi;
    }>(
      `me/clients/${id}`
    );

  }

  /**
   * POST /api/me/clients
   */
  createClient(payload: ClientPayload) {
    return this.api.post<{
      message: string;
      data: ClientApi;
    }>(
      'me/clients',
      payload
    );
  }

  /**
   * PUT /api/me/clients/{id}
   */
  updateClient(
    id: number,
    payload: ClientPayload
  ) {
    return this.api.put<{
      message: string;
      data: ClientApi;
    }>(
      `me/clients/${id}`,
      payload
    );
  }

  // Cambiar el estatus
  changeStatus(id: number, payload: any) {
    return this.api.patch<{
      message: string;
      data: {
        id: number;
        is_active: boolean;
      };
    }>(`me/clients/${id}/status`, payload);
  }

  // Bloquear / Desbloquear
  changeBlockStatus(
    id: number,
    payload: {
      blocked: boolean;
      reason?: string | null;
    }
  ) {
    return this.api.patch<{
      message: string;
      data: {
        id: number;
        is_blocked: boolean;
        blocked_reason: string | null;
      };
    }>(
      `me/clients/${id}/block`,
      payload
    );
  }

  /**
   * DELETE /api/me/clients/{id}
   */
  deleteClient(id: number) {
    return this.api.delete(`me/clients/${id}`);
  }

  /**
  * Consultar mascotas
  */
  getClientPets(
    clientId: number
  ): Observable<PetSelectItem[]> {

    return this.api.get<
      PetSelectItem[]
    >(
      `me/clients/${clientId}/pets`
    );

  }

  /**
 * Crear cliente rápido
 */
  quickCreate(
    payload: any
  ) {
    return this.api.post<
      ClientSelectItem
    >(
      'me/clients/quick-create',
      payload
    );
  }

}
