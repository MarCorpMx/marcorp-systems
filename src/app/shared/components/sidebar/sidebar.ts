import { Component, computed, EventEmitter, inject, Input, Output, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut, X } from 'lucide-angular';
import {
  Calendar,
  Users,
  Settings,
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  Briefcase,
  Clock,
  Bell,
  BarChart,
  UserCheck,
  Contact,
  ShieldCheck,
  UsersRound,
  UserRound,
  ChevronDown
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
//import { SYSTEM_MENUS } from '../../../core/config/system-menus';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})

export class Sidebar {
  readonly LogOut = LogOut;
  readonly X = X;

  ICON_MAP: any = {
    LayoutDashboard,
    Calendar,
    UserRound,
    Briefcase,
    Clock,
    Bell,
    BarChart,
    UsersRound,
    Settings,
    ChevronDown
  };

  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private router = inject(Router);
  private confirm = inject(ConfirmDialogService);
  sidebarOpen = signal(false);
  private elRef = inject(ElementRef);

  user = this.auth.getUser();
  systems = this.auth.getSystems();
  currentSystem = this.theme.getCurrentSystem();

  isClosing = false;

  @Input() open = false;
  @Output() close = new EventEmitter<void>();


  menu = computed(() => {
    if (!this.currentSystem?.features) return [];

    return this.currentSystem.features
      .filter((f: any) => f.visible && !f.parent)
      .sort((a: any, b: any) => a.sort_order - b.sort_order);
  });

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.elRef.nativeElement
      .querySelector('.branch-selector')
      ?.contains(event.target);

    if (!clickedInside) {
      this.branchMenuOpen = false;
    }
  }

  closeSidebar() {
    this.isClosing = true;

    setTimeout(() => {
      this.close.emit();
      this.isClosing = false;
    }, 250); // duración animación
  }


  canUse(item: any): boolean {
    return item.enabled;
  }

  handleBlocked(feature: any) {
    console.log('Feature bloqueada:', feature.key);

    // aquí puedes abrir modal PRO
  }

  switchSystem() {
    this.router.navigate(['/seleccionar-sistema']);
  }


  logout() {
    this.confirm.open(
      'Cerrar sesión',
      '¿Seguro que deseas cerrar tu sesión?',
      () => {
        this.auth.logout().subscribe(() => {
          this.router.navigate(['/iniciar-sesion']);
        });
      }
    );
  }

  handleMenuClick(item: any) {
    if (!item.enabled) {
      this.handleBlocked(item);
      return;
    }

    // 👉 cerrar sidebar SOLO en móvil
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }


  // 🔹 Simulación de sucursales
  branches = [
    { id: 1, name: 'Sucursal Centro' },
    { id: 2, name: 'Sucursal Norte' },
    { id: 3, name: 'Sucursal Sur' }
  ];

  // 🔹 sucursal actual
  currentBranch = this.branches[0];

  // 🔹 estado dropdown
  branchMenuOpen = false;

  // 🔹 toggle
  toggleBranchMenu() {
    this.branchMenuOpen = !this.branchMenuOpen;
  }

  // 🔹 seleccionar sucursal
  selectBranch(branch: any) {
    this.currentBranch = branch;
    this.branchMenuOpen = false;

    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }

    console.log('Sucursal cambiada:', branch);
  }
}
