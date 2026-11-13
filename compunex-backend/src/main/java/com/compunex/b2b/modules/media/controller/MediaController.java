package com.compunex.b2b.modules.media.controller;

import com.compunex.b2b.modules.media.dto.response.MediaUploadResponseDTO;
import com.compunex.b2b.modules.media.service.MediaStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.concurrent.TimeUnit;

/**
 * Controlador para carga y entrega pública de imágenes (Sprint-B09).
 */
@RestController
@RequestMapping("/api/v1/media")
@RequiredArgsConstructor
@Tag(name = "13. Media e Imágenes", description = "Subida de imágenes para productos/perfiles y entrega pública")
public class MediaController {

    private final MediaStorageService mediaStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('PROVEEDOR', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
            summary = "[28] Subir imagen al servidor",
            description = "Recibe una imagen JPEG, PNG o WEBP (máx. 5MB) y retorna su URL pública lista para asociar a productos o perfiles."
    )
    public ResponseEntity<MediaUploadResponseDTO> uploadImage(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "products") String folder) {
        MediaUploadResponseDTO response = mediaStorageService.store(file, folder);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/files/{folder}/{filename}")
    @Operation(
            summary = "[29] Obtener imagen pública",
            description = "Sirve el archivo de imagen almacenado localmente sin requerir token JWT."
    )
    public ResponseEntity<Resource> serveImage(
            @PathVariable String folder,
            @PathVariable String filename) {
        MediaStorageService.LoadedMediaResource loaded = mediaStorageService.load(folder, filename);
        return ResponseEntity.ok()
                .contentType(loaded.mediaType())
                .cacheControl(CacheControl.maxAge(1, TimeUnit.DAYS).cachePublic())
                .body(loaded.resource());
    }
}
