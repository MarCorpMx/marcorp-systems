import { Component } from '@angular/core';

@Component({
  selector: 'app-citas-layout',
  imports: [],
  templateUrl: './citas-layout.html',
  styleUrl: './citas-layout.css',
})
export class CitasLayout {
  
  ngOnInit(): void { 
    console.log('Ya entranmos al sistemas de citas');
    console.log('Token de citas: ', localStorage.getItem('auth_token'));
  }
}
