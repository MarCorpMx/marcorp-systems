import {
  Component,
  inject,
  OnInit,
  LOCALE_ID
} from '@angular/core';

import localeEs from '@angular/common/locales/es';
import { CommonModule, registerLocaleData } from '@angular/common';
import {
  LucideAngularModule,
  Clock,
  Plus,
  Coffee,
  CalendarX
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';

// Serivios Internos
import { AuthService } from '../../../../core/services/auth.service';
import { ProfessionalsService, Professional } from '../../../../core/services/professionals.service';
import { AgendaSettingsService } from '../../../../core/services/citas-agenda-settings.service';
import { CitasAgendaService } from '../../../../core/services/citas-agenda.service';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { APPOINTMENT_STATUS_CONFIG, AppointmentStatus } from '../../../../shared/config/appointment-status.config';
import { AppointmentModel } from '../../../../core/models/appointment.model';

registerLocaleData(localeEs);


@Component({
  selector: 'app-disponibilidad',
  imports: [LucideAngularModule, CommonModule, FormsModule, FullCalendarModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' }
  ],
  templateUrl: './disponibilidad.html',
  styleUrl: './disponibilidad.css'
})

export class Disponibilidad implements OnInit {
  readonly Clock = Clock;
  readonly Plus = Plus;
  readonly Coffee = Coffee;
  readonly CalendarX = CalendarX;

  private auth = inject(AuthService);
  private professionalsService = inject(ProfessionalsService);
  private agendaService = inject(AgendaSettingsService);
  private citasService = inject(CitasAgendaService);
  private confirm = inject(ConfirmDialogService);
  private notify = inject(Notification);

  loading = true;
  emptyState = false;
  role: string | null = null;
  staffId: number | null = null;

  professionals: Professional[] = [];
  selectedProfessionalId!: number;

  appointments: AppointmentModel[] = [];
  statusConfig = APPOINTMENT_STATUS_CONFIG;

  blockedRanges: { start: Date; end: Date; type: string }[] = [];
  currentSchedule: any[] = [];
  currentRecurring: any[] = [];

  blockModal = {
    open: false,
    editMode: false,
    id: null as number | null,
    start: null as Date | null,
    end: null as Date | null,
    reason: '',
    error: false
  };

  appointmentModal = {
    open: false,
    data: null as AppointmentModel | null
  };


  calendarOptions: any = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],

    initialView: 'timeGridWeek',

    locales: [esLocale],
    locale: 'es',
    timeZone: 'America/Mexico_City',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },

    allDaySlot: false,

    selectable: true,
    selectMirror: true,
    editable: true,

    height: 'auto',
    contentHeight: 'auto',

    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',

    events: [],

    selectAllow: (selectInfo: any) => {
      const start = this.fixToLocal(selectInfo.start);
      const end = this.fixToLocal(selectInfo.end);

      // BLOQUEAR MULTI-DÍA
      if (start.toDateString() !== end.toDateString()) {
        this.notify.info('Solo puedes seleccionar dentro de un mismo día');
        return false;
      }

      /*
      |----------------------------------------------------------
      | 1. VALIDAR RANGOS REALES
      |----------------------------------------------------------
      */
      const overlap = this.blockedRanges.some(range =>
        start < range.end && end > range.start
      );

      if (overlap) {
        this.notify.info('Horario no disponible');
        return false;
      }

      /*
      |----------------------------------------------------------
      | 2. VALIDAR HORARIO LABORAL
      |----------------------------------------------------------
      */

      //const day = start.getDay();
      let day = start.getDay();
      day = day === 0 ? 7 : day;

      const schedule = this.currentSchedule || [];


      const jsDay = start.getDay(); // 0-6
      const workingDay = schedule.find((d: any) => {
        return Number(d.day_of_week) === jsDay;
      });

      if (!workingDay) {
        this.notify.info('No es día laboral');
        return false;
      }


      const startMinutes = start.getHours() * 60 + start.getMinutes();
      const endMinutes = end.getHours() * 60 + end.getMinutes();

      const workStart = this.toMinutes(workingDay.start_time);
      const workEnd = this.toMinutes(workingDay.end_time);

      if (
        startMinutes < workStart ||
        endMinutes > workEnd
      ) {
        this.notify.info('Fuera del horario laboral');
        return false;
      }

      /*
      |----------------------------------------------------------
      | 3. VALIDAR BLOQUES RECURRENTES
      |----------------------------------------------------------
      */

      const recurring = this.currentRecurring || [];

      const conflictRecurring = recurring.some((r: any) => {

        if (Number(r.day_of_week) !== day) return false;

        const rStart = this.toMinutes(r.start_time);
        const rEnd = this.toMinutes(r.end_time);

        return (
          startMinutes < rEnd &&
          endMinutes > rStart
        );
      });

      if (conflictRecurring) {
        this.notify.info('Horario bloqueado recurrentemente');
        return false;
      }

      return true;
    },

    /*
    |----------------------------------------------------------
    | SELECCIÓN
    |----------------------------------------------------------
    */
    select: (info: any) => {
      this.openBlockModal(info.start, info.end);
    },

    /*
    |----------------------------------------------------------
    | CLICK EN EVENTOS
    |----------------------------------------------------------
    */
    eventClick: (info: any) => {
      const event = info.event;

      if (event.extendedProps.type === 'appointment') {
        this.openAppointmentModal(event);
      }

      if (event.extendedProps.type === 'manual_block') {
        this.openEditBlockModal(event);
      }
    },

    /*
    |----------------------------------------------------------
    | TOOLTIP AUTOMÁTICO
    |----------------------------------------------------------
    */
    eventDidMount: (info: any) => {

      const type = info.event.extendedProps.type;

      let message = '';

      if (type === 'appointment') {
        message = 'Cita agendada';
      }

      if (type === 'manual_block') {
        message = 'Bloqueo manual';
      }

      if (type === 'recurring_block') {
        message = 'Bloque recurrente';
      }

      if (type === 'non_working_day') {
        message = 'Día no laboral';
      }

      if (message) {
        info.el.title = message; // tooltip nativo
      }
    }
  };

  /*ngOnInit() {
    this.setResponsiveOptions();
    window.addEventListener('resize', () => this.setResponsiveOptions());

    this.role = this.auth.getRole();
    this.staffId = this.auth.getStaffId();

    if (!this.role) {
      console.warn('No hay rol definido');
    }

    this.loadProfessionals();
  }*/

  ngOnInit() {
    this.setResponsiveOptions();
    window.addEventListener('resize', () => this.setResponsiveOptions());

    this.role = this.auth.getRole();
    this.staffId = this.auth.getStaffId();

    if (!this.role) {
      console.warn('No hay rol definido');
      return;
    }

    // STAFF → no cargar profesionales
    if (this.role === 'staff') {
      if (this.staffId) {
        this.selectedProfessionalId = this.staffId;
        this.loadAvailability();
      }
      return;
    }

    // ADMIN / OWNER / RECEPTIONIST
    this.loadProfessionals();
  }

  toMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  getTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  openEditBlockModal(event: any) {
    this.blockModal = {
      open: true,
      editMode: true,
      id: event.id,
      start: this.fixToLocal(event.start),
      end: this.fixToLocal(event.end),
      reason: event.title,
      error: false
    };
  }

  openBlockModal(start: Date, end: Date) {
    this.blockModal = {
      open: true,
      editMode: false,
      id: null,
      start: this.fixToLocal(start),
      end: this.fixToLocal(end),
      reason: '',
      error: false
    };
  }

  openAppointmentModal(event: any) {
    /*this.appointmentModal = {
      open: true,
      data: event.extendedProps.raw // toda la cita
    };*/

    const data = event.extendedProps.raw;

    this.appointmentModal = {
      open: true,
      data: {
        ...data,
        appointmentNotes: data.appointmentNotes?.map((n: any) => ({
          ...n,
          expanded: false
        }))
      }
    };

  }

  closeBlockModal() {
    this.blockModal.open = false;
  }

  closeAppointmentModal() {
    this.appointmentModal.open = false;
  }

  fixToLocal(date: Date): Date {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() + offset * 60000);
  }

  setResponsiveOptions() {
    if (window.innerWidth < 768) {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'timeGridDay',
        headerToolbar: {
          left: 'prev,next',
          center: 'title',
          right: 'today'
        }
      };
    } else {
      this.calendarOptions = {
        ...this.calendarOptions,
        initialView: 'timeGridWeek',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }
      };
    }
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

  loadAvailability() {
    if (!this.selectedProfessionalId) return;

    this.loading = true;

    this.agendaService
      .getAgenda(this.selectedProfessionalId)
      .subscribe({
        next: (res) => {
          const data = res.data;

          //console.log('dataConfig:', JSON.stringify(res, null, 2));

          if (this.isNotConfigured(data)) {
            this.loading = false;
            this.emptyState = true;
            return;
          }

          this.emptyState = false;


          const recurringEvents = this.mapRecurringBlocks(data.recurring_blocks || []);
          const nonWorkingDays = this.mapNonWorkingDays(data.weekly_schedule || []);
          const nonWorkingDates = this.mapNonWorkingDates(data.non_working_days || []);
          const manualBlocks = this.mapManualBlocks(data.blocked_slots || []);
          const nonWorkingHours = this.mapNonWorkingHours(data.weekly_schedule);
          const { min, max } = this.getMinMaxTime(data.weekly_schedule);

          //console.log(' weekly_schedule:', data.weekly_schedule);
          //console.log(' recurring_blocks:', data.recurring_blocks);
          //console.log(' blocks (si existen):', data.blocks);
          //console.log(' overrides:', data.availability_overrides);

          this.citasService
            .getAll({ staff_member_id: this.selectedProfessionalId })
            .subscribe({
              next: (res2) => {

                const appointments = this.mapAppointments(res2.data || []); //
                //console.log('dataCitas:', JSON.stringify(res2, null, 2));

                // rangos bloqueados
                this.currentSchedule = data.weekly_schedule || [];
                this.currentRecurring = data.recurring_blocks || [];

                this.blockedRanges = [
                  // citas
                  ...appointments.map(a => ({
                    start: new Date(a.start),
                    end: new Date(a.end),
                    type: 'appointment',
                  })),
                  // bloqueos manuales
                  ...manualBlocks.map(b => ({
                    start: this.fixToLocal(new Date(b.start)),
                    end: this.fixToLocal(new Date(b.end)),
                    type: 'manual_block'
                  })),
                  // días no laborales (fechas completas)
                  ...nonWorkingDates.map(d => ({
                    start: new Date(d.start),
                    end: new Date(d.end),
                    type: 'non_working_day'
                  }))
                ];

                // Cragamos la configuración
                this.calendarOptions = {
                  ...this.calendarOptions,
                  slotMinTime: min,
                  slotMaxTime: max,
                  events: [
                    ...recurringEvents,
                    ...nonWorkingDays,
                    ...nonWorkingDates,
                    ...manualBlocks,
                    ...nonWorkingHours,
                    ...appointments
                  ]
                };

                this.loading = false;
              },
              error: (err) => {
                this.loading = false;
                this.handleError(err, 'Error al consultar las citas');
              }
            });
        },
        error: (err) => {
          this.loading = false;
          this.handleError(err, 'Error al cargar disponibilidad');
        }
      });
  }

  isNotConfigured(data: any): boolean {
    return !data.weekly_schedule || data.weekly_schedule.length === 0;
  }

  selectProfessional(id: number) {
    this.selectedProfessionalId = id;
    this.loadAvailability();
  }

  get selectedProfessionalName(): string {
    const found = this.professionals.find(p => p.id === this.selectedProfessionalId);
    return found ? found.name : 'Mi agenda';
  }

  saveBlock() {
    if (!this.blockModal.start || !this.blockModal.end) return;

    if (!this.blockModal.reason.trim()) {
      this.blockModal.error = true;
      return;
    }

    this.blockModal.error = false;

    const payload = {
      start_datetime: this.formatLocalDate(this.blockModal.start!),
      end_datetime: this.formatLocalDate(this.blockModal.end!),
      reason: this.blockModal.reason
    };

    if (this.blockModal.editMode) {
      this.updateBlock(payload);
    } else {
      this.createBlock(payload);
    }
  }

  createBlock(payload: any) {
    this.agendaService.createBlock(this.selectedProfessionalId, payload)
      .subscribe({
        next: () => {
          this.notify.success('Horario bloqueado');
          this.loadAvailability(); // recarga real
          this.closeBlockModal();
        },
        error: (err) => this.handleError(err, 'Error al guardar')
      });
  }

  updateBlock(payload: any) {

    if (!this.blockModal.id) return;

    this.agendaService.updateBlock(
      this.selectedProfessionalId,
      this.blockModal.id,
      payload
    ).subscribe({
      next: () => {
        this.notify.success('Horario actualizado');
        this.loadAvailability();
        this.closeBlockModal();
      },
      error: (err) => this.handleError(err, 'Error al actualizar')
    });
  }

  deleteBlock() {

    this.confirm.open(
      'Eliminar bloque',
      '¿Seguro que deseas eliminar el bloqueo de horario?',
      () => {
        if (!this.blockModal.id) return;

        this.agendaService.deleteBlock(
          this.selectedProfessionalId,
          this.blockModal.id
        ).subscribe({
          next: () => {
            this.notify.success('Bloque eliminado');
            this.loadAvailability();
            this.closeBlockModal();
          },
          error: (err) => this.handleError(err, 'Error al eliminar')
        });

      },
      'Cancelar',
      'Eliminar'
    );
  }

  // Control de errores
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

  // Funciones para los Bloqueos
  mapRecurringBlocks(blocks: any[]) {
    return blocks.map(b => ({
      title: b.label || 'Bloqueado',

      daysOfWeek: [this.mapDay(b.day_of_week)],

      startTime: b.start_time,
      endTime: b.end_time,

      //display: 'background', // bloque visual tipo Calendly
      display: 'block',
      color: '#ef4444',

      extendedProps: {
        type: 'recurring_block'
      }
    }));
  }

  mapDay(day: number): number {
    return day; // porque ya coincide (1=lunes)
  }

  getMinMaxTime(schedule: any[]) {

    if (!schedule || !schedule.length) {
      return {
        min: '08:00:00', // default seguro
        max: '18:00:00'
      };
    }

    const starts = schedule.map(d => d.start_time);
    const ends = schedule.map(d => d.end_time);

    return {
      min: starts.sort()[0],
      max: ends.sort().reverse()[0]
    };
  }

  mapNonWorkingDays(schedule: any[]) {

    const workingDays = schedule.map(d => d.day_of_week);

    const allDays = [0, 1, 2, 3, 4, 5, 6];

    const nonWorking = allDays.filter(d => !workingDays.includes(d));

    return nonWorking.map(day => ({
      daysOfWeek: [day],
      display: 'background',
      //color: '#111827', // oscuro
      color: 'rgba(0,0,0,0.6)',
      overlap: false
    }));
  }

  mapNonWorkingHours(schedule: any[]) {
    const events: any[] = [];

    schedule.forEach(day => {
      const dayIndex = day.day_of_week;

      // Bloque antes del horario
      if (day.start_time !== '00:00:00') {
        events.push({
          daysOfWeek: [dayIndex],
          startTime: '00:00:00',
          endTime: day.start_time,
          display: 'background',
          color: 'rgba(0,0,0,0.6)',
          overlap: false
        });
      }

      // Bloque después del horario
      if (day.end_time !== '23:59:59') {
        events.push({
          daysOfWeek: [dayIndex],
          startTime: day.end_time,
          endTime: '24:00:00',
          display: 'background',
          color: 'rgba(0,0,0,0.6)',
          overlap: false
        });
      }
    });

    return events;
  }

  mapNonWorkingDates(days: any[]) {
    return days.map(d => {
      const date = new Date(d.date);

      const start = new Date(date);
      start.setHours(0, 0, 0, 0);

      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      return {
        title: d.reason || 'No disponible',
        start,
        end,

        display: 'background', // bloquea todo el día

        color: 'rgba(239, 68, 68, 0.35)',

        extendedProps: {
          type: 'non_working_day'
        }
      };
    });
  }

  mapManualBlocks(blocks: any[]) {
    return blocks.map(b => ({
      id: b.id,
      title: b.reason || 'Bloqueado',
      start: this.toLocal(b.start_datetime),
      end: this.toLocal(b.end_datetime),
      color: '#ef4444',
      extendedProps: {
        type: 'manual_block'
      }
    }));
  }

  // rombi - nuevo
  mapAppointments(appointments: any[]) {
    return appointments.map(a => ({
      id: a.id,
      //title: `${a.client?.name || 'Cliente'} - ${a.service?.main?.name || ''}`,
      title: a.client?.name,

      start: a.start,
      end: a.end,


      color: this.getStatusColor(a.status),

      extendedProps: {
        type: 'appointment',
        status: a.status,
        raw: {
          ...a,
          start: a.start,
          end: a.end
        }
      }
    }));
  }

  // rombi - nuevo
  getStatusColor(status: string) {
    switch (status) {
      case 'confirmed': return '#22c55e'; // verde
      case 'pending': return '#f59e0b';   // amarillo
      case 'cancelled': return '#ef4444'; // rojo
      case 'completed': return '#3b82f6'; // azul
      default: return '#6b7280';
    }
  }

  cancelAppointment(app: any) {
    this.notify.info('Función no disponible en este módulo');
    /*this.citasService.updateStatus(app.id, { status: 'cancelled' })
      .subscribe(() => {
        this.notify.success('Cita cancelada');
        this.closeAppointmentModal();
        this.loadAvailability(); // recargar calendario
      });*/
  }


  getModeLabel(mode: string) {
    switch (mode) {
      case 'presential': return 'Presencial';
      case 'online': return 'En línea';
      default: return 'Otro';
    }
  }

  getModeClasses(mode: string) {
    switch (mode) {
      case 'presential':
        return 'bg-blue-500/10 text-blue-400';

      case 'online':
        return 'bg-purple-500/10 text-purple-400';

      default:
        return 'bg-gray-500/10 text-gray-400';
    }
  }

  toLocal(dateStr: string): Date {
    const date = new Date(dateStr);
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
  }

  formatLocalDate(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} `
      + `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
  }

  goToConfig() {
    window.location.href = '/sistemas/citas/configuracion/agenda';
  }

  // Para notas
  toggleNote(note: any) {
    note.expanded = !note.expanded;
  }

  isEvent(type: string): boolean {
    return [
      'reschedule',
      'client_reschedule',
      'admin_reschedule',
      'cancellation',
      'client_cancellation'
    ].includes(type);
  }

  getEventLabel(type: string): string {
    const map: any = {
      client_reschedule: 'Cliente reagendó la cita',
      admin_reschedule: 'Cita reagendada por el negocio',
      cancellation: 'Cita cancelada',
      client_cancellation: 'Cliente canceló la cita'
    };

    return map[type] || 'Evento';
  }


}