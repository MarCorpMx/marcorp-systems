import { Component, inject, OnInit, signal, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Trash2,
  Store,
  Sparkles,
  Lock,
  PauseCircle,
  PlayCircle, HelpCircle, Eye, MoreVertical, ChevronUp, ChevronDown, MessageCircle, Globe,
  Share2, PhoneCall, MapPinned, Info, Instagram, Sprout, Rocket, Star, Trophy
} from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';

import { AuthService } from '../../../../../core/services/auth.service';
import { Notification } from '../../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';
import { CitasBranchService } from '../../../../../core/services/citas-branch.service';
import { BranchModel } from '../../../../../core/models/citas-branch.model';
import { BusinessCatalogService } from '../../../../../core/services/business-catalog.service';
import { ProfileProgress, ProfileProgressLevel, ProfileProgressMissingField } from '../../../../../core/models/branchProfileCompletion.model';
import { SectionTip } from '../../../../../shared/components/section-tip/section-tip';

import { AppPhonePipe } from '../../../../../shared/pipes/app-phone-pipe';


@Component({
  selector: 'app-sucursales',
  imports: [CommonModule, LucideAngularModule, AppPhonePipe,
    ReactiveFormsModule, NgxIntlTelInputModule, SectionTip],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css',
})

export class Sucursales implements OnInit {

  /*“Tu plan actual permite 3 sucursales, pero tienes 10 activas.
No podrás crear nuevas hasta reducirlas o actualizar tu plan.”*/

  //rombi - Permitir crear a owner, solo por el momento, despues tal ves agreguemos Manager = responsable
  // o definir bien el rol de admin en esta parte

  /* 🚀 Nueva mejora disponible
 
 Ahora tus clientes pueden encontrarte más fácilmente
 gracias a nuestro nuevo sistema de ubicación inteligente.
 
 Verifica tu ubicación para aparecer correctamente
 en búsquedas y mapas.*/

  readonly Plus = Plus;
  readonly Building2 = Building2;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Store = Store;
  readonly Sparkles = Sparkles;
  readonly Lock = Lock;
  readonly PauseCircle = PauseCircle;
  readonly PlayCircle = PlayCircle;
  readonly HelpCircle = HelpCircle;
  readonly Eye = Eye;
  readonly MoreVertical = MoreVertical;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly MessageCircle = MessageCircle;
  readonly Globe = Globe;
  readonly Share2 = Share2;
  readonly PhoneCall = PhoneCall;
  readonly MapPinned = MapPinned;
  readonly Info = Info;
  readonly Instagram = Instagram;
  readonly Sprout = Sprout;
  readonly Rocket = Rocket;
  readonly Star = Star;
  readonly Trophy = Trophy;


