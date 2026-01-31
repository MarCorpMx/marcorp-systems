import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CitasLayoutService } from '../services/citas-layout.service';

@Component({
  selector: 'app-citas-layout',
  imports: [RouterOutlet],
  templateUrl: './citas-layout.html',
  styleUrl: './citas-layout.css',
})
export class CitasLayout {
  layout = inject(CitasLayoutService);

  ngOnInit(): void {
    this.restoreSystemTheme();
  }

  restoreSystemTheme() {
    const system = JSON.parse(localStorage.getItem('current_system') || 'null');
    if (system) {
      document.body.setAttribute('data-system', system.subsystem_key);
    }
  }
}
