package com.compunex.b2b.modules.media.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO de respuesta al subir una imagen al servidor.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MediaUploadResponseDTO {
    private String url;
    private String nombreArchivo;
    private String contentType;
    private long tamanoBytes;
}
