import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthRoutesEnum } from '../auth-routes.enum';

@Injectable({
  providedIn: 'root',
})

export class AuthNavigation {

  constructor(private router: Router) { }

  goToLogin(): Promise<boolean> {
    return this.router.navigateByUrl(AuthRoutesEnum.LOGIN);
  }

  goToRegister(): Promise<boolean> {
    return this.router.navigateByUrl(AuthRoutesEnum.REGISTER);
  }

  // goToRegister(): void {
  //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
  //     this.router.navigate([AuthRoutesEnum.REGISTER], { replaceUrl: true });
  //   });
  // }

  goToForgotPassword(): Promise<boolean> {
    return this.router.navigateByUrl(AuthRoutesEnum.FORGOT_PASSWORD);
  }
}
