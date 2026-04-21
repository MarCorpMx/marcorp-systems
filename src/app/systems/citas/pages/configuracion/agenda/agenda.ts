import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Briefcase } from 'lucide-angular';
import { ProfessionalsService, Professional } from '../../../../../core/services/professionals.service';
import { AgendaSettingsService, AgendaSettings } from '../../../../../core/services/citas-agenda-settings.service';
import { NonWorkingDayService, NonWorkingDay } from '../../../../../core/services/non-working-day.service';
import { CitasServicesService } from '../../../../../core/services/citas-services.service';
import { Notification } from '../../../../../services/notification.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { RecurringBlock } from '../../../../../core/models/citas-recurringBlock.model';


interface WeekDay {
  value: number;
  label: string;
  active: boolean;
  start: string;
  end: string;
}


@Component({
  selector: 'app-agenda',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})

export class Agenda implements OnInit {
  readonly Briefcase = Briefcase;

  hasChanges = false;
  saving = false;

  private originalState: any;
  loading = true;

  professionals: Professional[] = [];
  serviceVariants: any[] = [];
  selectedVariants: number[] = [];
  nonWorkingDays: NonWorkingDay[] = [];
  selectedProfessionalId!: number;

  recurringBlocks: RecurringBlock[] = [];

  // Configuración por defecto
  settings: AgendaSettings = {
    appointment_duration: 50,
    break_between_appointments: 0,
    minimum_notice_hours: 0,
    cancellation_limit_hours: 0,
    allow_online_booking: false,
    allow_cancellation: false
  };

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

  constructor(
    private auth: AuthService,
    private professionalsService: ProfessionalsService,
    private agendaService: AgendaSettingsService,
    private nonWorkingDayService: NonWorkingDayService,
    private citasService: CitasServicesService,
    private notify: Notification
  ) { }

  role: string | null = null;
  staffId: number | null = null;

  ngOnInit() {

    this.role = this.auth.getRole();
    this.staffId = this.auth.getStaffId();

    if (!this.role) {
      console.warn('No hay rol definido');
    }

    this.loadProfessionals();
    this.loadServiceVariants();
  }

