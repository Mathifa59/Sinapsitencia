# Product Backlog — Sinapsistencia

> Plataforma web basada en Machine Learning para el asesoramiento medico-legal
> a profesionales de la salud en la Clinica SANNA "El Golf"
>
> **Product Owner:** Vasquez Requejo Augusto Mathias Leonardo
> **Equipo:** 2 desarrolladores
> **Duracion de Sprint:** 2 semanas
> **Velocidad estimada:** 34-40 story points / sprint
> **Metodologia:** Scrum
> **Fecha de inicio:** 2026-01-13
> **Fecha de cierre estimada:** 2026-04-18 (7 sprints)

---

## Criterios de priorizacion

Se utiliza el metodo **MoSCoW** combinado con dependencias tecnicas:

| Prioridad | Significado | Criterio |
|-----------|-------------|----------|
| **Must Have** | Imprescindible | Sin esto el sistema no funciona o no cumple el objetivo principal |
| **Should Have** | Importante | Aporta valor significativo, requerido para la entrega final |
| **Could Have** | Deseable | Mejora la experiencia pero el sistema funciona sin ello |
| **Won't Have (this time)** | Fuera de alcance | Planificado para iteraciones futuras |

## Escala de Story Points (Fibonacci)

| SP | Complejidad | Ejemplo |
|----|-------------|---------|
| 1 | Trivial | Cambiar un label, agregar un badge |
| 2 | Simple | Boton con accion simple, toggle de estado |
| 3 | Moderada | Formulario con validacion basica, listado simple |
| 5 | Significativa | CRUD completo, modal con formulario + API |
| 8 | Compleja | Pagina completa con multiples componentes, flujos condicionales |
| 13 | Muy compleja | Modulo completo con multiples entidades y flujos |

---

## Backlog completo priorizado

### EPICA 1: Autenticacion y Control de Acceso

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 1 | HU-001 | Inicio de sesion por credenciales | Must Have | 5 | S1 | — | Done |
| 2 | HU-002 | Cierre de sesion | Must Have | 3 | S1 | HU-001 | Done |
| 3 | HU-003 | Proteccion de rutas por rol | Must Have | 8 | S1 | HU-001 | Done |
| 4 | HU-004 | Acceso rapido por rol (modo demo) | Should Have | 3 | S1 | HU-001 | Done |
| 5 | HU-005 | Cambio de rol desde sidebar (testing) | Could Have | 3 | S1 | HU-001, HU-003 | Done |

**Subtotal Epica 1:** 22 SP

---

### EPICA 10: Landing y Registro

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 6 | HU-032 | Pagina de inicio (landing) | Must Have | 5 | S1 | — | Done |
| 7 | HU-033 | Formulario de solicitud de acceso | Should Have | 5 | S1 | — | Done |

**Subtotal Epica 10:** 10 SP

---

### EPICA 2: Gestion Documental Clinico-Legal

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 8 | HU-006 | Listado de documentos con filtros | Must Have | 5 | S2 | HU-001, HU-003 | Done |
| 9 | HU-007 | Creacion de documentos | Must Have | 5 | S2 | HU-006 | Done |
| 10 | HU-008 | Detalle y trazabilidad de un documento | Must Have | 5 | S2 | HU-006 | Done |
| 11 | HU-009 | Cambio de estado de un documento | Must Have | 3 | S2 | HU-008 | Done |
| 12 | HU-010 | Listado de documentos (vista admin) | Should Have | 3 | S4 | HU-006 | Done |
| 13 | HU-041 | Historial de versiones de un documento | Should Have | 5 | S5 | HU-008 | Pendiente |
| 14 | HU-042 | Busqueda y filtrado avanzado de documentos | Could Have | 5 | S5 | HU-006 | Pendiente |

**Subtotal Epica 2:** 31 SP

---

### EPICA 3: Gestion de Casos Legales

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 15 | HU-011 | Listado de casos del medico | Must Have | 5 | S3 | HU-001, HU-003 | Done |
| 16 | HU-012 | Creacion de un caso legal | Must Have | 5 | S3 | HU-011 | Done |
| 17 | HU-013 | Detalle de un caso legal | Must Have | 5 | S3 | HU-011 | Done |
| 18 | HU-014 | Gestion de episodios clinicos (admin) | Should Have | 8 | S4 | HU-003 | Done |
| 19 | HU-037 | Asignacion de abogado a un caso legal | Should Have | 5 | S5 | HU-013 | Pendiente |
| 20 | HU-038 | Edicion de notas de un caso legal | Could Have | 3 | S5 | HU-013 | Pendiente |

