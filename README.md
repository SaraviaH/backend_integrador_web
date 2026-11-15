# COMPUNEX B2B — Plataforma Mayorista de Hardware

> **Curso:** Desarrollo Web Integrado — Sección 48942 (UTP)  
> **Grupo:** Grupo 02  
> **Arquitectura:** Cliente – Servidor (`Angular 18` + `Spring Boot 3.5.16` + `PostgreSQL`)

---

## 1. Contexto del Proyecto

**COMPUNEX B2B** es una plataforma web mayorista orientada al rubro de componentes y hardware de computación (RAM, SSD, GPU, procesadores, placas, periféricos) enfocada en conectar **proveedores mayoristas** con **MYPES y compradores empresariales** en Perú.

El sistema sigue una arquitectura **cliente–servidor** desacoplada mediante una API REST asegurada con **JWT (JSON Web Token)** y control de acceso basado en roles (**RBAC**: `ADMIN`, `PROVEEDOR`, `COMPRADOR`):

* **Portal Público / Catálogo:** Exploración de categorías, búsqueda y detalle técnico de productos.
* **Módulo Proveedor:** Autenticación, registro corporativo, gestión completa de catálogo propio (CRUD, especificaciones, imágenes, estados y borrado lógico).
* **Módulo Administrador:** Supervisión global de productos, moderación de estados y administración.

---

## 2. Estructura del Repositorio

```text
integrador_web/
├── compunex-backend/       # API REST en Spring Boot 3.5 (Java 21) + PostgreSQL + JWT
├── compunex-frontend/      # Aplicación web cliente en Angular 18 + Tailwind CSS
├── documentacion/          # Documentación por fases (análisis, arquitectura, QA y evidencias)
└── README.md               # Este archivo general
```

---

## 3. Inicio Rápido

1. **Base de Datos y Back-end:**  
   Sigue las instrucciones de instalación, configuración de PostgreSQL, variables de entorno y ejecución en:  
   👉 [compunex-backend/README.md](compunex-backend/README.md)

2. **Front-end (Angular):**  
   Sigue las instrucciones de instalación de dependencias, entornos (`environment.ts`) y arranque en:  
   👉 [compunex-frontend/README.md](compunex-frontend/README.md)

3. **URLs locales por defecto:**
   * **Front-end:** `http://localhost:4200`
   * **Back-end API:** `http://localhost:8080/api/v1`
   * **Swagger UI:** `http://localhost:8080/swagger-ui.html`

---

## 4. Equipo (Grupo 02)

* Sivipaucar Quispe, Edison Edgar
* Saravia Humana, José Manuel Elias
* Rosales Miranda, Owen Sebastian
* Rodríguez Lapa, Yussef Amir
* Rodríguez Guevara, Eudes
* Yarleque Valladolid, Guadalupe Jamile
