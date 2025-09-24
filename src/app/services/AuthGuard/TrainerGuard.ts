import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { AuthService } from '../auth/auth.service';

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
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('authToken');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const decoded = jwt_decode.jwtDecode<CustomJwtPayload>(token);
      const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('role', role);

      // route the user based on their role
      if (role === 'Trainer') {
        return true;
      } else {
        alert('Access denied for your role!');
        this.router.navigate(['/']);
        return false;
      }
    } catch (err) {
      console.error('Invalid token', err);
      this.router.navigate(['/']);
      return false;
    }
  }
}
