// user-menu.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { HelpSupport } from "../help-support/help-support";

@Component({
  selector: 'app-user-menu',
  imports: [CommonModule, HelpSupport], // Add CommonModule for *ngIf, *ngFor etc.
    templateUrl: './user-menu.html',
  styleUrl: './user-menu.css'
})
export class UserMenu implements OnInit {
  isProfileDropdownOpen = false;
  isHelpModalActive = false; // Add help modal state
  username: string | null = '';
  
  constructor(private auth: AuthService, private router: Router) {
  }
  
  ngOnInit(): void {
    this.username = this.auth.getUserName();
  }
  
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }
  
  handleAction(action: string, event: Event): void {
    event.preventDefault();
   
    switch(action) {
      case 'profile':
        alert('Redirecting to profile page...');
        break;
      case 'settings':
        alert('Redirecting to account settings...');
        break;
      case 'help':
        // Open help modal instead of alert
        this.isHelpModalActive = true;
        break;
      case 'logout':
        alert('Logging out...');
        this.auth.logout();
        this.router.navigate(['/']);
        break;
    }
   
    this.toggleProfileDropdown();
  }

  // Handle help modal state changes
  onHelpModalChange(isActive: boolean): void {
    this.isHelpModalActive = isActive;
  }
}