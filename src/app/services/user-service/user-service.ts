import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient, private auth: AuthService) {}

  getUserStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/stats`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getSessionDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/Bookings/upcoming`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getCompletedSessionDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/completed`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getMySessions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/Bookings`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getAllSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/User/available-sessions`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  bookSession(sessionId: number): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/User/Book/${sessionId}`,
      { sessionId },
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/User/details`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  putUserDetails(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/User/update-profile`, data, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  withdrawSession(bookingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/User/cancel/${bookingId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
