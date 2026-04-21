import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthNavigation } from '../services/auth-navigation';
import { Notification } from '../../services/notification.service';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, LucideAngularModule, NgxIntlTelInputModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register implements OnInit {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  showPassword = false;
  isSubmitting = false;
  pattern: RegExp = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúñÑ]+$/;
  patternPassword: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$#%])[A-Za-z\d@$#%]{8,15}$/;
  itemsSystems: any[] = [];
  itemDefault: any;

  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];

  constructor(
    private router: Router,
    public nav: AuthNavigation,
    private notify: Notification,
    private authService: AuthService) { }

  registrationForm = new FormGroup({
    first_name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.pattern)]),
    email: new FormControl('', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    //password: new FormControl('', [Validators.required, Validators.pattern(this.patternPassword)])
    password: new FormControl('', [Validators.required])
  });

  get first_name() {
    return this.registrationForm.get('first_name');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }

  ngOnInit(): void { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    // Previene la recarga de la página por defecto
    event.preventDefault();

    if (this.registrationForm.invalid) {
      //this.notify.error('Error: Algunos campos contienen información incorrecta o incompleta. Por favor, revísalos y vuelve a intentarlo.');
      this.markAllAsTouched(this.registrationForm);

      const firstInvalid = document.querySelector('.ng-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });


      return; // Detener el envío si es inválido
    }
    this.sendDataToBackend(null);
  }

  // Se estableción con token: string | null para posteriormente implementar re-captcha
  private sendDataToBackend(token: string | null) {
    if (this.isSubmitting) {
      return; // Si ya se está enviando, no hacer nada
    }
    this.isSubmitting = true;

    const payload = {
      first_name: this.registrationForm.value.first_name ?? undefined,
      email: this.registrationForm.value.email ?? undefined,
      password: this.registrationForm.value.password ?? '',
      subsystem: 'citas'
    };

    // Llama al servicio para enviar los datos
    this.authService.register(payload).subscribe({
      next: (res) => {
        this.notify.success('Bienvenido a CITARA\nTu espacio ya está listo');
        this.isSubmitting = false;
        /*this.notify.success('Registro exitoso');
        this.isSubmitting = false;
        this.registrationForm.reset();
        this.nav.goToLogin();*/
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err.status === 422) {
          const errors = err.error.errors;
          let messages = '';

          for (const key in errors) {
            messages += errors[key][0] + '\n';
          }
          this.notify.error(messages);

        } else if (err.status === 503) {
          this.notify.error(err.error?.message || 'Registro temporalmente deshabilitado');

        } else {
          this.notify.error('Error en el servidor, intenta más tarde');
        }
      }
    });
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

}
