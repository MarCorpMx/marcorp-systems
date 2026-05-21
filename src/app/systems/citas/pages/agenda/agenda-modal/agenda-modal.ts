import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  LucideAngularModule,
  Calendar, X, HelpCircle
} from 'lucide-angular';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap
} from 'rxjs';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';


import { ClientService } from '../../../../../core/services/client.service';
import { ClientApi, ClientSelectItem, PetSelectItem } from '../../../../../core/models/client.model';

import { CitasServicesService } from '../../../../../core/services/citas-services.service';
import { CitasAgendaService } from '../../../../../core/services/citas-agenda.service';
import { ServiceVariantListItem } from '../../../../../core/models/service.model';

import { ProfessionalsService } from '../../../../../core/services/professionals.service';
import { StaffListItem } from '../../../../../core/models/staff.model';

import { Notification } from '../../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-agenda-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, NgxIntlTelInputModule],
  templateUrl: './agenda-modal.html',
  styleUrl: './agenda-modal.css',
})

export class AgendaModal implements OnInit, OnChanges {

  readonly Calendar = Calendar;
  readonly X = X;
  readonly HelpCircle = HelpCircle;

  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private servicesApi = inject(CitasServicesService);
  private staffService = inject(ProfessionalsService);
  private appointmentsService = inject(CitasAgendaService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);

  @Input() niche!: string;
  @Input() selectedDate!: string;
  @Input() showModal = false;
  @Output() closed = new EventEmitter<boolean>();

  @Input() uiTerms!: {
    appointments: {
      singular: string;
      plural: string;
      singularLower: string;
      pluralLower: string;
    };

    team: {
      singular: string;
      plural: string;
      singularLower: string;
      pluralLower: string;
    };

    services: {
      singular: string;
      plural: string;
      singularLower: string;
      pluralLower: string;
    };

    clients: {
      singular: string;
      plural: string;
      singularLower: string;
      pluralLower: string;
    };
  };

  form!: FormGroup;
  saving = false;
  serverErrors: any = {};
  loading = true;
  isOccasionalClient = false;

  clients: ClientSelectItem[] = [];
  variants: ServiceVariantListItem[] = [];
  selectedVariant?: ServiceVariantListItem;
  staffMembers: StaffListItem[] = [];

  //selectedClient?: ClientDetailApi;
  clientPets: PetSelectItem[] = [];
  availableSlots: string[] = [];

  searchingClients = false;
  clientSelected = false;

  showQuickClient = false;
  showQuickClientHelp = false;

