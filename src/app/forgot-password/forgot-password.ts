import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, NgIf],
  standalone: true,
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email: string = '';
  otp = '';
  newPassword = '';
  errorMessage = '';
  @Output() close = new EventEmitter<void>();
  @Input() isOpen: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onClose() {
    this.email = '';
    this.otp = '';
    this.newPassword = '';
    this.close.emit();
  }

  sendOtp() {
    this.authService.sendotp(this.email).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Otp Verification Failed';
      },
    });
  }
  onChangePassword() {
    console.log('called');

    console.log(this.email, this.otp, this.newPassword);
    this.authService
      .onChangePassword({ email: this.email, otp: this.otp, newPassword: this.newPassword })
      .subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          console.log(err);
          this.errorMessage = err.error?.message || 'Password Change Failed';
        },
      });
  }
}
