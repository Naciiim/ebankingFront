import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../model/auth-response.model';
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        localStorage.setItem('token', <string>response.token);
      })
    );
  }

  saveToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token); // Utilise sessionStorage au lieu de localStorage
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }



  getUserRole(): string[] {
    const token = this.getToken();
    if (token) {
      const decodedToken: any = jwt_decode(token);
      return Array.isArray(decodedToken.roles) ? decodedToken.roles : [decodedToken.roles];
    }
    return [];
  }

  isAdmin(): boolean {
    const roles = this.getUserRole();
    return roles.includes('ADMIN'); // Adaptez en fonction du nom exact du rôle dans votre backend
  }


  hasRole(role: string): boolean {
    const userRoles = this.getUserRole();
    return userRoles.includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    const userRoles = this.getUserRole();
    return roles.some(role => userRoles.includes(role));
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decodedToken: any = jwt_decode(token);
      const currentTime = Date.now() / 1000;
      return decodedToken.exp > currentTime;
    } catch {
      return false;
    }
  }

  logout(): Observable<any> {
    console.log('Requête Logout envoyée');
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        // Supprimer le token de la session après la déconnexion
        sessionStorage.removeItem(this.TOKEN_KEY);
      })
    );
  }


  changePassword(email: string, newPassword: string, confirmPassword: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/change-password?email=${email}&newPassword=${newPassword}&confirmPassword=${confirmPassword}`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<AuthResponse>(url, null, { headers }).pipe(
      tap((response: AuthResponse) => {
        if (response.redirectUrl) {
          if (response.redirectUrl === '/api/auth/login') {
            this.router.navigate(['/login1']);
          } else {
            this.router.navigate([response.redirectUrl]);
          }
        }
      })
    );
  }
}
