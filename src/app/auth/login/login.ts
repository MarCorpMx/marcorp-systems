import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { AuthNavigation } from '../services/auth-navigation';
//import { Utils } from '../../services/utils';


@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  showPassword = false;
  isSubmitting = false;
  itemsSystemsUser: any[] = []; 

  //constructor(private router: Router, private _utils: Utils) { }
  constructor(private router: Router, public nav: AuthNavigation) { }

  loginForm = new FormGroup({
    username: new FormControl('diana@mail.com', [Validators.required]),
    password: new FormControl('and011235Mrom#', [Validators.required])
  });

  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    alert("provando ando");
  }

  markAllAsTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }

}
