import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import {
  LucideAngularModule,
  Plus,
  Clock,
  DollarSign,
  MapPin,
  Video,
  Palette,
  HelpCircle,
  ChevronUp, ChevronDown, Briefcase
} from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { CitasServicesService } from '../../../../core/services/citas-services.service';
import { ServiceModel, ServiceMode } from '../../../../core/models/service.model';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})

/*
|------------------------------------------------------------------
| rombi - pendientes
| - Hacer que se note que una variante o el servicio esta desactivado
|------------------------------------------------------------------
*/

/*
Free = 1 variante por servicio
Basic = 3 variantes
Pro = ilimitadas
*/

/*
Mayo
“Ahora puedes personalizar precios por sucursal”
Junio
“Duración distinta por sucursal”
Julio
“Ordena catálogo por sucursal”
Agosto
“Disponibilidad específica por sucursal”
Parece evolución constante.

*/

export class Servicios implements OnInit {
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

  form!: FormGroup;
  loading = true;
  services: ServiceModel[] = [];
  error = false;
  expandedIndex: number | null = 0;

  activeBranches: any[] = [];
  inactiveBranches: any[] = [];
  branchCount = 0;
  showAllBranchesOption = false;

  showVariantHelp = false;

  private auth = inject(AuthService);
  private confirm = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);
  private notify = inject(Notification);
  private servicesApi = inject(CitasServicesService);


  editingService: any | null = null;
  showModal = false;

  ngOnInit() {
    this.loadBranches();
    this.initForm();
    this.loadServices();
  }

  private loadBranches() {

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

  toggleVariant(index: number) {
    this.expandedIndex =
      this.expandedIndex === index ? null : index;
  }

  get variants(): FormArray {
    return this.form.get('variants') as FormArray;
  }

  addVariant(data?: any) {
    this.variants.push(this.fb.group({
      id: [data?.id ?? null],
      name: [data?.name ?? 'Sesión individual', Validators.required],
      description: [data?.description ?? ''],
      duration_minutes: [data?.duration_minutes ?? 60, Validators.required],
      price: [data?.price ?? 0, Validators.required],
      max_capacity: [data?.max_capacity ?? 1, Validators.required],
      mode: [data?.mode ?? 'presential', Validators.required],
      includes_material: [data?.includes_material ?? false],
      active: [data?.active ?? true],
    }));
  }

  private resetVariants(): void {
    while (this.variants.length !== 0) {
      this.variants.removeAt(0);
    }
  }

  removeVariant(index: number) {
    this.variants.removeAt(index);
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


  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      create_all_branches: [true],
      variants: this.fb.array([])
    });
  }


  loadServices() {
    this.loading = true;
    this.error = false;

    this.servicesApi.getAll().subscribe({
      next: (res) => {

        this.services = this.normalizeServices(res);

        console.log('dataBackendServices :', JSON.stringify(res, null, 2));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }

  openCreate() {
    this.editingService = null;

    this.form.reset({
      name: '',
      description: '',
      create_all_branches: true
    });

    this.resetVariants();
    this.addVariant(); // solo UNA

    this.expandedIndex = 0;
    this.showModal = true;
  }

  openEdit(service: ServiceModel) {
    this.editingService = service;

    this.form.patchValue({
      name: service.name,
      description: service.description
    });

    this.resetVariants();

    service.variants?.forEach(v => {
      this.addVariant(v);
    });

    this.expandedIndex = 0;
    this.showModal = true;
  }

  save() {
    if (this.form.invalid) return;

    const payload = {
      ...this.form.value,
      active: true
    };

    if (this.editingService) {
      this.servicesApi.update(this.editingService.id, payload)
        .subscribe({
          next: (res) => {
            this.notify.success('Servicio actualizado correctamente');
            this.loadServices();
            this.closeModal();
          },
          error: (err) => {
            this.handleError(err, 'No se pudo actualizar la sucursal');
          }
        });
    } else {
      this.servicesApi.create(payload)
        .subscribe({
          next: (res) => {

            this.notify.success('Servicio creado correctamente');

            /*
            ¿Deseas asignarlo ahora?
            [Ahora no] [Configurar]
            */

            /*
  
            rombi - mejora
  Ahora selecciona:
  • En qué sucursal se ofrece
  • Qué profesionales lo atienden
  
  Boton: Configurar disponibilidad
            */
            this.loadServices();
            this.closeModal();
          },

          error: (err) => {
            this.handleError(err, 'No se pudo actualizar la sucursal');
          }
        });

    }
  }


  closeModal() {
    this.showModal = false;
    this.form.reset();
    this.resetVariants();
  }

  getModeLabel(mode?: ServiceMode) {
    if (!mode) return 'No definido';

    switch (mode) {
      case 'online':
        return 'Online';
      case 'presential':
        return 'Presencial';
      case 'hybrid':
        return 'Híbrido';
    }
  }

  getModeIcon(mode?: ServiceMode) {
    if (!mode) return this.HelpCircle; // icono fallback

    switch (mode) {
      case 'online':
        return this.Video;
      case 'presential':
        return this.MapPin;
      case 'hybrid':
        return this.Video; // o uno combinado si quieres
    }
  }

  private normalizeServices(data: any[]): ServiceModel[] {
    return data.map(service => ({
      ...service,

      variants: service.variants.map((variant: any) => {

        const branch = variant.branch_variants?.[0];

        return {
          ...variant,

          name: branch?.name ?? variant.name,
          description: branch?.description ?? variant.description,
          duration_minutes: branch?.duration_minutes ?? variant.duration_minutes,
          price: Number(branch?.price ?? variant.price),
          max_capacity: branch?.max_capacity ?? variant.max_capacity,
          mode: branch?.mode ?? variant.mode,
          includes_material:
            branch?.includes_material ?? variant.includes_material,

          active: branch?.active ?? variant.active
        };
      })
    }));
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
