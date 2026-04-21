import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

import { AuthService } from '../../core/services/auth.service';
import { OnboardingStep } from '../models/onboarding.model';
import { Api } from '../../core/services/api';
import { LoadingService } from '../../core/services/loading.service';

@Injectable({
  providedIn: 'root',
})

export class OnboardingService {

  private api = inject(Api);
  private auth = inject(AuthService);
  private loadingService = inject(LoadingService);

  getStep(): OnboardingStep {
    const org = this.auth.getOrganization();

    if (!org?.onboarding_step) {
      return 'email_pending'; // fallback REAL
    }

    return org.onboarding_step as OnboardingStep;
  }


  // Reenvío de verificación (PÚBLICO)
  resendPublic(data: any): Observable<any> {
    const start = Date.now();
    this.loadingService.showGlobal(true);

    return this.api.post('auth/resend-verification', data, {
      loader: 'none'
    }).pipe(
      finalize(() => {
        const elapsed = Date.now() - start;
        const minTime = 500;

        const remaining = Math.max(minTime - elapsed, 0);

        setTimeout(() => {
          this.loadingService.showGlobal(false);
          this.loadingService.hide();
        }, remaining);
      })
    );
  }

  // Reenvío de verificación (AUTENTICADO)
  resendAuthenticated(): Observable<any> {
    const start = Date.now();
    this.loadingService.showGlobal(true);

    return this.api.post('auth/onboarding/resend-verification', {
      loader: 'none'
    }).pipe(
      finalize(() => {
        const elapsed = Date.now() - start;
        const minTime = 500;

        const remaining = Math.max(minTime - elapsed, 0);

        setTimeout(() => {
          this.loadingService.showGlobal(false);
          this.loadingService.hide();
        }, remaining);
      })
    );
  }

  // Verificar estado
  checkVerification(): Observable<any> {
    return this.api.get('onboarding/status', {});
  }

  completeOnboarding(): Observable<any> {
    const start = Date.now();
    const minTime = 500;

    this.loadingService.showGlobal(true);

    return this.api.post('onboarding/complete', {}, {
      loader: 'none'
    }).pipe(
      finalize(() => {
        const elapsed = Date.now() - start;
        const remaining = Math.max(minTime - elapsed, 0);

        setTimeout(() => {
          this.loadingService.showGlobal(false);
          this.loadingService.hide();
        }, remaining);
      })
    );
  }

  isCompleted(): boolean {
    const org = this.auth.getOrganization();

    return !!org?.onboarding_completed_at;
  }


}
