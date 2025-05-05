import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { error } from "node:console";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
    private apiUrlCard = 'http://127.0.0.1:8000/api/auth/flashcards/';
    private apiUrlCreate = 'http://127.0.1:8000/api/auth/create-card/';
    private apiUrl = 'http://127.0.0.1:8000/api/auth/';

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    getFlashcards(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(this.apiUrlCard, { headers }).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                } else if (error.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error);
            })
        );
    }

    createFlashcard(data: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(this.apiUrlCreate, data, { headers }).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                } else if (error.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error);
            })
        );
    }

    // Obtener encabezados de autenticación
    private getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();

        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return headers;
    }

    // Obtener todas las tarjetas favoritas
    getFavoriteCards(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}favorites/`, { headers }).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                } else if (error.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error);
            })
        );
    }

    // Agregar una tarjeta a favoritos
    addFavorite(cardId: number): Observable<any> {
        console.log('Adding card to favorites with ID:', cardId); // Depuración
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}${cardId}/favorite/`, {}, { headers }).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                } else if (error.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error);
            })
        );
    }

    // Eliminar una tarjeta de favoritos
    removeFavorite(cardId: number): Observable<any> {
        console.log('Removing card from favorites with ID:', cardId); // Depuración
        const headers = this.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}${cardId}/favorite/`, { headers }).pipe(
            catchError((error) => {
                if (error.status === 401) {
                    console.error('Unauthorized: Please log in again.');
                } else if (error.status === 404) {
                    console.error('Resource not found.');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
                return throwError(() => error);
            })
        );
    }// Obtener tarjetas favoritas
}