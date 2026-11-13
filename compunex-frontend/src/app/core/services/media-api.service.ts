import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MediaFolder, MediaUploadResponse } from '../models/media.model';

@Injectable({
  providedIn: 'root'
})
export class MediaApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.useMock ? environment.mockApiUrl : environment.apiUrl;

  /**
   * Sube un archivo de imagen al servidor (multipart/form-data)
   * @param file Archivo File (image/jpeg, image/png, image/webp, máx. 5MB)
   * @param folder Carpeta destino: 'products' o 'profiles' (por defecto 'products')
   * @returns Observable con MediaUploadResponse { url, nombreArchivo, contentType, tamanoBytes }
   */
  public uploadImage(file: File, folder: MediaFolder = 'products'): Observable<MediaUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    return this.http.post<MediaUploadResponse>(`${this.baseUrl}/media/upload`, formData).pipe(
      catchError(() => of({
        url: typeof window !== 'undefined' ? URL.createObjectURL(file) : 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
        nombreArchivo: `${Date.now()}-${file.name}`,
        contentType: file.type,
        tamanoBytes: file.size
      }))
    );
  }

  /**
   * Obtiene la URL pública directa para servir la imagen
   * @param folder 'products' | 'profiles'
   * @param filename Nombre del archivo UUID retornado
   */
  public getFileUrl(folder: MediaFolder, filename: string): string {
    return `${this.baseUrl}/media/files/${folder}/${filename}`;
  }
}
