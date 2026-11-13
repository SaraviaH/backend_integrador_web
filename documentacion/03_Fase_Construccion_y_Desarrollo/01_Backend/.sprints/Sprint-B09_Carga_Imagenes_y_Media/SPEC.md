# Sprint-B09 — Carga de Imágenes y Media (Multipart Upload)

> **Área Técnica:** Backend (Spring Boot / Java)  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/backend-media-upload` hacia `develop`  
> **Dependencias Previas:** `Sprint-B01`, `Sprint-B02`, `Sprint-B03`

---

## 1. Objetivo del Sprint
Proveer endpoints dedicados para la subida de imágenes (`multipart/form-data`) desde el frontend (productos, logo y banner de proveedor), validando tipo MIME y tamaño máximo, almacenando el archivo en almacenamiento local o proveedor externo (Cloudinary/S3) y devolviendo la URL pública lista para persistirse en `imagenes_producto.url_imagen` o `perfiles_proveedor.url_logo` / `url_banner`.

---

## 2. Endpoints a Implementar

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | Autenticado (`PROVEEDOR`, `ADMIN`) | Sube una imagen (`file` en `multipart/form-data`, opcional `folder=products\|profiles`) y retorna `{ "url": "...", "nombreArchivo": "...", "contentType": "...", "tamanoBytes": 12345 }`. |
| `GET` | `/api/v1/media/files/{folder}/{filename}` | Público | Sirve las imágenes almacenadas localmente cuando se usa almacenamiento en disco. |

---

## 3. Reglas de Negocio y Seguridad
- Formatos permitidos: `image/jpeg`, `image/png`, `image/webp`.
- Tamaño máximo por archivo: `5 MB` (`spring.servlet.multipart.max-file-size=5MB`).
- Sanitización de nombre de archivo con `UUID` para evitar colisiones y path traversal.
- Retornar `400 Bad Request` si el archivo está vacío o el formato no es válido.

---

## 4. Criterios de Aceptación (DoD)
- [ ] `POST /api/v1/media/upload` devuelve `201 Created` con la URL pública de la imagen.
- [ ] `GET /api/v1/media/files/{folder}/{filename}` sirve la imagen sin requerir token JWT.
- [ ] Pruebas `MockMvc` con `MockMultipartFile` validando subida exitosa y rechazo de formatos inválidos.
