# COMPUNEX B2B — Front-end (Angular 18)

> **Stack:** Angular 18 (Standalone Components) | TypeScript | Tailwind CSS | RxJS

---

## 1. Requisitos Previos

1. **Node.js** `18.x` o `20.x` (LTS) y **npm** instalados.
2. **Back-end COMPUNEX B2B** en ejecución en `http://localhost:8080` (ver [../compunex-backend/README.md](../compunex-backend/README.md)).

---

## 2. Instalación de Dependencias

Desde la carpeta `compunex-frontend`:

```powershell
cd compunex-frontend
npm install
```

---

## 3. Configuración de Entornos (`environments`)

Las variables de entorno del cliente están en `src/environments/`:

* `src/environments/environment.ts` (desarrollo):
  ```ts
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:8080/api/v1',
    mockApiUrl: 'http://localhost:4010/api/v1',
    useMock: false,
    appName: 'COMPUNEX B2B Portal',
    version: '1.0.0-mvp'
  };
  ```
* `src/environments/environment.prod.ts` (producción): configurado mediante `fileReplacements` en `angular.json`.

Asegúrate de mantener `useMock: false` y `apiUrl` apuntando al puerto del Back-end para trabajar conectado en vivo.

---

## 4. Cómo Ejecutar el Front-end

```powershell
cd compunex-frontend
npm start
```
*(Equivalente a `ng serve`)*

Abre tu navegador en **`http://localhost:4200/`**. La aplicación se recargará automáticamente ante cualquier cambio en los archivos fuente.

---

## 5. Otros Comandos Útiles

* **Compilar para producción** (genera artefactos en `dist/`):
  ```powershell
  npm run build
  ```
* **Ejecutar pruebas unitarias** (Karma / Jasmine):
  ```powershell
  npm test
  ```

---

## 6. Estructura del Proyecto (`src/app/`)

```text
src/app/
├── core/        # Guards, interceptores HTTP (JWT/errores) y servicios de API
├── features/    # Módulos funcionales (auth, catálogo, proveedor, admin, account, etc.)
├── layout/      # Navbar, layouts públicos y privados
└── shared/      # Componentes reutilizables y modelos/interfaces
```
