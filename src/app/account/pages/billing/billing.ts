import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
}

@Component({
  selector: 'app-billing',
  imports: [CommonModule],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing {
  loading = signal(true);

  currentPlan = signal({
    name: 'Pro',
    price: 499,
    interval: 'mensual',
    nextPayment: '15 Oct 2026'
  });

  paymentMethod = signal({
    brand: 'Visa',
    last4: '4242',
    expires: '08/27'
  });

  invoices = signal<Invoice[]>([]);

  hasInvoices = computed(() => this.invoices().length > 0);

  constructor() {
    setTimeout(() => {
      this.invoices.set([
        {
          id: 'INV-1001',
          date: '15 Sep 2026',
          amount: 499,
          status: 'paid'
        },
        {
          id: 'INV-1000',
          date: '15 Aug 2026',
          amount: 499,
          status: 'paid'
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  statusLabel(status: Invoice['status']) {
    return {
      paid: 'Pagado',
      pending: 'Pendiente',
      failed: 'Fallido'
    }[status];
  }

  statusClass(status: Invoice['status']) {
    return {
      paid: 'paid',
      pending: 'pending',
      failed: 'failed'
    }[status];
  }

}
