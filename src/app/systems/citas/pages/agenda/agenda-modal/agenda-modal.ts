import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import {
  LucideAngularModule,
  Calendar, X, Info, Lock, Sparkles
} from 'lucide-angular';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap
} from 'rxjs';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';


import { AuthService } from '../../../../../core/services/auth.service';
import { ClientService } from '../../../../../core/services/client.service';
import { ClientApi, ClientSelectItem, PetSelectItem } from '../../../../../core/models/client.model';

import { CitasServicesService } from '../../../../../core/services/citas-services.service';
import { CitasAgendaService } from '../../../../../core/services/citas-agenda.service';
import { ServiceVariantListItem } from '../../../../../core/models/service.model';

import { ProfessionalsService } from '../../../../../core/services/professionals.service';
import { StaffListItem } from '../../../../../core/models/staff.model';

import { AppointmentModel, CreateAppointmentDto } from '../../../../../core/models/appointment.model';

import { Notification } from '../../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';

@Component({
  selector: 'app-agenda-modal',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, NgxIntlTelInputModule],
  templateUrl: './agenda-modal.html',
  styleUrl: './agenda-modal.css',
})

/**
 * Para recurrencias poner límites aunque exita plan
 * Plan free: 0 recurrencias
 * Plan Basic: 24 recurrencias
 * Plan Pro: 100 recurrencias
 * Plan Premium: 500 recurrencias
 */

export class AgendaModal implements OnInit, OnChanges {

