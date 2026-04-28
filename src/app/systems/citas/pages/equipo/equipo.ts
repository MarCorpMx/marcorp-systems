import { Component, OnInit, inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users, HelpCircle, PlayCircle, PauseCircle, Building2, Pencil, EyeOff, Eye } from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl, FormsModule } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { AuthService } from '../../../../core/services/auth.service';
import { CitasTeamService } from '../../../../core/services/citas-team.service';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

type MemberStatus = 'Activo' | 'Invitado' | 'Suspendido' | 'Inactivo';
type MemberRole = 'Administrador' | 'Terapeuta' | 'Recepción';

interface TeamMember {
  id: string; // "user-4" | "staff-2"

  // Identidad
  name: string;
  first_name?: string;
  last_name?: string;

  // Contacto
  email?: string;
  phone?: any; // ngx-intl-tel-input (luego si quieres lo tipamos fino)

  // Perfil profesional
  title?: string;
  specialty?: string;
  bio?: string;

  // Estado del sistema
  status: 'Activo' | 'Invitado' | 'Suspendido' | 'Inactivo';
  is_active?: boolean;
  is_public?: boolean;

  // Accesos
  has_access: boolean; // puede entrar al sistema
  is_staff: boolean;   // atiende citas

  // Rol
  role: {
    key: 'root' | 'owner' | 'admin' | 'staff' | 'receptionist' | string;
    name: string;
  };

  branch_names?: string;
}


/*
|--------------------------------------------------------------------------
| rombi - PENDIENTES
| - Tenemos que migrar a sistema de invitación
| - Avisarles que han alcanzado el límite de creación de usuarios cuando quieran crear usuarios
| - Cuando realicemos el sistema de invitación, tenemos que verificar los contadores de límites para que tomen en cuenta a miembros pendientes de verificar aunque esten en la tabla de staff_members
| - Ver cómo controlar cuando el usuario ya existe en otra orga
| - Verificar bien los limites, más cuando tienen un plan superior y lo bajan a uno inferior
| - Colocar upgrades cuando se les acabe los miembros osea colocar "Sube tu plan si quieres disponer de más personal"
| - Existe un problema al activar/desactivar cuando el miembro es solo staff sin acceso al sistema
| - Falta mostrar/activar el botón "Añadir sucursal"
| - Falta validar chingón los límites (ahorita si tienen 5 vatos trabajando y desactivan pueden estar creando más)
| - Hacer boton la card para ver los datos del vato
|--------------------------------------------------------------------------
*/

/*
1.-sm.is_active (staff_members)
“puede atender citas”
2.-bua.is_active (branch_user_access)
“tiene acceso en esta sucursal + subsystem”
3.-ou.status (organization_users)
“puede entrar al sistema”
*/

@Component({
  selector: 'app-equipo',
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, NgxIntlTelInputModule, FormsModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})

export class Equipo implements OnInit {
  readonly Users = Users;
  readonly HelpCircle = HelpCircle;
  readonly PlayCircle = PlayCircle;
  readonly PauseCircle = PauseCircle;
  readonly Building2 = Building2;
  readonly Pencil = Pencil;
  readonly EyeOff = EyeOff;
  readonly Eye = Eye;

  private auth = inject(AuthService);
  private teamService = inject(CitasTeamService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

  role: string | null = null;

  loading = true;
  showModal = false;
  members: TeamMember[] = [];
  openMenuId: string | null = null;

  showPassword = false;

  showAccesHelp = false;
  showIsPublicHelp = false;

  processingStaffId: string | null = null;

  search = '';
  searchControl = new FormControl('');
  viewAll = false;

  isOwnerOrRoot = false;

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.search = value;
    this.loadTeam();
  }


  form!: FormGroup;
  submitted = false;
  saving = false;
  editingMember = false;
  currentMemberId: string | null = null;


