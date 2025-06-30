import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// defini rla estructura de la respuesta recibida desde la API
interface GeminiResponse {
  candidates: { content: { parts: { text: string} [] } }[];
}

// el servicio esta disponible a nivel de toda la aplicacion
// el servicio se registra a nivel "root", disponible en toda la aplicacion de angular
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  // construir la URL completa de la API de gemini, incluyendo la clave de acceso
  private url:string =
 `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${environment.geminiApiKey}`;

 private systemPrompt: string = ``;
  // inyectamos un httpcliente para poder hacer peticiones http
  constructor(private http: HttpClient) { }
  // metodo para generar contenido usando gemini
  //observable que emite la respuesta de gemini con la estructura geminiresponse
  generate(userText: string): Observable <GeminiResponse>{
    // concatener el promt  del sistema con texto del usuario
    const fullText: string = `${this.systemPrompt}\nUsuario: ${userText}`.trim();
    //construimos el cuerpo de la peticion segun lo especificacion de la api
    const body = {
      contents: [
        {
          parts: [
            {text: fullText}
          ]
        }
      ]
    };
    // hacemos la peticion POST a la url de la pai y retornamos al observable
    return this.http.post<GeminiResponse>(this.url,body);

  }
}
