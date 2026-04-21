import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { LucideAngularModule, Video, MapPin } from 'lucide-angular';

import { CreateServiceDto, OnboardingServiceResponse } from '../../../core/models/service.model';
import { ONBOARDING_ROUTES_MAP } from '../../models/onboarding.model';
import { CitasServicesService } from '../../../core/services/citas-services.service';
import { Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-service-create',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './service-create.html',
  styleUrl: './service-create.css',
})

export class ServiceCreate implements OnInit {

  readonly Video = Video;
  readonly MapPin = MapPin;

  private fb = inject(FormBuilder);
  private servicesService = inject(CitasServicesService);
  private router = inject(Router);
  private notify = inject(Notification);

  loading = true;
  saving = false;

  form!: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      duration_minutes: [60, Validators.required],
      price: [0, Validators.required],
      mode: ['presential', Validators.required]
    });

    // Detenemos un rato para un delay suave
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Completa los campos');
      return;
    }

    if (this.saving) return;

    this.saving = true;

    const payload: CreateServiceDto = {
      name: this.form.value.name,
      variants: [
        {
          name: 'Sesión individual',
          duration_minutes: this.form.value.duration_minutes,
          price: this.form.value.price ?? 0,
          max_capacity: 1,
          mode: this.form.value.mode,
          includes_material: false,
          active: true,
        }
      ]
    };

    this.servicesService
      .create<OnboardingServiceResponse>(payload)
      .subscribe({
        next: (res) => {

          this.notify.success('Servicio creado');

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

          // manejo fino de errores backend
          if (err.status === 422 && err.error?.errors) {
            this.notify.error('Revisa los campos');
          } else if (err.status === 403) {
            this.notify.error('No puedes hacer esto en este momento');
          } else {
            this.notify.error('No se pudo guardar');
          }

          this.saving = false;
        }
      });

  }
}
