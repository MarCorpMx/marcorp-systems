import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  AbstractControl
} from '@angular/forms';

import {
  LucideAngularModule,
  Plus,
  Clock,
  DollarSign,
  MapPin,
  Video,
  Palette,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Briefcase,
  Pencil,
  PauseCircle,
  PlayCircle,
  Eye
} from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { CitasServicesService } from '../../../../core/services/citas-services.service';
import { ServiceModel, ServiceMode, ServiceVariantModel } from '../../../../core/models/service.model';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { CurrencyService } from '../../../../core/services/currency.service';
import { BusinessCatalogService } from '../../../../core/services/business-catalog.service';

/** rombito mejoras 
 * Qué pasa cuando se equivocan y create_all_branches=true, entonces pierden servicios sin querer
 * Verificar correctamente los límites
 * Crear el boton y lo necesario para "restaurar servicios/variantes"
 */

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LucideAngularModule
  ],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css'
})
export class Servicios implements OnInit {

  /* =====================================================
   ICONS
  ===================================================== */
  readonly Plus = Plus;
  readonly Clock = Clock;
  readonly DollarSign = DollarSign;
  readonly MapPin = MapPin;
  readonly Video = Video;
  readonly Palette = Palette;
  readonly HelpCircle = HelpCircle;
  readonly ChevronUp = ChevronUp;
  readonly ChevronDown = ChevronDown;
  readonly Briefcase = Briefcase;
  readonly Pencil = Pencil;
  readonly PauseCircle = PauseCircle;
  readonly PlayCircle = PlayCircle;
  readonly Eye = Eye;

  /* =====================================================
   INJECTIONS
  ===================================================== */
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private servicesApi = inject(CitasServicesService);
  private currency = inject(CurrencyService);
  public catalog = inject(BusinessCatalogService);
  private router = inject(Router);

  /* =====================================================
   STATE
  ===================================================== */
  private readonly draftKey = 'services_modal_draft';

  form!: FormGroup;

  loading = true;
  saving = false;
  submitted = false;
  error = false;

  services: ServiceModel[] = [];

  showModal = false;
  showViewModal = false;
  showVariantHelp = false;
  showFullDescription = false;

  editingService: ServiceModel | null = null;
  viewingService: ServiceModel | null = null;

  expandedIndex: number | null = 0;
  processingServiceId: number | null = null;
  processingVariantId: number | null = null;

  activeBranches: any[] = [];
  inactiveBranches: any[] = [];
  branchCount = 0;
  showAllBranchesOption = false;

  totalServicesCount: number = 0;
  activeServicesCount: number = 0;
  totalVariantsCountMap: Record<number, number> = {};
  activeVariantsCountMap: Record<number, number> = {};
  servicesLimit: number | null = null;
  canCreateServices = true;

  org = JSON.parse(localStorage.getItem('organization') || '{}');
  niche = this.org.business_niche;

  /* =====================================================
   LIFECYCLE
  ===================================================== */
  ngOnInit(): void {

    this.servicesLimit = this.auth.getFeatureLimit('services');

    console.log('el limite de los servicios es: ', this.servicesLimit);


    this.initForm();
    this.loadBranches();
    this.loadServices();
    this.listenDraftChanges();
  }

