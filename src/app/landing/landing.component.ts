import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Registration } from '../shared/registration/registration';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [CommonModule, Registration, LoginComponent],
})
export class LandingComponent {
  isRegistrationModalOpen = false;
  isLoginModalOpen = false;
  registrationRoleId = 1;

  constructor(private router: Router) {}

  openLoginModal() {
    this.isLoginModalOpen = true;
    this.router.navigate(['/login']);
  }

  openStudentRegistration() {
    this.registrationRoleId = 1; // Student role
    this.isRegistrationModalOpen = true;
  }

  openTrainerRegistration() {
    this.registrationRoleId = 2; // Trainer role
    this.isRegistrationModalOpen = true;
  }

  closeRegistrationModal() {
    this.isRegistrationModalOpen = false;
  }

  onRegistrationSuccess() {
    // Handle successful registration if needed
    console.log('Registration successful');
  }

  closeModal(modalId: string) {
    if (modalId === 'loginModal') {
      this.isLoginModalOpen = false;
    }
  }
}
