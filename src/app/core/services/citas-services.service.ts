import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel, CreateServiceDto } from '../models/service.model';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})

export class CitasServicesService {

  constructor(
    private api: Api
  ) { }

  /*
  GET    /api/me/services
  POST   /api/me/services
  GET    /api/me/services/{id}
  PUT    /api/me/services/{id}
  DELETE /api/me/services/{id}
  */

  private endpoint = 'me/services';

  getAll(): Observable<ServiceModel[]> {
    return this.api.get<ServiceModel[]>(this.endpoint);
  }

  getById(id: number): Observable<ServiceModel> {
    return this.api.get<ServiceModel>(`${this.endpoint}/${id}`);
  }

  /*create(payload: Partial<ServiceModel>): Observable<ServiceModel> {
    return this.api.post<ServiceModel>(this.endpoint, payload);
  }

  update(id: number, payload: Partial<ServiceModel>): Observable<ServiceModel> {
    return this.api.put<ServiceModel>(`${this.endpoint}/${id}`, payload);
  }*/

  create(data: CreateServiceDto) {
    return this.api.post<ServiceModel>(this.endpoint, data);
  }

  update(id: number, data: CreateServiceDto) {
    return this.api.put<ServiceModel>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

}
