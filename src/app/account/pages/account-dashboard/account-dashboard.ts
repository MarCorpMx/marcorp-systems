import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-account-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './account-dashboard.html',
  styleUrl: './account-dashboard.css',
})

export class AccountDashboard {
  private auth = inject(AuthService);

  user = this.auth.getUser();
  systems = this.auth.getSystems();
  
}
