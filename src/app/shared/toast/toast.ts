import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.css'],
  imports:[CommonModule]
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';
  @Input() show = false;

  hideAfterDelay() {
    setTimeout(() => {
      this.show = false;
    }, 3000); // Auto-hide after 3s
  }
}
