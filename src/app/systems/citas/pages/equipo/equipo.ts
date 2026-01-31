import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Users } from 'lucide-angular';

type MemberStatus = 'activo' | 'invitado' | 'suspendido';
type MemberRole = 'Administrador' | 'Terapeuta' | 'Recepción';

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
}

@Component({
  selector: 'app-equipo',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './equipo.html',
  styleUrl: './equipo.css',
})

export class Equipo implements OnInit {
  readonly Users = Users;

  loading = true;

  members: TeamMember[] = [
    {
      id: 1,
      name: 'Diana Gómez',
      email: 'diana@punto-de-calma.mx',
      role: 'Administrador',
      status: 'activo'
    },
    {
      id: 2,
      name: 'Carlos Pérez',
      email: 'carlos@punto-de-calma.mx',
      role: 'Terapeuta',
      status: 'activo'
    },
    {
      id: 3,
      name: 'María López',
      email: 'maria@punto-de-calma.mx',
      role: 'Recepción',
      status: 'invitado'
    }
  ];

  ngOnInit() {
    setTimeout(() => {
      this.loading = false;

      // Para probar EMPTY:
      // this.members = [];

    }, 1200);
  }

  getRoleClasses(role: MemberRole) {
    return {
      'Administrador': 'bg-purple-500/10 text-purple-400',
      'Terapeuta': 'bg-blue-500/10 text-blue-400',
      'Recepción': 'bg-green-500/10 text-green-400',
    }[role];
  }

  getStatusClasses(status: MemberStatus) {
    return {
      'activo': 'bg-green-500/10 text-green-400',
      'invitado': 'bg-yellow-500/10 text-yellow-400',
      'suspendido': 'bg-red-500/10 text-red-400',
    }[status];
  }

}
