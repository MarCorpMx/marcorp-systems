import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  imports: [CommonModule],
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css',
})

export class ConfirmDialog {
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro de continuar?';
  
  confirmDialog = inject(ConfirmDialogService);

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

}
