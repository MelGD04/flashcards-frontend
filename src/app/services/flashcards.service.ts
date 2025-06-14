import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, catchError, Observable, throwError } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
    private apiUrlCard = 'http://127.0.0.1:8000/api/auth/flashcards/';
    private apiUrlCreate = 'http://127.0.0.1:8000/api/auth/create-card/';
    private apiUrlDelete = 'http://127.0.0.1:8000/api/auth/delete-card/';
    private apiUrl = 'http://127.0.0.1:8000/api/auth/';

    private currentCardSubject = new BehaviorSubject<number | null>(null); // Almacena la tarjeta actual
    currentCard$ = this.currentCardSubject.asObservable(); // Observable para suscribirse
    private flashcards: any[] = []; // Almacena las tarjetas obtenidas

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    

    // Obtener todas las tarjetas
    getFlashcards(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(this.apiUrlCard, { headers }).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // Establecer la tarjeta actual
    setCurrentCard(card: any): void {
        this.currentCardSubject.next(card); // Actualiza la tarjeta actual
    }

    // Obtener la tarjeta actual
    // Obtener el ID de la tarjeta actual
    getCurrentCardId(): number | null {
        return this.currentCardSubject.value; // Devuelve el ID actual
    }
    
    // Crear una nueva tarjeta
    createFlashcard(data: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(this.apiUrlCreate, data, { headers }).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // Actualizar una tarjeta
    updateCard(cardId: number, data: any): Observable<any> {
        console.log('Updating card with data:', data); // Depuración
        return this.http.put(`${this.apiUrl}${cardId}/`, data, { headers: this.getAuthHeaders() }).pipe(
            catchError((error) => {
                console.error('Error updating card:', error);
                return throwError(() => error);
            })
        );
    }

    // Eliminar una tarjeta
    deleteCard(cardId: number): Observable<any> {
        const headers = this.getAuthHeaders();
        const url = `${this.apiUrl}${cardId}/delete/`;
        console.log('URL being called:', url); // Log para depuración
        console.log('Headers being sent:', headers); // Log para depuración

        return this.http.delete(url, { headers }).pipe(
            catchError((error) => {
                console.error('Error deleting card:', error);
                return throwError(() => error);
            })
        );
    }

    // Obtener todas las tarjetas favoritas
    getFavoriteCards(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(`${this.apiUrl}favorites/`, { headers }).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // Agregar una tarjeta a favoritos
    addFavorite(cardId: number): Observable<any> {
        console.log('Adding card to favorites with ID:', cardId); // Depuración
        const headers = this.getAuthHeaders();
        return this.http.post(`${this.apiUrl}${cardId}/favorite/`, {}, { headers }).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // Eliminar una tarjeta de favoritos
    removeFavorite(cardId: number): Observable<any> {
        console.log('Removing card from favorites with ID:', cardId); // Depuración
        const headers = this.getAuthHeaders();
        return this.http.delete(`${this.apiUrl}${cardId}/favorite/`, { headers }).pipe(
            catchError((error) => this.handleError(error))
        );
    }

    // Obtener encabezados de autenticación
    private getAuthHeaders(): HttpHeaders {
        if (!isPlatformBrowser(this.platformId)) {
            console.warn('Not running in a browser environment.');
            return new HttpHeaders(); // Devuelve encabezados vacíos
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            console.warn('No access token found in localStorage.');
            return new HttpHeaders(); // Devuelve encabezados vacíos
        }

        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
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

