import { Component, OnInit, HostListener, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormsModule, FormArray } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import {
  LucideAngularModule,
  UserCheck,
  UserX,
  Tag,
  Calendar,
  FileText,
  MoreVertical,
  Search, X, UserRound, Eye, Pencil, PauseCircle, PlayCircle, Lock, Unlock, Trash2, HelpCircle, Phone, Mail,
  MessageCircle, SearchX
} from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { BusinessCatalogService } from '../../../../core/services/business-catalog.service';
import { Notification } from '../../../../services/notification.service';
import { ClientService } from '../../../../core/services/client.service';
import { ClientApi, ClientDetailApi, ClientPayload, PhoneApi } from '../../../../core/models/client.model';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { AppDatePipe } from '../../../../shared/pipes/app-date-pipe';


@Component({
  selector: 'app-clientes',
  imports: [CommonModule, FormsModule, LucideAngularModule, RouterLink,
    ReactiveFormsModule, NgxIntlTelInputModule, AppDatePipe],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

/** 
 * rombito - mejoras
 * Cuando se bloquea, corregir el diseño
 * Controlar los errores de todos los campos
 * Compactar/descompactar las mascotas
 * Agregar más campos a las mascotas para tener un mejor historial de las mascotas
 * CAMBIAR EL MODAL "VER" POR cliente-detalle
 * 
*/

export class Clientes implements OnInit {
  readonly UserCheck = UserCheck;
  readonly UserX = UserX;
  readonly Tag = Tag;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly MoreVertical = MoreVertical;
  readonly Search = Search;
  readonly X = X;
  readonly UserRound = UserRound;
  readonly Eye = Eye;
  readonly Pencil = Pencil;
  readonly PauseCircle = PauseCircle;
  readonly PlayCircle = PlayCircle;
  readonly Lock = Lock;
  readonly Unlock = Unlock;
  readonly Trash2 = Trash2;
  readonly HelpCircle = HelpCircle;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly MessageCircle = MessageCircle;
  readonly SearchX = SearchX;

  private auth = inject(AuthService);
  public businessCatalogService = inject(BusinessCatalogService);
  confirm = inject(ConfirmDialogService);
  private clientService = inject(ClientService);
  private fb = inject(FormBuilder);
  private notify = inject(Notification);

  organization = this.auth.organization$;

  niche = computed(() =>
    this.organization()?.business_niche ?? 'other'
  );

  isPetNiche = computed(() =>
    this.niche() === 'pet_grooming'
  );

  emailPlaceholder = computed(() =>
    this.isPetNiche()
      ? 'Ej. dueño@email.com'
      : 'Ej. cliente@email.com'
  );

  form!: FormGroup;
  loading = true;
  submitted = false;
  saving = false;
  success = false;

  activeMenu: number | null = null;

  searchTerm = ''; // Buscador
  private searchTimeout: any; // Buscador

  showModal = false;
  showClientActionsHelp = false;
  showAdditionalInfo = false;
  showPetSection = false;

  //showPreferencesSection = false;
  //showInternalSection = false;

  showBlockModal = false;
  blockingClient: ClientApi | null = null;
  blockReason = '';

  // Modal "ver"
  showViewModal = false;
  viewingClient: ClientDetailApi | null = null;
  showFullNotes = false;
  loadingViewClientId: number | null = null;

  processingClientId: number | null = null;
  processingBlockId: number | null = null;
  loadingClientDetailId: number | null = null;
  processingDeleteId: number | null = null;

  clients: ClientApi[] = [];
  editingClient: ClientDetailApi | null = null;
  currentPage = 1; // Paginador
  total = 0; // Paginador
  lastPage = 1; // Paginador
  perPage = 12; // Paginador, solo informativo (el número de datos viene del backend)

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];
  SearchCountryField = SearchCountryField;

  // Variables para texto 
  /*clientLabel = computed(() =>
    this.businessCatalogService.getTerm(
      this.niche(),
      'clients',
      'singular',
      true
    )
  );

  clientsLabel = computed(() =>
    this.businessCatalogService.getTerm(
      this.niche(),
      'clients',
      'plural',
      true
    )
  );

  clientLabelLower = computed(() =>
    this.businessCatalogService.getTerm(
      this.niche(),
      'clients',
      'singular'
    )
  );

  clientsLabelLower = computed(() =>
    this.businessCatalogService.getTerm(
      this.niche(),
      'clients',
      'plural'
    )
  );*/

//https://www.instagram.com/parultiwari158/

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
    this.initForm();
    this.loadClients();
  }

  initForm() {
    this.form = this.fb.group({

      /*
      |--------------------------------------------------------------------------
      | Básico
      |--------------------------------------------------------------------------
      */
      first_name: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      last_name: ['', [
        Validators.minLength(2),
        Validators.maxLength(100)
      ]],
      preferred_name: ['', [
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.email,
        Validators.maxLength(150)
      ]],
      phone: [null],

      /*
      |--------------------------------------------------------------------------
      | Personal
      |--------------------------------------------------------------------------
      */
      birth_date: [''],
      gender: [''],
      preferred_language: ['es'],
      timezone: [''],

      /*
      |--------------------------------------------------------------------------
      | CRM
      |--------------------------------------------------------------------------
      */
      source: ['manual'],
      tags: [[]],
      notes: ['', [
        Validators.maxLength(3000)
      ]],

      /*
      |--------------------------------------------------------------------------
      | Estado
      |--------------------------------------------------------------------------
      */
      is_active: [true],

      /*
      |--------------------------------------------------------------------------
      | Mascota (pet grooming)
      |--------------------------------------------------------------------------
      */
      /*pet_name: [''],
      pet_species: [''],
      pet_breed: [''],
      pet_gender: ['unknown'],
      pet_weight: [null],
      pet_weight_unit: ['kg'],
      pet_color: [''],
      pet_birth_date: [''],
      pet_allergies: [''],
      pet_medical_notes: ['']*/

      pets: this.fb.array([])

    });
  }

  get pets() {
    return this.form.get('pets') as FormArray;
  }

  createPetForm(data?: any): FormGroup {
    return this.fb.group({

      _tmpId: [data?._tmpId ?? this.generateId()],
      id: [data?.id ?? null],

      name: [data?.name ?? '', [Validators.required]],
      species: [data?.species ?? ''],
      breed: [data?.breed ?? ''],
      gender: [data?.gender ?? 'unknown'],
      weight: [data?.weight ?? null],
      weight_unit: [data?.weight_unit ?? 'kg'],
      color: [data?.color ?? ''],
      birth_date: [data?.birth_date ?? ''],
      allergies: [data?.allergies ?? ''],
      medical_notes: [data?.medical_notes ?? '']
    });
  }

  addPet(data?: any) {

    this.pets.push(
      this.createPetForm(data)
    );

  }

  removePet(index: number) {

    this.pets.removeAt(index);

  }


  loadClients(page: number = 1) {
    this.loading = true;

    this.clientService
      .getClients(page, this.searchTerm) // enviamos search
      .subscribe({
        next: (res) => {

          this.clients = res.data;
          this.currentPage = res.current_page;
          this.lastPage = res.last_page;
          this.perPage = res.per_page;
          this.total = res.total;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;

          this.handleError(err, 'Error al consultar los datos');
        }
      });
  }

  onSearch(term: string) {
    this.searchTerm = term;

    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.loadClients(1); // siempre vuelve a página 1
    }, 400);
  }

  clearSearch() {
    this.searchTerm = '';
    this.loadClients(1);
  }


  goToPage(page: number) {
    if (page < 1 || page > this.lastPage) return;

    this.loadClients(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get pages(): number[] {
    const total = this.lastPage;
    const current = this.currentPage;
    const maxButtons = 5;

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    let start = current - 2;
    let end = current + 2;

    if (start < 1) {
      start = 1;
      end = maxButtons;
    }

    if (end > total) {
      end = total;
      start = total - (maxButtons - 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  toggleMenu(id: number) {
    this.activeMenu = this.activeMenu === id ? null : id;
  }

  @HostListener('document:click')
  closeMenu() {
    this.activeMenu = null;
  }

  openView(client: ClientApi): void {

    if (this.loadingViewClientId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }

    this.loadingViewClientId = client.id;

    this.clientService
      .getClient(client.id)
      .subscribe({

        next: (res) => {

          this.viewingClient = res.data;

          this.loadingViewClientId = null;

          this.showViewModal = true;
        },

        error: (err) => {

          this.loadingViewClientId = null;

          this.handleError(
            err,
            'Error al cargar información'
          );
        }

      });

  }

  toggleClientStatus(client: ClientApi): void {

    if (this.processingClientId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }

    const execute = () => {

      this.processingClientId = client.id;

      const prev = client.is_active;

      const payload = {
        active: !client.is_active
      };

      this.clientService
        .changeStatus(client.id, payload)
        .subscribe({
          next: (res) => {

            client.is_active = res.data.is_active;

            this.sortClients();

            this.notify.success(
              res.data.is_active
                ? this.uiTerms().clients.singular + ' activado correctamente'
                : this.uiTerms().clients.singular + ' desactivado correctamente'
            );

            this.processingClientId = null;
          },
          error: (err) => {
            client.is_active = prev;

            this.processingClientId = null;

            this.handleError(err, 'Ocurrió un error al actualizar');

          }
        });
    };

    // Solo confirmar si se va a desactivar
    if (client.is_active) {
      this.confirm.open(
        'Desactivar ' + this.uiTerms().clients.singularLower,
        'Este ' + this.uiTerms().clients.singularLower + ' dejará de aparecer en nuevas reservas y listas activas. \nSu historial, citas y datos permanecerán guardados.\n\n¿Deseas continuar?',
        execute,
        'Cancelar',
        'Desactivar'
      );
    } else {
      execute();
    }

  }

  handleBlockAction(client: ClientApi) {

    /*
    |----------------------------------------------------------
    | Si ya está bloqueado → desbloquear
    |----------------------------------------------------------
    */
    if (client.is_blocked) {

      this.confirm.open(
        'Desbloquear ' + this.uiTerms().clients.singularLower,
        'Este ' + this.uiTerms().clients.singularLower + ' volverá a aparecer en reservas y procesos activos.\n\n¿Deseas continuar?',
        () => this.executeBlock(client, false),
        'Cancelar',
        'Desbloquear'
      );

      return;
    }

    /*
    |----------------------------------------------------------
    | Si no está bloqueado → abrir modal
    |----------------------------------------------------------
    */
    this.blockingClient = client;

    this.blockReason = '';

    this.showBlockModal = true;
  }

  closeBlockModal() {

    if (this.processingBlockId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }

    this.showBlockModal = false;
    this.blockingClient = null;
    this.blockReason = '';
  }

  confirmBlock() {

    if (!this.blockReason.trim()) {
      this.notify.error('Escribe un motivo del bloqueo');
      return;
    }

    if (!this.blockingClient || this.processingBlockId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }

    this.executeBlock(
      this.blockingClient,
      true,
      this.blockReason
    );

  }

  executeBlock(
    client: ClientApi,
    blocked: boolean,
    reason: string | null = null
  ) {

    this.processingBlockId = client.id;

    this.clientService
      .changeBlockStatus(
        client.id,
        {
          blocked,
          reason
        }
      )
      .subscribe({

        next: (res) => {

          client.is_blocked = res.data.is_blocked;
          client.blocked_reason = res.data.blocked_reason;

          // si bloqueas, mejor desactivar automáticamente
          if (blocked) {
            client.is_active = false;
          }

          this.sortClients();

          this.notify.success(
            blocked
              ? this.uiTerms().clients.singular + ' bloqueado'
              : this.uiTerms().clients.singular + ' desbloqueado'
          );

          this.processingBlockId = null;

          // limpiar modal
          this.closeBlockModal();
        },
        error: (err) => {
          this.processingBlockId = null;

          this.handleError(
            err,
            'Error al actualizar'
          );
        }
      });

  }

  openCreate() {

    this.pets.clear();

    if (this.isPetNiche()) {
      this.addPet();
    }

    this.editingClient = null;

    this.showAdditionalInfo = false;
    //this.showPreferencesSection = false;
    //this.showInternalSection = false;
    this.showPetSection = false;

    this.submitted = false;

    this.form.reset({
      preferred_language: 'es',
      source: 'manual',
      gender: '',
      is_active: true
    });

    this.showModal = true;
  }

  openEdit(client: ClientApi) {

    if (this.loadingClientDetailId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }


    this.loadingClientDetailId = client.id;

    this.clientService
      .getClient(client.id)
      .subscribe({

        next: (res) => {

          const detail = res.data;

          this.editingClient = detail;

          this.showAdditionalInfo = true;

          this.showPetSection = (detail.pets?.length ?? 0) > 0;

          this.pets.clear();

          detail.pets?.forEach(pet => {

            this.addPet({
              id: pet.id,
              name: pet.name,
              species: pet.species,
              breed: pet.breed,
              gender: pet.gender,
              weight: pet.weight,
              weight_unit: pet.weight_unit,
              color: pet.color,
              birth_date: pet.birth_date,
              allergies: pet.allergies,
              medical_notes: pet.medical_notes
            });

          });

          this.form.patchValue({
            first_name: detail.first_name ?? '',
            last_name: detail.last_name ?? '',
            preferred_name: detail.preferred_name ?? '',
            email: detail.email ?? '',
            phone: detail.phone ?? null,
            birth_date: detail.birth_date?.split('T')[0] ?? '',
            gender: detail.gender ?? '',
            preferred_language: detail.preferred_language ?? 'es',
            timezone: detail.timezone ?? '',
            source: detail.source ?? 'manual',
            tags: detail.tags ?? [],
            notes: detail.notes ?? '',
            is_active: detail.is_active ?? true
          });

          this.loadingClientDetailId = null;

          this.showModal = true;

        },

        error: (err) => {
          this.loadingClientDetailId = null;

          this.handleError(err, 'Error al cargar información');
        }

      });

  }

  closeModal() {

    this.showModal = false;

    this.submitted = false;

    this.form.reset();

    this.showAdditionalInfo = false;
    //this.showPreferencesSection = false;
    //this.showInternalSection = false;
    this.showPetSection = false;
  }

  save() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Revisa los campos.');
      return;
    }

    this.submitted = true;
    this.saving = true;

    const raw = this.form.getRawValue();

    const payload: ClientPayload = {
      first_name: raw.first_name?.trim(),
      last_name: raw.last_name?.trim() || null,
      preferred_name: raw.preferred_name?.trim() || null,

      email: raw.email?.trim() || null,
      phone: raw.phone || null,

      birth_date: raw.birth_date || null,
      gender: raw.gender || null,
      preferred_language: raw.preferred_language || null,
      timezone: raw.timezone || null,

      source: raw.source || 'manual',

      tags: raw.tags ?? [],

      notes: raw.notes?.trim() || null,

      is_active: raw.is_active ?? true
    };

    if (this.isPetNiche()) {

      payload.pets = raw.pets
        ?.filter(
          (pet: any) => pet.name?.trim()
        )
        .map((pet: any) => ({
          id: pet.id ?? null,
          name: pet.name.trim(),
          species: pet.species || null,
          breed: pet.breed || null,
          gender: pet.gender || 'unknown',
          weight: pet.weight || null,
          weight_unit: pet.weight_unit || 'kg',
          color: pet.color || null,
          birth_date: pet.birth_date || null,
          allergies: pet.allergies?.trim() || null,
          medical_notes: pet.medical_notes?.trim() || null
        }));
    }

    if (this.editingClient) {

      this.clientService
        .updateClient(
          this.editingClient.id,
          payload
        )
        .subscribe({
          next: (res) => {

            this.notify.success(
              this.uiTerms().clients.singular + ' actualizado correctamente'
            );

            this.saving = false;
            this.submitted = false;

            // recargar listado
            this.loadClients(this.currentPage);

            // cerrar modal
            this.closeModal();
          },
          error: (err) => {

            this.saving = false;
            this.submitted = false;

            this.handleError(
              err,
              'Error al actualizar'
            );

          }
        });

    } else {

      this.clientService
        .createClient(payload)
        .subscribe({
          next: () => {
            this.notify.success(this.uiTerms().clients.singular + ' creado correctamente');

            this.saving = false;
            this.submitted = false;

            this.loadClients(this.currentPage);

            this.closeModal();
          },
          error: (err) => {
            this.saving = false;
            this.submitted = false;

            const data_existing = err?.error?.data_existing;
            const existingClient = err?.error?.existing_client;

            if (data_existing == 'email') {
              this.notify.info(`El email ya existe y pertenece a "${existingClient.full_name}" `);
            } else if (data_existing == 'phone') {
              this.notify.info(`El teléfono ya existe y pertenece a "${existingClient.full_name}" `);
            } else {
              this.handleError(err, 'Error al guardar');
            }

            // michelle


          }
        });
    }
  }

  delete(client: ClientApi) {

    if (this.processingDeleteId) {
      this.notify.error('Procesando ' + this.uiTerms().clients.singularLower);
      return;
    }

    this.confirm.open(
      'Eliminar ' + this.uiTerms().clients.singularLower,
      '¿Seguro que deseas eliminar el ' + this.uiTerms().clients.singularLower + ' ?',
      () => {

        this.processingDeleteId = client.id;

        this.clientService
          .deleteClient(client.id)
          .subscribe({
            next: () => {
              this.notify.success(this.uiTerms().clients.singular + ' eliminado correctamente');

              this.processingDeleteId = null;

              this.loadClients(this.currentPage);

            },
            error: (err) => {

              this.processingDeleteId = null;

              this.handleError(err, 'Error al eliminar');
            }
          });

      },
      'Cancelar',
      'Eliminar'
    );
  }

  // Para ordenar
  private sortClients(): void {

    this.clients.sort((a, b) => {

      /*
      |----------------------------------------------------------
      | Prioridad:
      | 1 = activos
      | 2 = inactivos
      | 3 = bloqueados
      |----------------------------------------------------------
      */
      const getPriority = (client: ClientApi) => {

        if (client.is_blocked) return 3;

        if (!client.is_active) return 2;

        return 1;
      };

      const priorityA = getPriority(a);
      const priorityB = getPriority(b);

      // primero prioridad
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      // dentro del mismo grupo por nombre
      return this.getClientFullName(a)
        .localeCompare(
          this.getClientFullName(b)
        );

    });

  }

  // Genera los id´s para poder eliminar mascotas
  private generateId(): string {
    try {
      return crypto.randomUUID();
    } catch {
      return 'tmp_' +
        Math.random().toString(36).substring(2) +
        Date.now();
    }
  }

  // Status classes para badges
  getStatusClasses(status: string) {
    return {
      activo: 'bg-green-500/10 text-green-400',
      inactivo: 'bg-gray-500/10 text-gray-400',
      riesgo: 'bg-yellow-500/10 text-yellow-400'
    }[status];
  }

  getClientFullName(client: ClientApi): string {

    return client.full_name
      ?? client.preferred_name
      ?? client.first_name
      ?? 'Sin nombre';

  }

  getInitials(client: ClientApi): string {

    return (
      client.first_name?.charAt(0) +
      (client.last_name?.charAt(0) ?? '')
    )
      .toUpperCase()
      || '?';

  }

  getWhatsappLink(phone: PhoneApi): string {

    const number = phone.e164Number.replace('+', '');

    return `https://wa.me/${number}`;
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

  getPetError(index: number, controlName: string): string | null {

    const control = this.pets
      .at(index)
      ?.get(controlName);

    if (!control?.errors) return null;

    if (!control.touched && !this.submitted) {
      return null;
    }

    if (control.errors['required']) {
      return 'Obligatorio';
    }

    if (control.errors['maxlength']) {
      return 'Muy largo';
    }

    if (control.errors['minlength']) {
      return 'Muy corto';
    }

    return 'Campo inválido';
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
