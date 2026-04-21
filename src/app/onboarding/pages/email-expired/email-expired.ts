import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LucideAngularModule, MailX, MailCheck } from 'lucide-angular';

import { Notification } from '../../../services/notification.service';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-email-expired',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './email-expired.html',
  styleUrl: './email-expired.css',
})

export class EmailExpired {
  readonly MailX = MailX;
  readonly MailCheck = MailCheck;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private notify = inject(Notification);
  private onboardingService = inject(OnboardingService);

  isSending = signal(false);
  success = signal(false);

  pattern: RegExp = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúñÑ]+$/;

  expiredForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
      Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
    ]),
    website: new FormControl('')
  });

  get email() {
    return this.expiredForm.get('email');
  }

  get website() {
    return this.expiredForm.get('website');
  }

  ngOnInit() { }

  onSubmit(event: Event) {
    // Previene la recarga de la página por defecto
    event.preventDefault();

    if (this.expiredForm.invalid) {
      this.markAllAsTouched(this.expiredForm);

      const firstInvalid = document.querySelector('.ng-invalid');
      firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      return; // Detener el envío si es inválido
    }

    this.isSending.set(true);


    const payload = {
      email: this.expiredForm.value.email ?? undefined,
      website: this.expiredForm.value.website ?? '',
    };

    // Llama al servicio para enviar los datos
    this.onboardingService.resendPublic(payload).subscribe({
      next: (res) => {
        this.notify.success('Si el correo existe, enviamos un enlace de verificación');
        this.success.set(true);
        this.isSending.set(false);
        this.expiredForm.reset();
      },
      error: (err) => {
        this.isSending.set(false);

        if (err.status === 422) {
          const errors = err.error.errors;
          let messages = '';

          for (const key in errors) {
            messages += errors[key][0] + '\n';
          }
          this.notify.error(messages);

        } else if (err.status === 503 || err.status === 429) {
          this.notify.error(err.error?.message || 'No pudimos enviar el correo. Intenta nuevamente.');

        } else {
          this.notify.error('Error en el servidor, intenta más tarde');
        }
      }
    });


    // mock temporal
    /*setTimeout(() => {
      this.success.set(true);
      this.isSending.set(false);
    }, 1200);*/
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

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
