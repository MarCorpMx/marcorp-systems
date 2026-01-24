import { Component, computed, EventEmitter, inject, Output, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
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

  userMenuOpen = signal(false);

  @Output() toggleMenu = new EventEmitter<void>();

  user = this.auth.getUser();

  system = computed(() => {
    const current = this.auth.getCurrentSystem();
    return current?.subsystem_name ?? '';
  });

  breadcrumbs: string[] = [];

  constructor() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => this.buildBreadcrumbs());
  }

  buildBreadcrumbs() {
    const url = this.router.url
      .split('?')[0]
      .split('/')
      .filter(Boolean);

    // /systems/citas/dashboard → ["Citas", "Dashboard"]
    this.breadcrumbs = url.slice(2).map(v =>
      v.charAt(0).toUpperCase() + v.slice(1)
    );
  }

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
