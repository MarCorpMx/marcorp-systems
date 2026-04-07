import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceModel, CreateServiceDto, ServiceVariantListItem } from '../models/service.model';
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
  private variantsEndpoint = 'me/service-variants';

  // ---------------------------
  // SERVICES (ADMIN)
  // ---------------------------
  getAll(): Observable<ServiceModel[]> {
    return this.api.get<ServiceModel[]>(this.endpoint);
  }

  getServiceList(): Observable<any[]> {
    return this.api.get<any[]>(`${this.endpoint}/list`);
  }

  getById(id: number): Observable<ServiceModel> {
    return this.api.get<ServiceModel>(`${this.endpoint}/${id}`);
  }

  create(data: CreateServiceDto) {
    return this.api.post<ServiceModel>(this.endpoint, data);
  }

  update(id: number, data: CreateServiceDto) {
    return this.api.put<ServiceModel>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  // ---------------------------
  // SERVICE VARIANTS (SELECT)
  // ---------------------------
  getVariantList(): Observable<ServiceVariantListItem[]> {
    return this.api.get<ServiceVariantListItem[]>(
      `${this.variantsEndpoint}/list`
    );
  }



}