  savingQuickClient = false;

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];
  SearchCountryField = SearchCountryField;


  ngOnInit() {
    this.initForm();
    this.loadVariants();

    this.watchClientSearch();
  }

  initForm() {
    this.form = this.fb.group({
      // Cliente
      client_search: [''],

      // Crear el cliente
      quick_client:
        this.fb.group({

          first_name: ['', Validators.required],
          phone: [null],

          pet_name: ['', this.isPetNiche ? Validators.required : []],
          pet_species: ['']

        }),

      client_id: [null, Validators.required],

      // Solo pet grooming
      pet_id: [null],

      // Servicio
      service_variant_id: [null, Validators.required],
      // Profesional
      staff_member_id: [null, Validators.required],
      // Fecha/Hora
      date: [this.selectedDate, Validators.required],
      time: [null, Validators.required],
      // Futuro
      mode: ['in_person'],
      // Extra
      notes: [null]
    });
  }

  clearClient() {
    this.clientSelected = false;
    this.clients = [];
    this.clientPets = [];
    this.form.patchValue(
      {
        client_id: null,
        client_search: '',
        pet_id: null
      },
      {
        emitEvent: false
      }
    );

  }

  createQuickClient() {

    const quickClient = this.form.get('quick_client');

    quickClient?.markAllAsTouched();

    if (quickClient?.invalid) {
      return;
    }

    const data = this.form.value.quick_client;

    if (!data.first_name) {
      this.notify.error('Nombre requerido');
      return;
    }

    this.savingQuickClient = true;

    this.clientService
      .quickCreate(data)
      .subscribe({
        next: (client) => {

          this.showQuickClient = false;
          this.savingQuickClient = false;

          this.selectClient(client);

          this.notify.success(this.uiTerms.clients.singular + ' creado');

        },
        error: (err) => {
          this.savingQuickClient = false;

          const existingClient = err?.error?.existing_client;

          if (existingClient) {
            this.confirm.open(
              `${this.uiTerms.clients.singular} encontrado`,
              `El teléfono ya existe y pertenece a "${existingClient.full_name}".\n\n ¿Deseas usar este ${this.uiTerms.clients.singularLower}?`,
              () => {
                this.selectClient(
                  existingClient
                );

                this.showQuickClient = false;
              },
              'Cancelar',
              `Usar ${this.uiTerms.clients.singularLower}`
            );
          } else {
            console.log('no entra en el if');
            this.handleError(err, 'Error al crear ' + this.uiTerms.clients.singular);
          }


        }

      });

  }

  watchClientSearch() {

    this.form
      .get('client_search')
      ?.valueChanges
      .pipe(

        debounceTime(300),

        distinctUntilChanged(),

        switchMap(value => {

          const search =
            value?.trim();

          // limpiar solo si el usuario
          // está escribiendo manualmente

          this.clientSelected = false;

          this.form.patchValue(
            {
              client_id: null
            },
            {
              emitEvent: false
            }
          );

          this.clientPets = [];

          if (
            !search ||
            search.length < 3
          ) {

            this.clients = [];

            return [];
          }

          this.searchingClients = true;

          return this.clientService
            .getClientList(
              search
            );

        })

      )

      .subscribe({

        next: (clients) => {

          this.clients = clients;

          this.searchingClients = false;

        },

        error: (err) => {

          this.searchingClients = false;

          this.handleError(
            err,
            'Error consultando clientes'
          );

        }

      });

  }

  selectClient(client: ClientSelectItem) {

    this.clientSelected = true;

    this.form.patchValue({
      client_id: client.id,
      //client_search: client.display_name
      client_search: this.getClientLabel(client)
    },
      {
        emitEvent: false
      });

    this.clients = [];
    this.clientPets = [];

    this.form.patchValue(
      {
        pet_id: null
      },
      {
        emitEvent: false
      }
    );

    if (!this.isPetNiche) {
      return;
    }

    this.clientService
      .getClientPets(
        client.id
      )
      .subscribe({
        next: (pets) => {
          this.clientPets = pets;

          // si solo hay una mascota
          // seleccionarla automáticamente

          if (pets.length === 1) {
            this.form.patchValue({
              pet_id: pets[0].id
            });
          }

        },
        error: (err) => {
          this.handleError(err, 'Error cargando mascotas');
        }
      });

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDate'] && this.form) {
      this.form.patchValue({
        date: this.selectedDate
      });
    }
  }

  getClientLabel(
    client: ClientSelectItem
  ): string {

    const fullName = client.full_name?.trim();

    const preferredName = client.preferred_name?.trim();

    if (
      preferredName &&
      preferredName !== fullName
    ) {

      return `${fullName} (${preferredName})`;

    }

    return (
      fullName ||
      preferredName ||
      'Sin nombre'
    );

  }


  loadVariants() {
    this.servicesApi.getVariantList()
      .subscribe({
        next: (data) => {
          this.variants = data;
          //console.log(data);
        }
      });
  }


  save() {
    this.form.markAllAsTouched();

    if (!this.form.value.client_id) {
      return;
    }

    if (this.form.invalid) {
      return;
    }

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

  closeModal() {
    this.closed.emit(false);
  }

  get isPetNiche(): boolean {
    return this.niche === 'pet_grooming';
  }

  getClientName(client: ClientApi): string {

    return (
      client.preferred_name ||
      client.full_name ||
      [
        client.first_name,
        client.last_name
      ]
        .filter(Boolean)
        .join(' ') ||

      'Sin nombre'
    );

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

  getQuickClientError(field: string): string | null {

    const control = this.form.get(`quick_client.${field}`);

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

  handleError(err: any, fallbackMessage: string) {

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
