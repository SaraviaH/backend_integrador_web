# ARCHITECTURE.md — Marco Rector de Arquitectura (COMPUNEX B2B)

> **Fase del SDLC:** Fase 02 · Diseño y Arquitectura  
> **Propósito:** Índice rector de las arquitecturas especializadas del proyecto COMPUNEX B2B.

---

## 🏛️ 1. Visión General del Sistema

COMPUNEX B2B adopta una arquitectura **Cliente-Servidor desacoplada**:
* **Back-end (`compunex-backend`):** Monolito modular por capas en Spring Boot 3.5.16 (Java 21) que expone una API REST stateless protegida con JWT.
* **Front-end (Angular):** Aplicación SPA modular organizada por *features* en `kebab-case`, con interceptores HTTP para autenticación y manejo de errores.
* **Persistencia:** Base de datos relacional normalizada (7 tablas principales) gestionada vía Spring Data JPA / Hibernate.

---

## 🗺️ 2. Índice de Arquitecturas Especializadas por Área

| Área Técnica | Archivo de Arquitectura Especializada | Enfoque y Responsabilidad |
| :--- | :--- | :--- |
| **01. Backend** | [`01_Backend/ARCHITECTURE.md`](01_Backend/ARCHITECTURE.md) | Organización de paquetes en `com.compunex.b2b`, capas, DTOs, servicios y excepciones. |
| **02. Frontend** | [`02_Frontend/ARCHITECTURE.md`](02_Frontend/ARCHITECTURE.md) | Estructura Angular `kebab-case`, `environment.ts`, guards, interceptores y UI responsiva. |
| **03. Base de Datos** | [`03_Base_de_Datos/ARCHITECTURE.md`](03_Base_de_Datos/ARCHITECTURE.md) | Diagrama ER real de las 7 tablas, restricciones de integridad y estrategia de motor. |
| **04. Seguridad y Redes** | [`04_Seguridad_y_Redes/ARCHITECTURE.md`](04_Seguridad_y_Redes/ARCHITECTURE.md) | Flujo JWT stateless, matriz RBAC (`PROVEEDOR`, `ADMIN`, público), BCrypt, CORS y secretos. |
| **05. Integración y APIs** | [`05_Integracion_y_APIs/ARCHITECTURE.md`](05_Integracion_y_APIs/ARCHITECTURE.md) | Catálogo de los 14 endpoints REST, manejo de errores JSON y [`CONTRATOS_JSON.md`](05_Integracion_y_APIs/CONTRATOS_JSON.md). |

---

## 🧩 3. Principios Aplicados en el Diseño

1. **Separación de responsabilidades (SRP):** Controladores delgados (solo enrutamiento y validación `@Valid`), lógica de negocio en `service/impl`, acceso a datos en `repository`.
2. **Inversión de dependencias (DIP):** Los controladores dependen de interfaces de servicio (`AuthService`, `ProductoService`, `CategoriaService`), no de implementaciones concretas.
3. **Local-First:** Ejecución completa en entorno local sin dependencias cloud obligatorias.
