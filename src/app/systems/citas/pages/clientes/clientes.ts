import { Component, OnInit, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat, SearchCountryField } from 'ngx-intl-tel-input';
import {
  LucideAngularModule,
  UserCheck,
  UserX,
  Tag,
  Calendar,
  FileText,
  MoreVertical,
  Search, X
} from 'lucide-angular';

import { Notification } from '../../../../services/notification.service';
import { ClientService } from '../../../../core/services/client.service';
import { ClientApi } from '../../../../core/models/client.model';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';
import { AppDatePipe } from '../../../../shared/pipes/app-date-pipe';


@Component({
  selector: 'app-clientes',
  imports: [CommonModule, LucideAngularModule, RouterLink, ReactiveFormsModule, NgxIntlTelInputModule, AppDatePipe],
  templateUrl: './clientes.html',
  styleUrl: './clientes.css',
})

export class Clientes implements OnInit {
  readonly UserCheck = UserCheck;
  readonly UserX = UserX;
  readonly Tag = Tag;
  readonly Calendar = Calendar;
  readonly FileText = FileText;
  readonly MoreVertical = MoreVertical;
  readonly Search = Search;
  readonly X = X;

  form!: FormGroup;
  loading = true;
  submitted = false;
  saving = false;
  success = false;
  activeMenu: number | null = null;

  searchTerm = ''; // Buscador
  private searchTimeout: any; // Buscador

  clients: ClientApi[] = [];
  showModal = false;
  editingClient: ClientApi | null = null;
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

  confirm = inject(ConfirmDialogService);
  constructor(
    private clientService: ClientService,
    private fb: FormBuilder,
    private notify: Notification
  ) { }

  ngOnInit() {
    this.initForm();
    this.loadClients();
  }

  initForm() {
    this.form = this.fb.group({
      first_name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      last_name: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.maxLength(150)
      ]],
      phone: [null, Validators.required],
      birth_date: ['', Validators.required]
    });
  }

  /*loadClients(page: number = 1) {
    this.loading = true;

    this.clientService.getClients(page).subscribe({
      next: (response) => {
        this.clients = response.data;

        this.currentPage = response.current_page;
        this.lastPage = response.last_page;
        this.perPage = response.per_page;
        this.total = response.total;

        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }*/

  loadClients(page: number = 1) {
    this.loading = true;

    this.clientService
      .getClients(page, this.searchTerm) // enviamos search
      .subscribe({
        next: (response) => {
          this.clients = response.data;
          this.currentPage = response.current_page;
          this.lastPage = response.last_page;
          this.perPage = response.per_page;
          this.total = response.total;
          this.loading = false;
        },
        error: () => this.loading = false
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

  openCreate() {
    this.editingClient = null;
    this.form.reset();
    this.showModal = true;
  }

  openEdit(client: ClientApi) {
    this.editingClient = client;

    const [firstName, ...lastParts] = client.full_name.split(' ');

    const formattedBirthDate = client.birth_date
      ? client.birth_date.substring(0, 10)
      : '';

    this.form.patchValue({
      first_name: firstName,
      last_name: lastParts.join(' '),
      email: client.email ?? '',
      phone: client.phone ?? '',
      birth_date: formattedBirthDate
    });

    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  save() {
    if (this.form.invalid) return;

    const data = this.form.value;

    if (this.editingClient) {
      this.clientService.updateClient(this.editingClient.id, data)
        .subscribe(() => {
          this.notify.success('Cliente actualizado correctamente');
          this.loadClients(this.currentPage);
          this.closeModal();
        });
    } else {
      this.clientService.createClient(data)
        .subscribe(() => {
          this.notify.success('Cliente creado correctamente');
          this.loadClients(this.currentPage);
          this.closeModal();
        });
    }
  }

  delete(client: ClientApi) {
    this.confirm.open(
      'Eliminar cliente',
      '¿Seguro que deseas eliminar el cliente?',
      () => {
        this.clientService.deleteClient(client.id)
          .subscribe(() => this.loadClients(this.currentPage));
        this.notify.success('Cliente eliminado correctamente');
      },
      'Cancelar',
      'Eliminar'
    );


  }

  // Status classes para badges
  getStatusClasses(status: string) {
    return {
      activo: 'bg-green-500/10 text-green-400',
      inactivo: 'bg-gray-500/10 text-gray-400',
      riesgo: 'bg-yellow-500/10 text-yellow-400'
    }[status];
  }

}
