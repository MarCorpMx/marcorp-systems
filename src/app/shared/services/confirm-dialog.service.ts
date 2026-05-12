import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {

  visible = signal(false);

  title = signal('');
  message = signal('');

  btnCancelText = signal('Cancelar');
  btnConfirmText = signal('Confirmar');

  btnThirdText = signal('');
  showThirdButton = signal(false);

  onConfirm?: () => void;
  onThird?: () => void;

  open(
    title: string,
    message: string,
    onConfirm: () => void,
    btnCancelText?: string,
    btnConfirmText?: string,
    thirdButton?: {
      text: string;
      action: () => void;
    }
  ) {
    this.title.set(title);
    this.message.set(message);

    this.btnCancelText.set(btnCancelText ?? 'Cancelar');
    this.btnConfirmText.set(btnConfirmText ?? 'Confirmar');

    this.onConfirm = onConfirm;

    /* tercer botón opcional */
    if (thirdButton) {
      this.btnThirdText.set(thirdButton.text);
      this.onThird = thirdButton.action;
      this.showThirdButton.set(true);
    } else {
      this.btnThirdText.set('');
      this.onThird = undefined;
      this.showThirdButton.set(false);
    }

    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }

  confirm() {
    this.onConfirm?.();
    this.close();
  }

  third() {
    this.onThird?.();
    this.close();
  }
}