import { Component, OnDestroy, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, Mail, Check } from 'lucide-angular';

import { OnboardingService } from '../../services/onboarding.service';
import { Notification } from '../../../services/notification.service';

//import { Api } from '../../core/services/api';

@Component({
  selector: 'app-email-verification',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './email-verification.html',
  styleUrl: './email-verification.css',
})

export class EmailVerification implements OnInit, OnDestroy {

  readonly Mail = Mail;
  readonly Check = Check;

  private router = inject(Router);
  private onboardingService = inject(OnboardingService);
  private notify = inject(Notification);

  showProgress = true;

  email: string = '';

  isSending = signal(false);
  sent = signal(false);
  error = signal<string | null>(null);

  cooldown = signal(0);

  private interval: ReturnType<typeof setInterval> | null = null;
  private intervalId: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    this.email = user?.email || '';

    this.startVerificationCheck();
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (this.interval) clearInterval(this.interval);
  }

  startVerificationCheck() {
    if (this.intervalId) return; // Evita duplicados

    this.intervalId = setInterval(() => {

      
      this.onboardingService.checkVerification().subscribe({
        next: (res: any) => {

          if (res?.verified) {

            // detener polling
            if (this.intervalId) {
              clearInterval(this.intervalId);
            }

            // actualizar organization en localStorage
            if (res.organization) {
              localStorage.setItem('organization', JSON.stringify(res.organization));
            }

            // feedback visual
            this.sent.set(true);

            // navegación automática
            setTimeout(() => {
              this.router.navigate(['/onboarding/business']);
            }, 1200);
          }

        },
        error: () => { }
      });

    }, 5000); 
  }


  resendEmail() {
    if (this.cooldown() > 0) return;

    this.isSending.set(true);

    this.onboardingService.resendAuthenticated().subscribe({
      next: (res: any) => {

        this.notify.success(res.message || 'Correo reenviado');

        this.isSending.set(false);
        this.sent.set(true);

        // usar cooldown del backend si viene
        const seconds = res.cooldown ?? 60;
        this.startCooldown(seconds);
      },

      error: (err) => {
        this.isSending.set(false);

        if (err.status === 429) {
          this.notify.info(err.error?.message || 'Espera antes de reenviar');

          const seconds = err.error?.cooldown ?? 60;
          this.startCooldown(seconds);

        } else if (err.status === 400) {
          this.notify.info(err.error?.message);

        } else {
          this.notify.error('Error al enviar correo');
        }
      }
    });
  }

  startCooldown(seconds: number) {
    this.cooldown.set(seconds);

    this.interval = setInterval(() => {
      const value = this.cooldown() - 1;
      this.cooldown.set(value);

      if (value <= 0 && this.interval) {
        clearInterval(this.interval);
      }
    }, 1000);
  }

}
