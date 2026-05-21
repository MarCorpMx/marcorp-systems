import { Component, computed, EventEmitter, inject, Input, Output, signal, HostListener, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule, LogOut, X } from 'lucide-angular';
import {
  Calendar,
  Users,
  Settings,
  BookOpen,
  LayoutDashboard,
  Briefcase,
  Globe,
  Clock,
  Bell,
  BarChart,
  UserCheck,
  Contact,
  ShieldCheck,
  UsersRound,
  UserRound,
  ChevronDown,
  Sparkles, Scissors, Hand, Brain, Stethoscope, Heart, Flower, Dumbbell, GraduationCap, Presentation,
  Target, PawPrint, PenTool, Circle, Apple, ShieldPlus,
} from 'lucide-angular';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
//import { SYSTEM_MENUS } from '../../../core/config/system-menus';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';
import { BusinessCatalogService } from '../../../core/services/business-catalog.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
})

export class Sidebar implements OnInit {
  readonly LogOut = LogOut;
  readonly X = X;

  ICON_MAP: any = {
    LayoutDashboard,
    Calendar,
    UserRound,
    Briefcase,
    Globe,
    Clock,
    Bell,
    BarChart,
    UsersRound,
    Settings,
    ChevronDown,

    // business niches
    Sparkles,
    Scissors,
    Hand,
    Brain,
    Stethoscope,
    Heart,
    Flower,
    Dumbbell,
    GraduationCap,
    Presentation,
    Target,
    PawPrint,
    PenTool,
    Circle,
    Apple,
    ShieldPlus,
  };

  // Iconos para Niches
  ICON_NAME_MAP: Record<string, string> = {
    'sparkles': 'Sparkles',
    'scissors': 'Scissors',
    'hand': 'Hand',
    'brain': 'Brain',
    'stethoscope': 'Stethoscope',
    'heart': 'Heart',
    'flower': 'Flower',
    'dumbbell': 'Dumbbell',
    'graduation-cap': 'GraduationCap',
    'presentation': 'Presentation',
    'target': 'Target',
    'paw-print': 'PawPrint',
    'pen-tool': 'PenTool',
    'circle': 'Circle',
    'apple': 'Apple',
    'shield-plus': 'ShieldPlus'
  };

  private auth = inject(AuthService);
  private theme = inject(ThemeService);
  private router = inject(Router);
  private confirm = inject(ConfirmDialogService);
  sidebarOpen = signal(false);
  private elRef = inject(ElementRef);
  private businessCatalogService = inject(BusinessCatalogService);

  user = this.auth.getUser();
  systems = this.auth.getSystems();
  //currentSystem = this.theme.getCurrentSystem();
  currentSystem = computed(() => this.auth.getCurrentSystem());

  isClosing = false;

  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  // Contexto de la organización
  organization = this.auth.organization$;

  niche = computed(() =>
    this.organization()?.business_niche ?? 'other'
  );

  organizationLogo = computed(() =>
    this.organization()?.logo_url ?? null
  );

  nicheIcon = computed(() =>
    this.businessCatalogService.getIcon(this.niche())
  );

  nicheColor = computed(() =>
    this.businessCatalogService.getColor(this.niche())
  );

  // iconos
  sidebarNicheIcon = computed(() => {

    const iconName =
      this.businessCatalogService.getIcon(this.niche());

    const mapped =
      this.ICON_NAME_MAP[iconName] || 'Circle';

    return this.ICON_MAP[mapped];
  });


  /*menu = computed(() => {
    const system = this.currentSystem();

    if (!system?.features) return [];

    console.log(system.features);

    return system.features
      .filter((f: any) => f.visible && !f.parent)
      .sort((a: any, b: any) => a.sort_order - b.sort_order);
  });*/

  menu = computed(() => {

    const system = this.currentSystem();

    if (!system?.features) return [];

    const niche = this.niche();

    return system.features

      .filter((f: any) => f.visible && !f.parent)

      .sort((a: any, b: any) => a.sort_order - b.sort_order)

      .map((feature: any) => ({

        ...feature,

        dynamicLabel: this.businessCatalogService.getMenuLabel(
          niche,
          feature.key,
          feature.label
        )

      }));

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

  // Sucursales
  //branches = computed(() => this.currentSystem?.branches ?? []);
  branches = computed(() => {
    return this.currentSystem()?.branches ?? [];
  });

  // sucursal actual
  //currentBranch = signal<any>(null);
  currentBranch = this.auth.currentBranch$;

  // estado dropdown
  branchMenuOpen = false;

  ngOnInit() {

    const branches = this.currentSystem()?.branches ?? [];

    if (!branches.length) return;

    const saved = this.auth.getCurrentBranch();

    // 1. si hay sucursal guardada y sigue existiendo - úsarla
    if (saved) {
      const exists = branches.find(
        (b: any) => b.branch_id === saved.branch_id
      );

      if (exists) {
        //this.currentBranch.set(exists);
        this.auth.setCurrentBranch(exists);
        return;
      }
    }

    // 2. si no hay saved - usar default
    /*const defaultBranch = branches.find(
      (b: any) => b.branch_id === this.currentSystem?.default_branch_id
    );*/
    const defaultBranch = branches.find(
      (b: any) => b.branch_id === this.currentSystem()?.default_branch_id
    );

    const finalBranch = defaultBranch ?? branches[0];

    //this.currentBranch.set(finalBranch);

    // guardar para futuras recargas
    this.auth.setCurrentBranch(finalBranch);
  }

  // toggle
  toggleBranchMenu() {
    this.branchMenuOpen = !this.branchMenuOpen;
  }

  // seleccionar sucursal
  selectBranch(branch: any) {

    if (!branch.branch_is_active) {
      return; // no seleccionar
    }

    //this.currentBranch.set(branch);
    this.branchMenuOpen = false;

    // persistir en auth/localStorage
    this.auth.setCurrentBranch(branch);

    this.router.navigate(['/sistemas/citas/dashboard']);

    if (window.innerWidth <= 768) {
      this.closeSidebar();
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

    // cerrar sidebar SOLO en móvil
    if (window.innerWidth <= 768) {
      this.closeSidebar();
    }
  }

}
