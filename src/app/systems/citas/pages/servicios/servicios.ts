import { Component, OnInit, inject } from '@angular/core';
import {
  LucideAngularModule,
  Plus,
  Clock,
  DollarSign,
  MapPin,
  Video,
  Palette,
  HelpCircle
} from 'lucide-angular';
import { CitasServicesService } from '../../../../core/services/citas-services.service';
import { ServiceModel, ServiceMode } from '../../../../core/models/service.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  form!: FormGroup;
  loading = true;
  services: ServiceModel[] = [];
  error = false;

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

  initForm() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      duration_minutes: [30, Validators.required],
      price: [0, Validators.required],
      mode: ['online', Validators.required],
    });
  }

  loadServices() {
    this.loading = true;
    this.error = false;

    this.servicesApi.getAll().subscribe({
      next: (res) => {

        this.services = res.map((service: ServiceModel) => {
          const mainVariant = service.variants?.[0];

          return {
            ...service,
            duration_minutes: mainVariant?.duration_minutes,
            price: mainVariant?.price,
            mode: mainVariant?.mode,
          };
        });

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
      duration_minutes: 60,
      price: 0,
      mode: 'presential',
    });
    this.showModal = true;
  }

  openEdit(service: any) {
    this.editingService = service;
    this.form.patchValue({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: service.price,
      mode: service.mode,
    });

    this.showModal = true;
  }

  save() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const payload = {
      name: formValue.name,
      active: true,
      variants: [
        {
          name: 'Principal',
          duration_minutes: formValue.duration_minutes,
          price: formValue.price,
          max_capacity: 1,
          mode: formValue.mode,
          includes_material: false,
          active: true,
        }
      ]
    };

    if (this.editingService) {

      this.servicesApi.update(this.editingService.id, payload)
        .subscribe(() => {
          this.loadServices();
          this.closeModal();
          this.notify.success('Servicio actualizado correctamente');
        });

    } else {

      this.servicesApi.create(payload)
        .subscribe(() => {
          this.loadServices();
          this.closeModal();
          this.notify.success('Servicio creado correctamente');
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