**Subtotal Epica 3:** 31 SP

---

### EPICA 4: Vinculacion Medico-Abogado (Matching)

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 21 | HU-015 | Recomendaciones de abogados para medico | Must Have | 5 | S3 | HU-001 | Done |
| 22 | HU-016 | Envio de solicitud de contacto | Must Have | 5 | S3 | HU-015 | Done |
| 23 | HU-017 | Gestion de solicitudes recibidas (abogado) | Must Have | 5 | S3 | HU-016 | Done |
| 24 | HU-019 | Directorio de abogados (vista medico) | Should Have | 5 | S3 | HU-001 | Done |
| 25 | HU-020 | Directorio de medicos (vista abogado) | Should Have | 5 | S3 | HU-001 | Done |
| 26 | HU-039 | Mensaje de respuesta al gestionar solicitudes | Could Have | 3 | S6 | HU-017 | Pendiente |

**Subtotal Epica 4:** 28 SP

---

### EPICA 5: Gestion de Pacientes

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 27 | HU-021 | Listado de pacientes | Must Have | 5 | S4 | HU-003 | Done |
| 28 | HU-022 | Registro de nuevo paciente | Must Have | 5 | S4 | HU-021 | Done |
| 29 | HU-023 | Edicion de paciente | Should Have | 3 | S4 | HU-021 | Done |

**Subtotal Epica 5:** 13 SP

---

### EPICA 6: Gestion de Usuarios

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 30 | HU-024 | Listado de usuarios del sistema | Must Have | 5 | S4 | HU-003 | Done |
| 31 | HU-025 | Creacion de nuevo usuario | Must Have | 5 | S4 | HU-024 | Done |
| 32 | HU-026 | Activar/desactivar usuario | Should Have | 2 | S4 | HU-024 | Done |

**Subtotal Epica 6:** 12 SP

---

### EPICA 7: Auditoria y Trazabilidad

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 33 | HU-027 | Registro de auditoria | Must Have | 5 | S4 | HU-003 | Done |
| 34 | HU-043 | Exportar listado de auditoria a CSV | Could Have | 3 | S6 | HU-027 | Pendiente |

**Subtotal Epica 7:** 8 SP

---

### EPICA 8: Dashboard y Visualizacion

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 35 | HU-028 | Dashboard del medico | Must Have | 8 | S2 | HU-001, HU-003 | Done |
| 36 | HU-018 | Dashboard del abogado con solicitudes | Must Have | 8 | S3 | HU-017 | Done |
| 37 | HU-029 | Dashboard del administrador | Must Have | 8 | S4 | HU-024, HU-027 | Done |

**Subtotal Epica 8:** 24 SP

---

### EPICA 9: Perfil de Usuario

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 38 | HU-030 | Visualizacion y edicion de perfil medico | Should Have | 5 | S5 | HU-001 | Done |
| 39 | HU-031 | Visualizacion y edicion de perfil abogado | Should Have | 5 | S5 | HU-001 | Done |
| 40 | HU-040 | Toggle de disponibilidad del abogado | Could Have | 2 | S6 | HU-031 | Pendiente |

**Subtotal Epica 9:** 12 SP

---

### EPICA 11: Firmas Digitales y Consentimiento Informado

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 41 | HU-034 | Firma de un documento por parte del medico | Should Have | 5 | S5 | HU-008, HU-009 | Pendiente |
| 42 | HU-035 | Gestion de registros de consentimiento informado | Should Have | 8 | S6 | HU-034 | Pendiente |

**Subtotal Epica 11:** 13 SP

---

### EPICA 12: Gestion de Archivos Adjuntos

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 43 | HU-036 | Adjuntar documentos a un caso legal | Should Have | 8 | S6 | HU-013 | Pendiente |

**Subtotal Epica 12:** 8 SP

---

### EPICA 13: Evaluacion de Riesgo ML (Planificado — Sprint 7)

