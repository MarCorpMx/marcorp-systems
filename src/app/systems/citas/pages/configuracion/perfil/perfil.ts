import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { Notification } from '../../../../../services/notification.service';
import { OrganizationService } from '../../../../../core/services/organization.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, NgxIntlTelInputModule, CommonModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {

  form!: FormGroup;
  loading = true;
  submitted = false;
  saving = false;
  success = false;

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];


  constructor(
    private fb: FormBuilder,
    private notify: Notification,
    private organizationService: OrganizationService
  ) { }

  ngOnInit(): void {
    this.initForm();

    // Generar lista de países para el select
    this.countries = Object.keys(CountryISO)
      .filter(k => isNaN(Number(k))) // filtrar los keys que son nombres
      .map(k => ({
        code: CountryISO[k as keyof typeof CountryISO], // <-- fuerza el tipo aquí
        name: k
      }));

    this.organizationService.getOrganization().subscribe({
    next: (org) => {
      this.form.patchValue({
        name: org.name ?? '',
        email: org.email ?? '',
        phone: org.phone ?? null,
        website: org.website ?? '',
        country: org.country ?? 'MX',
        state: org.state ?? '',
        city: org.city ?? '',
        zip_code: org.zip_code ?? '',
        address: org.address ?? '',
      });

      this.loading = false;
    },
    error: () => {
      this.notify.error('No se pudo cargar la información de la organización.');
      this.loading = false;
    }
  });
  }

initForm() {
  this.form = this.fb.group({
    name: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(120)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(150)
    ]],
    phone: [null, Validators.required],
    website: ['', [
      Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\w\-.~:\/?#[\]@!$&'()*+,;=]*)?$/)
    ]],
    country: ['MX', Validators.required], // default México
    state: ['', Validators.maxLength(100)],
    city: ['', Validators.maxLength(100)],
    address: ['', Validators.maxLength(255)],
    zip_code: ['', Validators.maxLength(20)]
  });
}

save() {
  this.submitted = true;

  if (this.form.invalid) {
    this.notify.error('Error: Algunos campos contienen información incorrecta o incompleta.');
    this.form.markAllAsTouched();
    return;
  }

  this.saving = true;
  this.success = false;

  this.organizationService.updateOrganization(this.form.value).subscribe({
    next: () => {
      this.saving = false;
      this.success = true;
      this.notify.success('Información actualizada correctamente.');

      setTimeout(() => this.success = false, 3000);
    },
    error: () => {
      this.saving = false;
      this.notify.error('No se pudo guardar la información.');
    }
  });
}

getError(controlName: string): string | null {
  const control = this.form.get(controlName);
  if (!control || !control.touched || !control.errors) return null;

  if (control.errors['required']) return 'Este campo es obligatorio';
  if (control.errors['email']) return 'Correo electrónico inválido';
  if (control.errors['minlength']) return 'Demasiado corto';
  if (control.errors['maxlength']) return 'Demasiado largo';
  if (control.errors['pattern']) return 'Formato inválido';

  return null;
}

}