import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Registration } from '../shared/registration/registration';
import { ForgotPassword } from '../forgot-password/forgot-password';

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, LoginComponent, Registration, ForgotPassword], // Make sure LoginComponent is standalone
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true,
})
export class HomePage {
  isRegistrationModalOpen = false;
  isLoginModalOpen = false;
  registrationRoleId = 1;

  constructor(private router: Router) {}

  openLoginModal() {
    this.isLoginModalOpen = true;
    // this.router.navigate(['/login']);
  }

  openStudentRegistration() {
    this.registrationRoleId = 1; // Student role
    this.isRegistrationModalOpen = true;
  }

  openTrainerRegistration() {
    this.registrationRoleId = 2; // Trainer role
    this.isRegistrationModalOpen = true;
  }

  isForgotPasswordModalOpen = false;

  openForgotPasswordModal() {
    this.isForgotPasswordModalOpen = true;
  }

  closeForgotPasswordModal() {
    this.isForgotPasswordModalOpen = false;
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

  faqs = [
    {
      question: 'How do I book a session?',
      answer: "You can browse available sessions and book them through the platform's dashboard.",
      open: false,
    },
    {
      question: 'Can I cancel a booked session?',
      answer: 'Yes, you can cancel a session up to 2 hours before it starts.',
      open: false,
    },
    {
      question: 'How do I become a trainer?',
      answer:
        'You can apply to become a trainer by submitting your qualifications through the platform.',
      open: false,
    },
  ];

  toggleFaq(index: number) {
    this.faqs.forEach((faq, i) => {
      if (i === index) {
        faq.open = !faq.open;
      } else {
        faq.open = false;
      }
    });
  }
}
