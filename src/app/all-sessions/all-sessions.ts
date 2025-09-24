import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { Sessioncards } from "../sessioncards/sessioncards";

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
  selector: 'app-all-sessions',
  imports: [Sessioncards],
  templateUrl: './all-sessions.html',
  styleUrl: './all-sessions.css',
})
export class AllSessions {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  sessions: Session[] = []; // store sessions from API

  constructor(private sessionService: UserService) {}

  ngOnInit() {
    this.loadSessions();
  }

  

  loadSessions() {
    this.sessionService.getAllSessions().subscribe({
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

  formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
