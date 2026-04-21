import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
  animations: [
    trigger('routeAnimation', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AuthLayout {
  leftTitle: string = 'Administra tus citas y clientes desde un solo lugar.';
  urlImg = 'marcorp/images/authLayout_left.png';

  constructor(public route: ActivatedRoute, public router: Router) { }



  ngOnInit(): void {
    this.router.events.subscribe(() => {
      const child = this.route.firstChild;

      if (child?.snapshot.data?.['leftTitle']) {
        this.leftTitle = child.snapshot.data['leftTitle'];
      }
    });
  }

}
