import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { error } from "node:console";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
    private apiUrl = 'http://127.0.0.1:8000/api/cards/flashcards/';


    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    getFlashcards(): Observable<any> {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('access_token'); // Solo en navegador
            const headers = {
                Authorization: `Bearer ${token}`
            };

            return this.http.get(this.apiUrl, { headers }).pipe(
                catchError(error => {
                    console.error('Error al obtener flashcards:', error);
                    return throwError(() => new Error('Error al obtener flashcards'));
                })
            );
        } else {
            // SSR: devuelve un observable vacío o maneja de otra forma
            console.warn('Intento de acceder a localStorage en SSR');
            return of([]); // O lanza un error, según lo que necesites
        }
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