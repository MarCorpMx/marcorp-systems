import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  Clock,
  Plus,
  Coffee,
  CalendarX
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';


import { AuthService } from '../../../../core/services/auth.service';
import { ProfessionalsService, Professional } from '../../../../core/services/professionals.service';
import { AgendaSettingsService } from '../../../../core/services/citas-agenda-settings.service';
import { Notification } from '../../../../services/notification.service';

import { RecurringBlock } from '../../../../core/models/citas-recurringBlock.model';


interface CalendarBlock {
  dayIndex: number; // 0 = lunes
  start: string;
  end: string;
  //type: 'available' | 'blocked';
  type: 'blocked',
  label: string
}

interface WeekDay {
  value: number;
  label: string;
  active: boolean;
  start: string;
  end: string;
}

@Component({
  selector: 'app-disponibilidad',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css',
})



export class Disponibilidad implements OnInit {
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly Coffee = Coffee;
  readonly CalendarX = CalendarX;

  loading = true;
  role: string | null = null;
  staffId: number | null = null;

  selecting = false;
  tempStart: { dayIndex: number; hour: string } | null = null;

  professionals: Professional[] = [];
  selectedProfessionalId!: number;

  recurringBlocks: RecurringBlock[] = [];

  workingHoursMap: Record<number, { start: string; end: string } | null> = {};

  hoveredDay: number | null = null;

  auth = inject(AuthService);
  professionalsService = inject(ProfessionalsService);
  agendaService = inject(AgendaSettingsService);
  notify = inject(Notification);


  // Días de la semana
  weekDays: WeekDay[] = [
    { value: 1, label: 'Lunes', active: true, start: '09:00', end: '18:00' },
    { value: 2, label: 'Martes', active: true, start: '09:00', end: '18:00' },
    { value: 3, label: 'Miércoles', active: true, start: '09:00', end: '18:00' },
    { value: 4, label: 'Jueves', active: true, start: '09:00', end: '18:00' },
    { value: 5, label: 'Viernes', active: true, start: '09:00', end: '15:00' },
    { value: 6, label: 'Sábado', active: false, start: '09:00', end: '14:00' },
    { value: 0, label: 'Domingo', active: false, start: '09:00', end: '14:00' }
  ];


  // Data DEMO
  blocks: CalendarBlock[] = [
    //{ dayIndex: 0, start: '08:00', end: '10:00', type: 'available' },
    //{ dayIndex: 0, start: '10:00', end: '12:00', type: 'blocked' },
    //{ dayIndex: 0, start: '12:00', end: '14:00', type: 'available' },
    //{ dayIndex: 0, start: '14:00', end: '15:00', type: 'blocked' },
  ];

  // Horas base
  hours = [
    '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00',
    '16:00', '17:00', '18:00'
  ];
  days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  startHour = 8;


  ngOnInit() {

    this.role = this.auth.getRole();
    this.staffId = this.auth.getStaffId();

    if (!this.role) {
      console.warn('No hay rol definido');
    }

    this.loadProfessionals();

    /*setTimeout(() => {
      this.loading = false;
    }, 1200);*/
  }

  loadProfessionals() {
    this.professionalsService.getAll().subscribe(res => {
      this.professionals = res.data;

      if (!this.professionals.length) return;

      // STAFF → solo él mismo
      if (this.role === 'staff') {

        if (this.staffId) {
          this.selectedProfessionalId = this.staffId;
          this.loadAvailability();
        }

        return; // NO cargar selector
      }

      // ADMIN / OWNER / RECEPTIONIST

      // buscar si el user tiene staff asociado
      const ownProfessional = this.professionals.find(
        p => p.id === this.staffId // importante: staff_member_id === professional.id
      );

      if (ownProfessional) {
        // cargar su propio horario por default
        this.selectedProfessionalId = ownProfessional.id;
      } else {
        // fallback
        this.selectedProfessionalId = this.professionals[0].id;
      }

      this.loadAvailability();

    });
  }


  selectProfessional(id: number) {
    this.selectedProfessionalId = id;
    this.loadAvailability();
  }



