import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthNavigation } from '../services/auth-navigation';
import { Notification } from '../../services/notification.service';

@Component({
  selector: 'app-recover-password',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './recover-password.html',
  styleUrl: './recover-password.css',
})
export class RecoverPassword {
  isSubmitting = false;

  constructor(
    private router: Router,
    public nav: AuthNavigation,
    private notify: Notification
  ) { }

  recoverForm = new FormGroup({
    login: new FormControl('', [Validators.required])
  });

  get login() {
    return this.recoverForm.get('login');
  }

  onSubmit(event: Event) {
    // Previene la recarga de la página por defecto
    event.preventDefault();

    if (this.recoverForm.invalid) {
      this.notify.error("Algunos campos contienen información incorrecta o incompleta. Por favor, revísalos y vuelve a intentarlo.");
      this.markAllAsTouched(this.recoverForm);
      return; // Detener el envío si es inválido
    }

    this.notify.success('Se han enviado las instrucciones al correo proporcionado en el registro');
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
