import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

interface SupportTicket {
  id: number;
  subject: string;
  category: 'technical' | 'billing' | 'account';
  status: 'open' | 'pending' | 'closed';
  created_at: string;
}


@Component({
  selector: 'app-support',
  imports: [CommonModule],
  templateUrl: './support.html',
  styleUrl: './support.css',
})
export class Support {
  loading = signal(true);

  tickets = signal<SupportTicket[]>([]);

  hasTickets = computed(() => this.tickets().length > 0);

  constructor() {
    setTimeout(() => {
      this.tickets.set([
        {
          id: 101,
          subject: 'No puedo acceder al sistema',
          category: 'technical',
          status: 'open',
          created_at: '2026-01-12'
        },
        {
          id: 102,
          subject: 'Duda sobre facturación',
          category: 'billing',
          status: 'pending',
          created_at: '2026-01-10'
        },
        {
          id: 103,
          subject: 'Cambio de correo principal',
          category: 'account',
          status: 'closed',
          created_at: '2026-01-05'
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  categoryLabel(category: SupportTicket['category']) {
    return {
      technical: 'Técnico',
      billing: 'Facturación',
      account: 'Cuenta'
    }[category];
  }

  statusLabel(status: SupportTicket['status']) {
    return {
      open: 'Abierto',
      pending: 'En espera',
      closed: 'Cerrado'
    }[status];
  }

  statusClass(status: SupportTicket['status']) {
    return {
      open: 'open',
      pending: 'pending',
      closed: 'closed'
    }[status];
  }

}
