import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthNavigation } from '../services/auth-navigation';
import { Notification } from '../../services/notification.service';
import { Subsystem, arrSubsystem } from '../../core/services/subsystem';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, LucideAngularModule, NgxIntlTelInputModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
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
    private subsystemService: Subsystem,
    private notify: Notification,
    private authService: AuthService) { }

  registrationForm = new FormGroup({
    first_name: new FormControl('Diana', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.pattern)]),
    last_name: new FormControl('Islas', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.pattern)]),
    //phone: new FormControl(undefined, [Validators.required]),
    phone: new FormControl('7702021345', [Validators.required]),
    subsystem_id: new FormControl(null, [Validators.required]),
    email: new FormControl('diana@mail.com', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('and011235Mrom@', [Validators.required, Validators.pattern(this.patternPassword)])
  });

  get first_name() {
    return this.registrationForm.get('first_name');
  }
  get last_name() {
    return this.registrationForm.get('last_name');
  }
  get phone() {
    return this.registrationForm.get('phone');
  }
  get subsystem_id() {
    return this.registrationForm.get('subsystem_id');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }

  ngOnInit(): void {
    this.loadSubsystems();
  }

  loadSubsystems() {
    this.subsystemService.getActiveSubsystems().subscribe({
      next: (data) => {
        this.itemsSystems = data;
        this.registrationForm.get('subsystem_id')?.setValue(this.itemsSystems[0].id);
      },
      error: (err) => {
        console.error('Error cargando subsistemas:', err);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    // Previene la recarga de la página por defecto
    event.preventDefault();

    if (this.registrationForm.invalid) {
      this.notify.error('Error: Algunos campos contienen información incorrecta o incompleta. Por favor, revísalos y vuelve a intentarlo.');
      this.markAllAsTouched(this.registrationForm);
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

    // Llama al servicio para enviar los datos
    this.authService.register(this.registrationForm.value).subscribe({
      next: (res) => {
        this.notify.success('Registro exitoso');
        //console.log(res);

        this.isSubmitting = false;
        this.registrationForm.reset();
        this.registrationForm.get('subsystem_id')?.setValue(this.itemsSystems[0].id);
        this.router.navigate([this.nav.goToLogin()]);
      },
      error: (err) => {
        if (err.status === 422) {
          this.isSubmitting = false;
          // Errores de validación de Laravel
          const errors = err.error.errors;
          let messages = '';

          for (const key in errors) {
            messages += errors[key][0] + '\n';
          }
          this.notify.error(messages);
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
