# 04. Integración y Configuración: Entorno y Variables

> **Ámbito:** Configuración del Ecosistema e Integración Local  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Proyecto:** COMPUNEX B2B  
> **Propósito:** Normas para la gestión de variables de entorno, configuración segura en local, colección de Postman para pruebas de API y enlace entre Spring Boot y Angular.

---

## 🏛️ Principios de Configuración

### 1. Variables de Entorno y Secretos (`.env`)
* **Archivos Canónicos:**
  * `.env.example`: Archivo versionado en Git que documenta cada variable requerida con valores locales seguros:
    ```env
    # Base de Datos MySQL XAMPP
    SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/compunex_b2b?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    SPRING_DATASOURCE_USERNAME=root
    SPRING_DATASOURCE_PASSWORD=
    
    # Servidor y Puerto
    SERVER_PORT=8080
    
    # Seguridad JWT
    JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
    JWT_EXPIRATION_MS=86400000
    
    # CORS
    CORS_ALLOWED_ORIGINS=http://localhost:4200
    ```
  * `.env` / `application-local.properties`: Archivos locales no versionados (protegidos en `.gitignore`).
* **Cero Secretos en el Repositorio:** El agente de IA tiene estrictamente prohibido hacer commit de credenciales reales.

### 2. Colección de Pruebas Automatizadas de Postman
* La verificación del contrato de API se automatiza mediante la colección exportada en:
  `documentacion/02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/COMPUNEX_B2B_API.postman_collection.json`.
* En el `Sprint-06`, se ejecutan los 24 endpoints contra el servidor Spring Boot local para verificar respuestas 200/201 y esquemas RFC 9457 en caso de errores 400/401/403/404/409.

### 3. Enlace Frontend-Backend en Local
* Frontend Angular (`http://localhost:4200`) se comunica con Backend Spring Boot (`http://localhost:8080/api/v1`).
* Configuración de proxy para desarrollo en `proxy.conf.json`:
  ```json
  {
    "/api": {
      "target": "http://localhost:8080",
      "secure": false
    }
  }
  ```
