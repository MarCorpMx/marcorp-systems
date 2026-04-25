import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import {
  Plus,
  Building2,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Trash2,
  Store,
  Sparkles,
  Lock,
  PauseCircle,
  PlayCircle, HelpCircle
} from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { AuthService } from '../../../../../core/services/auth.service';
import { Notification } from '../../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../../shared/services/confirm-dialog.service';
import { CitasBranchService, BranchModel } from '../../../../../core/services/citas-branch.service';

import { AppPhonePipe } from '../../../../../shared/pipes/app-phone-pipe';


@Component({
  selector: 'app-sucursales',
  imports: [CommonModule, LucideAngularModule, AppPhonePipe, ReactiveFormsModule, NgxIntlTelInputModule],
  templateUrl: './sucursales.html',
  styleUrl: './sucursales.css',
})

export class Sucursales implements OnInit {

  /*“Tu plan actual permite 3 sucursales, pero tienes 10 activas.
No podrás crear nuevas hasta reducirlas o actualizar tu plan.”*/

  //rombi - Permitir crear a owner, solo por el momento, despues tal ves agreguemos Manager = responsable
  // o definir bien el rol de admin en esta parte

  readonly Plus = Plus;
  readonly Building2 = Building2;
  readonly MapPin = MapPin;
  readonly Phone = Phone;
  readonly Mail = Mail;
  readonly Pencil = Pencil;
  readonly Trash2 = Trash2;
  readonly Store = Store;
  readonly Sparkles = Sparkles;
  readonly Lock = Lock;
  readonly PauseCircle = PauseCircle;
  readonly PlayCircle = PlayCircle;
  readonly HelpCircle = HelpCircle;


