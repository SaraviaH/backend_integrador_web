# Sprint-F10 — Gestión de Cuenta, Seguridad y Activación de Proveedor

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-account-security` hacia `develop`  
> **Dependencias Previas:** `Sprint-F09_Mis_Compras_y_Trazabilidad`

---

## 1. Objetivo del Sprint
Implementar las pantallas de gestión de usuario y seguridad: perfil de cuenta (`P-16`), actualización segura de contraseña (`P-17`), y el formulario de autogestión para clientes existentes que desean activar su rol y perfil de proveedor comercial mayorista (`P-18`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-16`: Mi cuenta (Datos personales, rol asignado, estado de la cuenta, botón para activar proveedor si no lo es).
  * `P-17`: Cambiar contraseña (Formulario con contraseña actual, nueva contraseña y confirmación).
  * `P-18`: Activar perfil proveedor (Formulario con RUC 11 dígitos, Razón Social, Nombre comercial, Dirección fiscal y teléfono de contacto).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `GET /api/v1/auth/me` (Endpoint 3)
  * `PATCH /api/v1/auth/password` (Endpoint 4)
  * `POST /api/v1/providers/me/activate` (Endpoint 17)
* **Reglas de Negocio:**
  * `RN-001`: Sesión autenticada requerida.
  * `RN-002`: Validación de RUC 11 dígitos numéricos obligatorio para proveedor.

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Pantalla P-16: Mi Cuenta (`AccountProfileComponent`)
- [ ] Vista de información del usuario: Nombre, Correo, Rol actual (`CLIENTE`, `PROVEEDOR`, `ADMIN`), Fecha de registro.
- [ ] Si el usuario tiene rol `CLIENTE`, mostrar tarjeta destacada: *"¿Deseas vender tus productos tecnológicos en COMPUNEX? Activa tu cuenta de Proveedor"* con enlace a `P-18`.

### 3.2. Pantalla P-17: Cambiar Contraseña (`ChangePasswordComponent`)
- [ ] Formulario reactivo con campos: `contrasenaActual`, `nuevaContrasena`, `confirmarContrasena`.
- [ ] Validador personalizado que confirma que ambas contraseñas coincidan y cumplan política de seguridad (mínimo 6 caracteres).
- [ ] Feedback visual de éxito o error si la contraseña actual no es correcta.

### 3.3. Pantalla P-18: Activar Perfil Proveedor (`ActivateProviderComponent`)
- [ ] Formulario reactivo con campos fiscales: RUC (11 dígitos), Razón Social, Nombre comercial, Dirección fiscal, Teléfono.
- [ ] Al completar exitosamente: actualiza el rol en `AuthService` a `PROVEEDOR` y muestra banner de bienvenida redirigiendo a `/proveedor/dashboard`.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Las 3 vistas son accesibles exclusivamente para usuarios autenticados (`AuthGuard`).
- [ ] El cambio de contraseña limpia los campos tras el envío exitoso.
- [ ] La activación de proveedor valida estrictamente el RUC y refresca el menú de navegación para mostrar los accesos de proveedor.

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/account/**/*.spec.ts
# Navegar a http://localhost:4200/cuenta/perfil, /cuenta/seguridad y /cuenta/activar-proveedor
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantallas | Componentes | Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| `RF-01`, `RF-02` | `RN-001`, `RN-002` | `P-16`, `P-17`, `P-18` | `ProfileComponent.ts`, `ChangePasswordComponent.ts`, `ActivateProviderComponent.ts` | 3, 4, 17 |
