import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user-service/user-service';

interface Session {
  bookingId: number;
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
  selector: 'app-mysessions',
  imports: [],
  templateUrl: './mysessions.html',
  styleUrl: './mysessions.css',
})
export class Mysessions {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  sessions: Session[] = []; // store sessions from API

  constructor(private sessionService: UserService) {}

  ngOnInit() {
    this.loadSessions();
  }

  loadSessions() {
    this.sessionService.getMySessions().subscribe({
      next: (data: Session[]) => {
        // assuming API returns an array of session objects
        this.sessions = data;
        console.log('Sessions loaded:', this.sessions);
      },
      error: (err) => {
        console.error('Error fetching sessions', err);
      },
    });
  }

  onClose(): void {
    this.closeModal.emit();
  }

  selectedBookingId!: number;
  clicked: boolean = false;

  handleClick(BookingId: number) {
    this.clicked = !this.clicked;
    this.selectedBookingId = BookingId;
    console.log(this.selectedBookingId);
  }

  withdraw() {
    console.log('Withdrawing from session...');
    // Logic to withdraw from the session
    this.sessionService.withdrawSession(this.selectedBookingId).subscribe({
      next: (response) => {
        console.log('Withdraw successful:', response);
        this.loadSessions(); // Refresh the sessions list
      },
      error: (err) => {
        console.error('Error withdrawing from session:', err);
      },
    });
  }

  formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  sessionStatus(session: Session) {
    const today = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    if (today < start) {
      return 'Upcoming';
    } else if (today >= start && today <= end) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  }

  formatDateTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }

  remainingStudents(session: Session) {
    return session.capacity - session.remainingCapacity;
  }
}
