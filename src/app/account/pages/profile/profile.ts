import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  user = signal<any>(null);
  loading = signal(false);

  constructor(private auth: AuthService) {
    this.user.set(this.auth.getUser());
  }

  save() {
    this.loading.set(true);

    // aquí luego irá la API real
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify(this.user()));
      this.loading.set(false);
      alert('Perfil actualizado de broma, falta la api man');
    }, 800);
  }

}
