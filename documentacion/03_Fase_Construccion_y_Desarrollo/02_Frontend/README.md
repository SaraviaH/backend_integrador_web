# 02. Frontend: Construcción y Desarrollo Local

> **Ámbito:** Especialidad Técnica · Frontend  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Normas de ingeniería para el Agente de Frontend: construcción de interfaces de usuario, composición con Atomic Design, gestión de estado reactivo, accesibilidad (a11y) y consumo del Mock Server local de la API.  
> **Regla de Operación:** El frontend puede avanzar con un mock cuando exista un contrato acordado; el alcance, la herramienta y las verificaciones reales dependen del proyecto.

---

## 🤖 Operación Autónoma del Agente de Frontend

* **Rama de trabajo:** `feature/frontend-<id-tarea>` (originada desde `develop`).
* **Bitácora local:** Toda deuda de UI, accesibilidad, tests de widgets y estados de pantalla se registran en [`MEMORY_FRONTEND.md`](MEMORY_FRONTEND.md).
* **Ejemplo opcional de mock:** desde esta carpeta, si el proyecto usa OpenAPI y Prism está instalado y aprobado:
  ```bash
  npx @stoplight/prism-cli mock ../../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/openapi_template.yaml -p 8080
  ```

---

## 🏛️ Principios de Construcción de Frontend

### 1. Composición de interfaz (ejemplo: Atomic Design)
* **Átomos:** Botones, inputs, badges, tipografías y colores puros.
* **Moléculas:** Grupos de formulario, tarjetas simples con título y descripción.
* **Organismos:** Cabeceras, barras de navegación, listados complejos y modales.
* **Vistas / Pantallas:** Ensamblado de organismos vinculados a rutas.

### 2. Gestión de Estado y Datos
* Separar estado de UI (abierto/cerrado, tabs) del estado de datos de servidor (caché de peticiones).
* Representar formalmente los 4 estados de toda vista:
  * 🔄 **Cargando:** Spinner o Skeleton legible.
  * 📭 **Vacío:** Mensaje explicativo amigable cuando no hay datos.
  * ❌ **Error:** Feedback claro con botón de reintento.
  * ✅ **Éxito:** Renderizado limpio de los datos.

### 3. Seguridad en el Cliente
* Cero secretos de servidor o claves privadas dentro del código del cliente.
* La sesión y tokens se almacenan en almacenamiento protegido (Keystore / Keychain / Secure Storage).
* Sanitización de entradas para evitar ataques XSS o inyección en vistas web.

### 4. Accesibilidad y Ergonomía (a11y)
* Áreas táctiles de mínimo 48x48 dp para botones en dispositivos móviles.
* Contraste cromático de texto mínimo 4.5:1 (estándar WCAG 2.1 AA).
* No comunicar estados críticos únicamente a través del color.

---

## 🛑 Protocolo de Control Anti-Alucinación (El Humano en el Bucle)

El agente de frontend **NUNCA** da por cerrado un sprint de UI sin confrontar al desarrollador:
> 💬 *"¿Revisaste el código visual que generé? ¿Probaste la pantalla en tu navegador o emulador con clics reales e interacciones táctiles? ¿Comprobaste los estados de carga, vacío y error antes de hacer commit?"*

---

## 📁 Estructura del Área

* [`BACKLOG_FRONTEND.md`](BACKLOG_FRONTEND.md): Product Backlog autónomo con la matriz de sprints de UI, mockups vinculados y DoD.
* [`MEMORY_FRONTEND.md`](MEMORY_FRONTEND.md): Bitácora técnica y registro de tests de UI.
* [`.sprints/`](.sprints/): Carpeta de sprints de desarrollo de frontend.
