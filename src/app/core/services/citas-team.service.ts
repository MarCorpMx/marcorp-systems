import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';


export interface BackendTeamMember {
  id: string;
  name: string;
  email?: string;
  role: {
    key: string;
    name: string;
  };
  status: string;
  is_staff: boolean;
  has_access: boolean;
}

export interface TeamMemberResponse {
  data: BackendTeamMember[];
}

@Injectable({
  providedIn: 'root',
})

export class CitasTeamService {
  private endpoint = 'me/team';

  constructor(private api: Api) { }

  getMembers(): Observable<TeamMemberResponse> {
    return this.api.get<TeamMemberResponse>(this.endpoint);
  }

  createMember(data: any) {
    return this.api.post(this.endpoint, data);
  }

  updateMember(id: string, payload: any) {
    return this.api.put(`${this.endpoint}/${id}`, payload);
  }

  suspendMember(id: string) {
    return this.api.post(`${this.endpoint}/${id}/suspend`, {});
  }

  activateMember(id: string) {
    return this.api.post(`${this.endpoint}/${id}/activate`, {});
  }


}
