import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ConfirmDialogService {
  visible = signal(false);
  title = signal('');
  message = signal('');
  btnCancelText = signal('Cancelar');
  btnConfirmText = signal('Cerrar sesión');
  onConfirm?: () => void;

  open(
    title: string,
    message: string,
    onConfirm: () => void,
    btnCancelText?: string,
    btnConfirmText?: string
  ) {
    this.title.set(title);
    this.message.set(message);
    this.btnCancelText.set(btnCancelText ?? 'Cancelar');
    this.btnConfirmText.set(btnConfirmText ?? 'Cerrar sesión');
    this.onConfirm = onConfirm;
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }

  confirm() {
    this.onConfirm?.();
    this.close();
  }
  
}