| # | ID | Historia de Usuario | Prioridad | SP | Sprint | Dependencias | Estado |
|---|-----|---------------------|-----------|-----|--------|--------------|--------|
| 44 | HU-044 | Evaluacion de riesgo medico-legal de un caso | Must Have | 13 | S7 | HU-013 | Pendiente |
| 45 | HU-045 | Visualizacion de factores de riesgo (XAI) | Must Have | 8 | S7 | HU-044 | Pendiente |
| 46 | HU-046 | Historial de evaluaciones de riesgo por paciente | Should Have | 5 | S7 | HU-044 | Pendiente |
| 47 | HU-047 | Recomendaciones automaticas basadas en riesgo | Should Have | 5 | S7 | HU-044 | Pendiente |

**Subtotal Epica 13:** 31 SP

> **Nota:** Las HU-044 a HU-047 seran detalladas con criterios de aceptacion y DoD al momento de iniciar el Sprint 7. Se incluyen en el backlog como items de alto nivel para visibilidad de alcance.

---

## Resumen por Epica

| Epica | Nombre | HUs | SP Total | % del total |
|-------|--------|-----|----------|-------------|
| E1 | Autenticacion y Control de Acceso | 5 | 22 | 9.2% |
| E2 | Gestion Documental Clinico-Legal | 7 | 31 | 12.9% |
| E3 | Gestion de Casos Legales | 6 | 31 | 12.9% |
| E4 | Vinculacion Medico-Abogado | 6 | 28 | 11.7% |
| E5 | Gestion de Pacientes | 3 | 13 | 5.4% |
| E6 | Gestion de Usuarios | 3 | 12 | 5.0% |
| E7 | Auditoria y Trazabilidad | 2 | 8 | 3.3% |
| E8 | Dashboard y Visualizacion | 3 | 24 | 10.0% |
| E9 | Perfil de Usuario | 3 | 12 | 5.0% |
| E10 | Landing y Registro | 2 | 10 | 4.2% |
| E11 | Firmas Digitales y Consentimiento | 2 | 13 | 5.4% |
| E12 | Gestion de Archivos Adjuntos | 1 | 8 | 3.3% |
| E13 | Evaluacion de Riesgo ML | 4 | 31 | 12.9% |
| | **TOTAL** | **47** | **243** | **100%** |

---

## Sprint Planning

### Sprint 1 — Fundamentos (Semanas 1-2)

> **Objetivo:** Establecer la base del sistema: autenticacion, proteccion de rutas, landing page y registro.
> **Fecha:** 2026-01-13 al 2026-01-24
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-032 | Landing page | 5 | Dev 1 |
| 2 | HU-001 | Inicio de sesion | 5 | Dev 2 |
| 3 | HU-003 | Proteccion de rutas por rol | 8 | Dev 2 |
| 4 | HU-002 | Cierre de sesion | 3 | Dev 2 |
| 5 | HU-004 | Acceso rapido por rol | 3 | Dev 1 |
| 6 | HU-033 | Formulario de solicitud de acceso | 5 | Dev 1 |
| 7 | HU-005 | Cambio de rol desde sidebar | 3 | Dev 1 |

**Total Sprint 1:** 32 SP | **Estado:** Completado

**Sprint Review:**
- Entregable: Sistema de autenticacion completo con 3 roles, landing page publica, proteccion de rutas.
- Demo: Login con credenciales, acceso rapido por rol, proteccion de rutas, logout, landing.

---

### Sprint 2 — Gestion Documental + Dashboard Medico (Semanas 3-4)

> **Objetivo:** Implementar el modulo completo de gestion documental y el dashboard del medico.
> **Fecha:** 2026-01-27 al 2026-02-07
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-006 | Listado de documentos con filtros | 5 | Dev 1 |
| 2 | HU-007 | Creacion de documentos | 5 | Dev 2 |
| 3 | HU-008 | Detalle y trazabilidad de documento | 5 | Dev 1 |
| 4 | HU-009 | Cambio de estado de documento | 3 | Dev 2 |
| 5 | HU-028 | Dashboard del medico | 8 | Dev 1 |

**Total Sprint 2:** 26 SP | **Estado:** Completado

**Sprint Review:**
- Entregable: CRUD completo de documentos con flujo de estados, dashboard medico funcional.
- Demo: Crear documento, ver detalle con versiones y firmas, cambiar estado, dashboard con estadisticas.

