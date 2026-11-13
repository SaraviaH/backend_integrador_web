# Sprint-G01 — Setup del Entorno y Proyectos Base

> **Área Técnica:** Transversal / DevOps y Entorno  
> **Track:** General  
> **Agente Responsable:** Agente DevOps / Setup  
> **Estado:** PENDIENTE  
> **Rama GitFlow:** `chore/setup-entorno-base` hacia `develop`  
> **Dependencias Previas:** Ninguna (Sprint Inicial)

---

## 1. Objetivo del Sprint
Configurar y validar el entorno de desarrollo local completo para COMPUNEX B2B, asegurando que el proyecto backend (Spring Boot 3.2.0 / Java 17) y el frontend (Angular 18 standalone) compilen limpiamente, se conecten al servicio MySQL 8.0 en XAMPP (puerto 3306), y expongan un endpoint de healthcheck operativo (`GET /api/v1/salud`).

---

## 2. Insumos y Referencias Obligatorias (Línea Base)
* **Stack Tecnológico:**
  * Backend: Java 17 LTS, Spring Boot 3.2.0, Spring Data JPA, Spring Security 6.2, JJWT 0.11.5, Lombok, Flyway.
  * Frontend: Angular 18, TypeScript 5.4, Tailwind CSS, SASS, Angular Signals.
  * Base de Datos: MySQL 8.0 (XAMPP puerto 3306, base de datos `compunex_db`).
  * Mock Server: Prism Mock Server (`@stoplight/prism-cli`) sobre `compunex-openapi.yaml`.
* **Referencias Documentales:**
  * `02_Fase_Diseno_y_Arquitectura/01_Backend/ARCHITECTURE.md`
  * `02_Fase_Diseno_y_Arquitectura/02_Frontend/ARCHITECTURE.md`
  * `03_Fase_Construccion_y_Desarrollo/04_Integracion_y_Configuracion/README.md`

---

## 3. Tareas Técnicas Detalladas (Paso a Paso)

### 3.1. Configuración del Repositorio y GitFlow
- [ ] Verificar ramas base `main` y `develop` en el repositorio Git.
- [ ] Configurar `.gitignore` exhaustivo (excluir `/target`, `/node_modules`, `/.angular`, `*.log`, `.env`).
- [ ] Crear archivo `.env.example` con las variables de entorno oficiales (puerto 8080, db url, db user, secret JWT).

### 3.2. Proyecto Backend (Spring Boot 3.2.0)
- [ ] Verificar estructura Maven multi-capa: `controller`, `service`, `repository`, `model`, `dto`, `config`, `exception`.
- [ ] Configurar `pom.xml` con las dependencias oficiales (Spring Web, Spring Security, Data JPA, MySQL Connector, JJWT, Lombok, MapStruct, Flyway).
- [ ] Configurar `src/main/resources/application.yml` y `application-dev.yml` con la cadena de conexión MySQL:
  ```yaml
  spring:
    datasource:
      url: jdbc:mysql://localhost:3306/compunex_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      username: root
      password: ""
  ```
- [ ] Implementar endpoint de salud:
  * Controlador: `SaludController.java`
  * Ruta: `GET /api/v1/salud` (Público, sin token)
  * Respuesta `200 OK`: `{"estado": "UP", "servicio": "COMPUNEX B2B API", "timestamp": "2026-11-13T..."}`.

### 3.3. Proyecto Frontend (Angular 18)
- [ ] Inicializar workspace Angular 18 con arquitectura standalone (`standalone: true`).
- [ ] Instalar y configurar Tailwind CSS y preprocesador SASS (`src/styles.scss`).
- [ ] Configurar `proxy.conf.json` para enrutamiento local a `http://localhost:8080` o Prism `http://localhost:4010`.
- [ ] Crear componente raíz `Shell` con router outlet y estructura de layouts (`PublicLayout`, `DashboardLayout`).

### 3.4. Servidor Mock (Prism) para Frontend Desacoplado
- [ ] Configurar script npm en package.json: `"mock:api": "prism mock ../documentacion/02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/compunex-openapi.yaml -p 4010"`.
- [ ] Probar levantamiento de Prism en puerto 4010.

---

## 4. Criterios de Aceptación (Definition of Done - DoD)
- [ ] `mvn clean package -DskipTests` genera el JAR ejecutable sin errores.
- [ ] `GET http://localhost:8080/api/v1/salud` responde `200 OK` con payload JSON válido.
- [ ] `ng build` en frontend compila sin advertencias ni errores.
- [ ] `npm run mock:api` levanta el servidor mock respondiendo a las rutas de `compunex-openapi.yaml`.
- [ ] Base de datos `compunex_db` creada en MySQL local.

---

## 5. Plan de Verificación y Comandos
```bash
# 1. Verificar backend
cd compunex-backend
mvn spring-boot:run
curl -i http://localhost:8080/api/v1/salud

# 2. Verificar frontend
cd compunex-frontend
npm start
# Abrir en navegador http://localhost:4200

# 3. Verificar Mock Server
npm run mock:api
curl -i http://localhost:4010/api/v1/categories
```

---

## 6. Matriz de Trazabilidad
| Requisito Funcional | Regla de Negocio | Endpoint / Recurso | Componente / Archivo |
| :--- | :--- | :--- | :--- |
| `RF-Transversal` | N/A | `GET /api/v1/salud` | `SaludController.java` |
| `RF-Transversal` | N/A | Layout Base | `AppComponent.ts`, `app.routes.ts` |
| `RF-Transversal` | N/A | Mock API 4010 | `package.json` (Prism Mock) |
