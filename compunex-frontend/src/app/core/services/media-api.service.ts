import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MediaFolder, MediaUploadResponse } from '../models/media.model';

const BACKEND_ORIGIN = environment.apiUrl.replace(/\/api\/v1\/?$/, '');

/**
 * Catálogo local estático de los 100 productos sembrados en `public/uploads/products/`.
 * Si el backend devuelve la URL de uno de estos archivos, se sirve directamente desde Angular
 * (`/uploads/products/<archivo>`) para carga instantánea sin depender de copia en el backend.
 * Cualquier otro archivo (ej. el producto 101 o futuras subidas vía `/media/upload`) conserva su URL real del servidor.
 */
const LOCAL_CATALOG_PRODUCT_IMAGES = new Set<string>([
  'ram-corsair-vengeance-32gb-ddr5.jpg',
  'ram-crucial-pro-16gb-ddr5.jpg',
  'ram-gskill-tridentz5-32gb-ddr5.jpg',
  'ram-kingston-fury-16gb-ddr4.jpg',
  'ram-teamgroup-delta-16gb-ddr4.jpg',
  'ram-adata-xpg-d35g-16gb-ddr4.jpg',
  'ram-kingston-sodimm-8gb-ddr4.jpg',
  'ram-crucial-sodimm-16gb-ddr5.jpg',
  'ram-corsair-dominator-64gb-ddr5.jpg',
  'ram-patriot-viper-32gb-ddr5.jpg',
  'ssd-samsung-990pro-1tb.jpg',
  'ssd-kingston-nv2-1tb.jpg',
  'ssd-wd-black-sn850x-2tb.jpg',
  'ssd-crucial-p3plus-1tb.jpg',
  'ssd-kingston-a400-480gb.jpg',
  'ssd-samsung-870evo-1tb.jpg',
  'ssd-adata-s70blade-1tb.jpg',
  'ssd-wd-green-sn350-500gb.jpg',
  'ssd-crucial-t700-2tb-gen5.jpg',
  'ssd-sandisk-extreme-1tb-ext.jpg',
  'gpu-asus-dual-rtx4060-8gb.jpg',
  'gpu-msi-ventus-rtx4060ti-16gb.jpg',
  'gpu-gigabyte-rtx4070super-12gb.jpg',
  'gpu-asus-tuf-rtx4070tisuper.jpg',
  'gpu-msi-rtx4080super-16gb.jpg',
  'gpu-asus-rog-rtx4090-24gb.jpg',
  'gpu-sapphire-rx7600-8gb.jpg',
  'gpu-gigabyte-rx7700xt-12gb.jpg',
  'gpu-sapphire-rx7800xt-16gb.jpg',
  'gpu-pny-rtx-a2000-12gb.jpg',
  'cpu-intel-i5-14400f.jpg',
  'cpu-intel-i5-14600k.jpg',
  'cpu-intel-i7-14700k.jpg',
  'cpu-intel-i9-14900k.jpg',
  'cpu-intel-i3-13100.jpg',
  'cpu-amd-ryzen5-5600.jpg',
  'cpu-amd-ryzen5-7600.jpg',
  'cpu-amd-ryzen7-7800x3d.jpg',
  'cpu-amd-ryzen9-7950x.jpg',
  'cpu-amd-ryzen5-8600g.jpg',
  'mb-asus-prime-b760m-a.jpg',
  'mb-msi-pro-z790p-wifi.jpg',
  'mb-gigabyte-b760m-ds3h.jpg',
  'mb-asus-tuf-b650-plus.jpg',
  'mb-msi-b650-tomahawk.jpg',
  'mb-asrock-b550m-pro4.jpg',
  'mb-gigabyte-a520m-k.jpg',
  'mb-asus-rog-x670ef.jpg',
  'mb-msi-pro-h610m-g.jpg',
  'mb-asrock-b650i-itx.jpg',
  'hdd-seagate-barracuda-2tb.jpg',
  'hdd-wd-blue-1tb.jpg',
  'hdd-wd-purple-4tb.jpg',
  'hdd-seagate-skyhawk-6tb.jpg',
  'hdd-seagate-ironwolf-4tb.jpg',
  'hdd-wd-redplus-8tb.jpg',
  'hdd-seagate-exos-16tb.jpg',
  'hdd-toshiba-p300-2tb.jpg',
  'hdd-toshiba-n300-10tb.jpg',
  'hdd-wd-elements-4tb-ext.jpg',
  'psu-corsair-rm750e-750w.jpg',
  'psu-corsair-rm850x-850w.jpg',
  'psu-msi-a650bn-650w.jpg',
  'psu-evga-600br-600w.jpg',
  'psu-seasonic-gx850.jpg',
  'psu-asus-tuf-1000w.jpg',
  'psu-coolermaster-mwe750.jpg',
  'psu-gigabyte-ud850gm.jpg',
  'psu-corsair-hx1200i.jpg',
  'psu-thermaltake-smart-500w.jpg',
  'usb-kingston-exodia-64gb.jpg',
  'usb-kingston-exodia-m-128gb.jpg',
  'usb-sandisk-ultraflair-64gb.jpg',
  'usb-sandisk-dual-128gb-usbc.jpg',
  'usb-kingston-duo-64gb.jpg',
  'usb-kingston-microsd-128gb.jpg',
  'usb-sandisk-extremepro-256gb.jpg',
  'usb-samsung-evoplus-128gb.jpg',
  'usb-adata-uv128-32gb.jpg',
  'usb-lexar-s80-256gb.jpg',
  'cool-cm-hyper212-black.jpg',
  'cool-deepcool-ak400-digital.jpg',
  'cool-noctua-nhd15-black.jpg',
  'cool-corsair-h100i-240mm.jpg',
  'cool-nzxt-kraken-360.jpg',
  'cool-msi-coreliquid-240r.jpg',
  'cool-arctic-freezer3-360.jpg',
  'cool-deepcool-ls720-360.jpg',
  'cool-lianli-unifan-3pack.jpg',
  'cool-arctic-mx4-4g.jpg',
  'case-corsair-4000d-airflow.jpg',
  'case-nzxt-h5-flow.jpg',
  'case-lianli-o11d-evo.jpg',
  'case-msi-mag-forge100r.jpg',
  'case-cm-q300l-matx.jpg',
  'case-deepcool-cc560.jpg',
  'case-asus-tuf-gt501.jpg',
  'case-nzxt-h9-flow-white.jpg',
  'case-corsair-3000d-airflow.jpg',
  'case-antryx-fx620-office.jpg'
]);

export function resolveMediaUrl(url?: string | null): string {
  if (!url || !url.trim()) return '/images/compunex-hero.png';
  const trimmed = url.trim();
  const cleanPath = trimmed.split('?')[0];
  const fileName = cleanPath.substring(cleanPath.lastIndexOf('/') + 1);

  if (
    LOCAL_CATALOG_PRODUCT_IMAGES.has(fileName) &&
    (trimmed.includes('/media/files/products/') || trimmed.includes('/uploads/products/') || !trimmed.includes('/'))
  ) {
    return `/uploads/products/${fileName}`;
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('img.compunex.com')) return '/images/compunex-hero.png';
    return trimmed;
  }
  if (trimmed.startsWith('/api/')) {
    return `${BACKEND_ORIGIN}${trimmed}`;
  }
  return trimmed;
}

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

    const request$ = this.http.post<MediaUploadResponse>(`${this.baseUrl}/media/upload`, formData).pipe(
      map(res => ({
        ...res,
        url: resolveMediaUrl(res.url)
      }))
    );

    if (!environment.useMock) {
      return request$;
    }

    return request$.pipe(
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
