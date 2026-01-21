import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  constructor(private snackBar: MatSnackBar) { }

  success(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'X', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-success']
    });
  }

  error(message: string, duration: number = 4000) {
    this.snackBar.open(message, 'X', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error']
    });
  }

  info(message: string, duration: number = 3000) {
    this.snackBar.open(message, 'X', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-info']
    });
  }

  warning(message: string, duration: number = 3500) {
    this.snackBar.open(message, 'X', {
      duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-warning']
    });
  }

}
