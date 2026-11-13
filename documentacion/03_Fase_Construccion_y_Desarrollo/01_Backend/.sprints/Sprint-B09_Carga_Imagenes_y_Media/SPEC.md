# Sprint-B09 — Carga de Imágenes y Media (Multipart Upload)

> **Área Técnica:** Backend (Spring Boot 3.5.16 / Java 21)  
> **Track:** Backend Track  
> **Agente Responsable:** Agente Backend  
> **Estado:** `COMPLETADO` (`1511771`)  
> **Rama:** `feat/backend-sprints` -> `integracion/e2e`  
> **Dependencias Previas:** `Sprint-B01`, `Sprint-B02`, `Sprint-B03`

---

## 1. Objetivo del Sprint
Proveer endpoints dedicados para la subida de imágenes (`multipart/form-data`) desde el frontend (productos, logo y banner de proveedor), validando tipo MIME y tamaño máximo, almacenando el archivo localmente mediante `LocalMediaStorageServiceImpl` y devolviendo la URL pública lista para persistirse en `imagenes_producto.url_imagen` o `perfiles_proveedor.url_logo` / `url_banner`.

---

## 2. Endpoints Implementados (`MediaController.java`)

| Método | Ruta | Acceso | Descripción |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/media/upload` | Autenticado (`PROVEEDOR`, `ADMIN`) | Sube una imagen (`file` en `multipart/form-data`, opcional `folder=products\|profiles`) y retorna `201 Created` con `MediaUploadResponseDTO` (`{ "url", "nombreArchivo", "contentType", "tamanoBytes" }`). |
| `GET` | `/api/v1/media/files/{folder}/{filename}` | Público | Sirve las imágenes almacenadas localmente con cabecera de caché pública. |

---

## 3. Reglas de Negocio y Seguridad
- Formatos permitidos: `image/jpeg`, `image/png`, `image/webp`.
- Tamaño máximo por archivo: `5 MB` (`spring.servlet.multipart.max-file-size=5MB`).
- Sanitización de carpeta y nombre de archivo con `UUID` para evitar colisiones y path traversal.
- Retornar `400 Bad Request` si el archivo está vacío, supera el límite o el formato no es válido.

---

## 4. Criterios de Aceptación (DoD)
- [x] `POST /api/v1/media/upload` devuelve `201 Created` con la URL pública de la imagen.
- [x] `GET /api/v1/media/files/{folder}/{filename}` sirve la imagen sin requerir token JWT.
- [x] Pruebas `MockMvc` en `MediaControllerTest` con `MockMultipartFile` validando subida exitosa, RBAC `403` y rechazo de formatos inválidos.

---

## 5. Plan de Verificación y Comandos
```powershell
cd compunex-backend
.\mvnw.cmd test -Dtest=MediaControllerTest
```
