import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import * as jwt_decode from 'jwt-decode';

interface LoginRequest {
  email: string;
  password: string;
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  otp?: string;
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
  private apiUrl = `${environment.apiBaseUrl}/Auth`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  register(data: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/register`, data);
  }

  // Fixed: Handle text response properly
  sendOtp(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Use responseType: 'text' to handle plain text responses
    return this.http.post(`${this.apiUrl}/Send-otp`, JSON.stringify(email), { 
      headers,
      responseType: 'text' as 'json' // This tells Angular to expect text response
    });
  }

  // Forgot password functionality
  forgotPassword(email: string, otp: string, newPassword: string): Observable<any> {
    const request = {
      Email: email,
      Otp: otp,
      NewPassword: newPassword
    };
    
    return this.http.put(`${this.apiUrl}/forgot-password`, request);
  }

  saveToken(token: string) {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  }

  getUserName(): string | null {
    return localStorage.getItem('username');
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decoded = jwt_decode.jwtDecode<CustomJwtPayload>(token);
      return decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwt_decode.jwtDecode<CustomJwtPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error checking token validity:', error);
      return false;
    }
  }
}