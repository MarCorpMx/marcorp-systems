import { Component, OnInit, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { CommonModule } from '@angular/common';
import {
  LucideAngularModule, HelpCircle, Image, ChevronUp, ChevronDown,
  Link, PhoneCall, FileText, MapPinned, Sparkles, Scissors, Hand,
  Brain, Stethoscope, Heart, Flower, Dumbbell, GraduationCap, Presentation, Target, PawPrint,
  PenTool, Circle, Apple, ShieldPlus
} from 'lucide-angular';


import { BusinessCatalogService } from '../../../../../core/services/business-catalog.service';
import { Notification } from '../../../../../services/notification.service';
import { OrganizationService } from '../../../../../core/services/organization.service';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  imports: [ReactiveFormsModule, NgxIntlTelInputModule, CommonModule, LucideAngularModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})

export class Perfil implements OnInit {

  readonly HelpCircle = HelpCircle;
  readonly Image = Image;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly Link = Link;
  readonly PhoneCall = PhoneCall;
  readonly FileText = FileText;
  readonly MapPinned = MapPinned;

  // business niches
  ICON_MAP: any = {
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

  private fb = inject(FormBuilder);
  private notify = inject(Notification);
  private organizationService = inject(OrganizationService);
  private auth = inject(AuthService);
  private businessCatalogService = inject(BusinessCatalogService);

  // Contexto de la organización
  organization = this.auth.organization$;

  niche = computed(() =>
    this.organization()?.business_niche ?? 'other'
  );

  nicheColor = computed(() =>
    this.businessCatalogService.getColor(this.niche())
  );

  // Catálogos
  niches = this.businessCatalogService.getNiches();

  // iconos
  sidebarNicheIcon = computed(() => {

    const iconName =
      this.businessCatalogService.getIcon(this.niche());

    const mapped =
      this.ICON_NAME_MAP[iconName] || 'Circle';

    return this.ICON_MAP[mapped];
  });

  // Estado del componente (secciones)
  expandedSections = {
    visualIdentity: true,
    reservations: false,
    contact: false,
    billing: false,
    location: false,
  };

  toggleSection(section: keyof typeof this.expandedSections): void {
    this.expandedSections[section] =
      !this.expandedSections[section];
  }

  form!: FormGroup;

  loading = true;
  saving = false;
  submitted = false;
  success = false;
  billingEnabled = false;
  locationEnabled = false;

  showSlugHelp = false;
  showReferencePrefixHelp = false;

  // Para logo
  logoPreview: string | null = null;
  selectedLogoFile: File | null = null;

  uploadingLogo = false;

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];

  timezones: string[] = [
    'UTC',
    'America/Mexico_City',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/Madrid',
    'Europe/London'
  ];

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

