import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

import { OnboardingService } from '../../services/onboarding.service';
import {
  ONBOARDING_STEPS_ORDER,
  ONBOARDING_STEPS_LABEL,
  ROUTE_TO_STEP_MAP,
  ONBOARDING_ROUTES_MAP,
  OnboardingStep
} from '../../models/onboarding.model';

@Component({
  selector: 'app-progress-bar',
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.css',
})

export class ProgressBar {

  /*onboarding = inject(OnboardingService);
  steps: OnboardingStep[] = ONBOARDING_STEPS_ORDER;
  currentStep = computed(() => this.onboarding.getStep());
  currentIndex = computed(() =>
    this.steps.indexOf(this.currentStep())
  );
  getLabel(step: OnboardingStep) {
    return ONBOARDING_STEPS_LABEL[step];
  }
  isCompleted(index: number) {
    return index < this.currentIndex();
  }
  isActive(index: number) {
    return index === this.currentIndex();
  }*/

  private router = inject(Router);

  steps = ONBOARDING_STEPS_ORDER;

  currentStep = signal<OnboardingStep>('email_pending');

  constructor() {

    // 1 SET INICIAL (CLAVE)
    this.updateStep(this.router.url);

    // 2 ESCUCHAR CAMBIOS
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateStep(event.urlAfterRedirects);
      });
  }

  private updateStep(url: string) {
    const cleanUrl = url.split('?')[0];

    const found = Object.entries(ONBOARDING_ROUTES_MAP)
      .find(([_, route]) => route === cleanUrl);

    if (found) {
      this.currentStep.set(found[0] as OnboardingStep);
    }
  }

  currentIndex() {
    return this.steps.indexOf(this.currentStep());
  }

  getLabel(step: OnboardingStep) {
    return ONBOARDING_STEPS_LABEL[step];
  }

  isCompleted(index: number) {
    return index < this.currentIndex();
  }

  isActive(index: number) {
    return index === this.currentIndex();
  }
}
