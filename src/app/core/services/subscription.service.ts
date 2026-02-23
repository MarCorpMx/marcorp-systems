import { Injectable } from '@angular/core';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})

export class SubscriptionService {

  constructor(private api: Api) { }

  getCurrentPlan(orgId: number, subsystem: string) {
    return this.api.get<any>(`me/subscription?organization_id=${orgId}&subsystem=${subsystem}`);
  }

  /*getPlans(subsystem: string) {
    return this.api.get<Plan[]>(`me/plans?subsystem=${subsystem}`);
  }*/

  getPlans(subsystem: string) {
    return this.api.get<any[]>(`me/plans?subsystem=${subsystem}`);
  }

}
