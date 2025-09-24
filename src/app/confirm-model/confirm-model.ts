import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-model',
  imports: [FormsModule,NgIf],
  templateUrl: './confirm-model.html',
  styleUrl: './confirm-model.css',
})
export class ConfirmModel {
  @Input() show = false; // open/close
  @Input() title = 'Confirm'; // modal header
  @Input() message = 'Are you sure?'; // body text
  @Input() confirmText = 'Yes';
  @Input() cancelText = 'No';

  @Input() showReasonInput = false; // for rejection
  @Input() reason = '';
  @Output() reasonChange = new EventEmitter<string>();

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  closeOnOverlay(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.cancel.emit();
    }
  }
}
