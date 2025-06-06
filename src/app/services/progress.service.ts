import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = 'http://127.0.0.1:8000/api/auth/progreso/card/'; // URL de la API para el progreso

  constructor(private http: HttpClient) { }

  // Obtener el token de autenticación desde el almacenamiento local
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token'); // Asegúrate de que el token esté almacenado en localStorage
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Agrega el token al encabezado
    });
  }

  // Actualizar el progreso de una tarjeta
  updateProgress(cardId: number, accion: string): Observable<any> {
    const headers = this.getAuthHeaders();
    const body = {
      card_id: cardId,
      accion: accion
    };

    console.log('Sending progress update:', body);
    return this.http.post(this.apiUrl, body, { headers });
  }
}
