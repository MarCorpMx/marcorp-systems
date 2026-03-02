import { Pipe, PipeTransform } from '@angular/core';

export type AppPhoneFormat =
  | 'international' // +52 777 123 4567
  | 'national'      // 777 123 4567
  | 'compact'       // (777) 123-4567
  | 'dial'          // +52 7771234567
  | 'raw';          // 7771234567

interface PhoneObject {
  countryCode?: string;
  dialCode?: string;
  e164Number?: string;
  internationalNumber?: string;
  nationalNumber?: string;
  number?: string;
}

@Pipe({
  name: 'appPhone',
})

export class AppPhonePipe implements PipeTransform {

  transform(
    phone: PhoneObject | string | null,
    format: AppPhoneFormat = 'international'
  ): string {

    if (!phone) return '';

    const normalized = this.normalize(phone);

    switch (format) {

      case 'international':
        return this.formatInternational(normalized);

      case 'national':
        return this.formatNational(normalized);

      case 'compact':
        return this.formatCompact(normalized);

      case 'dial':
        return `+52 ${normalized}`;

      case 'raw':
        return normalized;

      default:
        return this.formatInternational(normalized);
    }
  }

  // ------------------------
  // NORMALIZACIÓN (LA MAGIA)
  // ------------------------
  private normalize(phone: PhoneObject | string): string {

    let number = '';

    if (typeof phone === 'string') {
      number = phone;
    } else {
      number =
        phone.e164Number ||
        phone.nationalNumber ||
        phone.number ||
        phone.internationalNumber ||
        '';
    }

    // quitar todo menos números
    number = number.replace(/\D/g, '');

    // quitar lada México si viene incluida
    if (number.startsWith('52') && number.length > 10) {
      number = number.slice(2);
    }

    return number.slice(-10); // últimos 10 dígitos
  }

  // ------------------------
  // FORMATOS
  // ------------------------

  private formatInternational(n: string): string {
    return `+52 ${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }

  private formatNational(n: string): string {
    return `${n.slice(0, 3)} ${n.slice(3, 6)} ${n.slice(6)}`;
  }

  private formatCompact(n: string): string {
    return `(${n.slice(0, 3)}) ${n.slice(3, 6)}-${n.slice(6)}`;
  }
}
