import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  LucideAngularModule, Video, MapPin,
  Sparkles, Scissors, Hand, Brain, Stethoscope, Heart, Flower, Dumbbell, GraduationCap, Briefcase,
  Target, PawPrint, PenTool, Circle, Apple, ShieldPlus, Presentation 

} from 'lucide-angular';

import { CreateServiceDto, OnboardingServiceResponse } from '../../../core/models/service.model';
import { ONBOARDING_ROUTES_MAP } from '../../models/onboarding.model';
import { CitasServicesService } from '../../../core/services/citas-services.service';
import { Notification } from '../../../services/notification.service';
import { BusinessCatalogService } from '../../../core/services/business-catalog.service';

@Component({
  selector: 'app-service-create',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './service-create.html',
  styleUrl: './service-create.css',
})

export class ServiceCreate implements OnInit {

  readonly Video = Video;
  readonly MapPin = MapPin;

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
  private fb = inject(FormBuilder);
  private servicesService = inject(CitasServicesService);
  private router = inject(Router);
  private notify = inject(Notification);
  public catalog = inject(BusinessCatalogService);

  loading = true;
  saving = false;

  form!: FormGroup;

  org = JSON.parse(localStorage.getItem('organization') || '{}');
  niche = this.org.business_niche;

  nicheLabel = this.catalog.getLabel(this.niche);
  nicheIcon = this.catalog.getIcon(this.niche);
  nicheColor = this.catalog.getColor(this.niche);

  presets = this.catalog.getPresets(this.niche);

  ngOnInit() {
    this.initForm();

    const suggestion = this.catalog.getSuggestion(this.niche);

    if (suggestion) {
      this.form.patchValue({
        name: suggestion.name,
        duration_minutes: suggestion.duration,
        price: suggestion.price,
        mode: suggestion.mode
      });
    }

    setTimeout(() => {
      this.loading = false;
    }, 400);
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

  applyPreset(preset: string) {
    this.form.patchValue({ name: preset });
  }


  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Completa los campos');
      return;
    }

    if (this.saving) return;

    this.saving = true;

    const variantName = this.catalog.getDefaultVariantName(this.niche);

    const payload: CreateServiceDto = {
      name: this.form.value.name,
      variants: [
        {
          name: variantName,
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
