import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule, HelpCircle,
  Sparkles, Scissors, Hand, Brain, Stethoscope, Heart, Flower, Dumbbell, GraduationCap, Briefcase,
  Target, PawPrint, PenTool, Circle, Apple, ShieldPlus, Presentation
 } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { CitasServicesService } from '../../../core/services/citas-services.service';
import { AgendaSettingsService, AgendaSettings } from '../../../core/services/citas-agenda-settings.service';
import { Notification } from '../../../services/notification.service';
import { BusinessCatalogService } from '../../../core/services/business-catalog.service';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule],
  templateUrl: './availability-setup.html',
  styleUrl: './availability-setup.css',
})

export class AvailabilitySetup implements OnInit {

  readonly HelpCircle = HelpCircle;

  ICON_MAP: any = {
    scissors: Scissors,
    sparkles: Sparkles,
    hand: Hand,
    brain: Brain,
    apple: Apple,
    'shield-plus': ShieldPlus,
    stethoscope: Stethoscope,
    heart: Heart,
    flower: Flower,
    dumbbell: Dumbbell,
    'graduation-cap': GraduationCap,
    briefcase: Briefcase,
    presentation: Presentation,
    target: Target,
    'paw-print': PawPrint,
    'pen-tool': PenTool,
    circle: Circle
  };

  private auth = inject(AuthService);
  private citasService = inject(CitasServicesService);
  private agendaService = inject(AgendaSettingsService);
  private notify = inject(Notification);
  private router = inject(Router);
  public catalog = inject(BusinessCatalogService);

  loading = true;
  saving = false;

  showAppoDurHelp = false;
  showBreakAppoHelp = false;

  staffId: number | null = null;

  org = JSON.parse(localStorage.getItem('organization') || '{}');
  niche = this.org.business_niche;

  nicheLabel = this.catalog.getLabel(this.niche);
  nicheIcon = this.catalog.getIcon(this.niche);
  nicheColor = this.catalog.getColor(this.niche);


  // Configuración por defecto
  settings: AgendaSettings = {
    appointment_duration: 15, // Intervalo entre horarios (aparecen los bloques en booking-public)
    break_between_appointments: 0, // Espacio entre citas (espacio para barrer, preparar siguiente cita)
    minimum_notice_hours: 0,
    cancellation_limit_hours: 0,
    allow_online_booking: true,
    allow_cancellation: true
  };

  weekDays: WeekDay[] = this.getDefaultWeekDays();

  ngOnInit() {

    this.staffId = this.auth.getStaffId();

    const agenda = this.catalog.getAgendaConfig(this.niche);
    const schedule = this.catalog.getSmartSchedule(this.niche);

    // settings
    if (agenda) {
      this.settings.appointment_duration = agenda.appointment_duration;
      this.settings.break_between_appointments = agenda.break_between_appointments;
    }

    // horario (AQUÍ estaba el bug real)
    if (schedule) {
      this.weekDays = this.weekDays.map(day => ({
        ...day,
        active: schedule.working_days.includes(day.value),
        start: schedule.start,
        end: schedule.end
      }));
    }


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

    const schedule = this.catalog.getSmartSchedule(this.niche);
    const agenda = this.catalog.getAgendaConfig(this.niche);

    if (schedule) {
      this.weekDays = this.weekDays.map(day => ({
        ...day,
        active: schedule.working_days.includes(day.value),
        start: schedule.start,
        end: schedule.end
      }));
    }

    if (agenda) {
      this.settings.appointment_duration = agenda.appointment_duration;
      this.settings.break_between_appointments = agenda.break_between_appointments;
    }

    this.notify.success('Horario recomendado aplicado');
  }

  save() {

    if (this.weekDays.filter(d => d.active).length === 0) {
      this.notify.error('Selecciona al menos un día');
      return;
    }

    const activeDays = this.weekDays.filter(d => d.active);

    const payload = {
      ...this.settings,

      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as string,

      weekly_schedule: activeDays.map(d => ({
        day_of_week: d.value,
        start_time: d.start + ':00',
        end_time: d.end + ':00'
      }))
    };


    this.saving = true;

    if (!this.staffId) {
      this.notify.error('Error de sesión');
      this.saving = false;
      return;
    }

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
      error: (err) => {
        this.saving = false;

        this.handleError(err, 'Error al guardar');
      }
    });

  }

  handleError(err: any, fallbackMessage: string) {

    //console.error(err);

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