---

### Sprint 3 — Casos Legales + Matching (Semanas 5-6)

> **Objetivo:** Implementar casos legales para medicos y el sistema de matching medico-abogado completo.
> **Fecha:** 2026-02-10 al 2026-02-21
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-011 | Listado de casos del medico | 5 | Dev 1 |
| 2 | HU-012 | Creacion de un caso legal | 5 | Dev 1 |
| 3 | HU-013 | Detalle de un caso legal | 5 | Dev 1 |
| 4 | HU-015 | Recomendaciones de abogados | 5 | Dev 2 |
| 5 | HU-016 | Envio de solicitud de contacto | 5 | Dev 2 |
| 6 | HU-017 | Gestion de solicitudes (abogado) | 5 | Dev 2 |
| 7 | HU-019 | Directorio de abogados | 5 | Dev 1 |
| 8 | HU-020 | Directorio de medicos | 5 | Dev 2 |
| 9 | HU-018 | Dashboard del abogado | 8 | Dev 2 |

**Total Sprint 3:** 48 SP | **Estado:** Completado

**Sprint Review:**
- Entregable: Flujo completo de casos legales, matching con recomendaciones, directorios, dashboard abogado.
- Demo: Crear caso, ver detalle, buscar abogados, enviar solicitud, abogado acepta/rechaza.

---

### Sprint 4 — Panel Administrativo (Semanas 7-8)

> **Objetivo:** Implementar todo el portal del administrador: usuarios, pacientes, documentos, episodios, auditoria y dashboard.
> **Fecha:** 2026-02-24 al 2026-03-07
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-024 | Listado de usuarios | 5 | Dev 1 |
| 2 | HU-025 | Creacion de usuario | 5 | Dev 1 |
| 3 | HU-026 | Activar/desactivar usuario | 2 | Dev 1 |
| 4 | HU-021 | Listado de pacientes | 5 | Dev 2 |
| 5 | HU-022 | Registro de paciente | 5 | Dev 2 |
| 6 | HU-023 | Edicion de paciente | 3 | Dev 2 |
| 7 | HU-010 | Documentos (vista admin) | 3 | Dev 1 |
| 8 | HU-014 | Episodios clinicos (admin) | 8 | Dev 2 |
| 9 | HU-027 | Registro de auditoria | 5 | Dev 1 |
| 10 | HU-029 | Dashboard del administrador | 8 | Dev 1 |

**Total Sprint 4:** 49 SP | **Estado:** Completado

**Sprint Review:**
- Entregable: Portal administrador completo con gestion de usuarios, pacientes, episodios, auditoria.
- Demo: CRUD usuarios, CRUD pacientes, supervision documental, episodios clinicos, logs de auditoria, dashboard admin.

---

### Sprint 5 — Perfiles + Firmas + Mejoras Documentales (Semanas 9-10)

> **Objetivo:** Implementar perfiles profesionales, firma digital de documentos, asignacion de abogados y mejoras al modulo documental.
> **Fecha:** 2026-03-10 al 2026-03-21
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-030 | Perfil del medico | 5 | Dev 1 |
| 2 | HU-031 | Perfil del abogado | 5 | Dev 2 |
| 3 | HU-034 | Firma digital de documentos | 5 | Dev 1 |
| 4 | HU-037 | Asignacion de abogado a caso | 5 | Dev 2 |
| 5 | HU-038 | Edicion de notas de caso | 3 | Dev 2 |
| 6 | HU-041 | Historial de versiones de documento | 5 | Dev 1 |
| 7 | HU-042 | Filtrado avanzado de documentos | 5 | Dev 1 |

**Total Sprint 5:** 33 SP | **Estado:** Pendiente

**Sprint Review:**
- Entregable: Perfiles editables, firma digital con hash, asignacion de abogados, historial de versiones, filtros avanzados.
- Demo: Editar perfil, firmar documento, asignar abogado a caso, ver historial de versiones, filtrar documentos.

---

### Sprint 6 — Consentimiento + Adjuntos + Mejoras (Semanas 11-12)