  // Configuración ngx-intl-tel-input
  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];
  countryEnum = CountryISO;
  countries: { code: CountryISO, name: string }[] = [];


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    const clickedMenu = target.closest('[data-menu]');

    if (!clickedMenu) {
      this.openMenuId = null;
    }
  }

  ngOnInit() {
    this.role = this.auth.getRole();

    if(this.role == 'owner'){this.isOwnerOrRoot = true;} 
    
    this.initForm();
    this.loadTeam();

    

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {

      this.search = value || '';

      this.loadTeam();
    });

  }

  // rombi
  openBranchAssignModal(valor: any) {

  }

  initForm() {
    this.form = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: [''],
      email: ['', [Validators.email]],
      phone: [null],

      title: [''],
      specialty: [''],
      bio: [''],

      is_active: [true],
      is_public: [true],

      has_access: [false],
      role: ['staff'],

      username: ['', [Validators.minLength(4), Validators.maxLength(50)]],
      password: ['', [Validators.minLength(8), Validators.maxLength(15)]],
    });

    this.form.get('has_access')?.valueChanges.subscribe((hasAccess) => {

      const email = this.form.get('email');
      const password = this.form.get('password');
      const username = this.form.get('username');

      if (hasAccess) {
        email?.setValidators([Validators.required, Validators.email]);

        // SOLO requerido si NO está editando
        if (!this.editingMember) {
          password?.setValidators([Validators.required, Validators.minLength(8)]);
          username?.setValidators([Validators.required, Validators.minLength(4)]);
        } else {
          password?.clearValidators();
          username?.clearValidators();
        }

      } else {
        email?.setValidators([Validators.email]);
        password?.clearValidators();
        username?.clearValidators();
      }

      email?.updateValueAndValidity();
      password?.updateValueAndValidity();
      username?.updateValueAndValidity();
    });

    setTimeout(() => {
      this.form.get('has_access')?.updateValueAndValidity();
    });
  }

  loadTeam() {

    this.loading = true;

    this.teamService.getMembers({
      search: this.search,
      view_all: this.viewAll
    }).subscribe({

      next: (res) => {

        console.log('miembros al aire:', JSON.stringify(res, null, 2));

        this.members = res.data.map((m: any) => ({
          ...m,
          status: this.normalizeStatus(m.status),
        }));

        this.loading = false;
      },

      error: (err) => {

        console.error(err);

        this.loading = false;
      }
    });

  }

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  toggleAccessHelp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.showAccesHelp = !this.showAccesHelp;
  }

  toggleIsPublicHelp(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    this.showIsPublicHelp = !this.showIsPublicHelp;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }


  // member: TeamMember
  edit(member: TeamMember) {
    this.editingMember = true;
    this.showModal = true;
    this.currentMemberId = member.id;
    this.resetForm();

    // Cargamos los datos del personal en el formulario
    this.form.patchValue({
      first_name: member.first_name || '',
      last_name: member.last_name || '',
      email: member.email || '',
      phone: member.phone || null,
      title: member.title || '',
      specialty: member.specialty || '',
      bio: member.bio || '',
      is_active: member.is_active ?? true,
      is_public: member.is_public ?? true,
      has_access: member.has_access,
      role: member.role?.key || 'staff'
    });

    // FORZAR REEVALUACIÓN
    this.form.get('has_access')?.updateValueAndValidity();
  }

  toggleStaffStatus(staff: any) {
    if (this.processingStaffId) return;

    // Solo confirmar si se va a desactivar
    if (staff.is_active) {
      this.confirm.open(
        'Desactivar personal',
        'Este integrante dejará de recibir citas en esta sucursal. ¿Deseas continuar?',
        () => {
          this.executeToggle(staff);
        },
        'Cancelar',
        'Desactivar'
      );
    } else {
      this.executeToggle(staff);
    }


  }

  executeToggle(staff: any) {
    this.processingStaffId = staff.id;

    const prev = staff.is_active;

    const payload = {
      is_active: !staff.is_active
    };


    this.teamService
      .toggleAccess(staff.id, payload)
      .subscribe({
        next: (res: any) => {

          this.notify.success(res.message);

          //console.log(res.data.message);
          this.processingStaffId = null;
          this.ngOnInit();
        },

        error: (err) => {
          staff.is_active = prev; // rollback
          this.processingStaffId = null;
          this.handleError(err, 'No se pudo actualizar la sucursal');
        }
      });
  }


  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingMember = false;

    this.resetForm();

    this.submitted = false;
  }

  saveMember() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    const value = this.form.value;

    const payload: any = {
      first_name: value.first_name,
      last_name: value.last_name,
      email: value.email,
      phone: value.phone,
      title: value.title,
      specialty: value.specialty,
      bio: value.bio,

      is_active: value.is_active,
      is_public: value.is_public,

      has_access: value.has_access,
    };

    // SOLO SI TIENE ACCESO
    if (value.has_access) {
      payload.username = value.username;
      payload.password = value.password;
      payload.role = value.role;
    } else {
      payload.role = 'staff';
    }
    payload.subsystem = 'citas';

    if (this.editingMember) {
      this.updateMember(payload);
    } else {
      this.createMember(payload);
    }

  }

  createMember(payload: any) {
    this.teamService.createMember(payload).subscribe({
      next: () => {
        this.notify.success('Personal del equipo creado correctamente');
        this.saving = false;
        this.closeModal();
        this.ngOnInit();
      },
      error: (error) => {
        let message = 'Ocurrió un error inesperado';

        // Error de validación (422)
        if (error.status === 422) {
          message = error.error?.message || 'Datos inválidos';

          // Si quieres mostrar errores por campo
          if (error.error?.errors) {
            const firstError = Object.values(error.error.errors)[0] as string[];
            message = firstError[0];
          }
        }

        // Error del servidor (500)
        else if (error.status === 500) {
          message = error.error?.message || 'Error interno del servidor';

          // opcional (modo debug)
          console.error('Server error:', error.error?.error);
        }

        // fallback
        else if (error.error?.message) {
          message = error.error.message;
        }

        this.notify.error(message);
        this.saving = false;
      }
    });
  }

  updateMember(payload: any) {
    if (!this.currentMemberId) {
      this.notify.error('No se pudo identificar el personal');
      return;
    }

    this.teamService.updateMember(this.currentMemberId, payload).subscribe({
      next: () => {
        this.notify.success('Personal actualizado correctamente');
        this.saving = false;
        this.closeModal();
        this.ngOnInit();
      },
      error: (error) => {
        let message = 'Ocurrió un error inesperado';

        // Error de validación (422)
        if (error.status === 422) {
          message = error.error?.message || 'Datos inválidos';

          // Si quieres mostrar errores por campo
          if (error.error?.errors) {
            const firstError = Object.values(error.error.errors)[0] as string[];
            message = firstError[0];
          }
        }

        // Error del servidor (500)
        else if (error.status === 500) {
          message = error.error?.message || 'Error interno del servidor';

          // opcional (modo debug)
          console.error('Server error:', error.error?.error);
        }

        // fallback
        else if (error.error?.message) {
          message = error.error.message;
        }

        this.notify.error(message);
        this.saving = false;
      }
    });
  }

  resetForm() {
    this.form.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: null,
      title: '',
      specialty: '',
      bio: '',
      is_active: true,
      is_public: true,
      has_access: false,
      role: 'staff'
    });
  }

  getInitial(name: string | null | undefined): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getError(controlName: string): string | null {
    const control = this.form.get(controlName);

    if (!control || !control.touched || !control.errors) return null;

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Correo inválido';
    if (control.errors['minlength']) return 'Muy corto';
    if (control.errors['maxlength']) return 'Muy largo';

    return null;
  }

  normalizeStatus(status: string): 'Activo' | 'Invitado' | 'Suspendido' | 'Inactivo' {
    switch (status) {
      case 'active': return 'Activo';
      case 'invited': return 'Invitado';
      case 'suspended': return 'Suspendido';
      case 'inactive': return 'Inactivo';
      default: return 'Activo';
    }
  }

  getRoleLabel(role: { key: string; name: string }): string {
    return {
      root: 'El Root',
      owner: 'Dueño',
      admin: 'Administrador',
      staff: 'Profesional',
      noAccess: 'Profesional',
      receptionist: 'Recepción',
    }[role.key] || role.name; // fallback
  }

  getRoleClasses(roleKey: string) {
    return {
      'owner': 'bg-purple-500/10 text-purple-400',
      'admin': 'bg-purple-500/10 text-purple-400',
      'staff': 'bg-blue-500/10 text-blue-400',
      'reception': 'bg-green-500/10 text-green-400',
    }[roleKey] || 'bg-gray-500/10 text-gray-400';
  }

  getStatusClasses(status: MemberStatus) {
    return {
      'Activo': 'bg-green-500/10 text-green-400',
      'Invitado': 'bg-yellow-500/10 text-yellow-400',
      'Suspendido': 'bg-red-500/10 text-red-400',
      'Inactivo': 'bg-red-500/10 text-red-400',
    }[status];
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
