import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CitasLayoutService } from '../../services/citas-layout.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {
  loading = true; // Temporal
  hasAppointmentsToday = false; // Temporal

  layout = inject(CitasLayoutService);

  ngOnInit() {
    this.layout.setHeader({
      title: 'Resumen de hoy',
      subtitle: 'Así va tu agenda'
    });

    setTimeout(() => {
      this.loading = false;
    }, 1500); // simula API
  }




  ngOnDestroy() {
    this.layout.clearHeader();
  }

}
