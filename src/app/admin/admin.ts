import { Component, HostListener } from '@angular/core';
import { AdminPending } from '../admin-pending/admin-pending';
import { AdminService } from '../services/admin/admin-service';
import { AdminSessions } from '../admin-sessions/admin-sessions';
import { NgIf } from '@angular/common';
import { Users } from '../users/users';
import { Trainers } from '../trainers/trainers';
import { AuthService } from '../services/auth/auth.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  imports: [AdminPending, AdminSessions, NgIf, Users, Trainers],
})
export class Admin {
  sidebarOpen: boolean = false;

  constructor(
    private Auth: AuthService,
    private Route: Router,
    private adminService: AdminService,
    private router: Router
  ) {}

  totalSessionsCount: number = 0;
  totalTrainers: number = 0;
  totalUsers: number = 0;
  AdminName!: string | null;
  activeSessions: number = 0;
  ngOnInit() {
    this.AdminName = this.Auth.getUserName();
    this.fetchUserStats();
    this.fetchSessionStats();
  }
  fetchUserStats() {
    this.adminService.getUserStats().subscribe({
      next: (data: any) => {
        this.totalTrainers = data.trainerCount;
        this.totalUsers = data.userCount;
      },
      error: (error) => {
        if (error.status === 403) {
          this.router.navigate(['/']);
        }
      },
    });
  }

  logout() {
    this.Auth.logout();
    this.Route.navigate(['/']);
  }

  isAllUsersOpen: boolean = false;
  openAllUsers() {
    console.log('Navigating to all users view...');
    this.isAllUsersOpen = true;
  }
  closeAllUsers() {
    this.isAllUsersOpen = false;
  }

  isAllTrainersOpen: boolean = false;

  openAllTrainers() {
    this.isAllTrainersOpen = true;
  }

  closeAllTrainers() {
    this.isAllTrainersOpen = false;
  }

  fetchSessionStats() {
    this.adminService.getCompletedSessionsCount().subscribe(
      (data: any) => {
        console.log('Session Stats:', data);
        this.totalSessionsCount = data.totalSessions;
        this.activeSessions = data.totalSessions - data.completedSessions;
      },
      (error) => {
        console.error('Error fetching session stats:', error);
      }
    );
  }

  isSessionsOpen: boolean = false;

  openAllSessions() {
    // Logic to navigate to or display all sessions
    console.log('Navigating to all sessions view...');
    this.isSessionsOpen = true;
  }

  closeSessions() {
    this.isSessionsOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) {
      this.sidebarOpen = false;
    }
  }

  // Close sidebar on mobile if clicked outside
  closeSidebarOnOutsideClick(event: Event) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (
      window.innerWidth <= 768 &&
      sidebar &&
      menuBtn &&
      !sidebar.contains(event.target as Node) &&
      !menuBtn.contains(event.target as Node)
    ) {
      this.sidebarOpen = false;
    }
  }
}
