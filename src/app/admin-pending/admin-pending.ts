import { Component } from '@angular/core';
import { AdminService } from '../services/admin/admin-service';
import { NgIf } from '@angular/common';
import { AdminSessions } from '../admin-sessions/admin-sessions';

interface Session {
  capacity: number;
  description: string | null;
  endTime: string;
  isApproved: boolean;
  remainingCapacity: number;
  sessionId: number;
  sessionLink: string | null;
  startTime: string;
  title: string;
  trainer: string;
  trainerId: number;
  sessionDate?: string; // Today / Tomorrow / actual date
  sessionHour?: string; // formatted start time
}

@Component({
  selector: 'app-admin-pending',
  imports: [NgIf, AdminSessions],
  templateUrl: './admin-pending.html',
  styleUrl: './admin-pending.css',
})
export class AdminPending {
  constructor(private adminService: AdminService) {}
  pendingSessions: Session[] = [];
  ngOnInit() {
    this.fetchPendingSessions();
  }
  isAdminSessionsOpen: boolean = false;
  openAllSessions(sessionId: number) {
    console.log('Navigating to all sessions view...');
    this.isAdminSessionsOpen = true;
  }
  closeAdminSessions() {
    this.isAdminSessionsOpen = false;
  }
  fetchPendingSessions() {
    this.adminService.getPendingSessions().subscribe(
      (data: Session[]) => {
        const today = new Date();

        this.pendingSessions = data.map((Session) => {
          const start = new Date(Session.startTime.replace('T', ' '));
          const end = new Date(Session.endTime.replace('T', ' '));

          // Compute sessionDate
          const diffDays = Math.floor(
            (start.getFullYear() - today.getFullYear()) * 365 +
              (start.getMonth() - today.getMonth()) * 30 +
              (start.getDate() - today.getDate())
          );

          const sessionDate =
            diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : start.toLocaleDateString();

          // Format times
          const sessionHour = start.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          return { ...Session, sessionDate, sessionHour };
        });
        console.log('Pending Sessions:', this.pendingSessions);
      },
      (error) => {
        console.error('Error fetching pending sessions:', error);
      }
    );
  }
}
