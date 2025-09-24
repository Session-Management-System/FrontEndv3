import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { UpcomingSessions } from '../upcoming-sessions/upcoming-sessions';
import { RecentSessionsComponent } from '../recent-sessions/recent-sessions';
import { AuthService } from '../services/auth/auth.service';
import { UserService } from '../services/user-service/user-service';
import { jwtDecode } from 'jwt-decode';
import { Mysessions } from '../mysessions/mysessions';
import { NgIf } from '@angular/common';
import { AllSessions } from '../all-sessions/all-sessions';
import { SessionHistory } from '../session-history/session-history';
import { Profile } from '../profile/profile';
import { HelpSupport } from '../help-support/help-support';

interface CustomJwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
}

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css'],
  imports: [
    NgIf,
    UpcomingSessions,
    RecentSessionsComponent,
    Mysessions,
    AllSessions,
    SessionHistory,
    Profile,
    HelpSupport,
  ],
})
export class StudentDashboardComponent implements OnInit {
  isMySessions: boolean = false;
  CompletedSessions = 0;
  UpcomingSessions = 0;
  Name?: string;
  Role?: string;
  isAllSessionsOpen = false;
  isHelpModalActive = false;

  constructor(
    private userService: UserService,
    private Auth: AuthService,
    private readonly router: Router
  ) {}
  ngOnInit() {
    this.loadUsersStats();
    this.Profile();
  }
  Profile() {
    const token: string | null = this.Auth.getToken();
    if (token == null) {
      this.router.navigate(['/']);
    }
    const decodedToken = jwtDecode<CustomJwtPayload>(token!);
    this.Name = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
    this.Role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  }

  loadUsersStats() {
    this.userService.getUserStats().subscribe({
      next: (data) => {
        console.log('DATA', data);
        this.CompletedSessions = data.completedSessions;
        this.UpcomingSessions = data.upcomingSessions;
      },
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['/']);
        }
        console.error('Error Fetching Stats:', err);
      },
    });
  }
  isHelpDeskOpen = false;

  openHelpDesk(event: Event) {
    event?.preventDefault();
    this.isHelpModalActive = true;
  }

  isMySessionsOpen = false;

  openMySessions(event?: Event) {
    if (event) event.preventDefault(); // prevent any default link behavior
    this.isMySessionsOpen = true;
  }

  closeMySessions() {
    this.isMySessionsOpen = false;
  }

  MySessions() {
    this.isMySessions = true;
    console.log('My Sessions Clicked');
  }

  navigateToBrowseSessions(event?: Event) {
    if (event) event.preventDefault();
    this.isAllSessionsOpen = true;
    console.log('Browse Sessions Clicked');
  }
  closeAllSessions() {
    this.isAllSessionsOpen = false;
  }

  logout() {
    this.Auth.logout();
    this.router.navigate(['/']);
  }

  isSidebarOpen = false;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.classList.toggle('open', this.isSidebarOpen);
    }
  }

  isSessionHistoryOpen = false;
  openSessionHistory(event?: Event) {
    if (event) event.preventDefault();
    this.isSessionHistoryOpen = true;
    console.log('Session History Clicked');
  }
  closeSessionHistory() {
    this.isSessionHistoryOpen = false;
  }

  isProfileOpen = false;

  openProfile() {
    this.isProfileOpen = true;
  }

  closeProfile() {
    this.isProfileOpen = false;
  }

  isSettingsOpen = false;

  openSettings() {
    this.isSettingsOpen = true;
  }

  closeSettings() {
    this.isSettingsOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (
      window.innerWidth <= 768 &&
      sidebar &&
      menuBtn &&
      !sidebar.contains(event.target as Node) &&
      !menuBtn.contains(event.target as Node)
    ) {
      this.isSidebarOpen = false;
      sidebar.classList.remove('open');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const sidebar = document.getElementById('sidebar');
    if (window.innerWidth > 768 && sidebar) {
      this.isSidebarOpen = false;
      sidebar.classList.remove('open');
    }
  }

  onHelpModalChange(isActive: boolean): void {
    this.isHelpModalActive = isActive;
  }
}
