package com.compunex.b2b.modules.media.service.impl;

import com.compunex.b2b.config.audit.Auditable;
import com.compunex.b2b.exception.BusinessException;
import com.compunex.b2b.exception.ResourceNotFoundException;
import com.compunex.b2b.modules.media.dto.response.MediaUploadResponseDTO;
import com.compunex.b2b.modules.media.service.MediaStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Implementación en sistema de archivos local para almacenamiento seguro de imágenes.
 */
@Service
public class LocalMediaStorageServiceImpl implements MediaStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 5L * 1024L * 1024L;
    private static final Set<String> ALLOWED_FOLDERS = Set.of("products", "profiles");
    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            MediaType.IMAGE_JPEG_VALUE, ".jpg",
            MediaType.IMAGE_PNG_VALUE, ".png",
            "image/webp", ".webp"
    );

    private final Path baseUploadDir;

    public LocalMediaStorageServiceImpl(@Value("${app.media.upload-dir:uploads}") String uploadDir) {
        this.baseUploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @Override
    @Auditable(accion = "MEDIA_UPLOAD")
    public MediaUploadResponseDTO store(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException("El archivo de imagen es obligatorio y no puede estar vacío", HttpStatus.BAD_REQUEST);
        }

        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new BusinessException("El archivo excede el tamaño máximo permitido de 5MB", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.containsKey(contentType.toLowerCase())) {
            throw new BusinessException("Formato de imagen no permitido. Solo se aceptan JPEG, PNG o WEBP", HttpStatus.BAD_REQUEST);
        }

        String normalizedContentType = contentType.toLowerCase();
        String safeFolder = validarCarpeta(folder);
        String filename = UUID.randomUUID() + ALLOWED_CONTENT_TYPES.get(normalizedContentType);

        Path targetDir = baseUploadDir.resolve(safeFolder).normalize();
        Path targetFile = targetDir.resolve(filename).normalize();
        if (!targetFile.startsWith(baseUploadDir)) {
            throw new BusinessException("Ruta de almacenamiento inválida", HttpStatus.BAD_REQUEST);
        }

        try {
            Files.createDirectories(targetDir);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException ex) {
            throw new BusinessException("No se pudo almacenar la imagen en el servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String url = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/api/v1/media/files/")
                .path(safeFolder)
                .path("/")
                .path(filename)
                .toUriString();

        return MediaUploadResponseDTO.builder()
                .url(url)
                .nombreArchivo(filename)
                .contentType(normalizedContentType)
                .tamanoBytes(file.getSize())
                .build();
    }

    @Override
    public LoadedMediaResource load(String folder, String filename) {
        String safeFolder = validarCarpeta(folder);
        if (filename == null || filename.isBlank() || filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new BusinessException("Nombre de archivo inválido", HttpStatus.BAD_REQUEST);
        }

        Path filePath = baseUploadDir.resolve(safeFolder).resolve(filename).normalize();
        if (!filePath.startsWith(baseUploadDir)) {
            throw new BusinessException("Ruta de archivo inválida", HttpStatus.BAD_REQUEST);
        }

        try {
            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Imagen no encontrada: " + filename);
            }
            return new LoadedMediaResource(resource, resolverMediaType(filename));
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Imagen no encontrada: " + filename);
        }
    }

    private String validarCarpeta(String folder) {
        if (folder == null || folder.isBlank()) {
            return "products";
        }
        String normalized = folder.trim().toLowerCase();
        if (!ALLOWED_FOLDERS.contains(normalized)) {
            throw new BusinessException("Carpeta inválida. Valores permitidos: products, profiles", HttpStatus.BAD_REQUEST);
        }
        return normalized;
    }

    private MediaType resolverMediaType(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (lower.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        return MediaType.IMAGE_JPEG;
    }
}
