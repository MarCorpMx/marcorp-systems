import { Component, OnInit, inject } from '@angular/core';
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
import { CitasServicesService } from '../../../../core/services/citas-services.service';
import { ServiceModel, ServiceMode } from '../../../../core/models/service.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-servicios',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './servicios.html',
  styleUrl: './servicios.css',
})

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

  confirm = inject(ConfirmDialogService);
  constructor(
    private fb: FormBuilder,
    private notify: Notification,
    private servicesApi: CitasServicesService
  ) { }

  editingService: any | null = null;
  showModal = false;

  ngOnInit() {
    this.initForm();
    this.loadServices();
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
      variants: this.fb.array([])
    });
  }

  loadServices() {
    this.loading = true;
    this.error = false;

    this.servicesApi.getAll().subscribe({
      next: (res) => {
        this.services = res;
        /*this.services = res.map((service: ServiceModel) => {
          const mainVariant = service.variants?.[0];

          return {
            ...service,
            duration_minutes: mainVariant?.duration_minutes,
            price: mainVariant?.price,
            mode: mainVariant?.mode,
          };
        });*/

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
      description: ''
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
        .subscribe(() => {
          this.notify.success('Servicio actualizado correctamente');
          this.loadServices();
          this.closeModal();
        });
    } else {
      this.servicesApi.create(payload)
        .subscribe(() => {
          this.notify.success('Servicio creado correctamente');
          this.loadServices();
          this.closeModal();
        });
    }
  }

  delete(service: any) {
    this.confirm.open(
      'Eliminar servicio',
      '¿Seguro que deseas eliminar el servicio?',
      () => {
        this.servicesApi.delete(service.id)
          .subscribe(() => this.loadServices());
        this.notify.success('Servicio eliminado correctamente');
      },
      'Cancelar',
      'Eliminar'
    );
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

}
