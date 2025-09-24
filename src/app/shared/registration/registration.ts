import { Component, EventEmitter, Input, Output, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ToastComponent } from '../toast/toast';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.html',
  styleUrls: ['./registration.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ToastComponent],
})
export class Registration implements OnInit {
  @ViewChild(ToastComponent) toast!: ToastComponent;
  @Input() isOpen: boolean = false;
  @Input() roleId: number = 2;
  @Output() closed = new EventEmitter<void>();
  @Output() registrationSuccess = new EventEmitter<void>();

  registerForm!: FormGroup;
  otpForm!: FormGroup;
  registerError: string | null = null;
  isLoading: boolean = false;
  isResending: boolean = false;
  currentStep: 'form' | 'otp' = 'form';
  resendCooldown: number = 0;
  private cooldownSubscription?: Subscription;

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(1)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatchValidator }
    );

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { passwordMismatch: true } : null;
  };

  // Step 1: Send OTP - Simplified with proper text response handling
  onSendOtp() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registerError = null;

    const email = this.registerForm.get('email')?.value;

    this.authService.sendOtp(email).subscribe({
      next: (response: any) => {
        // Response will be the plain text "Otp sent"
        this.handleOtpSuccess();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('OTP send error:', err);
        
        // Check if it's actually a success but parsing error
        if (err.status === 200 && err.error && err.error.text === 'Otp sent') {
          // This is actually a success - backend sent OTP but Angular had parsing issues
          this.handleOtpSuccess();
        } else {
          // Real error occurred
          this.registerError = err.error?.message || 'Failed to send OTP. Please try again.';
        }
      },
    });
  }

  private handleOtpSuccess() {
    this.isLoading = false;
    this.currentStep = 'otp';
    this.startResendCooldown();
    this.registerError = null;
    
    this.toast.message = 'OTP sent to your email! 📧';
    this.toast.type = 'success';
    this.toast.show = true;
    this.toast.hideAfterDelay();
  }

  // Step 2: Verify OTP and Register
  onVerifyOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.registerError = null;

    const formValue = this.registerForm.value;
    const otpValue = this.otpForm.get('otp')?.value;

    const payload = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      email: formValue.email,
      password: formValue.password,
      roleId: this.roleId,
      otp: otpValue
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.registerError = null;
        this.registrationSuccess.emit();
        this.onClose();
        
        this.toast.message = 'User registration successful! 🎉';
        this.toast.type = 'success';
        this.toast.show = true;
        this.toast.hideAfterDelay();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration error:', err);
        
        if (err.error?.message) {
          this.registerError = err.error.message;
        } else if (err.status === 400) {
          this.registerError = 'Invalid or expired OTP. Please try again.';
        } else {
          this.registerError = 'Registration failed. Please try again.';
        }
      },
    });
  }

  // Resend OTP functionality
  onResendOtp() {
    if (this.resendCooldown > 0) return;

    this.isResending = true;
    const email = this.registerForm.get('email')?.value;

    this.authService.sendOtp(email).subscribe({
      next: (response: any) => {
        this.isResending = false;
        this.startResendCooldown();
        
        this.toast.message = 'OTP resent successfully! 📧';
        this.toast.type = 'success';
        this.toast.show = true;
        this.toast.hideAfterDelay();
      },
      error: (err) => {
        this.isResending = false;
        
        // Check if it's actually a success but parsing error
        if (err.status === 200 && err.error && err.error.text === 'Otp sent') {
          this.isResending = false;
          this.startResendCooldown();
          
          this.toast.message = 'OTP resent successfully! 📧';
          this.toast.type = 'success';
          this.toast.show = true;
          this.toast.hideAfterDelay();
        } else {
          this.registerError = err.error?.message || 'Failed to resend OTP. Please try again.';
        }
      },
    });
  }

  // Cooldown timer for resend OTP
  private startResendCooldown() {
    this.resendCooldown = 60;
    this.cooldownSubscription?.unsubscribe();
    this.cooldownSubscription = interval(1000).subscribe(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        this.cooldownSubscription?.unsubscribe();
      }
    });
  }

  onClose() {
    this.registerForm.reset();
    this.otpForm.reset();
    this.registerError = null;
    this.isLoading = false;
    this.currentStep = 'form';
    this.resendCooldown = 0;
    this.cooldownSubscription?.unsubscribe();
    this.closed.emit();
  }

  // Helper methods for form validation
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  hasOtpFieldError(fieldName: string): boolean {
    const field = this.otpForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field || !field.errors) return '';

    if (field.errors['required']) {
      switch (fieldName) {
        case 'firstName':
          return 'First name is required (minimum 2 characters)';
        case 'lastName':
          return 'Last name is required';
        case 'email':
          return 'Email address is required';
        case 'password':
          return 'Password is required';
        case 'confirmPassword':
          return 'Please confirm your password';
        default:
          return 'This field is required';
      }
    }

    if (field.errors['minlength']) {
      if (fieldName === 'firstName') return 'First name must be at least 2 characters long';
      if (fieldName === 'password') return 'Password must be at least 6 characters long';
    }

    if (field.errors['email']) return 'Please enter a valid email address';

    return 'Invalid input';
  }

  ngOnDestroy() {
    this.cooldownSubscription?.unsubscribe();
  }
}