  private auth = inject(AuthService);
  public businessCatalogService = inject(BusinessCatalogService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private branchService = inject(CitasBranchService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Contexto de la organización
  organization = this.auth.organization$;

  niche = computed(() =>
    this.organization()?.business_niche ?? 'other'
  );

  slug = computed(() =>
    this.organization()?.slug ?? 'mi-organizacion'
  );

  form!: FormGroup;

  role: string | null = null;
  authContext: any;

  isFreePlan = false;

  loading = true;
  saving = false;
  submitted = false;

  showModal = false;
  editingBranch: BranchModel | null = null;

  noAccess = true;

  showSlugHelp = false;
  showReferencePrefixHelp = false;

  branchesLimit: number | null = null;
  canCreateBranches = false;
  canActivateMore = false;

  //processingBranchId: number | null = null;

  branches: BranchModel[] = [];

  activeMenu: number | null = null;

  // Loadings
  processingBranchId: number | null = null;

  processingAction:
    | 'view'
    | 'edit'
    | 'status'
    | 'delete'
    | null = null;


  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];
  SearchCountryField = SearchCountryField;

  // Variables para texto amigable
  showTaglineHelp = false;
  showDescriptionHelp = false;

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


  public readonly nicheContent: Record<string, {
    tagline: string;
    taglineModal: string;
    description: string;
    descriptionModal: string;
  }> = {

      psychology: {
        tagline: 'Ej. Acompañamiento terapéutico',
        taglineModal: 'Espacio terapéutico dedicado al acompañamiento emocional',
        description: 'Brindamos acompañamiento psicológico...',
        descriptionModal: 'Brindamos acompañamiento psicológico para adolescentes y adultos mediante terapia individual, terapia de pareja y atención emocional profesional'
      },

      medical: {
        tagline: 'Ej. Atención médica profesional',
        taglineModal: 'Atención médica profesional',
        description: 'Ofrecemos atención médica profesional...',
        descriptionModal: 'Ofrecemos atención médica profesional enfocada en la prevención, diagnóstico y seguimiento integral de la salud'
      },

      dentist: {
        tagline: 'Ej. Sonrisas saludables',
        taglineModal: 'Sonrisas saludables para toda la familia',
        description: 'Cuidamos la salud bucal de nuestros pacientes...',
        descriptionModal: 'Cuidamos la salud bucal de nuestros pacientes mediante tratamientos preventivos, restaurativos y estéticos'
      },

      nutrition: {
        tagline: 'Ej. Nutrición personalizada',
        taglineModal: 'Nutrición personalizada para tu bienestar',
        description: 'Ayudamos a mejorar tus hábitos alimenticios...',
        descriptionModal: 'Ayudamos a mejorar tus hábitos alimenticios mediante planes personalizados orientados a tu salud y objetivos'
      },

      therapy: {
        tagline: 'Ej. Bienestar emocional',
        taglineModal: 'Bienestar emocional y crecimiento personal',
        description: 'Ofrecemos espacios de acompañamiento...',
        descriptionModal: 'Ofrecemos espacios de acompañamiento terapéutico enfocados en el bienestar emocional y el desarrollo personal'
      },

      hair_salon: {
        tagline: 'Ej. Expertos en color y estilo',
        taglineModal: 'Expertos en color, corte y estilo',
        description: 'Transformamos tu imagen con servicios profesionales...',
        descriptionModal: 'Transformamos tu imagen con servicios profesionales de coloración, corte y estilismo adaptados a tu personalidad'
      },

      barbershop: {
        tagline: 'Ej. Cortes clásicos y modernos',
        taglineModal: 'Cortes clásicos y modernos',
        description: 'Especialistas en barbería tradicional...',
        descriptionModal: 'Especialistas en barbería tradicional y moderna para quienes buscan una imagen impecable'
      },

      nails: {
        tagline: 'Ej. Diseño profesional de uñas',
        taglineModal: 'Diseño y cuidado profesional de uñas',
        description: 'Ofrecemos servicios especializados de manicure...',
        descriptionModal: 'Ofrecemos servicios especializados de manicure, pedicure y diseño de uñas para cada ocasión'
      },

      spa: {
        tagline: 'Ej. Relajación y bienestar',
        taglineModal: 'Bienestar y relajación para tu día',
        description: 'Creamos experiencias de relajación y bienestar...',
        descriptionModal: 'Creamos experiencias de relajación y bienestar mediante tratamientos corporales y terapias especializadas'
      },

      fitness: {
        tagline: 'Ej. Entrena con propósito',
        taglineModal: 'Entrenamiento para alcanzar tus metas',
        description: 'Te ayudamos a mejorar tu condición física...',
        descriptionModal: 'Te ayudamos a mejorar tu condición física mediante programas de entrenamiento adaptados a tus objetivos'
      },

      education: {
        tagline: 'Ej. Aprendizaje de calidad',
        taglineModal: 'Aprendizaje para todas las etapas',
        description: 'Impulsamos el desarrollo académico y profesional...',
        descriptionModal: 'Impulsamos el desarrollo académico y profesional mediante programas educativos de calidad'
      },

      consulting: {
        tagline: 'Ej. Consultoría estratégica',
        taglineModal: 'Soluciones estratégicas para tu negocio',
        description: 'Ayudamos a organizaciones y profesionales a tomar decisiones...',
        descriptionModal: 'Ayudamos a organizaciones y profesionales a tomar mejores decisiones mediante asesoría especializada'
      },

      coaching: {
        tagline: 'Ej. Desarrolla tu potencial',
        taglineModal: 'Desarrolla tu máximo potencial',
        description: 'Acompañamos procesos de crecimiento personal...',
        descriptionModal: 'Acompañamos procesos de crecimiento personal y profesional enfocados en resultados concretos'
      },

      pet_grooming: {
        tagline: 'Ej. Cuidado para tu mascota',
        taglineModal: 'Cuidado y estética para tu mascota',
        description: 'Brindamos servicios de baño, estética y cuidado para mascotas...',
        descriptionModal: 'Brindamos servicios de baño, estética y cuidado integral para mascotas en un entorno seguro y profesional'
      },

      tattoo: {
        tagline: 'Ej. Arte que te representa',
        taglineModal: 'Arte permanente con estilo propio',
        description: 'Creamos diseños personalizados...',
        descriptionModal: 'Creamos diseños personalizados y experiencias seguras para quienes buscan expresar su identidad mediante el arte corporal'
      },

      beauty: {
        tagline: 'Ej. Belleza para cada ocasión',
        taglineModal: 'Belleza profesional para cada ocasión',
        description: 'Ofrecemos servicios para resaltar tu belleza...',
        descriptionModal: 'Ofrecemos servicios especializados para resaltar tu belleza y bienestar personal'
      },

      other: {
        tagline: 'Ej. Atención profesional',
        taglineModal: 'Servicios profesionales para nuestros clientes',
        description: 'Ofrecemos atención profesional...',
        descriptionModal: 'Ofrecemos atención profesional enfocada en brindar la mejor experiencia posible'
      }

    };

  get nicheTaglinePlaceholder(): string {
    return this.nicheContent[this.niche()]?.tagline
      ?? 'Ej. Atención profesional';
  }

  get nicheDescriptionPlaceholder(): string {
    return 'Ej. ' + (
      this.nicheContent[this.niche()]?.description
      ?? 'Describe los servicios, especialidades o experiencia de esta sucursal'
    );
  }

  get nicheTaglineExample(): string {
    return this.nicheContent[this.niche()]?.taglineModal
      ?? 'Atención profesional';
  }

  get nicheDescriptionExample(): string {
    return this.nicheContent[this.niche()]?.descriptionModal
      ?? 'Describe los servicios y especialidades de esta sucursal';
  }

  // Veeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeer
  // https://www.instagram.com/thesisirose/

  // Estado del componente (secciones para modal)
  expandedSections = {
    general: true,
    location: false,
    contact: false,
    social: false,
    visibility: false,
  };

  toggleSection(section: keyof typeof this.expandedSections): void {
    this.expandedSections[section] =
      !this.expandedSections[section];
  }

  toggleVisibility(controlName: string): void {
    const control = this.form.get(controlName);

    if (!control) {
      return;
    }

    control.setValue(!control.value);
    control.markAsDirty();
  }

  /*branches = [
    {
      id: 1,
      name: 'Sucursal Centro',
      address: 'Av. Reforma 123, CDMX',
      phone: '+52 55 1234 5678',
      email: 'centro@rombi.mx',
      manager: 'Ana López',
      active: true,
    }
  ];*/

  ngOnInit() {
    this.role = this.auth.getRole();
    this.branchesLimit = this.auth.getFeatureLimit('branches');
    this.authContext = this.auth.getAuthContext();

    if (this.authContext.plan == 'free' || this.authContext.plan == 'basic') {
      this.isFreePlan = true;
    }

    this.initForm();
    this.setupFormListeners();
    this.getBranches();

    console.log('el slug es: ', this.slug());
  }

  isProcessing(
    branchId: number,
    action: 'view' | 'edit' | 'status' | 'delete'
  ): boolean {

    return (
      this.processingBranchId === branchId &&
      this.processingAction === action
    );
  }

  startProcessing(
    branchId: number,
    action: 'view' | 'edit' | 'status' | 'delete'
  ): boolean {

    if (this.processingAction) {
      this.notify.error('Procesando sucursal');
      return false;
    }

    this.processingBranchId = branchId;
    this.processingAction = action;

    return true;
  }

  stopProcessing(): void {
    this.processingBranchId = null;
    this.processingAction = null;
  }

  isOverlayProcessing(branchId: number): boolean {

    return (
      this.processingBranchId === branchId &&
      (
        this.processingAction === 'delete'
        || this.processingAction === 'status'

      )
    );
  }

  toggleMenu(id: number) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  @HostListener('document:click')
  closeMenu() {
    this.activeMenu = null;
  }

  setupFormListeners() {
    // Generar lista de países para el select
    this.countries = Object.keys(CountryISO)
      .filter(k => isNaN(Number(k))) // filtrar los keys que son nombres
      .map(k => ({
        code: CountryISO[k as keyof typeof CountryISO], // <-- fuerza el tipo aquí
        name: k
      }));

    this.countries = this.countries.sort((a, b) => {
      if (a.code === CountryISO.Mexico) return -1;
      if (b.code === CountryISO.Mexico) return 1;
      return a.name.localeCompare(b.name);
    });

    // Solo mayúsculas en reference_prefix
    const control = this.form.get('reference_prefix');
    control?.valueChanges.subscribe(value => {
      if (!value) return;

      const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '');

      if (value !== clean) {
        control.setValue(clean, { emitEvent: false });
      }
    });


    // Solo minúsculas en slug
    const controlSlug = this.form.get('slug');
    controlSlug?.valueChanges.subscribe(value => {
      if (!value) return;

      const clean = value
        .toLowerCase()
        .replace(/\s+/g, '-')         // espacios → guiones
        .replace(/[^a-z0-9-]/g, '')   // limpia raros
        .replace(/--+/g, '-');        // evita dobles guiones

      if (value !== clean) {
        controlSlug.setValue(clean, { emitEvent: false });
      }
    });

    // Auto-generar slug desde nombre
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (!this.form.get('slug')?.dirty) {
        this.form.get('slug')?.setValue(this.generateSlug(name), { emitEvent: false });
      }
    });
  }

  initForm() {
    this.form = this.fb.group({
      // Información general
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      slug: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)]],
      reference_prefix: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(/^(?=.*[A-Z])[A-Z0-9]{2,5}$/)]],
      tagline: ['', [Validators.maxLength(120)]],
      description: ['', [Validators.minLength(20), Validators.maxLength(500)]],

      // Ubicación
      country: [CountryISO.Mexico, Validators.required],
      state: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(100)],
      zip_code: ['', Validators.maxLength(20)],
      address: ['', Validators.maxLength(255)],

      // Contacto
      phone: [null],
      whatsapp_phone: [null],
      email: ['', [Validators.email, Validators.maxLength(150)]],
      website: ['', [
        Validators.maxLength(255)
      ]], // Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\w\-.~:\/?#[\]@!$&'()*+,;=]*)?$/)

      // Presencia digital
      instagram: ['', [Validators.maxLength(255)]],
      facebook: ['', [Validators.maxLength(255)]],
      tiktok: ['', [Validators.maxLength(255)]],
      youtube: ['', [Validators.maxLength(255)]],
      x: ['', [Validators.maxLength(255)]],

      // Visibility
      show_phone: [true],
      show_whatsapp: [false],
      show_email: [true],
      show_address: [true],
      show_website: [true],
      show_social_links: [true],

    });
  }

  private getProfileLevel(
    percentage: number
  ): ProfileProgressLevel {

    if (percentage <= 30) {
      return {
        key: 'starter',
        label: 'Perfil inicial'
      };
    }

    if (percentage <= 60) {
      return {
        key: 'growing',
        label: 'Perfil en crecimiento'
      };
    }

    if (percentage <= 90) {
      return {
        key: 'professional',
        label: 'Perfil profesional'
      };
    }

    return {
      key: 'optimized',
      label: 'Perfil optimizado'
    };
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
      this.profileProgress.level.key
    ];
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
      this.profileProgress.level.key
    ];
  }

  calculateProfileProgress(): ProfileProgress {

    const values = this.form.getRawValue();

    const checks = {

      name: !!values.name,
      slug: !!values.slug,
      reference_prefix: !!values.reference_prefix,

      tagline: !!values.tagline,
      description: !!values.description,

      phone: !!values.phone,
      whatsapp_phone: !!values.whatsapp_phone,
      email: !!values.email,
      website: !!values.website,

      country: !!values.country,
      city: !!values.city,
      address: !!values.address,

      social_links:
        !!values.instagram ||
        !!values.facebook ||
        !!values.tiktok ||
        !!values.youtube ||
        !!values.x,

      logo_url: !!this.organization()?.logo_url
    };

    const labels: Record<string, string> = {

      name: 'Nombre',

      slug: 'Enlace público',

      reference_prefix:
        `Prefijo de ${this.uiTerms().appointments.pluralLower}`,

      tagline: 'Frase principal',

      description: 'Descripción',

      phone: 'Teléfono',

      whatsapp_phone: 'WhatsApp',

      email: 'Correo electrónico',

      website: 'Sitio web',

      country: 'País',

      city: 'Ciudad',

      address: 'Dirección',

      social_links: 'Redes sociales',

      logo_url: 'Logo de la organización'
    };

    const missing = Object.entries(checks)
      .filter(([_, completed]) => !completed)
      .map(([field]) => ({
        field,
        label: labels[field],

        isExternal:
          field === 'logo_url',

        route:
          field === 'logo_url'
            ? '/sistemas/citas/configuracion/perfil'
            : null

      }));

    const completed =
      Object.values(checks)
        .filter(Boolean)
        .length;

    const total =
      Object.keys(checks).length;

    const percentage =
      Math.round((completed / total) * 100);

    return {
      percentage,
      completed,
      total,
      level: this.getProfileLevel(percentage),
      missing
    };
  }

  goToMissingItem(item: ProfileProgressMissingField): void {

    if (!item.route) {
      return;
    }

    this.router.navigate([item.route]);
  }

  get profileProgress(): ProfileProgress {
    return this.calculateProfileProgress();
  }

  rebuildForm() {
    this.initForm();
    this.setupFormListeners();
  }

  // sucursal actual
  //currentBranch = signal<any>(null);

  //currentBranch = this.auth.getCurrentBranch()

  getBranches() {
    this.branchService.getBranches().subscribe({
      next: (res) => {

        this.loading = false;

        if (this.role == 'owner') {
          this.noAccess = false;
        }

        this.branches = res.data;

        console.log('dataBackend :', JSON.stringify(res, null, 2));

        // Saber si puede crear
        const totalOrgBranches = res.meta.organization_branches_count;

        if (this.branchesLimit === null) {
          this.canCreateBranches = true;
        } else {
          this.canCreateBranches = totalOrgBranches < this.branchesLimit;
        }

        // Saber si puede activar
        const activeCount = this.branches.filter(b => b.is_active).length;

        this.canActivateMore =
          this.branchesLimit === null || activeCount < this.branchesLimit;

        // Actualizar sidebar
        //this.auth.refreshAuthContext().subscribe();

      },
      error: (err) => {
        this.handleError(
          err,
          'Error al cargar sucursales'
        );
      }
    });
  }

  openCreate() {

    if (!this.canCreateBranches) {

      this.confirm.open(
        'Límite alcanzado',
        `Tu plan permite ${this.branchesLimit} sucursales.\n\n¿Quieres actualizar tu plan para agregar más?`,
        () => {
          this.goToPlans();
        },
        'Cancelar',
        'Ver planes'
      );

      return;
    }

    this.rebuildForm();

    this.editingBranch = null;
    this.showModal = true;
  }

  openEdit(branch: any) {

    if (!this.startProcessing(branch.id, 'edit')) {
      return;
    }

    // Simulación temporal - después consultar a backend
    setTimeout(() => {

      this.form.patchValue({
        name: branch.name ?? '',
        slug: branch.slug ?? '',
        reference_prefix: branch.reference_prefix ?? '',
        email: branch.email ?? '',
        phone: branch.phone ?? null,
        website: branch.website ?? '',

        country: branch.country ? branch.country.toLowerCase() as CountryISO : CountryISO.Mexico,
        state: branch.state ?? '',
        city: branch.city ?? '',
        zip_code: branch.zip_code ?? '',
        address: branch.address ?? '',
      });

      this.editingBranch = branch;
      this.showModal = true;

      this.stopProcessing();

    }, 2000); // 300 mariela

  }

  closeModal() {
    this.form.reset();
    this.showModal = false;

    this.submitted = false;
    this.saving = false;
    this.processingBranchId = null;
    this.editingBranch = null;
  }

  toggleBranchStatus(branch: any) {

    // SI QUIERE ACTIVAR
    if (!branch.is_active && !this.canActivateMore) {

      this.confirm.open(
        'Límite alcanzado',
        'Ya alcanzaste el límite de sucursales activas.\n\nActualiza tu plan para activar más.',
        () => this.goToPlans(),
        'Cancelar',
        'Ver planes'
      );

      return;
    }

    // Solo confirmar si se va a desactivar
    if (branch.is_active) {
      this.confirm.open(
        'Desactivar sucursal',
        `No podrás agendar ${this.uiTerms().appointments.pluralLower} en esta sucursal. ¿Deseas continuar?`,
        () => {

          if (!this.startProcessing(branch.id, 'status')) {
            return;
          }

          this.executeToggle(branch);
        },
        'Cancelar',
        'Desactivar'
      );
    } else {
      this.executeToggle(branch);
    }

  }

  executeToggle(branch: any) {

    const prev = branch.is_active;

    const payload = {
      is_active: !branch.is_active
    };

    this.branchService
      .updateBranch(branch.id, payload)
      .subscribe({
        next: (res) => {

          branch.is_active = res.data.is_active;


          const current = this.auth.getCurrentBranch();

          // Si se desactivo la sucursal
          if (current && current.branch_id === branch.id && !branch.is_active) {

            const activeBranches = this.branches.filter(b => b.is_active);

            if (activeBranches.length) {

              const fallback =
                activeBranches.find(b => b.is_primary) ?? activeBranches[0];

              this.auth.setCurrentBranch({
                branch_id: fallback.id,
                branch_name: fallback.name,
                branch_is_active: fallback.is_active,
                branch_primary: fallback.is_primary
              });

              // sync global (clave)
              this.auth.refreshAuthContext().subscribe({
                next: () => {
                  this.notify.info('Te movimos a una sucursal activa');
                  // opcional pero recomendable
                  this.router.navigate(['/sistemas/citas/dashboard']);
                },
                error: () => {
                  this.notify.error('Error al refrescar sesión');
                }
              });


            } else {
              this.auth.setCurrentBranch(null);
            }
          } else {
            this.auth.refreshAuthContext().subscribe(() => {
              this.getBranches();
            });
          }

          this.notify.success(
            res.data.is_active
              ? 'Sucursal activada'
              : 'Sucursal desactivada'
          );

          this.getBranches();

          this.stopProcessing();
        },

        error: (err) => {

          branch.is_active = prev; // rollback
          this.stopProcessing();

          if (err?.error?.message?.includes('límite')) {

            this.confirm.open(
              'Límite de plan',
              'Has alcanzado el límite de sucursales activas.\n\nActualiza tu plan para activar más.',
              () => this.goToPlans(),
              'Cancelar',
              'Ver planes'
            );

            return;
          }

          this.handleError(err, 'No se pudo actualizar la sucursal');
        }
      });

  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Revisa los campos.');
      return;
    }

    this.submitted = true;
    this.saving = true;

    const rawPhone = this.form.value.phone;

    const phone = rawPhone ? {
      e164Number: rawPhone.e164Number,
      internationalNumber: rawPhone.internationalNumber,
      nationalNumber: rawPhone.nationalNumber,
      countryCode: rawPhone.countryCode,
      dialCode: rawPhone.dialCode
    } : null;

    const formValue = this.form.value;

    const payload = {
      ...formValue,
      phone: phone,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone

      // rombi - FALTA ZONA HORARIA QUE EL USUARIO PUEDA DEFINIR
    };

    if (this.editingBranch == null) { // Nueva sucursal
      this.createBranch(payload);
    } else {
      this.updateBranch(payload);
    }
  }

  createBranch(payload: any) {
    this.branchService.createBranch(payload)
      .subscribe({
        next: (res) => {
          this.notify.success('Sucursal creada');

          this.auth.refreshAuthContext().subscribe(() => {
            this.getBranches();
          });

          this.getBranches();

          this.saving = false;
          this.closeModal();
        },
        error: (err) => {
          this.saving = false;

          this.handleError(err, 'Error al guardar');
        }

      });
  }


  updateBranch(payload: any) {

    if (this.processingBranchId || !this.editingBranch) return;

    this.processingBranchId = this.editingBranch.id;
    const branchID = this.processingBranchId;

    this.branchService
      .updateBranch(branchID, payload)
      .subscribe({
        next: (res) => {

          this.notify.success('Sucursal actualizada correctamente');

          this.auth.refreshAuthContext().subscribe(() => {
            this.getBranches();
          });

          this.getBranches();

          this.saving = false;
          this.closeModal();
        },

        error: (err) => {
          this.handleError(err, 'No se pudo actualizar la sucursal');
        }
      });
  }

  delete(branch: BranchModel) {

    const execute = () => {

      if (!this.startProcessing(branch.id, 'delete')) {
        return;
      }

      console.log('vamos a eliminar ', branch.id);

      //this.stopProcessing();
      this.branchService.deleteBranch(branch.id).subscribe({
        next: (res) => {

          this.notify.info("GFALTAN COSITAS");

          this.stopProcessing();

        },
        error: (err) => {

          this.stopProcessing();

          this.handleError(err, 'Error al eliminar la sucursal');
        }
      });

    };

    this.confirm.open(
      'Eliminar Sucursal',
      'Esta acción eliminará la sucursal. ¿Deseas continuar?',


      execute,
      'Cancelar',
      'Eliminar'
    );

  }


  openView(branch: BranchModel): void {

    if (!this.startProcessing(branch.id, 'view')) {
      return;
    }


    // Simulación temporal - después consultar a backend
    setTimeout(() => {

      // mostrar modal

      this.stopProcessing();

      this.notify.info('FALTA LA CONFIGURACION');

    }, 4000); // 300
  }


  getError(controlName: string): string | null {
    const control = this.form.get(controlName);
    if (!control || !control.errors) return null;

    if (!control.touched && !this.submitted) return null;

    if (control.errors['required']) return 'Obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['maxlength']) return 'Muy largo';
    if (control.errors['minlength']) return 'Muy corto';
    if (control.errors['pattern']) return 'Formato inválido';

    return 'Campo inválido';
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

  isLockedByPlan(branch: BranchModel): boolean {
    return branch.locked_by_plan;
  }

  generateSlug(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD') // quita acentos
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9]+/g, '-') // reemplaza todo por -
      .replace(/^-+|-+$/g, '') // quita guiones extremos
      .replace(/-{2,}/g, '-'); // evita dobles guiones
  }

  goToPlans() {
    this.router.navigate(['/account/subscriptions']);
  }

}


