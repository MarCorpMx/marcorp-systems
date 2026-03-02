import { Pipe, PipeTransform } from '@angular/core';

export type AppDateFormat =
  | 'short'        // 27 Nov 1998
  | 'datetime'     // 27 Nov 1998 · 12:00 pm
  | 'datetimeCaps' // 27 Nov 1998, 12:00 PM
  | 'numeric'      // 27-11-1998
  | 'numericTime'; // 27-11-1998 · 12:00 pm

  // {{ item.date | appDate:'short' }}

@Pipe({
  name: 'appDate',
  standalone: true
})
export class AppDatePipe implements PipeTransform {

  private timezone = 'America/Mexico_City';
  private locale = 'es-MX';

  transform(
    value: string | Date | null,
    format: AppDateFormat = 'short'
  ): string {

    if (!value) return '';

    const date = new Date(value);

    const baseDate = new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timezone,
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);

    const time12 = new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(date).toLowerCase();

    const timeCaps = time12.toUpperCase();

    const numeric = new Intl.DateTimeFormat(this.locale, {
      timeZone: this.timezone,
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date).replace(/\//g, '-');

    switch (format) {
      case 'short':
        return baseDate;

      case 'datetime':
        return `${baseDate} · ${time12}`;

      case 'datetimeCaps':
        return `${baseDate}, ${timeCaps}`;

      case 'numeric':
        return numeric;

      case 'numericTime':
        return `${numeric} · ${time12}`;

      default:
        return baseDate;
    }
  }
}