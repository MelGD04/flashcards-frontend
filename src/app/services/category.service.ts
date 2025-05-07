import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/categories/'; // URL base para categorías

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object // Inyección para detectar el entorno
  ) { }

  // Obtener todas las categorías
  getCategories(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(this.apiUrl, { headers }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Crear una nueva categoría
  createCategory(category_name: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.apiUrl}add/`, { category_name }, { headers }).pipe(
      catchError((error) => this.handleError(error))
    );
  }

  // Obtener encabezados de autenticación
  private getAuthHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    // Verificar si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('access_token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      } else {
        console.warn('No access token found in localStorage.');
      }
    } else {
      console.warn('Not running in a browser environment.');
    }

    return headers;
  }

  // Manejo centralizado de errores
  private handleError(error: any): Observable<never> {
    if (error.status === 401) {
      console.error('Unauthorized: Please log in again.');
    } else if (error.status === 404) {
      console.error('Resource not found.');
    } else {
      console.error('An unexpected error occurred:', error);
    }
    return throwError(() => error);
  }
}
