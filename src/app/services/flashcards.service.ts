import { Injectable } from "@angular/core";
import { Flashcard } from "../models/flashcard.model";
import { error } from "node:console";
import { HttpClient } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class FlashcardsService {
    private apiUrl = 'http://127.0.0.1:8000/api/auth/flashcards/';


    constructor(private http: HttpClient) { }

    getFlashcards(): Observable<any> {
        return this.http.get(this.apiUrl).pipe(
            catchError(error => {
                console.error('Error al obtener flashcards:', error);
                return throwError(() => new Error('Error al obtener flashcards'));
            })
        );
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