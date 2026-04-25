import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideAngularModule, CheckCircle } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { OnboardingService } from '../../services/onboarding.service';

@Component({
  selector: 'app-onboarding-completed',
  imports: [LucideAngularModule],
  templateUrl: './onboarding-completed.html',
  styleUrl: './onboarding-completed.css',
})
export class OnboardingCompleted implements OnInit {

  readonly CheckCircle = CheckCircle;

  auth = inject(AuthService);

  onboardingService = inject(OnboardingService);
  router = inject(Router);

  loading = true;

  ngOnInit() {
    // Detenemos un rato para un delay suave
    setTimeout(() => {
      this.loading = false;
    }, 400);
  }


  goToDashboard() {

    this.loading = true;

    this.onboardingService.completeOnboarding().subscribe({
      next: () => {

        this.auth.refreshAuthContext().subscribe({
          next: () => {
            //this.loading = false;
            this.router.navigate(['/sistemas/citas/dashboard']);
          },
          error: () => {
            this.loading = false;
          }
        });

      },
      error: () => {
        this.loading = false;
      }
    });

  }



}
