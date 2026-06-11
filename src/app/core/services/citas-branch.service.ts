import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { BranchModel, ApiMeta, BranchResponse } from '../models/citas-branch.model';

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

  deleteBranch(id: number) {
    return this.api.delete(`${this.endpoint}/${id}`);
  }


}