  loadProfessionals() {
    this.professionalsService.getAll().subscribe(res => {
      this.professionals = res.data;

      if (!this.professionals.length) return;

      // STAFF → solo él mismo
      if (this.role === 'staff') {

        if (this.staffId) {
          this.selectedProfessionalId = this.staffId;
          this.loadAgenda();
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

      this.loadAgenda();

    });
  }

  loadServiceVariants() {
    this.citasService.getVariantList().subscribe({
      next: (res) => {
        this.serviceVariants = res;
      },
      error: (err) => {
        console.error('Error loading service variants', err);
      }
    });
  }

  toggleVariant(id: number) {
    if (this.selectedVariants.includes(id)) {
      this.selectedVariants = this.selectedVariants.filter(v => v !== id);
    } else {
      this.selectedVariants.push(id);
    }

    this.detectChanges();

  }

  get selectedProfessionalName(): string {
    const found = this.professionals.find(p => p.id === this.selectedProfessionalId);
    return found ? found.name : 'Mi agenda';
  }

  selectProfessional(id: number) {
    if (this.role === 'staff') return; // 🔒 protección extra

    this.selectedProfessionalId = id;
    this.loadAgenda();
  }

  loadAgenda() {
    this.loading = true;

    this.agendaService
      .getAgenda(this.selectedProfessionalId)
      .subscribe({
        next: (res) => {

          const data = res.data;

          this.settings = data.settings;
          this.weekDays = this.mapBackendSchedule(data.weekly_schedule);

          // Bloqueos recurrentes
          this.recurringBlocks = (data.recurring_blocks || []).map((b: any) => ({
            id: b.id,
            day_of_week: b.day_of_week,
            start: b.start_time.substring(0, 5),
            end: b.end_time.substring(0, 5),
            label: b.label
          }));

          // Servicios del staff
          this.professionalsService
            .getStaffVariants(this.selectedProfessionalId)
            .subscribe({
              next: (res) => {
                this.selectedVariants = res.data;

                this.snapshotState();
                this.detectChanges();
              },
              error: (err) => {
                this.handleError(err, 'Error al cargar servicios del staff');
              }
            });

          // Non working days
          this.loadNonWorkingDays()?.subscribe({
            next: (response) => {
              this.nonWorkingDays = response.data.map((d: any) => ({
                ...d,
                date: d.date ? d.date.split('T')[0] : ''
              }));

              this.loading = false;
            },
            error: (err) => {
              this.handleError(err, 'Error al consultar días no laborables');
              this.loading = false;
            }
          });

        },
        error: (err) => {
          this.handleError(err, 'Error al cargar agenda');
          this.loading = false;
        }
      });
  }


  loadNonWorkingDays() {
    if (!this.selectedProfessionalId) return;

    return this.nonWorkingDayService
      .getAll(this.selectedProfessionalId);
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

  snapshotState() {
    this.originalState = JSON.stringify({
      settings: this.settings,
      weekDays: this.weekDays,
      nonWorkingDays: this.nonWorkingDays,
      selectedVariants: this.selectedVariants,
      recurringBlocks: this.recurringBlocks
    });
  }

  detectChanges() {
    const current = JSON.stringify({
      settings: this.settings,
      weekDays: this.weekDays,
      nonWorkingDays: this.nonWorkingDays,
      selectedVariants: this.selectedVariants,
      recurringBlocks: this.recurringBlocks
    });

    this.hasChanges = current !== this.originalState;
  }

  openAddNonWorkingDay() {
    const newDay: NonWorkingDay = {
      id: Date.now(),
      date: '',
      reason: ''
    };

    this.nonWorkingDays.push(newDay);
  }

  deleteNonWorking(day: NonWorkingDay) {
    this.nonWorkingDays = this.nonWorkingDays.filter(d => d.id !== day.id);
  }

  saveAgenda() {

    if (!this.validateBeforeSave()) return;

    this.saving = true;

    const payload = {
      ...this.settings,
      weekly_schedule: this.weekDays
        .filter(d => d.active)
        .map(d => ({
          day_of_week: d.value,
          start_time: d.start + ':00',
          end_time: d.end + ':00'
        })),
      non_working_days: this.nonWorkingDays.map(d => ({
        date: d.date,
        reason: d.reason
      })),
      recurring_blocks: this.recurringBlocks.map(b => ({
        day_of_week: b.day_of_week,
        start: b.start + ':00',
        end: b.end + ':00',
        label: b.label
      }))
    };

    this.agendaService
      .updateAgenda(this.selectedProfessionalId, payload)
      .subscribe({
        next: () => {

          this.professionalsService.syncStaffVariants(
            this.selectedProfessionalId,
            { service_variant_ids: this.selectedVariants }
          ).subscribe({
            next: () => {
              this.snapshotState();
              this.hasChanges = false;
              this.saving = false;
              this.notify.success("Datos guardados correctamente");
            },
            error: (err) => {
              this.saving = false;
              this.handleError(err, 'Error al guardar servicios');
            }
          });

        },
        error: (err) => {
          this.saving = false;
          this.handleError(err, 'Error al guardar agenda');
        }
      });
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

  validateBeforeSave(): boolean {

    // 1. al menos 1 servicio
    if (this.selectedVariants.length === 0) {
      this.notify.error('Selecciona al menos un servicio');
      return false;
    }

    // 2. al menos 1 día activo
    const hasActiveDay = this.weekDays.some(d => d.active);

    if (!hasActiveDay) {
      this.notify.error('Activa al menos un día de trabajo');
      return false;
    }

    // 3. Validar horarios de atención
    const invalidDay = this.weekDays.find(d =>
      d.active && !this.isValidTimeRange(d.start, d.end)
    );

    if (invalidDay) {
      this.notify.error(`El horario de ${invalidDay.label} es inválido`);
      return false;
    }

    // 4. Validación de bloqueos
    for (const block of this.recurringBlocks) {
      if (!this.isValidTimeRange(block.start, block.end)) {
        this.notify.error("Un bloqueo tiene horario inválido");
        return false;
      }
    }

    // Validar que el día del bloqueo este activo
    for (const block of this.recurringBlocks) {
      const day = this.weekDays.find(d => d.value === Number(block.day_of_week));


      if (!day || !day.active) {
        this.notify.error("Hay bloqueos en días no laborables");
        return false;
      }
    }

    // Validar que el bloqueo este dentro del horario laboral
    for (const block of this.recurringBlocks) {
      const day = this.weekDays.find(d => d.value === block.day_of_week);

      if (!day) {
        this.notify.error("Día inválido en bloqueo");
        return false;
      }

      //const day = this.weekDays.find(d => d.value === block.day_of_week)!;
      if (block.start < day.start || block.end > day.end) {
        this.notify.error("Un bloqueo está fuera del horario laboral");
        return false;
      }
    }

    // Validar que no se encimen
    const grouped = this.groupBlocksByDay();

    for (const day in grouped) {
      const blocks = grouped[day].sort((a: RecurringBlock, b: RecurringBlock) => a.start.localeCompare(b.start));

      for (let i = 0; i < blocks.length - 1; i++) {
        if (blocks[i].end > blocks[i + 1].start) {
          this.notify.error("Hay bloqueos encimados");
          return false;
        }
      }
    }


    return true;
  }

  groupBlocksByDay() {
    return this.recurringBlocks.reduce((acc: any, block) => {
      if (!acc[block.day_of_week]) {
        acc[block.day_of_week] = [];
      }
      acc[block.day_of_week].push(block);
      return acc;
    }, {});
  }

  /*
  addRecurringBlock() {
    this.recurringBlocks.push({
      id: Date.now(),
      day_of_week: 1,
      start: '13:00',
      end: '14:00',
      label: ''
    });

    this.detectChanges();
  }*/

  addRecurringBlock() {

    const activeDays = this.weekDays.filter(d => d.active);

    if (activeDays.length === 0) {
      this.notify.error('Primero activa un día de trabajo');
      return;
    }

    this.recurringBlocks.push({
      id: Date.now(),
      day_of_week: activeDays[0].value, // SIEMPRE válido
      start: '13:00',
      end: '14:00',
      label: ''
    });

    this.detectChanges();
  }

  removeRecurringBlock(block: RecurringBlock) {
    this.recurringBlocks = this.recurringBlocks.filter(b => b !== block);
    this.detectChanges();
  }

  discardChanges() {
    const state = JSON.parse(this.originalState);

    this.settings = state.settings;
    this.weekDays = state.weekDays;
    this.nonWorkingDays = state.nonWorkingDays;
    this.recurringBlocks = state.recurringBlocks;

    this.hasChanges = false;
  }

  goToServices() {
    // ajusta ruta
    window.location.href = '/sistemas/citas/servicios';
  }

  isValidTimeRange(start: string, end: string): boolean {
    const toMinutes = (time: string) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
    };

    return toMinutes(start) < toMinutes(end);
  }


}
