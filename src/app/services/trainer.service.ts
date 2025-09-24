// trainer.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { AuthService } from './auth.service';

export interface SessionDto {
  title: string;
  description: string;
  capacity: number;
  startTime: string;
  endTime: string;
  sessionLink: string;
}

export interface Session {
  sessionId: number;
  title: string;
  description: string;
  capacity: number;
  remainingCapacity: number;
  startTime: string;
  endTime: string;
  isApproved: boolean;
  sessionLink: string;
  trainerId: number;

}

export interface SessionStat {
  completedSessions: number;
  upcomingSessions: number;
}



@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private apiUrl = `${environment.apiBaseUrl}/Trainer`;
  private sessionapiUrl = `${environment.apiBaseUrl}/Session`;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }



  createSession(sessionData: SessionDto): Observable<{ message: string }> {
    console.log(sessionData);
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/create-session`,
      sessionData,
      { headers: this.authService.getAuthHeaders() }
    );
  }


  getPendingSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/pending-sessions`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getApprovedSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/approved-sessions`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getMySessions(): Observable<Session[]> {
    return this.http.get<Session[]>(
      `${this.apiUrl}/my-sessions`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getSessionStats(): Observable<SessionStat> {
    return this.http.get<SessionStat>(
      `${this.apiUrl}/session-stats`,
      {
        headers: this.authService.getAuthHeaders()
      }
    );
  }
  deleteSession(id: number): Observable<any> {
    console.log(`${id}delete session id value{id}`)
    return this.http.delete<any>(
      `${this.sessionapiUrl}/${id}`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  // Format date to display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

}