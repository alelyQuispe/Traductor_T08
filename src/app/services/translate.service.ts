import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ITranslate } from '../interfaces/translate.interface';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private baseUrl = 'http://localhost:8080/translations';

  constructor(private http: HttpClient) {}

  // Obtener todas las traducciones
  getAllTranslations(): Observable<ITranslate[]> {
    return this.http.get<ITranslate[]>(this.baseUrl).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener traducción por ID
  getTranslationById(id: number): Observable<ITranslate> {
    return this.http.get<ITranslate>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Traducir texto
  translateText(translation: ITranslate): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/translate`, translation).pipe(
      catchError(this.handleError)
    );
  }

  // Actualizar traducción
  updateTranslation(id: number, translation: ITranslate): Observable<ITranslate> {
    return this.http.put<ITranslate>(`${this.baseUrl}/${id}`, translation).pipe(
      catchError(this.handleError)
    );
  }

  // Eliminar traducción
  deleteTranslation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Manejo de errores
  private handleError(error: any) {
    console.error('Error:', error);
    return throwError('Ocurrió un error. Por favor, inténtelo de nuevo.');
  }
}
