// ==============================================================================
// CONTRATOS_JSON.md — Sección 6. Módulo Media / Imágenes (Sprint-B09)
// ==============================================================================

export type MediaFolder = 'products' | 'profiles';

export interface MediaUploadResponse {
  url: string;
  nombreArchivo: string;
  contentType: string;
  tamanoBytes: number;
}
