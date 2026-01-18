import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { NgxIntlTelInputModule, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { AuthNavigation } from '../services/auth-navigation';
//import { Utils } from '../../services/utils';

@Component({
  selector: 'app-register',
  imports: [RouterModule, ReactiveFormsModule, LucideAngularModule, NgxIntlTelInputModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  showPassword = false;
  isSubmitting = false;
  pattern: RegExp = /^[a-zA-Z0-9\sÁÉÍÓÚáéíóúñÑ]+$/;
  patternPassword: RegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$#%])[A-Za-z\d@$#%]{8,15}$/;
  itemsSystems: any[] = []; 
  itemDefault: any;

  PhoneNumberFormat = PhoneNumberFormat;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Mexico, CountryISO.UnitedStates];

  //constructor(private router: Router, private _utils: Utils) { }
  constructor(private router: Router, public nav: AuthNavigation) { }

  registrationForm = new FormGroup({
    firstName: new FormControl('Diana', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.pattern)]),
    lastName: new FormControl('Islas', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern(this.pattern)]),
    //phone: new FormControl(undefined, [Validators.required]),
    phone: new FormControl('7702021345', [Validators.required]),
    system: new FormControl(null, [Validators.required]),
    email: new FormControl('diana@mail.com', [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
    password: new FormControl('and011235Mrom@', [Validators.required, Validators.pattern(this.patternPassword)])
  });

  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get phone() {
    return this.registrationForm.get('phone');
  }
  get system() {
    return this.registrationForm.get('system');
  }
  get email() {
    return this.registrationForm.get('email');
  }
  get password() {
    return this.registrationForm.get('password');
  }

  ngOnInit(): void {}

  loadServices() {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    alert("ahi vanos man");
  }

  private sendDataToBackend(token: string | null) {}

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