  ngOnInit(): void {
    this.initForm();

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

    this.loadData();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      slogan: ['', [Validators.minLength(2), Validators.maxLength(200)]],
      business_niche: ['', Validators.required],

      slug: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)]],
      reference_prefix: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10), Validators.pattern(/^(?=.*[A-Z])[A-Z0-9]{2,5}$/)]],

      email: ['', [Validators.email, Validators.maxLength(150)]],
      phone: [null],
      website: ['', [
        Validators.pattern(/^(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\w\-.~:\/?#[\]@!$&'()*+,;=]*)?$/)
      ]],

      // Dirección
      country: [CountryISO.Mexico, Validators.required],
      state: ['', Validators.maxLength(100)],
      city: ['', Validators.maxLength(100)],
      zip_code: ['', Validators.maxLength(20)],
      address: ['', Validators.maxLength(255)],

      // FACTURACIÓN
      /*legal_name: ['', Validators.maxLength(255)],
      tax_id: ['', Validators.maxLength(20)],
      tax_regime: ['', Validators.maxLength(10)],
      invoice_zip_code: ['', Validators.maxLength(10)],
      cfdi_email: ['', [Validators.email, Validators.maxLength(150)]],*/

      legal_name: [{ value: '', disabled: true }],
      tax_id: [{ value: '', disabled: true }],
      tax_regime: [{ value: '', disabled: true }],
      invoice_zip_code: [{ value: '', disabled: true }],
      cfdi_email: [{ value: '', disabled: true }],

    });
  }

  loadData() {
    this.organizationService.getOrganization().subscribe({
      next: (org) => {

        console.log('la orga:', JSON.stringify(org, null, 2));

        this.form.patchValue({
          name: org.name ?? '',
          slogan: org.slogan ?? '',
          business_niche: org.business_niche ?? '',
          slug: org.slug ?? '',
          reference_prefix: org.reference_prefix ?? '',

          email: org.email ?? '',
          phone: org.phone ?? null,
          website: org.website ?? '',

          country: org.country ? org.country.toLowerCase() as CountryISO : CountryISO.Mexico,
          state: org.state ?? '',
          city: org.city ?? '',
          zip_code: org.zip_code ?? '',
          address: org.address ?? '',

          // FACTURACIÓN
          legal_name: org.legal_name ?? '',
          tax_id: org.tax_id ?? '',
          tax_regime: org.tax_regime ?? '',
          invoice_zip_code: org.invoice_zip_code ?? '',
          cfdi_email: org.cfdi_email ?? '',
        });

        this.logoPreview = org.logo_url ?? null;

        this.loading = false;
      },
      error: () => {
        this.notify.error('No se pudo cargar la información.');
        this.loading = false;
      }
    });
  }

  onLogoSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.notify.error(
        'Solo se permiten imágenes PNG, JPG o WEBP'
      );

      return;
    }

    const maxSize = 2 * 1024 * 1024;

    if (file.size > maxSize) {

      this.notify.error(
        'La imagen no puede superar 2 MB'
      );

      return;
    }

    this.selectedLogoFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.logoPreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  uploadLogo(): void {

    if (!this.selectedLogoFile) {
      this.notify.error('Subiendo logo');
      return;
    }

    this.uploadingLogo = true;

    const formData = new FormData();

    formData.append(
      'logo',
      this.selectedLogoFile
    );

    this.organizationService
      .uploadLogo(formData)
      .subscribe({

        next: (res: any) => {

          this.logoPreview = res.logo_url;

          this.selectedLogoFile = null;

          this.uploadingLogo = false;

          this.notify.success(
            'Logo actualizado'
          );

          this.auth.refreshAuthContext().subscribe();
        },
        error: (err) => {
          this.uploadingLogo = false;

          this.handleError(err, 'No se pudo subir el logo');
        }
      });
  }

  save() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Revisa los campos.');
      return;
    }

    this.saving = true;

    const payload = {
      name: this.form.value.name,
      slogan: this.form.value.slogan,
      business_niche: this.form.value.business_niche,

      slug: this.form.value.slug,
      reference_prefix: this.form.value.reference_prefix,

      email: this.form.value.email,
      phone: this.form.value.phone,
      website: this.form.value.website,

      // Dirección
      country: this.form.value.country,
      state: this.form.value.state,
      city: this.form.value.city,
      zip_code: this.form.value.zip_code,
      address: this.form.value.address

      // rombito - FALTA ZONA HORARIA Y LOS CAMPOS PARA FACTURACION
    };

    this.organizationService.updateOrganization(payload).subscribe({
      next: (res: any) => {

        // sync inmediato
        if (res.organization) {
          localStorage.setItem('organization', JSON.stringify(res.organization));
        }

        // sync global (clave)
        this.auth.refreshAuthContext().subscribe({
          next: () => { },
          error: () => {
            this.notify.error('Error al refrescar sesión');
          }
        });

        this.saving = false;
        this.success = true;

        this.notify.success('Perfil del negocio actualizado');

        setTimeout(() => this.success = false, 3000);
      },
      error: (err) => {
        this.saving = false;

        this.handleError(err, 'No se pudo actualizar el perfil del negocio');
      }
    });
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