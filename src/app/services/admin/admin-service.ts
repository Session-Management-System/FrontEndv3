import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `${environment.apiBaseUrl}`;
  constructor(private http: HttpClient, private auth: AuthService) {}

  getPendingSessions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Admin/pending-sessions`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
  getUserStats() {
    return this.http.get<any>(`${this.apiUrl}/Admin/Active-user-trainers`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getCompletedSessionsCount(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Admin/session-stats`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  getAllSessions(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Session`, {
      headers: this.auth.getAuthHeaders(),
    });
  }

  approveSessionById(sessionId: number): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/Admin/approve-session/${sessionId}`,
      {},
      {
        headers: this.auth.getAuthHeaders(),
      }
    );
  }
  rejectSessionById(sessionId: number, comment: string): Observable<any> {
    let headers = this.auth.getAuthHeaders().set('Content-Type', 'application/json'); // chain on HttpHeaders

    return this.http.post<any>(
      `${this.apiUrl}/Admin/reject-session/${sessionId}`,
      JSON.stringify(comment), // raw string
      { headers }
    );
  }

  LoadUsers(RoleId:number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/Admin/Get-user-Details/${RoleId}`, {
      headers: this.auth.getAuthHeaders(),
    });
  }
}
