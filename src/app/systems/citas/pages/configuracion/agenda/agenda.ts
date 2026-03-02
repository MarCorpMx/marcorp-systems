import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfessionalsService, Professional } from '../../../../../core/services/professionals.service';
import { AgendaService, AgendaSettings } from '../../../../../core/services/agenda.service';
import { NonWorkingDayService, NonWorkingDay } from '../../../../../core/services/non-working-day.service';
import { Notification } from '../../../../../services/notification.service';

/*interface AgendaSettings {
  appointment_duration: number;
  break_between_appointments: number;
  minimum_notice_hours: number;
  cancellation_limit_hours: number;
  allow_online_booking: boolean;
  allow_cancellation: boolean;
}*/

interface WeekDay {
  value: number;
  label: string;
  active: boolean;
  start: string;
  end: string;
}

@Component({
  selector: 'app-agenda',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})

export class Agenda implements OnInit {
  hasChanges = false;
  saving = false;

  private originalState: any;
  loading = true;

  professionals: Professional[] = [];
  nonWorkingDays: NonWorkingDay[] = [];
  selectedProfessionalId!: number;

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
    private professionalsService: ProfessionalsService,
    private agendaService: AgendaService,
    private nonWorkingDayService: NonWorkingDayService,
    private notify: Notification
  ) { }

  ngOnInit() {
    this.loadProfessionals();
  }

  loadProfessionals() {
    this.professionalsService.getAll().subscribe(res => {
      this.professionals = res.data;

      if (this.professionals.length > 0) {
        this.selectedProfessionalId = this.professionals[0].id;
        this.loadAgenda();
      }

      this.loading = false;
    });
  }

  loadAgenda() {
    this.loading = true;

    this.agendaService
      .getAgenda(this.selectedProfessionalId)
      .subscribe(res => {

        const data = res.data;

        this.settings = data.settings;
        this.weekDays = this.mapBackendSchedule(data.weekly_schedule);

        // Esperamos non working days
        this.loadNonWorkingDays()?.subscribe({
          next: (response) => {
            this.nonWorkingDays = response.data.map((d: any) => ({
              ...d,
              date: d.date ? d.date.split('T')[0] : ''
            }));

            // Tomamos snapshot
            this.snapshotState();
            this.loading = false;
          },
          error: () => {
            this.snapshotState();
            this.loading = false;
          }
        });
      });
  }


  /*loadAgenda() {
    this.loading = true;

    this.agendaService
      .getAgenda(this.selectedProfessionalId)
      .subscribe(res => {

        const data = res.data;

        // SETTINGS
        this.settings = data.settings;

        // WEEK SCHEDULE
        this.weekDays = this.mapBackendSchedule(data.weekly_schedule);

        // NON WORKING
        this.loadNonWorkingDays();

        this.snapshotState();
        this.loading = false;
      });
  }*/

  loadNonWorkingDays() {
    if (!this.selectedProfessionalId) return;

    return this.nonWorkingDayService
      .getAll(this.selectedProfessionalId);
  }

  /*loadNonWorkingDays() {
    this.loading = true;

    if (!this.selectedProfessionalId) return;

    this.nonWorkingDayService
      .getAll(this.selectedProfessionalId)
      .subscribe({
        next: (response) => {
          this.nonWorkingDays = response.data.map((d: any) => ({
            ...d,
            date: d.date ? d.date.split('T')[0] : ''
          }));
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading non working days', err);
          this.loading = false;
        }
      });
  }*/

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
      nonWorkingDays: this.nonWorkingDays
    });
  }

  detectChanges() {
    const current = JSON.stringify({
      settings: this.settings,
      weekDays: this.weekDays,
      nonWorkingDays: this.nonWorkingDays
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
      }))
    };

    this.agendaService
      .updateAgenda(this.selectedProfessionalId, payload)
      .subscribe(() => {
        this.snapshotState();
        this.hasChanges = false;
        this.saving = false;
        this.notify.success("Datos guardados correctamente");
      });
  }

  discardChanges() {
    const state = JSON.parse(this.originalState);

    this.settings = state.settings;
    this.weekDays = state.weekDays;
    this.nonWorkingDays = state.nonWorkingDays;

    this.hasChanges = false;
  }


}
