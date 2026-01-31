import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
  username: string;
}


@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})

export class Profile implements OnInit {
  // Estados
  loading = signal(true);
  saving = signal(false);

  // Data
  user = signal<User | null>(null);

  // Form (editable)
  form = {
    name: ''
  };

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.loading.set(true);

    // Simulación API
    setTimeout(() => {
      const data: User = {
        id: 1,
        name: 'Diana Gómez',
        email: 'diana@marcorp.mx',
        username: 'diana'
      };

      this.user.set(data);
      this.form.name = data.name;

      this.loading.set(false);
    }, 1200);
  }

  save() {
    if (!this.user()) return;

    this.saving.set(true);

    // Simulación save API
    setTimeout(() => {
      this.user.update(u => ({
        ...u!,
        name: this.form.name
      }));

      this.saving.set(false);
    }, 1000);
  }

  reload() {
    this.loadProfile();
  }


}
