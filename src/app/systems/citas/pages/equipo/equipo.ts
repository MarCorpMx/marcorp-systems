import { Component, OnInit, inject, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';

import { CitasTeamService } from '../../../../core/services/citas-team.service';
import { Notification } from '../../../../services/notification.service';
import { ConfirmDialogService } from '../../../../shared/services/confirm-dialog.service';

type MemberStatus = 'Activo' | 'Invitado' | 'Suspendido';
type MemberRole = 'Administrador' | 'Terapeuta' | 'Recepción';

interface TeamMember {
  id: string; // "user-4" | "staff-2"

  // 🔥 Identidad
  name: string;
  first_name?: string;
  last_name?: string;

  // 🔥 Contacto
  email?: string;
  phone?: any; // ngx-intl-tel-input (luego si quieres lo tipamos fino)

  // 🔥 Perfil profesional
  title?: string;
  specialty?: string;
  bio?: string;

  // 🔥 Estado del sistema
  status: 'Activo' | 'Invitado' | 'Suspendido';
  is_active?: boolean;
  is_public?: boolean;

  // 🔥 Accesos
  has_access: boolean; // puede entrar al sistema
  is_staff: boolean;   // atiende citas

  // 🔥 Rol
  role: {
    key: 'root' | 'owner' | 'admin' | 'staff' | 'receptionist' | string;
    name: string;
  };
}

@Component({
  selector: 'app-equipo',
  imports: [CommonModule, LucideAngularModule, ReactiveFormsModule, NgxIntlTelInputModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})

export class Equipo implements OnInit {
  readonly Users = Users;

  loading = true;
  showModal = false;
  members: TeamMember[] = [];
  openMenuId: string | null = null;

  form!: FormGroup;
  submitted = false;
  saving = false;
  editingMember = false;
  currentMemberId: string | null = null;

  private teamService = inject(CitasTeamService);
  private notify = inject(Notification);
  private confirm = inject(ConfirmDialogService);
  private fb = inject(FormBuilder);

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
    this.initForm();

    this.teamService.getMembers().subscribe({
      next: (res) => {
        console.log(res);
        this.members = res.data.map((m: any) => ({
          ...m,
          status: this.normalizeStatus(m.status),
        }));

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
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

      username: [''],
      password: [''],
    });

    this.form.get('has_access')?.valueChanges.subscribe((hasAccess) => {

      const email = this.form.get('email');
      const password = this.form.get('password');
      const username = this.form.get('username');

      if (hasAccess) {
        email?.setValidators([Validators.required, Validators.email]);

        // SOLO requerido si NO está editando
        if (!this.editingMember) {
          password?.setValidators([Validators.required, Validators.minLength(6)]);
          username?.setValidators([Validators.required, Validators.minLength(3)]);
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

  toggleMenu(id: string) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  // member: TeamMember
  edit(member: TeamMember) {
    this.editingMember = true;
    this.showModal = true;
    this.currentMemberId = member.id;
    this.resetForm();

    // Cargamos los datos del miembro en el formulario
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

  suspend(member: any) {
    this.teamService.suspendMember(member.id).subscribe({
      next: () => {
        this.notify.success('Miembro suspendido');
        // evitar reload inmediato
        this.members = this.members.map(m =>
          m.id === member.id
            ? { ...m, status: 'Suspendido', has_access: false }
            : m
        );

      },
      error: (error) => {
        console.log(error);
        this.notify.error('No se pudo suspender');
      }
    });
  }

  activate(member: any) {
    this.teamService.activateMember(member.id).subscribe({
      next: () => {
        this.notify.success('Miembro activado');
        this.ngOnInit();
      },
      error: () => {
        this.notify.error('No se pudo activar');
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
        this.notify.success('Miembro del equipo creado correctamente');
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
      this.notify.error('No se pudo identificar el miembro');
      return;
    }

    this.teamService.updateMember(this.currentMemberId, payload).subscribe({
      next: () => {
        this.notify.success('Miembro actualizado correctamente');
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

  normalizeStatus(status: string): 'Activo' | 'Invitado' | 'Suspendido' {
    switch (status) {
      case 'active': return 'Activo';
      case 'invited': return 'Invitado';
      case 'suspended': return 'Suspendido';
      default: return 'Activo';
    }
  }

  getRoleLabel(role: { key: string; name: string }): string {
    return {
      root: 'El Root',
      owner: 'Dueño',
      admin: 'Administrador',
      staff: 'Profesional',
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
    }[status];
  }

}
