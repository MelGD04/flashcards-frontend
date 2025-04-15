import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/users/';
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  signUp(username:string, name:string, last_name:string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}`, { username,name, last_name, email, password });
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('access_token');
      return !!token;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }
}
