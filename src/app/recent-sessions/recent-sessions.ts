import { Component } from '@angular/core';
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
  selector: 'app-recent-sessions',
  standalone: true,
  imports: [],
  templateUrl: './recent-sessions.html',
  styleUrl: './recent-sessions.scss',
})
export class RecentSessionsComponent {
  sessions: Session[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadSessions();
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

  limitedSessions = this.sessions.slice(0, 3);
}