  loadAvailability() {
    if (!this.selectedProfessionalId) return;

    this.loading = true;

    this.agendaService
      .getAgenda(this.selectedProfessionalId)
      .subscribe({
        next: (res) => {
          const data = res.data;

          console.log(res);

          // Cragmos la configuración
          this.weekDays = this.mapBackendSchedule(data.weekly_schedule);

          this.buildWorkingHoursMap();

          this.recurringBlocks = (data.recurring_blocks || []).map((b: any) => ({
            day_of_week: b.day_of_week,
            start: b.start_time.substring(0, 5),
            end: b.end_time.substring(0, 5),
          }));

          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err, 'Error al cargar disponibilidad');
        }
      });
  }

  get selectedProfessionalName(): string {
    const found = this.professionals.find(p => p.id === this.selectedProfessionalId);
    return found ? found.name : 'Mi agenda';
  }

  onCellClick(dayIndex: number, hour: string) {

    if (this.getCellState(dayIndex, hour) !== 'available') {
      return;
    }

    // Si no hay selección → iniciar
    if (!this.tempStart) {
      this.tempStart = { dayIndex, hour };
      return;
    }

    // Si cambia de día → reiniciar
    if (this.tempStart.dayIndex !== dayIndex) {
      this.tempStart = { dayIndex, hour };
      return;
    }

    const start = this.tempStart.hour;
    const end = hour;

    // Ordenar horas (IMPORTANTE)
    const startH = this.toHour(start);
    const endH = this.toHour(end);

    if (startH === endH) {
      this.tempStart = null;
      return;
    }

    const finalStart = startH < endH ? start : end;
    const finalEnd = startH < endH ? end : start;

    this.blocks.push({
      dayIndex,
      start: finalStart,
      end: finalEnd,
      type: 'blocked',
      label: ''
    });

    this.tempStart = null;
  }

  isSelectingCell(dayIndex: number, hour: string): boolean {
    if (!this.tempStart) return false;

    return this.tempStart.dayIndex === dayIndex &&
      this.tempStart.hour === hour;
  }

  removeBlock(block: CalendarBlock) {
    this.blocks = this.blocks.filter(b => b !== block);
  }

  createBlock(start: string, end: string) {
    if (this.toHour(end) <= this.toHour(start)) return;
  }

  getBlocksForDay(dayIndex: number): CalendarBlock[] {
    return this.blocks.filter(b => b.dayIndex === dayIndex);
  }

  toHour(time: string): number {
    return Number(time.split(':')[0]);
  }

  getCellState(dayIndex: number, hour: string): 'disabled' | 'blocked' | 'available' {

    const normalizedDay = this.normalizeDayIndex(dayIndex);

    const day = this.weekDays.find(d => d.value === normalizedDay);


    if (!day || !day.active) return 'disabled';

    // fuera de horario laboral
    if (hour < day.start || hour >= day.end) return 'disabled';

    // bloqueos recurrentes
    const isRecurringBlocked = this.recurringBlocks.some(b =>
      b.day_of_week === normalizedDay &&
      hour >= b.start &&
      hour < b.end
    );

    if (isRecurringBlocked) return 'blocked';

    // bloqueos manuales (UI)
    const isBlocked = this.blocks.some(b =>
      b.dayIndex === dayIndex &&
      hour >= b.start &&
      hour < b.end
    );

    if (isBlocked) return 'blocked';

    return 'available';
  }

  mapBackendSchedule(schedule: any[]): WeekDay[] {
    return this.weekDays.map(day => {
      const match = schedule.find(
        s => s.day_of_week === day.value
      );

      if (!match) {
        return { ...day, active: false };
      }

      return {
        ...day,
        active: true,
        start: match.start_time.substring(0, 5),
        end: match.end_time.substring(0, 5)
      };
    });
  }

  normalizeDayIndex(dayIndex: number): number {
    return dayIndex === 6 ? 0 : dayIndex + 1;
  }

  

  buildWorkingHoursMap() {
    this.workingHoursMap = {};

    for (let i = 0; i < 7; i++) {
      const normalized = this.normalizeDayIndex(i);

      const day = this.weekDays.find(d => d.value === normalized);

      if (day && day.active) {
        this.workingHoursMap[i] = {
          start: day.start,
          end: day.end
        };
      } else {
        this.workingHoursMap[i] = null;
      }
    }
  }

  handleError(err: any, fallbackMessage: string) {

    console.error(err);

    if (err?.error?.message) {
      this.notify.error(err.error.message);
      return;
    }

    if (err?.error?.errors) {
      const firstError = Object.values(err.error.errors)[0] as string[];
      this.notify.error(firstError[0]);
      return;
    }

    this.notify.error(fallbackMessage);
  }

}
