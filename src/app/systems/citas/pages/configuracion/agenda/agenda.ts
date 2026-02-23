import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Notification } from '../../../../../services/notification.service';

//import { OrganizationService } from '../../../../../core/services/organization.service';
import { ScheduleService } from '../../../../../core/services/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-agenda',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './agenda.html',
  styleUrl: './agenda.css',
})

export class Agenda implements OnInit {

  form!: FormGroup;
  loading = true;
  saving = false;
  daysOfWeek = ['Lunes', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private fb: FormBuilder,
    //private orgService: OrganizationService,
    private scheduleService: ScheduleService,
    private notify: Notification
  ) { }


  ngOnInit() {
    this.initForm();
    this.loadScheduleSettings();
  }

  initForm() {
    this.form = this.fb.group({
      default_appointment_duration: [30, [Validators.required, Validators.min(5)]],
      break_between_appointments: [10, [Validators.required, Validators.min(0)]],
      rules: [''],
      working_hours: this.fb.group(this.daysOfWeek.reduce((acc, day) => {
        acc[day] = this.fb.group({
          start: ['09:00'],
          end: ['18:00']
        });
        return acc;
      }, {} as any)),
      holidays: this.fb.nonNullable.array<string>([])
    });
  }

  get holidays(): FormArray<FormControl<string>> {
    return this.form.get('holidays') as FormArray<FormControl<string>>;
  }

  addHoliday(date: string) {
    if (date) {
    this.holidays.push(
      this.fb.nonNullable.control(date)
    );
  }
  }

  removeHoliday(index: number) {
    this.holidays.removeAt(index);
  }

  loadScheduleSettings() {
    this.scheduleService.getSchedule().subscribe(res => {
      // Patch working_hours
      if (res.working_hours) {
        this.daysOfWeek.forEach(day => {
          if (res.working_hours[day]) {
            this.form.get(`working_hours.${day}`)?.patchValue(res.working_hours[day]);
          }
        });
      }
      // Patch other fields
      this.form.patchValue({
        default_appointment_duration: res.default_appointment_duration ?? 30,
        break_between_appointments: res.break_between_appointments ?? 10,
        rules: res.rules ?? ''
      });
      // Patch holidays
      if (res.holidays && res.holidays.length) {
        res.holidays.forEach(h => this.addHoliday(h));
      }

      this.loading = false;
    });
  }

  save() {
    if (this.form.invalid) {
      this.notify.error('Algunos campos son inválidos');
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.scheduleService.updateSchedule(this.form.value).subscribe({
      next: () => {
        this.saving = false;
        this.notify.success('Configuración guardada correctamente');
      },
      error: () => this.saving = false
    });
  }


}
