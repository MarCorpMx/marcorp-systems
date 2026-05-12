import { Injectable, inject } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  private auth = inject(AuthService);

  private currencyMap: Record<string, string> = {
    mx: 'MXN',
    us: 'USD',
    co: 'COP',
    ar: 'ARS',
    cl: 'CLP',
    pe: 'PEN',
    es: 'EUR'
  };

  private localeMap: Record<string, string> = {
    mx: 'es-MX',
    us: 'en-US',
    co: 'es-CO',
    ar: 'es-AR',
    cl: 'es-CL',
    pe: 'es-PE',
    es: 'es-ES'
  };

  format(value: number | string | null | undefined): string {
    const branch = this.auth.getCurrentBranch();

    const country = branch?.country?.toLowerCase() ?? 'mx';

    const currency = this.currencyMap[country] ?? 'MXN';
    const locale = this.localeMap[country] ?? 'es-MX';

    const amount = Number(value ?? 0);

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }
}