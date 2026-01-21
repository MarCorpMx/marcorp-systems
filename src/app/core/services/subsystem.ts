import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';

export interface arrSubsystem {
  id: number;
  key: string;
  name: string;
  description?: string;
}

@Injectable({
  providedIn: 'root',
})

export class Subsystem {
  constructor(private api: Api) {}

  getActiveSubsystems(): Observable<Subsystem[]> {
    return this.api.get<Subsystem[]>('subsystems');
  }
}
