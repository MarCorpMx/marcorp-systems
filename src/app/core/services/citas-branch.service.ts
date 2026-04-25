import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface BranchModel {

  id: number;
  name: string;
  slug: string;
  reference_prefix: string;

  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;

  phone: any;
  email: string;
  website: string;

  is_active: boolean;
  is_primary: boolean;
  locked_by_plan: boolean;

  timezone: string;

  manager?: string;
}

export interface ApiMeta {
  organization_branches_count: number;
}

export interface BranchResponse {
  data: BranchModel[];
  meta: ApiMeta;
}

@Injectable({
  providedIn: 'root',
})

export class CitasBranchService {

  private endpoint = 'me/branches';

  constructor(private api: Api) { }

  getBranches(): Observable<BranchResponse> {
    return this.api.get<BranchResponse>(this.endpoint);
  }

  createBranch(data: Partial<BranchModel>) {
    return this.api.post<{ data: BranchModel }>(this.endpoint, data);
  }

  updateBranch(id: number, payload: Partial<BranchModel>) {
    return this.api.put<{ data: BranchModel }>(
      `${this.endpoint}/${id}`,
      payload
    );
  }


}
