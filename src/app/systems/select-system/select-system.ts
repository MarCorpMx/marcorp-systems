import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import {
  Calendar,
  GraduationCap,
  Boxes,
  LucideAngularModule
} from 'lucide-angular';


/*export interface UserSystem {
  user_subsystem_id: number;
  subsystem_id: number;
  subsystem_key: string;
  subsystem_name: string;
  is_paid: boolean;
  roles: string[];
}*/

@Component({
  selector: 'app-select-system',
  imports: [LucideAngularModule],
  templateUrl: './select-system.html',
  styleUrl: './select-system.css',
})


export class SelectSystem {
  systems: any[] = [];

  // Mapa sistema → icono
  systemIcons: Record<string, any> = {
    citas: Calendar,
    escolar: GraduationCap,
    inventarios: Boxes,
  };


  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void { 
    console.log('Token desde selector de sistemas: ', localStorage.getItem('auth_token'));
    this.systems = this.auth.getSystems();

    if (this.systems.length === 1) {
      this.selectSystem(this.systems[0]);
    }
  }

  selectSystem(system: any) {
    this.auth.setCurrentSystem(system);

    // redirección por key
    this.router.navigate([`/systems/${system.subsystem_key}`]);
  }

  getIcon(systemKey: string) {
    return this.systemIcons[systemKey] || Boxes;
  }
}
