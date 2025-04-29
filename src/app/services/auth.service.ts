import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  private apiUrlLogin = 'http://127.0.0.1:8000/api/auth/login/';
  private apiUrlSignUp = 'http://127.0.0.1:8000/api/auth/signup/';
  private apiUrlValidateName = 'http://127.0.0.1:8000/api/auth/validate-name/'
  private fullNameUrl = ''
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post(this.apiUrlLogin, body);
  }

  signup(full_name:string, username:string, email:string, password:string): Observable<any>{
    const body = {full_name, username, email, password};

    return this.http.post(this.apiUrlSignUp, body);
  }

  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('token');
      return !!token;
    }
    return false;
  }

  validateFullName(fullName: string) {
    return this.http.post<any>(this.apiUrlValidateName, { full_name: fullName });
  }


}
