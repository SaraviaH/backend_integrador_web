# 04. Integración y Configuración: Entorno y Desacoplamiento

> **Ámbito:** Configuración del Ecosistema e Integración Continua  
> **Fase del SDLC:** Fase 03 · Construcción y Desarrollo  
> **Propósito:** Normas para la gestión de variables de entorno, contenedorización local con Docker, clientes API tipados y preparación del pipeline de integración continua (CI) local.

---

## 🏛️ Principios de Configuración

### 1. Gestión Segura de Configuración (.env)
* **Principio de las 12 Aplicaciones (Twelve-Factor App):** La configuración que varía entre entornos (puertos, URLs de servicios, secretos) reside en variables de entorno, nunca en código fuente.
* **Archivos Canónicos:**
  * `.env.example`: Archivo versionado en Git que documenta cada variable requerida con valores de ejemplo seguros o comentarios.
  * `.env`: Archivo local real con credenciales reales. **Está estrictamente excluido en `.gitignore`.**
* **Cero Secretos en Repositorio:** El agente de IA tiene prohibido hacer commit de tokens, passwords o claves privadas.

### 2. Ecosistema Local con Docker Compose
* El archivo `docker-compose.yml` en la raíz permite levantar todos los servicios auxiliares con un solo comando:
  ```bash
  docker compose up -d
  ```
* Incluye contenedores de base de datos local y, si aplica, brokers de mensajería (Redis, RabbitMQ) para que ningún desarrollador dependa de internet para programar y probar.

### 3. Cliente API y Mocking Local
* Durante el desarrollo en paralelo de la Fase 03, el cliente de Frontend se comunica con el mock server local levantado mediante Prism:
  ```bash
  npx @stoplight/prism-cli mock ../02_Fase_Diseno_y_Arquitectura/05_Integracion_y_APIs/openapi_template.yaml -p 8080
  ```
* Al llegar al `Sprint-G_Final_Integracion_E2E`, se conmuta la URL base del cliente para apuntar al Backend local real.

### 4. Automatización de Pruebas y Linters Locales
* Antes de abrir cualquier Pull Request hacia `develop`, el desarrollador o agente ejecuta la suite local:
  * Backend: `./mvnw test` o `pytest` o `go test ./...`
  * Frontend: `flutter test` o `npm test`
  * Linter: `flutter analyze` o `npm run lint` o `flake8`
