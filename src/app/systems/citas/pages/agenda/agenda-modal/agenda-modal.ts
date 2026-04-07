import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';

import { ClientService } from '../../../../../core/services/client.service';
import { ClientApi } from '../../../../../core/models/client.model';

import { CitasServicesService } from '../../../../../core/services/citas-services.service';
import { CitasAgendaService } from '../../../../../core/services/citas-agenda.service';
import { ServiceVariantListItem } from '../../../../../core/models/service.model';

import { ProfessionalsService } from '../../../../../core/services/professionals.service';
import { StaffListItem } from '../../../../../core/models/staff.model';

import { Notification } from '../../../../../services/notification.service';

@Component({
  selector: 'app-agenda-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agenda-modal.html',
  styleUrl: './agenda-modal.css',
})

export class AgendaModal implements OnInit, OnChanges {
  @Input() selectedDate!: string;
  @Input() show = false;
  @Output() closed = new EventEmitter<boolean>();

  form!: FormGroup;
  saving = false;
  serverErrors: any = {};
  loading = true;
  isOccasionalClient = false;

  clients: ClientApi[] = [];
  variants: ServiceVariantListItem[] = [];
  selectedVariant?: ServiceVariantListItem;
  staffMembers: StaffListItem[] = [];

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private servicesApi: CitasServicesService,
    private staffService: ProfessionalsService,
    private appointmentsService: CitasAgendaService,
    private notify: Notification
  ) { }

  ngOnInit() {
    this.loadClients();
    this.loadVariants();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && this.form) {
      this.form.patchValue({
        date: this.selectedDate
      });
    }
  }

  loadClients() {
    this.loading = true;

    this.clientService
      .getClientList()
      .subscribe({
        next: (response) => {
          this.clients = response;
        },
        error: () => this.loading = false
      });
  }

  loadVariants() {
    this.servicesApi.getVariantList()
      .subscribe({
        next: (data) => {
          this.variants = data;
          console.log(data);
        }
      });
  }

  initForm() {
    this.form = this.fb.group({
      client_id: [null, Validators.required],
      service_variant_id: [null, Validators.required],
      staff_member_id: [null, Validators.required],
      date: [this.selectedDate, Validators.required],
      time: [null, Validators.required],
      notes: [null]
    });
  }

  save() {
    if (this.form.invalid) return;

    this.saving = true;

    const form = this.form.value;

    const payload = {
      client_id: form.client_id,
      staff_member_id: form.staff_member_id,
      service_variant_id: form.service_variant_id,
      date: form.date,
      time: form.time,
      notes: form.notes
    };

    this.appointmentsService.create(payload).subscribe({
      next: () => {
        this.notify.success('Cita creada correctamente');
        this.saving = false;
        this.closed.emit(true);
      },
      error: (err) => {
        this.saving = false;

        this.notify.error('Ocurrió un error al crear la cita');

        if (err.status === 422) {
          this.serverErrors = err.error.errors;
        }
      }
    });
  }

  close() {
    this.closed.emit(false);
  }

  getError(field: string): string | null {
    if (this.serverErrors[field]) {
      return this.serverErrors[field][0];
    }

    const control = this.form.get(field);

    if (control?.touched && control?.invalid) {
      if (control.errors?.['required']) {
        return 'Este campo es obligatorio';
      }
    }

    return null;
  }


  // Calcular automáticamente end_datetime
  onVariantChange(event: any) {
    const variantId = +event.target.value;

    this.selectedVariant = this.variants.find(v => v.id === variantId);

    if (!this.selectedVariant) return;

    this.staffService.getStaffByVariant(variantId)
      .subscribe({
        next: (staff) => {
          this.staffMembers = staff;

          // limpiar selección anterior
          this.form.patchValue({ staff_member_id: null });
        }
      });

    const start = new Date(this.form.value.start_datetime);

    if (!start) return;

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + this.selectedVariant.duration);

    this.form.patchValue({
      end_datetime: end
    });
  }

  useOccasionalClient() {
    this.isOccasionalClient = true;
  }
}
