import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
//import { Utils } from './services/utils';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  leftTitle: string = 'Bienvenido al núcleo central de operaciones.';
  urlImg = 'marcorp/images/authLayout_left.png';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const child = this.route.firstChild;

      if (child?.snapshot.data?.['leftTitle']) {
        this.leftTitle = child.snapshot.data['leftTitle'];
      }
    });
  }

}
