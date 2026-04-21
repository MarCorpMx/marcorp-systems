import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { CitasServicesService } from '../../../core/services/citas-services.service';
import { AgendaSettingsService, AgendaSettings } from '../../../core/services/citas-agenda-settings.service';
import { Notification } from '../../../services/notification.service';

import { ONBOARDING_ROUTES_MAP } from '../../models/onboarding.model';

interface WeekDay {
  value: number;
  label: string;
  active: boolean;
  start: string;
  end: string;
}

@Component({
  selector: 'app-availability-setup',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './availability-setup.html',
  styleUrl: './availability-setup.css',
})

export class AvailabilitySetup implements OnInit {

  private auth = inject(AuthService);
  private citasService = inject(CitasServicesService);
  private agendaService = inject(AgendaSettingsService);
  private notify = inject(Notification);
  private router = inject(Router);

  loading = true;
  saving = false;

  staffId: number | null = null;

  // Configuración por defecto
  settings: AgendaSettings = {
    appointment_duration: 60,
    break_between_appointments: 0,
    minimum_notice_hours: 0,
    cancellation_limit_hours: 0,
    allow_online_booking: false,
    allow_cancellation: false
  };

  weekDays: WeekDay[] = this.getDefaultWeekDays();

  ngOnInit() {

    this.staffId = this.auth.getStaffId();

    // Detenemos un rato para un delay suave
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }

  private getDefaultWeekDays(): WeekDay[] {
    return [
      { value: 1, label: 'Lunes', active: true, start: '09:00', end: '18:00' },
      { value: 2, label: 'Martes', active: true, start: '09:00', end: '18:00' },
      { value: 3, label: 'Miércoles', active: true, start: '09:00', end: '18:00' },
      { value: 4, label: 'Jueves', active: true, start: '09:00', end: '18:00' },
      { value: 5, label: 'Viernes', active: true, start: '09:00', end: '18:00' },
      { value: 6, label: 'Sábado', active: false, start: '09:00', end: '14:00' },
      { value: 0, label: 'Domingo', active: false, start: '09:00', end: '14:00' }
    ];
  }

  applyDefaultSchedule() {

    this.weekDays = this.getDefaultWeekDays();

    this.settings = {
      appointment_duration: 50,
      break_between_appointments: 0,
      minimum_notice_hours: 0,
      cancellation_limit_hours: 0,
      allow_online_booking: false,
      allow_cancellation: false
    };

    this.notify.success('Horario restablecido');
  }

  save() {

    const activeDays = this.weekDays.filter(d => d.active);

    const payload = {
      ...this.settings,

      timezone: 'America/Mexico_City',

      weekly_schedule: activeDays.map(d => ({
        day_of_week: d.value,
        start_time: d.start + ':00',
        end_time: d.end + ':00'
      }))
    };


    this.saving = true;

    if (!this.staffId) { return; }

    this.agendaService.updateAgenda(this.staffId, payload).subscribe({
      next: (res) => {

        this.saving = false;

        this.notify.success('Horario configurado');

        // avanzar onboarding
        if (res.organization) {
          localStorage.setItem('organization', JSON.stringify(res.organization));
        }

        const step = res.organization?.onboarding_step;

        if (step) {
          this.router.navigate([ONBOARDING_ROUTES_MAP[step]]);
        }

      },
      error: (res) => {
        this.saving = false;
        this.notify.error('Error al guardar');
      }
    });

  }


}

