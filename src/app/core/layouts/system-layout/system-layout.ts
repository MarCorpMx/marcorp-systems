import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet  } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Sidebar } from '../../../shared/components/sidebar/sidebar';
import { Topbar } from '../../../shared/components/topbar/topbar';
import { ConfirmDialogService } from '../../../shared/services/confirm-dialog.service';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-system-layout',
  imports: [Sidebar, Topbar, ConfirmDialog, RouterOutlet],
  templateUrl: './system-layout.html',
  styleUrl: './system-layout.css',
})
export class SystemLayout {
  currentSystem: any;
  

  sidebarOpen = signal(false);
  toggleSidebar() {
    this.sidebarOpen.update(v => !v);
  }
  closeSidebar() {
    this.sidebarOpen.set(false);
  }

  constructor(
    private auth: AuthService,
    private theme: ThemeService,
    private router: Router,
    public confirm: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.currentSystem = this.auth.getCurrentSystem();

    if (!this.currentSystem) {
      this.router.navigate(['/auth/select-system']);
      return;
    }

    // aplica el tema del sistema
    this.theme.applySystemTheme(this.currentSystem.subsystem_key);
  }
}
