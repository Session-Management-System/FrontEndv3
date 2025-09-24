import { JsonPipe, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { StudentDashboardComponent } from '../student-dashboard/student-dashboard.component';
import { Router } from '@angular/router';

interface Session {
  bookingId?: number;
  capacity: number;
  description: string;
  endTime: string;
  isApproved: boolean;
  remainingCapacity: number;
  sessionId: number;
  sessionLink: string;
  startTime: string;
  title: string;
  trainerId: number;
  trainerName: string;
}

@Component({
  selector: 'app-sessioncards',
  imports: [NgClass, JsonPipe],
  templateUrl: './sessioncards.html',
  styleUrl: './sessioncards.css',
})
export class Sessioncards {
  @Input() session!: Session;
  clicked: boolean = false;
  constructor(private userService: UserService, private readonly route: Router) {}
  ngOnInit() {
    // this.loadSessions();
  }

  handleClick() {
    this.clicked = !this.clicked;
  }

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  showConfirmModal = false;

  openConfirmModal() {
    this.showConfirmModal = true;
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
  }

  confirmRegistration() {
    // TODO: call API or service
    console.log('User confirmed registration for session:', this.session.sessionId);
    this.userService.bookSession(this.session.sessionId).subscribe({
      next: (response) => {
        console.log('Session booked successfully:', response);
      },
      error: (err) => {
        console.error('Error booking session:', err);
      },
    });
    this.closeConfirmModal();
    this.route.navigate(['student']);

    // Optionally, show a success message or update UI
  }

  closeOnOverlay(event: MouseEvent) {
    // close only if user clicked on background overlay, not modal content
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.closeConfirmModal();
    }
  }

  // loadSessions() {
  //   this.sessionService.getAllSessions().subscribe({
  //     next: (data: Session[]) => {
  //       // assuming API returns an array of session objects
  //       this.sessions = data;
  //       console.log('Sessions loaded:', this.sessions);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching sessions', err);
  //     },
  //   });
  // }
}
