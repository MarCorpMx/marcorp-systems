import { Injectable, signal } from '@angular/core';

export interface CitasHeader {
  title: string;
  subtitle?: string;
  actions?: any[];
}

@Injectable({
  providedIn: 'root',
})

export class CitasLayoutService {
  header = signal<CitasHeader | null>(null);

  setHeader(header: CitasHeader) {
    this.header.set(header);
  }

  clearHeader() {
    this.header.set(null);
  }
  
}
