import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { AuthNavigation } from '../services/auth-navigation';
import { Notification } from '../../services/notification.service';
import { AuthService } from '../../core/services/auth.service';

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

  constructor(
    private router: Router,
    public nav: AuthNavigation,
    private notify: Notification,
    private authService: AuthService) { }

  loginForm = new FormGroup({
    //login: new FormControl('', [Validators.required]),
    //password: new FormControl('', [Validators.required])
    login: new FormControl('michell_admin', [Validators.required]),
    password: new FormControl('Admin@123456', [Validators.required])
  });

  get login() {
    return this.loginForm.get('login');
  }
  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(event: Event) {
    // Previene la recarga de la página por defecto
    event.preventDefault();

    if (this.loginForm.invalid) {
      this.notify.error("Algunos campos contienen información incorrecta o incompleta. Por favor, revísalos y vuelve a intentarlo.");
      this.markAllAsTouched(this.loginForm);
      return; // Detener el envío si es inválido
    }

    // Consultar los datos
    if (this.isSubmitting) {
      return; // Si ya se está enviando, no hacer nada
    }
    this.isSubmitting = true;

    // Normalizamos los datos antes de enviarlos
    const payload = {
      login: this.loginForm.value.login ?? undefined,
      password: this.loginForm.value.password ?? '',
    };

    // Llama al servicio 
    this.authService.login(payload).subscribe({
      next: (res) => {
        this.notify.success('Acceso concedido!!!');
      },
      error: (err) => {
        if (err.status === 401) {
          this.isSubmitting = false;
          // Errores de validación de Laravel
          let messages = err.error?.message || 'Error al iniciar sesión';
          this.notify.error(messages);
        } else {
          this.notify.error('Error en el servidor, intenta más tarde');
        }
      }
    });
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
