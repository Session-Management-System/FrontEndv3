import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user-service/user-service';
import { NgIf } from '@angular/common';
import { Mysessions } from "../mysessions/mysessions";

interface Session {
  bookingId: number;
  sessionId: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  trainerName: string;
  sessionDate?: string; // Today / Tomorrow / actual date
  sessionHour?: string; // formatted start time
  sessionEndHour?: string;
}

@Component({
  selector: 'app-upcoming-sessions',
  standalone: true,
  imports: [NgIf, Mysessions],
  templateUrl: './upcoming-sessions.html',
  styleUrl: './upcoming-sessions.scss',
})
export class UpcomingSessions implements OnInit {
  sessions: Session[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadSessions();
  }
  isOpen: boolean = false;

  handleClick() {
    this.isOpen = true;
    console.log('Session card clicked');
  }

  loadSessions() {
    console.log('Loading upcoming sessions...');
    this.userService.getSessionDetails().subscribe({
      next: (data: Session[]) => {
        const today = new Date();

        this.sessions = data.map((session) => {
          const start = new Date(session.startTime.replace('T', ' '));
          const end = new Date(session.endTime.replace('T', ' '));

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
          const sessionEndHour = end.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          // Compute status
          const now = new Date();
          const status = now < start ? 'Upcoming' : now > end ? 'Completed' : 'Ongoing';

          // Build session object explicitly
          return {
            bookingId: session.bookingId,
            sessionId: session.sessionId,
            title: session.title,
            description: session.description,
            startTime: session.startTime,
            endTime: session.endTime,
            trainerName: session.trainerName,
            sessionDate,
            sessionHour,
            sessionEndHour,
            status,
          };
        });

        console.log(this.sessions);
      },
      error: (err) => console.error(err),
    });
  }
}
