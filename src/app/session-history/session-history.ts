import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sessioncards } from '../sessioncards/sessioncards';
import { UserService } from '../services/user-service/user-service';

interface Session {
  sessionId: number;
  title: string;
  description?: string | null;
  startTime: string; // ISO 8601 string from API
  endTime: string; // ISO 8601 string from API
  trainerName: string;
  dayText: string;
}

@Component({
  selector: 'app-session-history',
  imports: [],
  templateUrl: './session-history.html',
  styleUrl: './session-history.css',
})
export class SessionHistory {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  sessions: Session[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadSessions();
  }

  onClose(): void {
    this.closeModal.emit();
  }

  loadSessions() {
    this.userService.getCompletedSessionDetails().subscribe({
      next: (data: Session[]) => {
        const today = new Date();

        this.sessions = data.map((session) => {
          const start = new Date(session.startTime);

          // Compute difference in days
          const diffTime = start.setHours(0, 0, 0, 0) - today.setHours(0, 0, 0, 0);
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

          // Only "Today" or "X day(s) ago"
          const dayText = diffDays === 0 ? 'Today' : `${Math.abs(diffDays)} days ago`;

          return {
            ...session,
            dayText,
          };
        });

        console.log(this.sessions);
      },
      error: (err) => console.error(err),
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
    });
  }
  formatTime(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
