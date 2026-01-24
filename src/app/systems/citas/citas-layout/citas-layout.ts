import { Component } from '@angular/core';
import { Router, RouterOutlet  } from '@angular/router';

@Component({
  selector: 'app-citas-layout',
  imports: [RouterOutlet],
  templateUrl: './citas-layout.html',
  styleUrl: './citas-layout.css',
})
export class CitasLayout {
  
  ngOnInit(): void { 
    this.restoreSystemTheme();

    
    console.log('Ya entranmos al sistemas de citas');
    console.log('Token de citas: ', localStorage.getItem('auth_token'));
  }

  restoreSystemTheme() {
  const system = JSON.parse(localStorage.getItem('current_system') || 'null');
  if (system) {
    document.body.setAttribute('data-system', system.subsystem_key);
  }
}
}
