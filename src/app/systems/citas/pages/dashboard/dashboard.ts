import { Component, OnInit, OnDestroy, inject, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import { LucideAngularModule } from 'lucide-angular';
import { Star, Lightbulb, Sprout, Rocket, Trophy, Globe } from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { BusinessCatalogService } from '../../../../core/services/business-catalog.service';
import { CitasDashboardService } from '../../../../core/services/citas-dashboard.service';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { DashboardData, ProfileProgress, ProfileProgressLevel, ProfileProgressMissingField } from '../../../../core/models/branchProfileCompletion.model';
import { ContactSalesService } from '../../../../core/services/contact-sales.service';
import { RequestType } from '../../../../core/enums/request-type.enum';
import { CurrencyService } from '../../../../core/services/currency.service';
import { CitasLayoutService } from '../../services/citas-layout.service'; // Importa un layout que ya tiene el template de trabajo


@Component({
  selector: 'app-dashboard',
  imports: [LucideAngularModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  readonly Star = Star;
  readonly Lightbulb = Lightbulb;
  readonly Sprout = Sprout;
  readonly Rocket = Rocket;
  readonly Trophy = Trophy;
  readonly Globe = Globe;

  private auth = inject(AuthService);
  layout = inject(CitasLayoutService);
  public businessCatalogService = inject(BusinessCatalogService);
  private dashboardService = inject(CitasDashboardService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private router = inject(Router);
  private contactSales = inject(ContactSalesService);
  private currency = inject(CurrencyService);

  readonly RequestType = RequestType;


  // Contexto de la organización
  organization = this.auth.organization$;

  niche = computed(() =>
    this.organization()?.business_niche ?? 'other'
  );

  // Sucursal actual
  currentBranch = this.auth.currentBranch$;

  loading = true;
  hasAppointmentsToday = false; // Temporal

  user = this.auth.getUser();

  // Data de la petición al backend
  dashboardData!: DashboardData;

  // Observar los cambios de sucursal
  constructor() {

    effect(() => {

      const branch = this.auth.currentBranch$();

      if (!branch) {
        return;
      }

      this.getDataDashboard();

    });

  }

  // Variables para texto amigable
  uiTerms = computed(() => ({
    appointments: {
      singular: this.businessCatalogService.getTerm(
        this.niche(),
        'appointments',
        'singular',
        true
      ),

      plural: this.businessCatalogService.getTerm(
        this.niche(),
        'appointments',
        'plural',
        true
      ),

      singularLower: this.businessCatalogService.getTerm(
        this.niche(),
        'appointments',
        'singular'
      ),

      pluralLower: this.businessCatalogService.getTerm(
        this.niche(),
        'appointments',
        'plural'
      )
    },

    services: {
      singular: this.businessCatalogService.getTerm(
        this.niche(),
        'services',
        'singular',
        true
      ),

      plural: this.businessCatalogService.getTerm(
        this.niche(),
        'services',
        'plural',
        true
      ),

      singularLower: this.businessCatalogService.getTerm(
        this.niche(),
        'services',
        'singular'
      ),

      pluralLower: this.businessCatalogService.getTerm(
        this.niche(),
        'services',
        'plural'
      )
    },

    audienceOwner: {
      singular: this.businessCatalogService.getTerm(
        this.niche(),
        'owner',
        'singular',
        true
      ),

      plural: this.businessCatalogService.getTerm(
        this.niche(),
        'owner',
        'plural',
        true
      ),

      singularLower: this.businessCatalogService.getTerm(
        this.niche(),
        'owner',
        'singular'
      ),

      pluralLower: this.businessCatalogService.getTerm(
        this.niche(),
        'owner',
        'plural'
      )
    },

    clients: {
      singular: this.businessCatalogService.getTerm(
        this.niche(),
        'clients',
        'singular',
        true
      ),

      plural: this.businessCatalogService.getTerm(
        this.niche(),
        'clients',
        'plural',
        true
      ),

      singularLower: this.businessCatalogService.getTerm(
        this.niche(),
        'clients',
        'singular'
      ),

      pluralLower: this.businessCatalogService.getTerm(
        this.niche(),
        'clients',
        'plural'
      )
    }
  }));

  ngOnInit() {
    this.layout.setHeader({
      title: `Bienvenido ${this.user.name}`,
      subtitle: 'Así va tu negocio hoy'
    });
  }

  ngOnDestroy() {
    this.layout.clearHeader();
  }

  requestInformation(
    type: RequestType
  ): void {

    this.contactSales
      .requestInformation(type);

  }

  getDataDashboard() {

    this.loading = true;

    this.dashboardService
      .getDataDashboard()
      .subscribe({
        next: (res) => {

          this.loading = false;

          //console.log('dataBackend :', JSON.stringify(res, null, 2));

          this.dashboardData = res.data;

          //this.profileCompletion = res.data.profile_completion;

          //console.log('dataBackend :', JSON.stringify(this.profileCompletion, null, 2));

        },

        error: (err) => {
          this.handleError(err, 'Ocurrió un error al obtener los datos');
        }
      });
  }

  readonly profileLevelConfig = {

    starter: {
      icon: Sprout,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },

    growing: {
      icon: Rocket,
      color: 'text-sky-500',
      bg: 'bg-sky-500/10'
    },

    professional: {
      icon: Star,
      color: 'text-violet-500',
      bg: 'bg-violet-500/10'
    },

    optimized: {
      icon: Trophy,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    }

  } as const;

  get currentLevelConfig() {
    return this.profileLevelConfig[
      this.profileCompletion.level.key
    ];
  }

  get profileCompletion() {
    return this.dashboardData.profile_completion;
  }

  get kpis() {
    return this.dashboardData.kpis;
  }

  get nextAppointment() {
    return this.dashboardData.next_appointment;
  }

  get todayAppointments() {
    return this.dashboardData.today_appointments;
  }

  get recentActivity() {
    return this.dashboardData.recent_activity;
  }

  readonly profileMessages = {

    starter:
      'Completa los datos básicos de tu sucursal.',

    growing:
      'Vas por buen camino, agrega más información.',

    professional:
      'Tu perfil ya transmite confianza.',

    optimized:
      'Excelente. Tu perfil está optimizado.'
  };

  get currentProfileMessage() {
    return this.profileMessages[
      this.profileCompletion.level.key
    ];
  }

  isExternalField(item: ProfileProgressMissingField): boolean {

    return item.field === 'logo_url';

  }

  goToMissingItem(item: ProfileProgressMissingField) {

    switch (item.field) {

      case 'logo_url':
        this.router.navigate([
          '/sistemas/citas/configuracion/perfil'
        ]);
        break;

      case 'tagline':
      case 'description':
      case 'website':
      case 'social_links':
        this.router.navigate([
          '/sistemas/citas/configuracion/sucursales'
        ]);
        break;

    }

  }

  goToBranches() {
    this.router.navigate([
      '/sistemas/citas/configuracion/sucursales'
    ]);
  }

  goToCreate(link: string) {
    if (link === 'horario') {
      this.router.navigate([
        '/sistemas/citas/configuracion'
      ]);
    } else {
      this.router.navigate([
        `/sistemas/citas/${link}`
      ]);
    }
  }

  get shouldShowWebsitePromotion(): boolean {

    return !this.loading
      && this.profileCompletion.missing.some(
        item => item.field === 'website'
      )
      && this.profileCompletion.percentage >= 40;
  }

  formatMoney(value: any): string {
    return this.currency.format(value);
  }

  getAppointmentStatusLabel(status: string): string {

    const labels: Record<string, string> = {

      pending: 'Pendiente',
      confirmed: 'Confirmada',
      completed: 'Completada',
      cancelled: 'Cancelada',
      no_show: 'No asistió',
      rescheduled: 'Reagendada'

    };

    return labels[status] ?? status;
  }

  getAppointmentStatusClass(status: string): string {

    const classes: Record<string, string> = {

      pending:
        'bg-yellow-500/10 text-yellow-400',

      confirmed:
        'bg-emerald-500/10 text-emerald-400',

      completed:
        'bg-sky-500/10 text-sky-400',

      cancelled:
        'bg-red-500/10 text-red-400',

      no_show:
        'bg-red-500/10 text-red-400',

      rescheduled:
        'bg-violet-500/10 text-violet-400'

    };

    return classes[status]
      ?? 'bg-white/10 text-white';
  }

  get rombiTip(): string {

    if (
      this.profileCompletion.missing.some(
        x => x.field === 'whatsapp_phone'
      )
    ) {
      return `Agregar WhatsApp aumenta la confianza de los ${this.uiTerms().audienceOwner.pluralLower} al reservar.`;
    }

    if (
      this.profileCompletion.missing.some(
        x => x.field === 'website'
      )
    ) {
      return 'Un sitio web profesional puede ayudarte a generar más reservas.';
    }

    if (
      this.profileCompletion.missing.some(
        x => x.field === 'logo_url'
      )
    ) {
      return 'Agregar un logo mejora la imagen profesional de tu negocio.';
    }

    return 'Tu perfil está en buen estado. Sigue generando reservas.';
  }

  handleError(err: any, fallbackMessage: string) {

    //console.error(err);

    if (err?.error?.message) {
      this.notify.error(err.error.message);
      return;
    }

    if (err?.error?.errors) {
      const firstError = Object.values(err.error.errors)[0] as string[];
      this.notify.error(firstError[0]);
      return;
    }

    this.notify.error(fallbackMessage);
  }

}
