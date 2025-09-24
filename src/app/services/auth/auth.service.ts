import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environments';
import * as jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
// import { IUser } from '../Interfaces/Iuser';

interface LoginRequest {
  email: string;
  password: string;
}
interface ChangePassword {
  email: string;
  otp: string;
  newPassword: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
}
interface AuthResponse {
  token: string;
  expiration: string;
  userName: string;
  role: string;
}

interface CustomJwtPayload {
  exp: number;
  iss: string;
  aud: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiBaseUrl}/Auth`; // 👈 now from environment

  constructor(private http: HttpClient) {}

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(data: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/register`, data);
  }
  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded = jwt_decode.jwtDecode<CustomJwtPayload>(token);
    console.log(decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
    return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }

  getUserName(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    const decoded = jwt_decode.jwtDecode<CustomJwtPayload>(token);
    return decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || null;
  }
  sendotp(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/Send-otp`, JSON.stringify(email), {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }
  onChangePassword(credentials: ChangePassword): Observable<AuthResponse> {
    console.log(credentials);
    return this.http.put<AuthResponse>(`${this.apiUrl}/forgot-password`, credentials);
  }
}