> **Objetivo:** Implementar consentimiento informado, archivos adjuntos, exportacion CSV y mejoras menores.
> **Fecha:** 2026-03-24 al 2026-04-04
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-035 | Consentimiento informado | 8 | Dev 1 |
| 2 | HU-036 | Adjuntar documentos a caso | 8 | Dev 2 |
| 3 | HU-039 | Mensaje de respuesta en solicitudes | 3 | Dev 2 |
| 4 | HU-040 | Toggle de disponibilidad abogado | 2 | Dev 2 |
| 5 | HU-043 | Exportar auditoria a CSV | 3 | Dev 1 |

**Total Sprint 6:** 24 SP | **Estado:** Pendiente

**Sprint Review:**
- Entregable: Gestion de consentimiento, adjuntos en casos, respuestas con mensaje, toggle disponibilidad, export CSV.
- Demo: Crear consentimiento, adjuntar archivo a caso, responder solicitud con mensaje, exportar auditoria.

---

### Sprint 7 — Modulo de Machine Learning (Semanas 13-14)

> **Objetivo:** Implementar el modulo de evaluacion de riesgo medico-legal con ML y explicabilidad XAI.
> **Fecha:** 2026-04-07 al 2026-04-18
> **Capacidad:** 38 SP

| Orden | ID | Historia | SP | Asignado a |
|-------|------|---------|-----|------------|
| 1 | HU-044 | Evaluacion de riesgo ML | 13 | Dev 1 + Dev 2 |
| 2 | HU-045 | Visualizacion factores XAI | 8 | Dev 1 |
| 3 | HU-046 | Historial de evaluaciones de riesgo | 5 | Dev 2 |
| 4 | HU-047 | Recomendaciones basadas en riesgo | 5 | Dev 2 |

**Total Sprint 7:** 31 SP | **Estado:** Planificado

**Sprint Review:**
- Entregable: Motor ML con evaluacion de riesgo, visualizacion SHAP/LIME, historial y recomendaciones.
- Demo: Solicitar evaluacion, ver score con factores explicativos, consultar historial, recibir recomendaciones.

---

## Resumen de Sprint Planning

| Sprint | Semanas | Tema | SP Planificados | SP Completados | Estado |
|--------|---------|------|-----------------|----------------|--------|
| S1 | 1-2 | Fundamentos: Auth + Landing | 32 | 32 | Completado |
| S2 | 3-4 | Gestion Documental + Dashboard Medico | 26 | 26 | Completado |
| S3 | 5-6 | Casos Legales + Matching + Dashboard Abogado | 48 | 48 | Completado |
| S4 | 7-8 | Panel Administrativo completo | 49 | 49 | Completado |
| S5 | 9-10 | Perfiles + Firmas + Mejoras | 33 | — | Pendiente |
| S6 | 11-12 | Consentimiento + Adjuntos + Mejoras | 24 | — | Pendiente |
| S7 | 13-14 | Modulo de Machine Learning | 31 | — | Planificado |
| | | **TOTAL** | **243** | **155** | **63.8%** |

---

## Burndown Chart (datos)

| Sprint | SP Restantes (inicio) | SP Restantes (fin) |
|--------|-----------------------|--------------------|
| S0 (inicio) | 243 | 243 |
| S1 | 243 | 211 |
| S2 | 211 | 185 |
| S3 | 185 | 137 |
| S4 | 137 | 88 |
| S5 | 88 | 55 |
| S6 | 55 | 31 |
| S7 | 31 | 0 |

**Velocidad promedio real (S1-S4):** 38.75 SP/sprint
**Velocidad necesaria (S5-S7):** 29.3 SP/sprint
**Estado del proyecto:** Dentro del rango estimado, ritmo saludable.

---

## Mapa de dependencias entre HUs

