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
  private apiUrlDeleteUser = 'http://127.0.0.1:8000/api/auth/delete-user/<str:username>/';
  private fullNameUrl = ''
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post(this.apiUrlLogin, body);
  }

  validateName(completeName: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/auth/validate-name/', {
      complete_name: completeName
    });
  }

  signup(first_name: string, last_name: string, username: string, email: string, password: string): Observable<any> {
    return this.http.post('http://127.0.0.1:8000/api/auth/signup/', {
      first_name,
      last_name,
      username,
      email,
      password
    });
  }
  

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      // estamos en SSR o test, localStorage no existe
      return false;
    }
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }
}
