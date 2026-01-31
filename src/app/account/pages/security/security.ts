import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Session {
  id: number;
  device: string;
  location: string;
  lastActive: string;
}

@Component({
  selector: 'app-security',
  imports: [CommonModule, FormsModule],
  templateUrl: './security.html',
  styleUrl: './security.css',
})

export class Security implements OnInit {
  loading = signal(true);
  saving = signal(false);

  form = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  sessions: Session[] = [];

  ngOnInit() {
    this.loadSecurityData();
  }

  loadSecurityData() {
    this.loading.set(true);

    // Simulación API
    setTimeout(() => {
      this.sessions = [
        {
          id: 1,
          device: 'Chrome · Windows',
          location: 'Ciudad de México',
          lastActive: 'Hace 5 minutos'
        },
        {
          id: 2,
          device: 'Safari · iPhone',
          location: 'Cuernavaca',
          lastActive: 'Hace 2 días'
        }
      ];

      this.loading.set(false);
    }, 1200);
  }

  changePassword() {
    if (this.form.newPassword !== this.form.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.saving.set(true);

    setTimeout(() => {
      this.form.currentPassword = '';
      this.form.newPassword = '';
      this.form.confirmPassword = '';

      this.saving.set(false);
    }, 1000);
  }

  revokeSession(id: number) {
    this.sessions = this.sessions.filter(s => s.id !== id);
  }

}
