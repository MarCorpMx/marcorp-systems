import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { DashboardResponse } from '../models/branchProfileCompletion.model';






@Injectable({
  providedIn: 'root',
})

export class CitasDashboardService {
  private endpoint = 'me/dashboard';

  constructor(private api: Api) { }

  getDataDashboard(): Observable<DashboardResponse> {
    return this.api.get<DashboardResponse>(this.endpoint);
  }

}
