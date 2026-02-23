import { Component, computed, EventEmitter, inject, Output, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import {
  LucideAngularModule,
  LogOut,
  ChevronRight,
  User,
  ChevronDown
} from 'lucide-angular';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar {
  readonly LogOut = LogOut;
  readonly ChevronRight = ChevronRight;
  readonly User = User;
  readonly ChevronDown = ChevronDown;

  private auth = inject(AuthService);
  private router = inject(Router);
  private confirm = inject(ConfirmDialogService);
  private el = inject(ElementRef);
  breadcrumbService = inject(BreadcrumbService);

  userMenuOpen = signal(false);

  @Output() toggleMenu = new EventEmitter<void>();

  user = this.auth.getUser();

  organization_name = computed(() => {
    const current = this.auth.getCurrentSystem();
    return current?.organization_name ?? '';
  });

  //breadcrumbs: string[] = [];

  breadcrumbs = this.breadcrumbService.breadcrumbs;

  constructor() {}

  toggleUserMenu() {
    this.userMenuOpen.update(v => !v);
  }

  closeUserMenu() {
    this.userMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.el.nativeElement.contains(event.target)) {
      this.closeUserMenu();
    }
  }

  goToAccount() {
    this.closeUserMenu();
    this.router.navigate(['/account']);
  }

  logout() {
    this.closeUserMenu();
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
