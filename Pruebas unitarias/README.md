# Guía de Pruebas en Postman — COMPUNEX B2B

Archivo de colección: [`COMPUNEX_B2B_API_Completa.postman_collection.json`](./COMPUNEX_B2B_API_Completa.postman_collection.json)  
URL base por defecto (`{{baseUrl}}`): `http://localhost:8080/api/v1`

---

## 1. Usuarios de Prueba y Variables de Token

| Rol / Tipo | Correo | Contraseña | RUC / Empresa | Variable en Postman | Cómo obtener el token |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Proveedor (Seed)** | `ventas.mayoristas@technova.com` | `PasswordMayorista123!` | `20608945612` · TechNova Mayorista S.A.C. | `{{token}}` | Carpeta `01` → **Login Proveedor** |
| **Administrador (Seed)** | `admin@compunex.com` | `AdminPassword2026!` | — | `{{adminToken}}` | Carpeta `01` → **Login Administrador** |
| **Empresa Compradora** | `compras@comercialtech.pe` | `Password123!` | `20607776661` · Comercial Tech MYPE SAC | `{{buyerToken}}` | Carpeta `01` → **Registro de Empresa Compradora** (1.ª vez) o **Login Empresa Compradora** (re-ejecuciones) |

> **Importante:** Las credenciales del **Proveedor** y del **Administrador** se crean automáticamente al arrancar el backend (`DataInitializer.java`). La **Empresa Compradora** se crea al ejecutar el request de registro de la carpeta `01`.

---

## 2. Qué Usuario y Prerrequisitos Usa Cada Carpeta

| Carpeta | Usuario / Token | ¿Se puede dar Run directo? | Prerrequisitos y Notas |
| :--- | :--- | :--- | :--- |
| **01. Autenticación** | Público + `{{token}}` | Sí (1.ª vez) | **Login Proveedor** y **Login Administrador** pueblan `{{token}}` y `{{adminToken}}`. En una **2.ª ejecución** sobre la misma BD, **Registro de Empresa Compradora** y **Registro de Proveedor** darán error por correo/RUC duplicado; usa **Login Empresa Compradora** para refrescar `{{buyerToken}}`. |
| **02. Categorías** | Público (sin token) | Sí | Usa `{{categoriaId}}` = `ram` por defecto. |
| **03. Catálogo Público** | Público (sin token) | Sí | Usa `{{productId}}` = `1` (producto semilla de TechNova). |
| **04. Productos del Proveedor (CRUD)** | Proveedor (`{{token}}`) | Sí, tras Login Proveedor | **Crear Producto** guarda automáticamente `{{createdProductId}}` para que **Actualizar**, **Cambiar Estado** y **Eliminar** operen sobre ese producto nuevo sin dañar el producto semilla (`1`). Si corres `Actualizar` o `Eliminar` sueltos sin haber corrido `Crear Producto`, `{{createdProductId}}` estará vacío. |
| **05. Administración de Productos** | Admin (`{{adminToken}}`) | Sí, tras Login Admin | Opera sobre `{{productId}}` (`1`). |
| **06. Perfil de Proveedor** | Mixto (`{{token}}` y `{{buyerToken}}`) | Sí, tras Login Proveedor + Comprador | **Obtener Mi Perfil de Proveedor** usa `{{token}}` (TechNova). **Activar Perfil de Proveedor** usa `{{buyerToken}}` (Comercial Tech, RUC `20607776661`) para promoverla a rol `PROVEEDOR` sin sobrescribir el RUC de TechNova. |
| **07. Órdenes y Checkout** | Comprador (`{{buyerToken}}`) | Sí, tras tener `{{buyerToken}}` | **No usar `{{token}}`** (TechNova es dueña del producto `1` y el backend prohíbe auto-compra). **Procesar Checkout** compra producto `1` y guarda `{{ordenId}}` y `{{subordenId}}`. |
| **08. Ventas del Proveedor** | Proveedor (`{{token}}`) | Solo después de `07` | Consulta las ventas recibidas por TechNova usando `{{subordenId}}`. **Actualizar Estado de Despacho** pasa de `PENDIENTE_DESPACHO` → `EN_PREPARACION`; si lo vuelves a ejecutar sobre la misma suborden, fallará porque ya no está en `PENDIENTE_DESPACHO`. |
| **09. Media y Archivos** | Proveedor (`{{token}}`) + Público | Manual en `Subir Imagen` | En **Subir Imagen**, debes adjuntar manualmente una imagen `.jpg`, `.png` o `.webp` (máx. 5 MB) en `Body → form-data → file`. Guarda `{{uploadedFilename}}` para **Obtener Archivo Subido**. |

---

## 3. Orden Recomendado de Ejecución en Postman

1. **Con el backend encendido** en `http://localhost:8080`:
   - Corre la carpeta **01. Autenticación** (la 1.ª vez completa; en siguientes corridas desmarca los dos endpoints de `Registro...` si ya existen en la BD).
2. Corre en este orden:
   - **02. Categorías**
   - **03. Catálogo Público**
   - **04. Productos del Proveedor (CRUD)**
   - **05. Administración de Productos**
   - **06. Perfil de Proveedor** *(opcional: si quieres mantener al comprador solo como `CLIENTE`, omite `Activar Perfil de Proveedor`; aunque incluso activado puede seguir comprando productos de TechNova en `07`)*
   - **07. Órdenes y Checkout** *(genera `{{ordenId}}` y `{{subordenId}}`)*
   - **08. Ventas del Proveedor** *(usa `{{subordenId}}` generado en `07`)*
3. Para **09. Media y Archivos**: abre el request **Subir Imagen**, selecciona un archivo de imagen en `file`, envíalo y luego ejecuta **Obtener Archivo Subido**.