  /* =====================================================
   FORM INIT
  ===================================================== */
  private initForm(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      description: ['', Validators.maxLength(500)],
      create_all_branches: [true],
      variants: this.fb.array([])
    });
  }


  get variants(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  private createVariant(data?: any): FormGroup {
    return this.fb.group({
      _tmpId: [data?._tmpId ?? this.generateId()],
      id: [data?.id ?? null],

      name: [data?.name ?? '', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      description: [data?.description ?? '', Validators.maxLength(300)],
      duration_minutes: [data?.duration_minutes ?? 60, [Validators.required, Validators.min(1)]],
      price: [data?.price ?? 0, [Validators.required, Validators.min(0)]],
      max_capacity: [data?.max_capacity ?? 1, [Validators.required, Validators.min(1)]],
      mode: [data?.mode ?? 'presential', Validators.required],
      includes_material: [data?.includes_material ?? false],
      active: [data?.active ?? true]
    });
  }

  addVariant(data?: any): void {
    this.variants.push(this.createVariant(data));
    this.expandedIndex = this.variants.length - 1;
  }

  removeVariant(index: number): void {
    if (this.variants.length <= 1) {
      this.notify.warning('Debe existir al menos una modalidad');
      return;
    }

    this.variants.removeAt(index);

    if (this.expandedIndex === index) {
      this.expandedIndex = 0;
    }
  }

  private clearVariants(): void {
    while (this.variants.length) {
      this.variants.removeAt(0);
    }
  }

  updateCounters(): void {
    this.totalServicesCount = this.services.length;

    this.activeServicesCount = this.services.filter(s => s.active).length;

    this.totalVariantsCountMap = {};
    this.activeVariantsCountMap = {};

    this.services.forEach(service => {
      const variants = service.variants || [];

      this.totalVariantsCountMap[service.id] = variants.length;

      this.activeVariantsCountMap[service.id] =
        variants.filter(v => v.active).length;
    });
  }

  /* =====================================================
   BRANCHES
  ===================================================== */
  private loadBranches(): void {
    const branches = this.auth.getBranches();

    this.activeBranches = branches.filter(
      (b: any) => b.branch_is_active && !b.branch_locked_by_plan
    );

    this.inactiveBranches = branches.filter(
      (b: any) => !b.branch_is_active
    );

    this.branchCount = this.activeBranches.length;
    this.showAllBranchesOption = this.branchCount > 1;
  }

  /* =====================================================
   CRUD
  ===================================================== */
  loadServices(): void {
    this.loading = true;
    this.error = false;

    this.servicesApi.getAll().subscribe({
      next: (res) => {
        this.services = this.normalizeServices(res);

        this.sortServices();
        this.updateCounters();

        this.loading = false;

      },
      error: (err) => {
        console.warn(err);

        this.handleError(err, 'Ocurrió un error al cargar los servicios');
        this.loading = false;
        this.error = true;
      }
    });
  }

  save(): void {

    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.warning('Completa los campos requeridos');
      return;
    }

    this.saving = true;

    const payload = this.buildPayload();

    if (this.editingService) {
      this.updateService(payload);
    } else {
      this.createService(payload);
    }

  }

  private createService(payload: any): void {
    this.servicesApi.create(payload).subscribe({
      next: (res) => {

        const newService = this.normalizeServices([res.data])[0];

        this.services.unshift(newService);
        this.services = [...this.services];

        this.sortServices();
        this.updateCounters();

        this.afterSave();

        this.confirm.open(
          res.message || 'Servicio creado correctamente',
          'El servicio ya fue creado, pero aún no está asignado a ningún miembro del personal. \n Asigna quién puede realizar este servicio para comenzar a recibir reservas.',
          () => {
            this.goToAgenda();
          },
          'Más tarde',
          'Configurar'
        );

      },
      error: (err) => {
        this.saving = false;
        this.handleError(err, 'No se pudo crear el servicio');
      }
    });
  }

  private updateService(payload: any): void {

    if (!this.editingService) {
      this.notify.error('Error al seleccionar el servicio');
      return;
    }


    this.servicesApi.update(this.editingService.id, payload).subscribe({
      next: (res) => {

        const updated = this.normalizeServices([res.data])[0];

        const index = this.services.findIndex(
          s => s.id === updated.id
        );

        if (index !== -1) {
          this.services[index] = updated;
        }

        // sincronizar referencia actual
        this.editingService = updated;

        // fuerza refresco visual
        this.services = [...this.services];

        this.sortServices();
        this.updateCounters();

        this.afterSave();

        this.notify.success(res.message || 'Servicio actualizado');

      },
      error: (err) => {

        this.saving = false;

        this.handleError(
          err,
          'No se pudo actualizar el servicio'
        );
      }
    });
  }

  private afterSave(): void {
    this.saving = false;

    localStorage.removeItem(this.draftKey);

    this.forceClose();
  }

  /* =====================================================
   MODALS
  ===================================================== */
  openCreate_bkp(): void {
    try {
      //this.openCreate_bkp();
    } catch (e) {
      alert('ERROR EN MODAL: ' + (e as any)?.message);
      console.error(e);
    }
  }

  openCreate(): void {

    this.editingService = null;
    this.resetFormState();

    const draft = localStorage.getItem(this.draftKey);
    const suggestion = this.catalog.getSuggestion(this.niche);

    this.clearVariants();

    if (draft) {

      const data = JSON.parse(draft);

      this.form.patchValue({
        name: data.name ?? '',
        description: data.description ?? '',
        create_all_branches: data.create_all_branches ?? true
      });

      if (data.variants?.length) {
        data.variants.forEach((v: any) => this.addVariant(v));
      } else {
        this.addVariant();
      }

    } else if (suggestion) {

      this.form.reset({
        name: suggestion.name,
        description: '',
        create_all_branches: true
      });

      this.addVariant({
        name: this.catalog.getDefaultVariantName(this.niche),
        duration_minutes: suggestion.duration,
        price: suggestion.price,
        mode: suggestion.mode
      });

    } else {

      this.form.reset({
        name: '',
        description: '',
        create_all_branches: true
      });

      this.addVariant();

    }

    this.form.markAsPristine();
    this.expandedIndex = 0;

    this.showModal = true;
  }

  openEdit(service: ServiceModel): void {

    this.editingService = service;
    this.resetFormState();

    this.form.patchValue({
      name: service.name,
      description: service.description
    });

    this.clearVariants();

    service.variants?.forEach(v => this.addVariant(v));

    this.form.markAsPristine();
    this.expandedIndex = 0;
    this.showModal = true;
  }


  closeModal(): void {

    if (!this.form.dirty) {
      this.forceClose();
      return;
    }

    /* EDIT MODE */
    if (this.editingService) {
      this.confirm.open(
        'Cerrar edición',
        'Tienes cambios sin guardar.',
        () => this.forceClose(),
        'Cancelar',
        'Salir'
      );

      return;
    }

    /* CREATE MODE - 3 BOTONES */
    this.confirm.open(
      'Cerrar formulario',
      'Tienes cambios sin guardar. ¿Qué deseas hacer?',
      () => {
        this.saveDraft();
        this.forceClose(false);
      },
      'Cancelar',
      'Guardar borrador',
      {
        text: 'Descartar',
        action: () => this.forceClose(true)
      }
    );
  }

  private forceClose(clearDraft = true): void {
    this.showModal = false;
    this.editingService = null;

    this.form.reset();
    this.clearVariants();

    if (clearDraft) {
      localStorage.removeItem(this.draftKey);
    }

    this.resetFormState();
  }

  private saveDraft(): void {
    localStorage.setItem(
      this.draftKey,
      JSON.stringify(this.form.getRawValue())
    );
  }

  openView(service: ServiceModel): void {
    this.viewingService = service;
    this.showViewModal = true;
  }

  private resetFormState(): void {
    this.submitted = false;
    this.saving = false;

    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  private listenDraftChanges(): void {
    this.form.valueChanges.subscribe(() => {

      if (!this.showModal) return;
      if (this.editingService) return;

      localStorage.setItem(
        this.draftKey,
        JSON.stringify(this.form.getRawValue())
      );
    });
  }

  /* =====================================================
   UI ACTIONS
  ===================================================== */
  private buildPayload() {
    const raw = this.form.getRawValue();

    return {
      name: raw.name,
      description: raw.description,
      create_all_branches: raw.create_all_branches,

      variants: raw.variants.map((v: any) => ({
        id: v.id ?? null, // importante para edit
        name: v.name,
        description: v.description,
        duration_minutes: Number(v.duration_minutes),
        price: Number(v.price),
        max_capacity: Number(v.max_capacity),
        mode: v.mode,
        includes_material: v.includes_material,
        active: v.active
      }))
    };
  }


  private generateId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return 'tmp_' + Math.random().toString(36).substring(2) + Date.now();
    }
  }

  toggleVariant(index: number): void {
    this.expandedIndex =
      this.expandedIndex === index ? null : index;
  }

  toggleServiceStatus(service: ServiceModel): void {
    if (this.processingServiceId) {
      this.notify.error('Procesando servicio');
      return;
    }

    // Si es el último servicio
    if (service.active && this.activeServicesCount === 1) {
      this.notify.warning(
        'Debes tener al menos un servicio activo para recibir reservas.'
      );
      return;
    }

    // Solo confirmar si se va a desactivar
    if (service.active) {

      // 'Este servicio dejará de estar disponible únicamente en esta sucursal. Las demás sucursales no serán afectadas.',
      this.confirm.open(
        'Desactivar servicio',
        'Este servicio dejará de estar disponible para reservas y sus modalidades también se desactivarán.\n ¿Deseas continuar?',
        () => {
          this.executeToggle(service);
        },
        'Cancelar',
        'Desactivar'
      );
    } else {
      this.executeToggle(service);
    }
  }

  toggleVariantStatus(variant: any) {
    const v = variant.value;

    if (this.processingVariantId) {
      this.notify.error('Procesando modalidad');
      return;
    }

    if (!this.editingService) {
      this.notify.error('No existe servicio seleccionado');
      return;
    }

    const service = this.editingService;

    if (!service.active) {
      this.notify.error('El servicio no se encuentra activo');
      return;
    }

    const activeVariants = this.variants.controls.filter(ctrl => ctrl.value.active).length;

    if (v.active && activeVariants <= 1) {
      this.notify.warning(
        'Este servicio debe tener al menos una modalidad activa.'
      );
      return;
    }


    const execute = () => {

      this.processingVariantId = v.id;

      const prev = v.active;

      const payload = {
        active: !v.active
      };

      this.servicesApi
        .changeVariantStatus(v.id, payload)
        .subscribe({
          next: (res) => {

            variant.patchValue({
              active: res.data.active
            });

            // sincronizar con la lista real
            const service = this.editingService;
            if (service) {
              const vIndex = service.variants.findIndex(v => v.id === res.data.id);
              if (vIndex !== -1) {
                service.variants[vIndex].active = res.data.active;
              }
            }

            this.sortVariants(); // Ordenamos las variantes
            this.updateCounters();

            this.notify.success(
              res.data.active
                ? 'Modalidad activada'
                : 'Modalidad desactivada'
            );

            this.processingVariantId = null;
          },
          error: (err) => {

            variant.patchValue({ active: prev });

            this.processingVariantId = null;

            this.handleError(err, 'No se pudo actualizar la modalidad');
          }
        });
    };

    // Solo preguntar cuando la variante este activa
    if (v.active) {

      this.confirm.open(
        'Desactivar modalidad',
        'Esta modalidad dejará de estar disponible para reservas. \n ¿Deseas continuar?',
        execute,
        'Cancelar',
        'Desactivar'
      );

    } else {
      execute();
    }

  }

  executeToggle(service: any) {
    this.processingServiceId = service.id;

    const prev = service.active;

    const payload = {
      active: !service.active
    };

    this.servicesApi
      .changeStatus(service.id, payload)
      .subscribe({
        next: (res) => {

          service.active = res.data.active;

          // mover activos arriba
          this.sortServices();
          this.updateCounters();


          if (res.data.active) {
            this.notify.success(
              'Servicio activado.\nRevisa y activa sus modalidades si lo deseas.'
            );
          } else {
            this.notify.success(
              'Servicio desactivado junto con sus modalidades.'
            );
          }

          this.processingServiceId = null;
        },

        error: (err) => {

          service.active = prev; // rollback
          this.processingServiceId = null;

          /*if (err?.error?.message?.includes('límite')) {

            this.confirm.open(
              'Límite de plan',
              'Has alcanzado el límite de sucursales activas.\n\nActualiza tu plan para activar más.',
              () => this.goToPlans(),
              'Cancelar',
              'Ver planes'
            );

            return;
          }*/

          this.handleError(err, 'No se pudo actualizar el servicio');
        }
      });


  }

  /* =====================================================
   HELPERS
  ===================================================== */
  sortServices(): void {
    this.services.sort((a, b) => {
      if (a.active === b.active) return 0;
      return a.active ? -1 : 1;
    });
  }


  sortVariants(): void {
    const sorted = [...this.variants.controls].sort((a, b) => {
      if (a.value.active === b.value.active) return 0;
      return a.value.active ? -1 : 1;
    });

    this.clearVariants();

    sorted.forEach(ctrl => this.variants.push(ctrl));
  }

  getMinPrice(service: ServiceModel): number {
    if (!service.variants?.length) return 0;
    return Math.min(...service.variants.map(v => v.price));
  }

  getMinDuration(service: ServiceModel): number {
    if (!service.variants?.length) return 0;
    return Math.min(...service.variants.map(v => v.duration_minutes));
  }

  getModes(service: ServiceModel): ServiceMode[] {
    if (!service.variants?.length) return [];
    return [...new Set(service.variants.map(v => v.mode))];
  }

  getModeLabel(mode?: ServiceMode): string {
    switch (mode) {
      case 'online': return 'Online';
      case 'presential': return 'Presencial';
      case 'hybrid': return 'Híbrido';
      default: return 'No definido';
    }
  }

  getModeIcon(mode?: ServiceMode) {
    switch (mode) {
      case 'online': return this.Video;
      case 'presential': return this.MapPin;
      case 'hybrid': return this.Video;
      default: return this.HelpCircle;
    }
  }

  goToAgenda() {
    this.router.navigate(['/sistemas/citas/configuracion/agenda']);
  }

  /* =====================================================
   NORMALIZER
  ===================================================== */
  private normalizeServices(data: any[]): ServiceModel[] {
    return data.map(service => ({
      ...service,
      variants: (service.variants || []).map((variant: any) => ({
        ...variant,
        price: Number(variant.price),
        duration_minutes: Number(variant.duration_minutes),
        max_capacity: Number(variant.max_capacity)
      }))
    }));
  }

  formatMoney(value: any): string {
    return this.currency.format(value);
  }

  /* =====================================================
   VALIDATIONS
  ===================================================== */
  getError(field: string): string | null {
    return this.resolveError(this.form.get(field));
  }

  getVariantError(index: number, field: string): string | null {
    const group = this.variants.at(index) as FormGroup;
    return this.resolveError(group.get(field));
  }

  private resolveError(control: AbstractControl | null): string | null {

    if (!control?.errors) return null;

    if (!control.touched && !this.submitted) {
      return null;
    }

    if (control.errors['required']) return 'Obligatorio';
    if (control.errors['min']) return 'Valor inválido';
    if (control.errors['maxlength']) return 'Muy largo';
    if (control.errors['minlength']) return 'Muy corto';

    return 'Campo inválido';
  }

  // Variantes inteligentes
  get variantExamples() {
    return this.catalog.getVariantExamples(this.niche);
  }

  applyExample(example: { title: string, items: string[] }) {

    // si solo tienes una variante vacía → reemplazar
    const isSingleEmpty =
      this.variants.length === 1 &&
      !this.variants.at(0).value.name;

    if (isSingleEmpty) {
      this.clearVariants();
    }

    example.items.forEach(name => {
      this.addVariant({
        name,
        duration_minutes: this.getSuggestedDuration(),
        price: this.getSuggestedPrice(),
        mode: this.getSuggestedMode()
      });
    });

    this.notify.success('Modalidades agregadas');
    this.showVariantHelp = false;
  }

  getSuggestedDuration(): number {
    return this.catalog.getSuggestion(this.niche)?.duration ?? 60;
  }

  getSuggestedPrice(): number {
    return this.catalog.getSuggestion(this.niche)?.price ?? 0;
  }

  //getSuggestedMode(): ServiceMode {
  getSuggestedMode(): string {
    return this.catalog.getSuggestion(this.niche)?.mode ?? 'presential';
  }

  /* =====================================================
   ERROR HANDLER
  ===================================================== */
  handleError(err: any, fallbackMessage: string): void {

    if (err?.error?.message) {
      this.notify.error(err.error.message);
      return;
    }

    if (err?.error?.errors) {
      const firstError =
        Object.values(err.error.errors)[0] as string[];

      this.notify.error(firstError[0]);
      return;
    }

    this.notify.error(fallbackMessage);
  }
}