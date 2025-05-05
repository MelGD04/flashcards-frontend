import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { error } from "node:console";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
    private apiUrl = 'http://127.0.0.1:8000/api/auth/flashcards/';
    private apiUrlCreate = 'http://127.0.1:8000/api/auth/create-card/';


    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    getFlashcards(): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.get(this.apiUrl, { headers }).pipe(
            catchError((error) => {
                console.error('Error fetching flashcards:', error);
                return throwError(() => error);
            })
        );
    }

    createFlashcard(data: any): Observable<any> {
        const headers = this.getAuthHeaders();
        return this.http.post(this.apiUrlCreate, data, { headers }).pipe(
            catchError((error) => {
                console.error('Error creating flashcard:', error);
                return throwError(() => error);
            })
        );
    }

    // Obtener encabezados de autenticación
    private getAuthHeaders(): HttpHeaders {
        let headers = new HttpHeaders();

        // Verifica si estás en el navegador antes de acceder a localStorage
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('access_token');
            if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
            }
        }

        return headers;
    }
    /*
        async function obtenerDatos() {
            const response = await fetch ('localhost:8000/flashcards/', {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
    
            if(!response.ok){
                console.error("Tengo tal error", error)
            }
            return response.json()
        }
            */
}