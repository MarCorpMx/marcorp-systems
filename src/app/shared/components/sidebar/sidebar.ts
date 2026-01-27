import { Component, computed, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut  } from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { SYSTEM_MENUS } from '../../../core/config/system-menus';

import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})

export class Sidebar {
  readonly LogOut = LogOut;
  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private router = inject(Router);
  private confirm = inject(ConfirmDialogService);

  user = this.auth.getUser();
  systems = this.auth.getSystems();
  currentSystem = this.theme.getCurrentSystem();

  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  menu = computed(() => {
    console.log(this.currentSystem);
    if (!this.currentSystem) return [];
    return SYSTEM_MENUS[this.currentSystem.subsystem_key] || [];
  });

  closeSidebar() {
    this.close.emit();
  }

  hasAccess(item: any): boolean {
    if (!item.roles) return true;
    return item.roles.some((r: string) =>
      this.currentSystem.roles?.includes(r)
    );
  }

  switchSystem() {
    this.router.navigate(['/select-system']);
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
