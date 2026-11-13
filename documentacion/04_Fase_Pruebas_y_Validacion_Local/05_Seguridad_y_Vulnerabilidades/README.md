# 05. Pruebas de Seguridad, SAST y Vulnerabilidades

> **Área Técnica:** AppSec & DevSecOps  
> **Fase del SDLC:** Fase 04 · Pruebas y Validación Local  
> **Propósito:** Identificar vulnerabilidades en el código fuente (SAST), librerías de terceros con fallas de seguridad conocidas y comprobar la protección contra los riesgos principales de OWASP Top 10.

---

## 🛡️ 1. Pilares de Seguridad en Fase de Pruebas

1. **Auditoría de Dependencias (SCA):** Escaneo de librerías para detectar vulnerabilidades conocidas (CVEs).
2. **Análisis Estático de Código (SAST):** Detección de inyecciones SQL, cross-site scripting (XSS), referencias nulas o secretos quemados.
3. **Control de Secretos (Secret Scanning):** Asegurar que ningún archivo contenga tokens, contraseñas o claves privadas.
4. **Validación de Identidad y Autorización:** Probar que usuarios sin privilegios no puedan acceder a recursos protegidos modificando IDs en la URL (IDOR).

---

## 🛠️ 2. Herramientas Automatizadas Locales

* **Auditoría de Paquetes:** `npm audit`, `pip-audit`, `cargo audit`, `trivy fs .`.
* **Análisis Estático (SAST):** SonarLint, Semgrep, ESLint Security Plugin, Bandit (Python).
* **Escaneo de Secretos:** `gitleaks`, `trufflehog`, `git-secrets`.

---

## 📋 3. Matriz de Controles de Seguridad Obligatorios

| Control de Seguridad | Herramienta Ejecutada | Criterio de Aceptación | Estado |
| :--- | :--- | :--- | :---: |
| **Cero Secretos en Git** | `gitleaks detect` | 0 credenciales detectadas | `[Aprobado]` |
| **Vulnerabilidades en Librerías** | `npm audit / pip-audit` | 0 vulnerabilidades Críticas o Altas | `[Aprobado]` |
| **Protección contra Inyección SQL** | Revisión de repositorios | 100% de consultas parametrizadas | `[Aprobado]` |
| **Sanitización de Entradas (XSS)** | Pruebas de integración UI | Payloads con `<script>` renderizados como texto plano | `[Aprobado]` |
| **Control de Autorización (IDOR)** | Pruebas de API | `403 Forbidden` al acceder a recursos de otro usuario | `[Aprobado]` |
