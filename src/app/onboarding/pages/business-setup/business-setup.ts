import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { ONBOARDING_ROUTES_MAP } from '../../models/onboarding.model';
import { OrganizationService } from '../../../core/services/organization.service';
import { Notification } from '../../../services/notification.service';


@Component({
  selector: 'app-business-setup',
  imports: [ReactiveFormsModule, NgxIntlTelInputModule, CommonModule],
  templateUrl: './business-setup.html',
  styleUrl: './business-setup.css',
})

export class BusinessSetup implements OnInit {

  private fb = inject(FormBuilder);
  private orgService = inject(OrganizationService);
  private notify = inject(Notification);
  private router = inject(Router);

  loading = true;
  saving = false;

  form!: FormGroup;

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];

  ngOnInit() {
    // Generar lista de países para el select
    this.countries = Object.keys(CountryISO)
      .filter(k => isNaN(Number(k))) // filtrar los keys que son nombres
      .map(k => ({
        code: CountryISO[k as keyof typeof CountryISO], // <-- fuerza el tipo aquí
        name: k
      }));

    this.countries = this.countries.sort((a, b) => {
      if (a.code === CountryISO.Mexico) return -1;
      if (b.code === CountryISO.Mexico) return 1;
      return a.name.localeCompare(b.name);
    });

    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [null, Validators.required],
      country: ['mx', Validators.required],
      state: ['', [Validators.maxLength(100)]],
      city: ['', [Validators.maxLength(100)]]
    });

    this.loadOrg();
  }

  loadOrg() {
    this.orgService.getOrganization().subscribe({
      next: (org) => {

        this.form.patchValue({
          name: org.name ?? '',
          phone: org.phone ?? null,
          country: (org.country ?? 'mx').toLowerCase(),
          state: org.state ?? '',
          city: org.city ?? '',
        });

        this.loading = false;
      },
      error: () => {
        this.notify.error('No pudimos cargar tu negocio');
        this.loading = false;
      }
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Completa los campos obligatorios');
      return;
    }

    this.saving = true;

    const payload = {
      name: this.form.value.name ?? undefined,
      phone: this.form.value.phone ?? undefined,
      country: this.form.value.country ?? undefined,
      state: this.form.value.state ?? undefined,
      city: this.form.value.city ?? undefined,
    };

    this.orgService.updateOrganization(payload).subscribe({
      next: (res) => {
        
        this.saving = false;
      
        this.notify.success('Negocio configurado');

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

        if (err?.error?.errors) {
          const firstError = Object.values(err.error.errors)[0] as string[];
          this.notify.error(firstError[0]);
          return;
        }

        this.notify.error('No se pudo guardar');
      }
    });

  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);

    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Correo inválido';
    if (control.errors['minlength']) return 'Muy corto';
    if (control.errors['maxlength']) return 'Muy largo';

    return null;
  }

}
