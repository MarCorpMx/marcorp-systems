import { CommonModule } from '@angular/common';
import { Component, signal, computed } from '@angular/core';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'viewer';
  status: 'active' | 'invited' | 'disabled';
}

@Component({
  selector: 'app-team',
  imports: [CommonModule],
  templateUrl: './team.html',
  styleUrl: './team.css',
})
export class Team {
  loading = signal(true);

  members = signal<TeamMember[]>([]);

  hasMembers = computed(() => this.members().length > 0);

  constructor() {
    setTimeout(() => {
      this.members.set([
        {
          id: 1,
          name: 'Omar Antúnez',
          email: 'omar@marcorp.mx',
          role: 'admin',
          status: 'active'
        },
        {
          id: 2,
          name: 'Diana López',
          email: 'diana@marcorp.mx',
          role: 'staff',
          status: 'active'
        },
        {
          id: 3,
          name: 'Juan Pérez',
          email: 'juan@mail.com',
          role: 'viewer',
          status: 'invited'
        }
      ]);

      this.loading.set(false);
    }, 1200);
  }

  roleLabel(role: TeamMember['role']) {
    return {
      admin: 'Administrador',
      staff: 'Personal',
      viewer: 'Solo lectura'
    }[role];
  }

  statusLabel(status: TeamMember['status']) {
    return {
      active: 'Activo',
      invited: 'Invitado',
      disabled: 'Desactivado'
    }[status];
  }

  statusClass(status: TeamMember['status']) {
    return {
      active: 'active',
      invited: 'invited',
      disabled: 'disabled'
    }[status];
  }

}
