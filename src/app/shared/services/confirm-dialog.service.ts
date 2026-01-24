import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class ConfirmDialogService {
  visible = signal(false);
  title = signal('');
  message = signal('');
  onConfirm?: () => void;

  open(
    title: string,
    message: string,
    onConfirm: () => void
  ) {
    this.title.set(title);
    this.message.set(message);
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
