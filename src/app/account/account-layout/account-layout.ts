import { Component, signal, inject, HostListener, computed } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ConfirmDialogService } from '../../shared/services/confirm-dialog.service';
import { ConfirmDialog } from '../../shared/components/confirm-dialog/confirm-dialog';
import { AuthService } from '../../core/services/auth.service';
import {
  LucideAngularModule,
  CircleUser,
  User,
  Shield,
  Building2,
  KeyRound,
  Crown,
  Gauge,
  CreditCard,
  Users,
  Bell,
  LifeBuoy,
  LogOut,
  Menu,
  X,
  ArrowLeft
} from 'lucide-angular';

interface AccountMenuItem {
  label: string;
  icon: any;
  route?: string;
  section?: 'account' | 'org' | 'billing' | 'support';
  danger?: boolean;
  action?: () => void;
}

@Component({
  selector: 'app-account-layout',
  imports: [CommonModule, RouterOutlet, RouterModule, LucideAngularModule, ConfirmDialog],
  templateUrl: './account-layout.html',
  styleUrl: './account-layout.css',
})
export class AccountLayout {
  readonly CircleUser = CircleUser;
  readonly User = User;
  readonly Shield = Shield;
  readonly Building2 = Building2;
  readonly KeyRound = KeyRound;
  readonly Crown = Crown;
  readonly Gauge = Gauge;
  readonly CreditCard = CreditCard;
  readonly Users = Users;
  readonly Bell = Bell;
  readonly LifeBuoy = LifeBuoy;
  readonly LogOut = LogOut;
  readonly Menu = Menu;
  readonly X = X;
  readonly ArrowLeft = ArrowLeft;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  //private confirm = inject(ConfirmDialogService);
  private auth = inject(AuthService);


  pageTitle = 'Cuenta';
  sidebarOpen = signal(false);

  organization_name = computed(() => {
    const current = this.auth.getCurrentSystem();
    return current?.organization_name ?? '';
  });

  constructor(public confirm: ConfirmDialogService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const child = this.route.firstChild;
        this.pageTitle = child?.snapshot.data['title'] || 'Cuenta';
      });
  }

  @HostListener('document:keydown.escape')
  closeOnEsc() {
    this.sidebarOpen.set(false);
  }

  goBackToSystem() {
    const lastSystem = localStorage.getItem('last_system_route');

    this.router.navigateByUrl('/sistemas/citas/dashboard');
    /*if (lastSystem) {
      //this.router.navigateByUrl(lastSystem);
      this.router.navigateByUrl('/sistemas/citas/dashboard');
    } else {
      this.router.navigateByUrl('/sistemas');
    }*/
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