  readonly Calendar = Calendar;
  readonly X = X;
  //readonly HelpCircle = HelpCircle;
  readonly Info = Info;
  readonly Lock = Lock;
  readonly Sparkles = Sparkles;

  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);
  private servicesApi = inject(CitasServicesService);
  private staffService = inject(ProfessionalsService);
  private appointmentsService = inject(CitasAgendaService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private router = inject(Router);

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

  currentBranch = this.auth.getCurrentBranch();
  branchTimezone = this.currentBranch?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  isFreePlan = true;

  form!: FormGroup;
  saving = false;
  serverErrors: any = {};
  loading = true;
  isOccasionalClient = false;

  clients: ClientSelectItem[] = [];
  variants: ServiceVariantListItem[] = [];
  selectedVariant?: ServiceVariantListItem;
  staffMembers: StaffListItem[] = [];
  loadingStaff = false;

  //selectedClient?: ClientDetailApi;
  clientPets: PetSelectItem[] = [];
  availableSlots: string[] = [];

  searchingClients = false;
  clientSelected = false;

  showQuickClient = false;
  showQuickClientHelp = false;

  savingQuickClient = false;

  teamLimit: number | null = null;

  // Cita recurrente
  showRecurringModal = false;
  recurringEnabled = false;
  recurringSummary = '';

  recurringConfig = {
    frequency: 'weekly',
    interval: 1,
    endType: 'never',
    occurrences: null,
    endDate: null
  };

  showRecurringHelp = false;

  // Prioridades
  showAdditionalOptions = false;
  showRecurringInline = false;

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];
  SearchCountryField = SearchCountryField;


  ngOnInit() {
    this.teamLimit = this.auth.getFeatureLimit('team');
    this.showAdditionalOptions = this.shouldOpenAdditionalOptions();

    this.initForm();
    this.loadVariants();

    this.watchClientSearch();
    this.watchRecurringChanges();
    this.watchModeChanges();

    console.log('el timezone:', this.branchTimezone);
  }



  initForm() {
    this.form = this.fb.group({
      // Cliente
      client_search: [''],

      // Crear el cliente
      quick_client:
        this.fb.group({

          first_name: [''], // es requerido, lo validamos despues
          phone: [null],

          // this.isPetNiche ? Validators.required : []
          pet_name: [''], // es requerido, lo validamos despues
          pet_species: ['']

        }),

      // Cita recurrente  
      recurring: this.fb.group({
        enabled: [false],

        /*frequency: ['weekly', Validators.required],
        interval: [1, [Validators.required, Validators.min(1)]],
        end_type: ['never', Validators.required],*/

        frequency: ['weekly'],
        interval: [1],
        end_type: ['never'],

        occurrences: [null],
        end_date: [null]
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

      // Tipo de cita
      mode: ['presential'],  // 'online' | 'presential' | 'hybrid';

      // Online
      meeting_url: [null],
      meeting_provider: [null],

      // Extra
      notes: [null]

    });
  }

  get recurringForm() {
    return this.form.get('recurring') as FormGroup;
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

  clearQuickClientValidators() {

    const quickClient = this.form.get('quick_client') as FormGroup;

    quickClient
      .get('first_name')
      ?.clearValidators();

    quickClient
      .get('pet_name')
      ?.clearValidators();

    quickClient
      .get('first_name')
      ?.updateValueAndValidity();

    quickClient
      .get('pet_name')
      ?.updateValueAndValidity();

  }

  createQuickClient() {

    const quickClient =
      this.form.get('quick_client') as FormGroup;

    /*
    |--------------------------------------------------------------------------
    | Validators dinámicos
    |--------------------------------------------------------------------------
    */

    quickClient
      .get('first_name')
      ?.setValidators([
        Validators.required
      ]);

    if (this.isPetNiche) {

      quickClient
        .get('pet_name')
        ?.setValidators([
          Validators.required
        ]);

    }

    /*
    |--------------------------------------------------------------------------
    | Refrescar validaciones
    |--------------------------------------------------------------------------
    */

    quickClient
      .get('first_name')
      ?.updateValueAndValidity();

    quickClient
      .get('pet_name')
      ?.updateValueAndValidity();

    quickClient.markAllAsTouched();

    /*
    |--------------------------------------------------------------------------
    | Validar
    |--------------------------------------------------------------------------
    */

    if (quickClient.invalid) {

      this.notify.error(
        'Completa correctamente los campos requeridos'
      );

      return;

    }

    const data = this.form.value.quick_client;

    this.savingQuickClient = true;

    this.clientService
      .quickCreate(data)
      .subscribe({
        next: (client) => {

          this.showQuickClient = false;
          this.savingQuickClient = false;

          this.form.get('quick_client')?.reset();

          this.clearQuickClientValidators();

          this.selectClient(client);

          this.notify.success(
            this.uiTerms.clients.singular + ' creado'
          );

        },
        error: (err) => {

          this.savingQuickClient = false;

          const existingClient =
            err?.error?.existing_client;

          if (existingClient) {

            this.confirm.open(
              `${this.uiTerms.clients.singular} encontrado`,
              `El teléfono ya existe y pertenece a "${existingClient.full_name}".\n\n ¿Deseas usar este ${this.uiTerms.clients.singularLower}?`,
              () => {

                this.selectClient(existingClient);

                this.showQuickClient = false;

              },
              'Cancelar',
              `Usar ${this.uiTerms.clients.singularLower}`
            );

          } else {

            this.handleError(
              err,
              'Error al crear ' +
              this.uiTerms.clients.singular
            );

          }

        }

      });

  }

  saveRecurring() {

    const recurringGroup = this.form.get('recurring');

    if (!recurringGroup) {
      this.notify.error('Ocurrió un error con la configuración recurrente');
      return;
    }

    recurringGroup.markAllAsTouched();

    if (recurringGroup.invalid) {
      this.notify.error('Completa correctamente los campos requeridos');
      return;
    }

    const recurring = recurringGroup.value;

    this.recurringEnabled = true;

    const labels: any = {
      daily: 'todos los días',
      weekly: 'cada semana',
      monthly: 'cada mes'
    };

    this.recurringSummary = labels[recurring?.frequency];

    this.form.patchValue({
      recurring: {
        ...recurring,
        enabled: true
      }
    });

    this.showRecurringModal = false;

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

          this.showQuickClient = false;

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

  getClientLabel(client: ClientSelectItem): string {

    const fullName = client.full_name?.trim();

    const preferredName = client.preferred_name?.trim();

    if (preferredName && preferredName !== fullName) {
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
        next: (res) => {
          this.variants = res;

          console.log('dataVariants:', JSON.stringify(res, null, 2));

        },
        error: (err) => {
          this.handleError(err, 'Error al consultar variantes');
        }
      });
  }


  save() {

    this.form.markAllAsTouched();

    if (!this.form.value.client_id) {
      this.notify.error('Error al consultar ' + this.uiTerms.clients.singularLower);
      return;
    }

    //console.log('FORM ERROR STATUS');
    //console.log(this.form);

    /*Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);

      if (control?.invalid) {
        console.log('INVALID CONTROL:', key);
        console.log(control.errors);
        console.log(control.value);
      }
    });*/

    if (this.form.invalid) {
      this.notify.error('Completa correctamente los campos requeridos');
      return;
    }

    this.saving = true;

    const form = this.form.value;

    // michelle

    const payload: CreateAppointmentDto = {
      client_id: form.client_id,
      pet_id: form.pet_id,
      staff_member_id: form.staff_member_id,
      branch_service_variant_id: form.service_variant_id,
      notes: form.notes,
      mode: form.mode, // Verificar el modo

      meeting_url:
        form.mode !== 'presential'
          ? form.meeting_url
          : null,

      meeting_provider:
        form.meeting_url
          ? 'manual'
          : null,

      // LOCAL datetime (timezone branch)
      start_datetime_local: `${form.date} ${form.time}:00`,

      // timezone branch
      timezone: this.branchTimezone,

      recurring: form.recurring.enabled
        ? {
          frequency: form.recurring.frequency,
          interval: form.recurring.interval,
          end_type: form.recurring.end_type,
          occurrences: form.recurring.occurrences,
          end_date: form.recurring.end_date
        }
        : null
    };

    console.log('payload:', JSON.stringify(payload, null, 2));

    this.appointmentsService.create(payload).subscribe({
      next: () => {
        this.notify.success(this.uiTerms.appointments.singular + ' creada correctamente');
        this.saving = false;
        this.closed.emit(true);
      },
      error: (err) => {
        this.saving = false;
        this.handleError(err, 'Error al crear la' + this.uiTerms.appointments.singularLower);
      }
    });

  }


  shouldOpenAdditionalOptions(): boolean {

    const expandedNiches = [
      'psychology',
      'therapy',
      'wellness',
      'clinic',
      'medical',
      'dentist',
      'nutrition',
      'education',
      'consulting',
      'coaching'
    ];

    return expandedNiches.includes(this.niche);

  }

  closeModal() {
    this.closed.emit(false);
  }

  get isPetNiche(): boolean {
    return this.niche === 'pet_grooming';
  }

  // Helper para detectar online
  get isOnlineAppointment(): boolean {
    return this.form?.value?.mode === 'online';
  }

  get isHybridAppointment(): boolean {
    return this.selectedVariant?.mode === 'hybrid';
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


  // Calcular automáticamente end_datetime
  onVariantChange(event: any) {

    const variantId = +event.target.value;

    this.selectedVariant = this.variants.find(v => v.id === variantId);

    console.log('la variante: ', JSON.stringify(this.selectedVariant, null, 2));

    if (!this.selectedVariant) {
      this.notify.error(`Error en el ${this.uiTerms.services.singularLower}`);
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Configurar modo automáticamente
    |--------------------------------------------------------------------------
    */

    if (this.selectedVariant.mode === 'online') {
      this.form.patchValue({
        mode: 'online'
      });
    }

    if (this.selectedVariant.mode === 'presential') {
      this.form.patchValue({
        mode: 'presential',
        meeting_url: null
      });
    }

    if (this.selectedVariant.mode === 'hybrid') {
      this.form.patchValue({
        mode: 'presential'
      });
    }

    // limpiar estado anterior
    this.loadingStaff = true;
    this.staffMembers = [];

    this.form.patchValue({
      staff_member_id: null
    });

    this.staffService.getStaffByVariant(variantId)
      .subscribe({
        next: (staff) => {

          this.staffMembers = staff;
          this.loadingStaff = false;

          console.log('el staff:', staff);

          // limpiar selección anterior
          this.form.patchValue({ staff_member_id: null });

          // Asignamos si solo hay un miembro del staff con la variante del servicio
          if (staff.length === 1) {

            this.form.patchValue({
              staff_member_id: staff[0].id
            });

          }
        },
        error: (err) => {
          this.loadingStaff = false;
          this.handleError(err, 'Error al consultar staff');
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

  goToAgenda() {
    this.router.navigate(['/sistemas/citas/configuracion/agenda']);
  }

  getServiceArticle(capitalize = false): string {

    const feminineWords = [
      'terapia',
      'sesión',
      'consulta',
      'clase',
      'cita'
    ];

    const article = feminineWords.includes(
      this.uiTerms.services.singularLower
        .toLowerCase()
        .trim()
    )
      ? 'esta'
      : 'este';

    return capitalize
      ? article.charAt(0).toUpperCase() + article.slice(1)
      : article;

  }

  // Validators dinámicos para meeting_url
  watchModeChanges() {

    this.form
      .get('mode')
      ?.valueChanges
      .subscribe((mode) => {

        const meetingUrl = this.form.get('meeting_url');

        if (!meetingUrl) {
          return;
        }

        meetingUrl.clearValidators();

        if (mode === 'online') {
          meetingUrl.setValidators([
            Validators.pattern(/^https?:\/\/.+$/)
          ]);
        } else {
          meetingUrl.setValue(null);
        }

        meetingUrl.updateValueAndValidity();

      });

  }

  watchRecurringChanges() {

    const recurringGroup =
      this.form.get('recurring');

    recurringGroup
      ?.get('end_type')
      ?.valueChanges
      .subscribe((value) => {

        const occurrences =
          recurringGroup.get('occurrences');

        const endDate =
          recurringGroup.get('end_date');

        // limpiar validaciones
        occurrences?.clearValidators();
        endDate?.clearValidators();

        // resetear errores viejos
        occurrences?.updateValueAndValidity();
        endDate?.updateValueAndValidity();

        // occurrences
        if (value === 'occurrences') {

          occurrences?.setValidators([
            Validators.required,
            Validators.min(1)
          ]);

        }

        // end_date
        if (value === 'date') {

          endDate?.setValidators([
            Validators.required
          ]);

        }

        occurrences?.updateValueAndValidity();
        endDate?.updateValueAndValidity();

      });

  }

  goToPlans() {
    this.router.navigate(['/account/subscriptions']);
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

  getRecurringError(field: string): string | null {

    const control =
      this.form.get(`recurring.${field}`);

    if (
      control?.touched &&
      control?.invalid
    ) {

      if (control.errors?.['required']) {
        return 'Este campo es obligatorio';
      }

      if (control.errors?.['min']) {
        return 'Debe ser mayor a 0';
      }

    }

    return null;

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
