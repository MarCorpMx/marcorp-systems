import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { Organization } from '../models/organization.model';

@Injectable({
  providedIn: 'root',
})

export class OrganizationService {

  constructor(private api: Api) { }

  /**
   * GET /api/me/organization
   */
  getOrganization(): Observable<Organization> {
    return this.api.get<Organization>('me/organization');
  }

  /**
   * PUT /api/me/organization
   */
  updateOrganization(data: Partial<Organization>): Observable<any> {
    return this.api.put('me/organization', data);
  }

}
