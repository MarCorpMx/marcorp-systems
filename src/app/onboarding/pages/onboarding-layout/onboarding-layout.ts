import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule,
  LogOut
} from 'lucide-angular';

import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../../core/services/auth.service';
import { OnboardingService } from '../../services/onboarding.service';
import { ProgressBar } from '../../components/progress-bar/progress-bar';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { ThemeService } from '../../../core/services/theme.service';


@Component({
  selector: 'app-onboarding-layout',
  imports: [RouterOutlet, ProgressBar, CommonModule, LucideAngularModule, ConfirmDialog],
  templateUrl: './onboarding-layout.html',
  styleUrl: './onboarding-layout.css',
})

export class OnboardingLayout implements OnInit {

  readonly LogOut = LogOut;

  currentSystem: any;

  private router = inject(Router);
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  confirm = inject(ConfirmDialogService);

  //constructor(public confirm: ConfirmDialogService){}

  hideProgressRoutes = [
    '/onboarding/email-expired'
  ];

  /*hideProgressRoutes = [
    '/onboarding/email-expired',
    '/onboarding/completed'
  ];*/

  ngOnInit() {
    this.theme.applySystemTheme('citas');
  }

  get showProgress(): boolean {
    return !this.hideProgressRoutes.includes(this.router.url);
  }


  logout() {
    this.confirm.open(
      'Cerrar sesión',
      '¿Seguro que deseas cerrar tu sesión?',
      () => {
        this.auth.logout().subscribe(() => {
          this.router.navigate(['/auth/login']);
        });
      }
    );
  }


}
