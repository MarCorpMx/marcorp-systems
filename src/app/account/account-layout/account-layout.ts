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
  ArrowLeft,
  Settings
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

  ICON_MAP: any = {
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
    ArrowLeft,
    Settings
  };

  /*
 * Bell (notificaciones)
  Alertas del sistema (pagos, errores, invitaciones)
Actividad del equipo
Recordatorios
Cambios en cuenta
- UX real:
Badge rojo con contador (🔥 importantísimo después)
Dropdown con lista de eventos
“Te invitaron a una organización”
“Tu factura está lista”

*Settings (configuración rápida)
Ajustes rápidos del usuario
Tema / idioma
Preferencias de cuenta
Accesos rápidos (seguridad, API keys, etc.)
- UX real:
Abre un mini menú tipo dropdown
O lleva a configuración general

*/


/*Asi debe quedar el puto manu man:
Cuenta
- Perfil
- Seguridad

Suscripción
- Plan
- Uso y límites
- Facturación

Soporte
- Soporte
*/


  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);


  pageTitle = 'Cuenta';
  sidebarOpen = signal(false);

  user = this.auth.getUser();

  organization_name = computed(() => {
    const current = this.auth.getCurrentSystem();
    return current?.organization_name ?? '';
  });

  menuSections = [
    {
      label: 'Cuenta',
      items: [
        { label: 'Perfil', icon: this.ICON_MAP.User, route: 'profile' },
        { label: 'Seguridad', icon: this.ICON_MAP.Shield, route: 'security' },
        { label: 'Notificaciones', icon: this.ICON_MAP.Bell, route: 'notifications' }
      ]
    },
    {
      label: 'Organización',
      items: [
        { label: 'Organizaciones', icon: this.ICON_MAP.Building2, route: 'organizations' },
        { label: 'Permisos', icon: this.ICON_MAP.KeyRound, route: 'permissions' }
      ]
    },
    {
      label: 'Suscripción',
      items: [
        { label: 'Suscripciones', icon: this.ICON_MAP.Crown, route: 'subscriptions' },
        { label: 'Uso y límites', icon: this.ICON_MAP.Gauge, route: 'usage' },
        { label: 'Facturación', icon: this.ICON_MAP.CreditCard, route: 'billing' }
      ]
    },
    /*{
      label: 'Equipo',
      items: [
        { label: 'Equipo', icon: this.ICON_MAP.Users, route: 'team' }
      ]
    },*/
    {
      label: 'Soporte',
      items: [
        { label: 'Soporte', icon: this.ICON_MAP.LifeBuoy, route: 'support' }
      ]
    }
  ];

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
