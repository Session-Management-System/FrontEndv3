import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { UserService } from '../services/user-service/user-service';
import { NgIf } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

interface user {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

interface updateUser {
  firstName: string;
  lastName: string;
  email: string;
  OldPassword?: string | null;
  NewPassword?: string | null;
}

@Component({
  selector: 'app-profile',
  imports: [FormsModule, NgIf],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  constructor(
    private userService: UserService,
    private AuthService: AuthService,
    private route: Router
  ) {}

  ngOnInit() {
    this.loadUser();
  }

  user: user = {
    userId: 0,
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  };

  editMode: boolean = false;

  editAndFocus(input: HTMLInputElement) {
    this.editMode = true; // enable editing
    this.isChangePassword = false;
    setTimeout(() => input.focus(), 0); // focus after DOM updates
  }
  OldPassword!: string;
  NewPassword!: string;
  isChangePassword: boolean = false;
  changePassword() {
    console.log('clicked');
    this.isChangePassword = true;
    this.editMode = false;
  }

  loadUser() {
    this.userService.getUserDetails().subscribe({
      next: (data: user) => {
        this.user = data;
        console.log('User loaded:', this.user);
      },
      error: (err) => {
        console.error('Error fetching user', err);
      },
    });
  }

  updatedUser: updateUser = {
    firstName: '',
    lastName: '',
    email: '',
    OldPassword: null,
    NewPassword: null,
  };

  updateData() {
    const confirmLogout = confirm(
      'If you wish to Update you need to logout. Do you want to log out now?'
    );

    if (!confirmLogout) {
      // User clicked Cancel → do nothing
      return;
    }
    if (!this.isChangePassword) {
      this.updatedUser = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      };
    } else {
      this.updatedUser = {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        OldPassword: this.OldPassword,
        NewPassword: this.NewPassword,
      };
    }
    console.log(this.updatedUser);
    this.userService.putUserDetails(this.updatedUser).subscribe({
      next: (data) => {
        console.log('API Response', data);
      },
      error: (err) => {
        console.error('Error updating user', err);
        return
      },
    });

    this.AuthService.logout();
    this.route.navigate(['']);
  }

  passwordError: string = '';

  validatePassword() {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!this.NewPassword) {
      this.passwordError = 'Password is required';
    } else if (!passwordPattern.test(this.NewPassword)) {
      this.passwordError =
        'Password must be at least 8 characters, include 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    } else {
      this.passwordError = '';
    }
  }

  onClose() {
    this.closeModal.emit();
  }
}
