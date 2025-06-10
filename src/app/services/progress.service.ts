import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/progreso/card/'; // URL del endpoint

  constructor(private http: HttpClient) { }

  // Método para actualizar el progreso de una tarjeta
  updateProgress(cardId: number, accion: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = { card_id: cardId, accion: accion };

    console.log('Sending progress update:', body); // Log para depuración
    return this.http.post(this.apiUrl, body, { headers });
  }

  // Método para obtener los encabezados de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Asegúrate de que el token esté almacenado en localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
}
