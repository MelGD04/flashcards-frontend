import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrlLogin = 'http://127.0.0.1:8000/api/auth/login/';
  private apiUrl = 'http://127.0.0.1:8000/api/auth/';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };
    return this.http.post(this.apiUrlLogin, body).pipe(
      tap((res: any) => {
        if (this.isBrowser && res.access && res.refresh) {
          localStorage.setItem('access_token', res.access);
          localStorage.setItem('refresh_token', res.refresh);
        }
      })
    );
  }

  signup(first_name: string, last_name: string, username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}signup/`, {
      first_name,
      last_name,
      username,
      email,
      password
    });
  }

  validateName(completeName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}validate-name/`, {
      complete_name: completeName
    });
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  private getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('access_token');
  }

  private getAuthHeaders(): HttpHeaders {
    if (!this.isBrowser) {
      console.warn('Not running in a browser environment.');
      return new HttpHeaders();
    }
    const token = this.getToken();
    if (!token) {
      console.warn('No access token found in localStorage.');
      return new HttpHeaders();
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCurrentUser(): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('User is not authenticated'));
    }
    return this.http.get(`${this.apiUrl}current-user/`, { headers: this.getAuthHeaders() });
  }

  deleteAuthenticatedUser(): Observable<any> {
    if (!this.isAuthenticated()) {
      return throwError(() => new Error('User is not authenticated'));
    }
    const url = `${this.apiUrl}delete-user/`;
    return this.http.delete(url, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }
}
