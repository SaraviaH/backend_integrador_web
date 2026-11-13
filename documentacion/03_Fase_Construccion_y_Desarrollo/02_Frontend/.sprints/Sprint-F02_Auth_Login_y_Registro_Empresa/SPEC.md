# Sprint-F02 — Autenticación, Login y Registro de Empresa Mayorista

> **Área Técnica:** Frontend  
> **Track:** Frontend Track  
> **Agente Responsable:** Agente Frontend  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `feature/frontend-auth-company` hacia `develop`  
> **Dependencias Previas:** `Sprint-F01_Setup_UI_y_Design_Tokens`

---

## 1. Objetivo del Sprint
Implementar las vistas y la infraestructura de autenticación de clientes y empresas en COMPUNEX B2B: pantalla de inicio de sesión (`P-06`), registro de empresa con validación de RUC de 11 dígitos y razón social (`P-07`), el servicio reactivo `AuthService` con Angular Signals y el interceptor funcional para inyección de tokens JWT.

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Pantallas MVP (`Mockups/PROMPTS_GOOGLE_STITCH_TEMPLATE.md`):**
  * `P-06`: Iniciar sesión (Formulario con correo y contraseña, recordar sesión, enlace a recuperación).
  * `P-07`: Registro de empresa (Formulario con RUC 11 dígitos, Razón Social, Nombre comercial, correo, teléfono y contraseña).
* **Contratos Consumidos (vía Prism Mock Server):**
  * `POST /api/v1/auth/login` (Endpoint 1)
  * `POST /api/v1/auth/register-company` (Endpoint 15)
* **Reglas de Negocio:**
  * `RN-001`: Sesión basada en JWT (expiración 24h).
  * `RN-002`: Validación de RUC (exactamente 11 dígitos numéricos, obligatorio para empresas).

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Infraestructura de Autenticación
- [ ] `AuthService.ts`: Estado con Signals (`currentUser`, `token`, `isAuthenticated`).
- [ ] `authInterceptor.ts`: Interceptor HTTP funcional que añade cabecera `Authorization: Bearer <token>`.
- [ ] `authGuard.ts`: Guard para rutas que requieren estar logueado.

### 3.2. Pantalla P-06: Iniciar Sesión (`LoginComponent`)
- [ ] Formulario reactivo con `ReactiveFormsModule`: campos `correo` (email válido) y `contrasena` (mínimo 6 caracteres).
- [ ] 4 Estados: Carga (botón disabled con spinner), Vacío/Inicial, Datos/Éxito (guarda token y redirige), Error (banner de credenciales inválidas).

### 3.3. Pantalla P-07: Registro de Empresa (`RegisterCompanyComponent`)
- [ ] Formulario reactivo con validadores:
  * `ruc`: `Validators.pattern(/^[0-9]{11}$/)`.
  * `razonSocial`: `Validators.required`.
  * `nombreComercial`, `correo`, `telefono`, `contrasena`.
- [ ] Feedback visual en tiempo real de campo inválido.
- [ ] 4 Estados: Envío con spinner, Éxito con redirección al login, Error si el RUC o correo ya existen.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] Login exitoso contra Prism Mock guarda el token en `localStorage` y actualiza el estado reactivo del usuario en el Header.
- [ ] El formulario de registro impide el envío si el RUC no tiene exactamente 11 dígitos numéricos.
- [ ] Accesibilidad: Etiquetas `<label>` asociadas a cada `<input>` mediante `id`/`for`, soporte para teclado (`Enter` para enviar).

---

## 5. Plan de Verificación y Comandos
```bash
ng test --include=src/app/features/auth/**/*.spec.ts
# Probar formularios en http://localhost:4200/auth/login y /auth/registro-empresa
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Pantalla | Componente |
| :--- | :--- | :--- | :--- |
| `RF-01` | `RN-001` | `P-06` | `LoginComponent.ts` |
| `RF-02` | `RN-002` | `P-07` | `RegisterCompanyComponent.ts` |