```
HU-001 (Login)
├── HU-002 (Logout)
├── HU-003 (Proteccion rutas)
│   ├── HU-004 (Acceso rapido)
│   ├── HU-005 (Cambio de rol)
│   ├── HU-006 (Listado docs) ──────────── HU-042 (Filtros avanzados)
│   │   ├── HU-007 (Crear doc)
│   │   ├── HU-008 (Detalle doc) ───────── HU-041 (Historial versiones)
│   │   │   ├── HU-009 (Cambio estado)
│   │   │   └── HU-034 (Firma digital)
│   │   │       └── HU-035 (Consentimiento informado)
│   │   └── HU-010 (Docs admin)
│   ├── HU-011 (Listado casos)
│   │   ├── HU-012 (Crear caso)
│   │   └── HU-013 (Detalle caso) ──────── HU-037 (Asignar abogado)
│   │       ├── HU-038 (Editar notas)
│   │       ├── HU-036 (Adjuntar docs)
│   │       └── HU-044 (ML evaluacion) ─── HU-045 (XAI visualizacion)
│   │                                       ├── HU-046 (Historial riesgo)
│   │                                       └── HU-047 (Recomendaciones ML)
│   ├── HU-014 (Episodios clinicos)
│   ├── HU-015 (Recomendaciones)
│   │   └── HU-016 (Solicitud contacto)
│   │       └── HU-017 (Gestionar solicitudes)
│   │           ├── HU-018 (Dashboard abogado)
│   │           └── HU-039 (Mensaje respuesta)
│   ├── HU-019 (Directorio abogados)
│   ├── HU-020 (Directorio medicos)
│   ├── HU-021 (Listado pacientes)
│   │   ├── HU-022 (Crear paciente)
│   │   └── HU-023 (Editar paciente)
│   ├── HU-024 (Listado usuarios)
│   │   ├── HU-025 (Crear usuario)
│   │   ├── HU-026 (Activar/desactivar)
│   │   └── HU-029 (Dashboard admin)
│   └── HU-027 (Auditoria) ─────────────── HU-043 (Exportar CSV)
├── HU-028 (Dashboard medico)
├── HU-030 (Perfil medico)
└── HU-031 (Perfil abogado) ────────────── HU-040 (Toggle disponibilidad)

HU-032 (Landing) ── sin dependencias
HU-033 (Registro) ── sin dependencias
```

---

## Definition of Done Global

Toda historia de usuario se considera terminada cuando cumple:

- [ ] Codigo compilable sin errores de TypeScript (strict mode).
- [ ] Sin warnings en consola del navegador.
- [ ] Responsive: funcional en desktop (>=1024px) y mobile (>=375px).
- [ ] Datos consumidos desde API Routes (`/api/*`), no directamente de mocks.
- [ ] Componentes usan hooks de TanStack Query para estado del servidor.
- [ ] Estado de carga visible (spinner) durante peticiones asincronas.
- [ ] Estado vacio visible cuando no hay datos.
- [ ] Mensajes de error visibles cuando una operacion falla.
- [ ] Proteccion de ruta aplicada (no accesible sin autenticacion ni con rol incorrecto).
- [ ] Build exitoso (`next build` sin errores).

---

## Riesgos identificados

| ID | Riesgo | Probabilidad | Impacto | Mitigacion |
|----|--------|-------------|---------|-----------|
| R1 | Retraso en integracion del motor ML por complejidad del modelo | Alta | Alto | Implementar con datos simulados primero; motor real como mejora incremental |
| R2 | Cambios en requisitos del caso de estudio (Clinica SANNA) | Media | Medio | Arquitectura modular permite adaptar sin reescribir modulos completos |
| R3 | Dependencias tecnicas entre modulos causan bloqueos | Baja | Medio | Sprint planning con analisis de dependencias; DI container permite desarrollo paralelo |
| R4 | Rendimiento insuficiente del modelo ML (<85% precision) | Media | Alto | Iterar con multiples algoritmos; usar ensemble methods si es necesario |
| R5 | Incompatibilidad con regulaciones MINSA/SUSALUD | Baja | Alto | Validar con marco legal en Cap 2; modulo de auditoria cumple trazabilidad |

---

## Criterios de aceptacion del proyecto

El proyecto se considera exitoso cuando:

1. **Funcional:** Los 3 portales (medico, abogado, admin) estan operativos con todas las HU Must Have implementadas.
2. **ML:** El motor de evaluacion de riesgo genera predicciones con precision >= 85% y explicaciones XAI.
3. **Seguridad:** Ningun rol puede acceder a funcionalidades fuera de su ambito.
4. **Trazabilidad:** El 100% de las acciones criticas quedan registradas en el log de auditoria.
5. **Calidad:** Build exitoso sin errores de TypeScript, responsive, sin warnings en consola.
6. **Documentacion:** Arquitectura C4, modelo ER, historias de usuario y product backlog actualizados.

---

*Documento generado el 2026-04-10 | Proyecto Sinapsistencia | Branch master*
