# Viabilidad y Riesgos — COMPUNEX B2B

> **Fase del SDLC:** 01 · Planificación y Análisis de Requisitos  
> **Propósito:** Evaluar la viabilidad técnica, operativa y Local-First del proyecto, además de identificar riesgos clave y sus planes de mitigación.

---

## 💻 1. Evaluación de Viabilidad

* **Viabilidad Técnica:** Alta. El equipo domina Java 21, Spring Boot 3, Spring Security + JWT, Spring Data JPA y Angular. Todas las pruebas unitarias e integración pueden ejecutarse localmente sin depender de servicios en la nube.
* **Viabilidad Operativa:** Alta. Los flujos de proveedor y administrador responden a operaciones CRUD estándar de catálogo mayorista, fácilmente demostrables en entorno local.
* **Viabilidad Local-First:**
  - [x] El sistema se compila, ejecuta y prueba completamente en máquina local (`H2` en memoria para JUnit y motor relacional local para ejecución).
  - [x] No depende de APIs de pago ni infraestructura cloud obligatoria.

---

## 📋 2. Matriz de Riesgos y Mitigación

| ID Riesgo | Descripción del Evento de Riesgo | Probabilidad | Impacto | Severidad | Estrategia de Mitigación / Contingencia |
| :---: | :--- | :---: | :---: | :---: | :--- |
| **RSK-01** | Cambio de motor de BD de PostgreSQL a MySQL por exigencia de rúbrica ATF3. | Media | Alto | **Alta** | Usar JPA estándar evitando SQL nativo propietario donde no sea indispensable; mantener `DataInitializer` agnóstico al motor y validar los 59 tests tras el cambio. |
| **RSK-02** | Exposición de credenciales de BD o `jwt.secret` en archivos de configuración versionados. | Alta | Alto | **Alta** | Externalizar propiedades sensibles a variables de entorno (`${DB_URL}`, `${DB_USER}`, `${DB_PASS}`, `${JWT_SECRET}`) y separar perfiles `dev`/`prod`. |
| **RSK-03** | Desalineación entre contratos JSON del Back-end y servicios del Front-end Angular. | Media | Alto | **Alta** | Congelar contratos en `02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/CONTRATOS_JSON.md` y validar con colección Postman + Swagger UI. |
| **RSK-04** | Retraso en la integración del Front-end Angular respecto al avance del Back-end. | Media | Alto | **Alta** | Priorizar conexión de Login, interceptor JWT, listado/CRUD de productos y manejo de errores 404/401 antes del pulido visual final. |