  private auth = inject(AuthService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private branchService = inject(CitasBranchService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  form!: FormGroup;

  role: string | null = null;
  authContext: any;

  isFreePlan = false;

  loading = true;
  saving = false;
  submitted = false;

  showModal = false;
  editingBranch: BranchModel | null = null;

  noAccess = true;

  showSlugHelp = false;
  showReferencePrefixHelp = false;

  branchesLimit: number | null = null;
  canCreateBranches = false;
  canActivateMore = false;

  processingBranchId: number | null = null;

  branches: BranchModel[] = [];

  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];

  /*branches = [
    {
      id: 1,
      name: 'Sucursal Centro',
      address: 'Av. Reforma 123, CDMX',
      phone: '+52 55 1234 5678',
      email: 'centro@citara.mx',
      manager: 'Ana López',
      active: true,
    }
  ];*/

  ngOnInit() {
    this.role = this.auth.getRole();
    this.branchesLimit = this.auth.getFeatureLimit('branches');
    this.authContext = this.auth.getAuthContext();

    if (this.authContext.plan == 'free' || this.authContext.plan == 'basic') {
      this.isFreePlan = true;
    }

    this.initForm();
    this.setupFormListeners();
    this.getBranches();
  }

  setupFormListeners() {
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
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120)]],
      slug: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120), Validators.pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)]],
      reference_prefix: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(/^(?=.*[A-Z])[A-Z0-9]{2,5}$/)]],

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
    });
  }

  rebuildForm() {
    this.initForm();
    this.setupFormListeners();
  }

  // sucursal actual
  //currentBranch = signal<any>(null);

  //currentBranch = this.auth.getCurrentBranch()

  getBranches() {
    this.branchService.getBranches().subscribe({
      next: (res) => {

        this.loading = false;

        if (this.role == 'owner') {
          this.noAccess = false;
        }

        this.branches = res.data;

        // Saber si puede crear
        const totalOrgBranches = res.meta.organization_branches_count;

        if (this.branchesLimit === null) {
          this.canCreateBranches = true;
        } else {
          this.canCreateBranches = totalOrgBranches < this.branchesLimit;
        }

        // Saber si puede activar
        const activeCount = this.branches.filter(b => b.is_active).length;

        this.canActivateMore =
          this.branchesLimit === null || activeCount < this.branchesLimit;

        // Actualizar sidebar
        //this.auth.refreshAuthContext().subscribe();


      },
      error: (err) => {
        if (err.status === 403) {
          this.noAccess = true;
        }
      }
    });
  }

  openCreate() {

    if (!this.canCreateBranches) {

      this.confirm.open(
        'Límite alcanzado',
        `Tu plan permite ${this.branchesLimit} sucursales.\n\n¿Quieres actualizar tu plan para agregar más?`,
        () => {
          this.goToPlans();
        },
        'Cancelar',
        'Ver planes'
      );

      return;
    }

    this.rebuildForm();

    this.editingBranch = null;
    this.showModal = true;
  }

  openEdit(branch: any) {

    this.form.patchValue({
      name: branch.name ?? '',
      slug: branch.slug ?? '',
      reference_prefix: branch.reference_prefix ?? '',
      email: branch.email ?? '',
      phone: branch.phone ?? null,
      website: branch.website ?? '',

      country: branch.country ? branch.country.toLowerCase() as CountryISO : CountryISO.Mexico,
      state: branch.state ?? '',
      city: branch.city ?? '',
      zip_code: branch.zip_code ?? '',
      address: branch.address ?? '',
    });

    this.editingBranch = branch;
    this.showModal = true;
  }

  closeModal() {
    this.form.reset();
    this.showModal = false;

    this.submitted = false;
    this.saving = false;
    this.processingBranchId = null;
    this.editingBranch = null;
  }


  toggleBranchStatus(branch: any) {

    if (this.processingBranchId) return;

    // SI QUIERE ACTIVAR
    if (!branch.is_active && !this.canActivateMore) {

      this.confirm.open(
        'Límite alcanzado',
        'Ya alcanzaste el límite de sucursales activas.\n\nActualiza tu plan para activar más.',
        () => this.goToPlans(),
        'Cancelar',
        'Ver planes'
      );

      return;
    }

    // Solo confirmar si se va a desactivar
    if (branch.is_active) {
      this.confirm.open(
        'Desactivar sucursal',
        'No podrás agendar citas en esta sucursal. ¿Deseas continuar?',
        () => {
          this.executeToggle(branch);
        },
        'Cancelar',
        'Desactivar'
      );
    } else {
      this.executeToggle(branch);
    }

  }

  executeToggle(branch: any) {

    this.processingBranchId = branch.id;

    const prev = branch.is_active;

    const payload = {
      is_active: !branch.is_active
    };

    this.branchService
      .updateBranch(branch.id, payload)
      .subscribe({
        next: (res) => {

          branch.is_active = res.data.is_active;


          const current = this.auth.getCurrentBranch();

          // Si se desactivo la sucursal
          if (current && current.branch_id === branch.id && !branch.is_active) {

            const activeBranches = this.branches.filter(b => b.is_active);

            if (activeBranches.length) {

              const fallback =
                activeBranches.find(b => b.is_primary) ?? activeBranches[0];

              this.auth.setCurrentBranch({
                branch_id: fallback.id,
                branch_name: fallback.name,
                branch_is_active: fallback.is_active,
                branch_primary: fallback.is_primary
              });

              // sync global (clave)
              this.auth.refreshAuthContext().subscribe({
                next: () => {
                  this.notify.info('Te movimos a una sucursal activa');
                  // opcional pero recomendable
                  this.router.navigate(['/sistemas/citas/dashboard']);
                },
                error: () => {
                  this.notify.error('Error al refrescar sesión');
                }
              });


            } else {
              this.auth.setCurrentBranch(null);
            }
          } else {
            this.auth.refreshAuthContext().subscribe(() => {
              this.getBranches();
            });
          }

          this.notify.success(
            res.data.is_active
              ? 'Sucursal activada'
              : 'Sucursal desactivada'
          );

          this.getBranches();

          this.processingBranchId = null;
        },

        error: (err) => {

          branch.is_active = prev; // rollback
          this.processingBranchId = null;

          if (err?.error?.message?.includes('límite')) {

            this.confirm.open(
              'Límite de plan',
              'Has alcanzado el límite de sucursales activas.\n\nActualiza tu plan para activar más.',
              () => this.goToPlans(),
              'Cancelar',
              'Ver planes'
            );

            return;
          }

          this.handleError(err, 'No se pudo actualizar la sucursal');
        }
      });

  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notify.error('Revisa los campos.');
      return;
    }

    this.submitted = true;
    this.saving = true;

    const rawPhone = this.form.value.phone;

    const phone = rawPhone ? {
      e164Number: rawPhone.e164Number,
      internationalNumber: rawPhone.internationalNumber,
      nationalNumber: rawPhone.nationalNumber,
      countryCode: rawPhone.countryCode,
      dialCode: rawPhone.dialCode
    } : null;

    const formValue = this.form.value;

    const payload = {
      ...formValue,
      phone: phone,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone

      // rombi - FALTA ZONA HORARIA QUE EL USUARIO PUEDA DEFINIR
    };

    if (this.editingBranch == null) { // Nueva sucursal
      this.createBranch(payload);
    } else {
      this.updateBranch(payload);
    }
  }

  createBranch(payload: any) {
    this.branchService.createBranch(payload)
      .subscribe({
        next: (res) => {
          this.notify.success('Sucursal creada');

          this.auth.refreshAuthContext().subscribe(() => {
            this.getBranches();
          });

          this.getBranches();

          this.saving = false;
          this.closeModal();
        },
        error: (err) => {
          this.saving = false;

          this.handleError(err, 'Error al guardar');
        }

      });
  }


  updateBranch(payload: any) {

    if (this.processingBranchId || !this.editingBranch) return;

    this.processingBranchId = this.editingBranch.id;
    const branchID = this.processingBranchId;

    this.branchService
      .updateBranch(branchID, payload)
      .subscribe({
        next: (res) => {

          this.notify.success('Sucursal actualizada correctamente');

          this.auth.refreshAuthContext().subscribe(() => {
            this.getBranches();
          });

          this.getBranches();

          this.saving = false;
          this.closeModal();
        },

        error: (err) => {
          this.handleError(err, 'No se pudo actualizar la sucursal');
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

  handleError(err: any, fallbackMessage: string) {

    console.error(err);

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

  isLockedByPlan(branch: BranchModel): boolean {
    return branch.locked_by_plan;
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

  goToPlans() {
    this.router.navigate(['/account/subscriptions']);
  }

}


