package com.compunex.b2b.modules.media.service;

import com.compunex.b2b.modules.media.dto.response.MediaUploadResponseDTO;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

/**
 * Contrato de almacenamiento y recuperación de archivos multimedia.
 */
public interface MediaStorageService {

    MediaUploadResponseDTO store(MultipartFile file, String folder);

    LoadedMediaResource load(String folder, String filename);

    record LoadedMediaResource(Resource resource, MediaType mediaType) {
    }
}
