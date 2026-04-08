# Cambios para la Tesis — Sinapsistencia

> Documento de texto de reemplazo para las secciones de la tesis que deben actualizarse
> para reflejar el proyecto implementado.
>
> **Caso de estudio:** Clinica SANNA "El Golf"
> **Fecha:** 2026-04-08

---

# SECCION 1 — Caso de estudio (reemplaza toda mencion al INSN-SB)

## 1.4.1 Caso de estudio

El presente proyecto toma como caso de estudio la **Clinica SANNA "El Golf"**, una institucion de salud privada de alta complejidad ubicada en el distrito de San Isidro, Lima, Peru. SANNA "El Golf" forma parte de la red de clinicas SANNA, una de las redes hospitalarias privadas mas grandes del pais, y ofrece servicios medicos en multiples especialidades incluyendo cirugia general, cardiologia, pediatria, ginecologia, traumatologia, entre otras.

La clinica atiende un volumen significativo de consultas, procedimientos quirurgicos e intervenciones medicas que generan documentacion clinica susceptible de implicancias legales. Al tratarse de un centro de salud privado de alto nivel, la exposicion a reclamaciones por presunta mala praxis, conflictos sobre consentimiento informado y disputas en procedimientos invasivos es considerable.

Actualmente, los profesionales medicos de la clinica no cuentan con un sistema digital especializado que les permita:

- Documentar actos medicos con trazabilidad legal desde su creacion.
- Gestionar consentimientos informados con firma digital y registro temporal.
- Conectarse con abogados especializados en derecho medico de forma confidencial.
- Recibir evaluaciones de riesgo medico-legal sobre sus procedimientos.
- Mantener una linea de evidencia documental ante posibles procesos legales.

Esta situacion genera que los medicos dependan de procesos manuales, comunicaciones informales y documentacion dispersa, lo cual incrementa su vulnerabilidad ante eventos legales adversos.

La Clinica SANNA "El Golf" representa un caso de estudio idoneo porque:

1. **Volumen y complejidad clinica:** Atiende especialidades medicas de alta complejidad donde los riesgos legales son inherentes.
2. **Entorno regulado:** Opera bajo la normativa del Ministerio de Salud (MINSA), la Superintendencia Nacional de Salud (SUSALUD) y las disposiciones de la Ley General de Salud (Ley 26842).
3. **Poblacion medica calificada:** Cuenta con profesionales de salud que requieren herramientas tecnologicas para proteger su ejercicio profesional.
4. **Representatividad del sector privado:** Los hallazgos y la solucion desarrollada son extrapolables a otras clinicas privadas del pais con problematicas similares.

---

# SECCION 2 — Objetivos (reemplaza los OE actuales)

## Objetivo General

Desarrollar una aplicacion web basada en Machine Learning que brinde asesoramiento medico-legal a los profesionales de la salud de la Clinica SANNA "El Golf", permitiendo la gestion documental con trazabilidad legal, la conexion con abogados especializados y la evaluacion de riesgo mediante inteligencia artificial explicable.

## Objetivos Especificos

### OE1 — Modulo de gestion documental clinico-legal

Implementar un modulo de gestion documental que permita a los medicos crear, versionar, firmar digitalmente y archivar documentos clinico-legales (historias clinicas, consentimientos informados, informes medicos, certificados) con trazabilidad completa de cada accion, garantizando una cadena de evidencia valida ante procesos legales.

**Indicador de exito:** El 100% de los documentos creados registran autor, fecha, versiones y firmas digitales con hash de integridad.

### OE2 — Modulo de matching medico-abogado y gestion de casos legales

Desarrollar un sistema de recomendacion y contacto que permita a los medicos encontrar abogados especializados en derecho medico segun su caso particular, establecer comunicacion confidencial y gestionar casos legales con seguimiento de estados, prioridades y documentacion asociada.

**Indicador de exito:** Los medicos pueden enviar solicitudes de contacto a abogados recomendados y gestionar al menos el ciclo completo de un caso legal (creacion, asignacion, seguimiento, cierre).

### OE3 — Modulo de evaluacion de riesgo medico-legal basado en Machine Learning

Disenar e implementar un motor de evaluacion de riesgo que, mediante modelos de Machine Learning, analice los factores clinicos y documentales de un caso para generar un puntaje de riesgo medico-legal, acompanado de explicaciones comprensibles (XAI) utilizando tecnicas como SHAP y LIME, de modo que el medico entienda los factores que contribuyen al riesgo identificado.

**Indicador de exito:** El modelo alcanza una precision >= 85% en la clasificacion de niveles de riesgo, y cada prediccion incluye al menos 3 factores explicativos generados por SHAP/LIME.

### OE4 — Modulo de administracion hospitalaria y auditoria

Implementar un panel de administracion que permita al personal administrativo de la clinica gestionar usuarios, pacientes y episodios clinicos, asi como un registro de auditoria completo que trace todas las acciones realizadas en el sistema (logins, creaciones, ediciones, firmas, descargas) para cumplir con los requisitos regulatorios de trazabilidad en salud.

**Indicador de exito:** El 100% de las acciones criticas del sistema quedan registradas en el log de auditoria con usuario, accion, recurso, IP y timestamp.

---

# SECCION 3 — Diseno de la Solucion (reemplaza la seccion 1.5 completa)

## 1.5 Diseno de la Solucion

### 1.5.1 Vision general

Sinapsistencia es una aplicacion web de tipo Single Page Application (SPA) con renderizado hibrido (Server-Side Rendering + Client-Side Rendering) construida sobre **Next.js**, el framework de React para produccion. La arquitectura sigue principios de **Clean Architecture** con **Domain-Driven Design (DDD)** aplicando vertical slicing por modulo de negocio.

La solucion se compone de tres capas principales por modulo:

- **Domain (Dominio):** Entidades, interfaces de repositorio y casos de uso que encapsulan la logica de negocio pura, sin dependencias de frameworks.
- **Infrastructure (Infraestructura):** Implementaciones concretas de los repositorios (API, Mock), cliente HTTP, contenedor de inyeccion de dependencias.
- **Presentation (Presentacion):** Componentes React, hooks personalizados, stores de estado y paginas del App Router de Next.js.

### 1.5.2 Stack tecnologico

| Capa | Tecnologia | Version | Proposito |
|------|-----------|---------|-----------|
| **Framework** | Next.js | 16.2.2 | App Router, SSR/CSR hibrido, API Routes |
| **UI Library** | React | 19.2.4 | Renderizado declarativo de interfaces |
| **Lenguaje** | TypeScript | 5.x | Tipado estatico estricto |
| **Estilos** | Tailwind CSS | 4.x | Utility-first CSS framework |
| **Componentes UI** | shadcn/ui + Radix UI | - | Sistema de componentes accesibles |
| **Estado global** | Zustand | 5.0.12 | Estado de autenticacion y UI |
| **Estado servidor** | TanStack React Query | 5.96.2 | Cache, sincronizacion y fetching de datos |
| **Formularios** | React Hook Form | 7.72.1 | Manejo performante de formularios |
| **Validacion** | Zod | 4.3.6 | Validacion de esquemas en runtime |
| **Iconos** | Lucide React | 1.7.0 | Sistema de iconos consistente |
| **ML Engine** | Python + scikit-learn + SHAP + LIME | - | Motor de Machine Learning explicable (planificado) |
| **Base de datos** | PostgreSQL | 16.x | Almacenamiento relacional (planificado) |

> **Nota sobre el prototipo:** La version actual del sistema implementa el frontend completo con un backend simulado mediante API Routes de Next.js que consumen datos en memoria (mock data). La arquitectura de repositorios con inyeccion de dependencias permite migrar al backend real (API REST con base de datos PostgreSQL y motor ML) modificando unicamente el contenedor de DI, sin alterar la logica de dominio ni la capa de presentacion.

### 1.5.3 Arquitectura del sistema

La aplicacion sigue una arquitectura de **tres portales diferenciados** segun el rol del usuario:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SINAPSISTENCIA WEB APP                        │
│                     (Next.js 16 + React 19)                     │
├──────────────┬──────────────────┬───────────────────────────────┤
│ Portal       │  Portal          │  Portal                       │
│ Medico       │  Abogado         │  Administrador                │
│ /doctor/*    │  /lawyer/*       │  /admin/*                     │
├──────────────┴──────────────────┴───────────────────────────────┤
│                     Capa de Presentacion                        │
│        (React Components + Hooks + TanStack Query)              │
├─────────────────────────────────────────────────────────────────┤
│                     Capa de Dominio                             │
│           (Entities + Use Cases + Repository Interfaces)        │
├─────────────────────────────────────────────────────────────────┤
│                     Capa de Infraestructura                     │
│      (API Repositories + HTTP Client + DI Container)            │
├─────────────────────────────────────────────────────────────────┤
│                     API Routes (Mock Backend)                   │
│              (Next.js Route Handlers + Mock Data)               │
├─────────────────────────────────────────────────────────────────┤
│                Backend Real (planificado)                        │
│     (REST API + PostgreSQL + ML Engine Python)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 1.5.4 Estructura del proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Layout raiz (fuentes, providers)
│   ├── page.tsx            # Landing page publica
│   ├── login/              # Pagina de inicio de sesion
│   ├── register/           # Solicitud de acceso
│   ├── doctor/             # Portal medico (6 paginas)
│   │   ├── dashboard/      # Resumen: casos, documentos, recomendaciones
│   │   ├── cases/          # Listado y detalle de casos legales
│   │   ├── documents/      # Gestion documental completa
│   │   ├── lawyers/        # Directorio de abogados + matching
│   │   └── profile/        # Perfil profesional
│   ├── lawyer/             # Portal abogado (4 paginas)
│   │   ├── dashboard/      # Solicitudes pendientes y casos activos
│   │   ├── requests/       # Gestion de solicitudes de contacto
│   │   ├── doctors/        # Directorio de medicos
│   │   └── profile/        # Perfil profesional
│   ├── admin/              # Portal administrador (6 paginas)
│   │   ├── dashboard/      # Estadisticas globales del sistema
│   │   ├── users/          # Gestion de usuarios (CRUD)
│   │   ├── patients/       # Gestion de pacientes
│   │   ├── documents/      # Supervision documental
│   │   ├── episodes/       # Episodios clinicos hospitalarios
│   │   └── audit/          # Registro de auditoria
│   └── api/                # API Routes (15 endpoints mock)
│       ├── auth/           # Login, logout, session (me)
│       ├── users/          # CRUD de usuarios
│       ├── patients/       # CRUD de pacientes
│       ├── documents/      # CRUD de documentos
│       ├── legal-cases/    # CRUD de casos legales
│       ├── matching/       # Recomendaciones y solicitudes
│       └── audit/          # Logs de auditoria
├── modules/                # Modulos de dominio (DDD vertical slicing)
│   ├── auth/               # Autenticacion y sesiones
│   ├── users/              # Gestion de usuarios y perfiles
│   ├── patients/           # Gestion de pacientes
│   ├── documents/          # Gestion documental
│   ├── cases/              # Casos legales
│   ├── matching/           # Matching medico-abogado
│   └── audit/              # Auditoria y trazabilidad
├── components/             # Componentes compartidos (shadcn/ui)
├── infrastructure/         # DI container + HTTP client
├── lib/                    # Utilidades (api, cookies, query keys)
├── mocks/                  # Datos mock (users, documents, cases, matching)
├── store/                  # Re-exports de stores Zustand
├── types/                  # Tipos globales del dominio (15 entidades)
├── constants/              # Labels, badges, navegacion por rol
└── validators/             # Schemas Zod (auth, cases)
```

### 1.5.5 Patron de repositorio e inyeccion de dependencias

Cada modulo define una **interfaz de repositorio** en la capa de dominio y una o mas **implementaciones concretas** en la capa de infraestructura:

```
IDocumentRepository (interface)
    ├── ApiDocumentRepository    → consume /api/documents (mock actual)
    └── MockDocumentRepository   → datos en memoria (alternativa)
```

Un **contenedor de inyeccion de dependencias** centralizado (`src/infrastructure/di/container.ts`) instancia los repositorios y los expone como singletons. Los hooks de presentacion consumen estos repositorios sin conocer la implementacion concreta:

```typescript
// Contenedor DI — punto unico de swap mock → real
export const authRepository     = new ApiAuthRepository();
export const caseRepository     = new ApiCaseRepository();
export const documentRepository = new ApiDocumentRepository();
export const matchingRepository = new ApiMatchingRepository();
export const auditRepository    = new ApiAuditRepository();
export const userRepository     = new ApiUserRepository();
export const patientRepository  = new ApiPatientRepository();
```

**Estrategia de migracion:** Para conectar con el backend real (REST API + PostgreSQL + ML Engine), solo se necesita cambiar la URL base en el `ApiClient` o crear nuevas implementaciones de repositorio. Ningun componente de UI, hook ni caso de uso requiere modificacion.

### 1.5.6 Modelo de datos

El sistema define **15 entidades de dominio** organizadas en los siguientes grupos:

**Identidad y acceso:**
- `User` — Usuario del sistema con rol (doctor, lawyer, admin)
- `DoctorProfile` — Perfil extendido del medico (CMP, especialidad, hospital)
- `LawyerProfile` — Perfil extendido del abogado (CAB, especialidades, rating)
- `AdminProfile` — Perfil del administrador hospitalario (departamento)

**Gestion clinica:**
- `Patient` — Paciente con datos demograficos (DNI, datos de contacto)
- `ClinicalEpisode` — Episodio clinico (diagnostico, fechas, estado)
- `Hospital` — Institucion de salud

**Gestion documental:**
- `Document` — Documento clinico-legal (8 tipos, 4 estados, versionado)
- `DocumentVersion` — Version individual de un documento (contenido, archivos)
- `SignatureRecord` — Firma digital con hash de integridad
- `ConsentRecord` — Registro de consentimiento informado

**Gestion legal:**
- `LegalCase` — Caso legal con prioridad, estado y documentos asociados
- `MatchRecommendation` — Recomendacion de abogado con score y razones
- `ContactRequest` — Solicitud de contacto medico → abogado

**Trazabilidad:**
- `AuditLog` — Registro de auditoria (9 tipos de accion rastreados)

### 1.5.7 Seguridad y control de acceso

El sistema implementa un esquema de **doble capa de proteccion**:

1. **Capa servidor (middleware/proxy):** Intercepta cada request y valida la cookie de sesion. Redirige usuarios no autenticados a `/login` y previene el acceso entre portales de distintos roles.

2. **Capa cliente (RoleGuard + Authorized):** Componentes React que verifican el rol del usuario en el store de Zustand y ocultan o redirigen si el acceso no corresponde.

**Matriz de acceso por rol:**

| Modulo | Medico | Abogado | Administrador |
|--------|--------|---------|---------------|
| Gestion documental | Crear, editar, firmar | Solo lectura (casos asignados) | Supervision (solo lectura) |
| Casos legales | Crear, gestionar | Revisar, asesorar | Sin acceso |
| Matching | Buscar abogados, enviar solicitud | Recibir solicitudes, aceptar/rechazar | Sin acceso |
| Pacientes | Ver propios | Sin acceso | CRUD completo |
| Usuarios | Ver perfil propio | Ver perfil propio | CRUD completo |
| Episodios clinicos | Sin acceso directo | Sin acceso | CRUD completo |
| Auditoria | Sin acceso | Sin acceso | Solo lectura |

> **Nota importante:** El modulo de casos legales es exclusivo de medicos y abogados. El administrador hospitalario no tiene visibilidad sobre los asuntos legales privados entre medicos y sus abogados.

### 1.5.8 Componente de Machine Learning (planificado)

El modulo de evaluacion de riesgo basado en Machine Learning esta disenado como un componente independiente que se integrara al sistema a traves de la misma arquitectura de repositorios:

**Arquitectura del motor ML:**

```
┌──────────────────────────────────────────────────┐
│              Frontend (Next.js)                    │
│  RiskAssessmentCard + RiskFactorsChart + XAI UI   │
├──────────────────────────────────────────────────┤
│         IRiskRepository (interface)                │
│    ├── MockRiskRepository (prototipo actual)       │
│    └── ApiRiskRepository  (backend real)           │
├──────────────────────────────────────────────────┤
│           REST API Endpoint                        │
│         POST /api/ml/assess-risk                  │
├──────────────────────────────────────────────────┤
│             ML Engine (Python)                     │
│  ┌─────────────┐  ┌──────────┐  ┌────────────┐   │
│  │ Modelo      │  │  SHAP    │  │   LIME     │   │
│  │ Clasificador│  │ Explainer│  │  Explainer │   │
│  │ (RF/XGBoost)│  │          │  │            │   │
│  └─────────────┘  └──────────┘  └────────────┘   │
├──────────────────────────────────────────────────┤
│           PostgreSQL + Feature Store              │
└──────────────────────────────────────────────────┘
```

**Flujo de prediccion:**
1. El medico solicita una evaluacion de riesgo desde la interfaz.
2. El frontend envia los datos del caso al endpoint `/api/ml/assess-risk`.
3. El ML Engine procesa los features (tipo de procedimiento, antecedentes, documentacion, perfil del paciente).
4. El modelo clasificador (Random Forest o XGBoost) genera un score de riesgo (0-100).
5. SHAP y LIME generan explicaciones de los factores mas influyentes.
6. La respuesta incluye: score, nivel de riesgo (bajo/medio/alto/critico), factores explicativos y recomendaciones.
7. La interfaz presenta los resultados mediante graficos interactivos y texto comprensible.

**Metricas objetivo:**
- Precision del modelo: >= 85%
- Tiempo de respuesta: < 1 segundo
- Explicabilidad: minimo 3 factores SHAP por prediccion

---

# SECCION 4 — Modulos del sistema (reemplaza la descripcion de modulos)

## Modulos funcionales

### Modulo 1: Autenticacion y control de acceso (Auth)

**Descripcion:** Gestiona el ciclo completo de autenticacion: inicio de sesion por credenciales, cierre de sesion seguro, validacion de tokens y proteccion de rutas por rol.

**Funcionalidades implementadas:**
- Inicio de sesion con correo electronico y contrasena
- Acceso rapido por rol (modo demo para evaluadores)
- Cierre de sesion con limpieza de estado y cookies
- Proteccion de rutas por rol (middleware + RoleGuard client-side)
- Redireccion automatica segun rol
- Cambio de rol desde sidebar (modo testing)

**Entidades:** User, SessionEntity

**Endpoints:**
- `POST /api/auth/login` — Autenticar usuario
- `POST /api/auth/logout` — Cerrar sesion
- `GET /api/auth/me` — Obtener sesion actual

---

### Modulo 2: Gestion documental clinico-legal (Documents)

**Descripcion:** Permite la creacion, edicion, versionado, firma digital y archivado de documentos clinico-legales con trazabilidad completa.

**Funcionalidades implementadas:**
- Listado de documentos con busqueda y filtros por tipo/estado
- Creacion de documentos (8 tipos: historia clinica, consentimiento informado, informe medico, receta, orden de laboratorio, certificado medico, documento legal, otro)
- Ciclo de estados: borrador → pendiente de firma → firmado → archivado
- Versionado de documentos con historial completo
- Firma digital con hash de integridad
- Supervision administrativa (solo lectura)

**Entidades:** Document, DocumentVersion, SignatureRecord, ConsentRecord

**Endpoints:**
- `GET /api/documents` — Listar documentos con filtros
- `POST /api/documents` — Crear documento
- `GET /api/documents/[id]` — Obtener detalle
- `PUT /api/documents/[id]` — Actualizar documento (contenido, estado, firma)

---

### Modulo 3: Casos legales (Cases)

**Descripcion:** Modulo exclusivo de medicos y abogados para la gestion de casos legales, incluyendo creacion, asignacion, seguimiento de estados y vinculacion de documentos de evidencia.

**Funcionalidades implementadas:**
- Creacion de casos legales con titulo, descripcion, prioridad y paciente
- Ciclo de estados: nuevo → en revision → activo → cerrado → archivado
- Niveles de prioridad: baja, media, alta, critica
- Asignacion de abogado al caso
- Vinculacion de documentos como evidencia
- Vista de detalle con timeline

**Entidades:** LegalCase

**Endpoints:**
- `GET /api/legal-cases` — Listar casos
- `POST /api/legal-cases` — Crear caso
- `GET /api/legal-cases/[id]` — Obtener detalle
- `PUT /api/legal-cases/[id]` — Actualizar caso

> **Restriccion de acceso:** El administrador hospitalario NO tiene acceso a este modulo. Los casos legales son asuntos privados entre el medico y su abogado.

---

### Modulo 4: Matching medico-abogado (Matching)

**Descripcion:** Sistema de recomendacion que sugiere abogados especializados en derecho medico segun el perfil del caso del medico, y gestiona el flujo de solicitudes de contacto.

**Funcionalidades implementadas:**
- Directorio de abogados con filtros por especialidad
- Recomendaciones con score de compatibilidad y razones
- Envio de solicitudes de contacto con mensaje
- Gestion de solicitudes (aceptar/rechazar) por parte del abogado
- Directorio de medicos para abogados

**Entidades:** MatchRecommendation, ContactRequest

**Endpoints:**
- `GET /api/matching/doctors` — Directorio de medicos
- `GET /api/matching/lawyers` — Directorio de abogados + recomendaciones
- `GET /api/matching/contact-requests` — Listar solicitudes
- `POST /api/matching/contact-requests` — Enviar solicitud
- `PATCH /api/matching/contact-requests` — Responder solicitud

---

### Modulo 5: Gestion de pacientes (Patients)

**Descripcion:** Administracion del registro de pacientes de la clinica con datos demograficos y de contacto.

**Funcionalidades implementadas:**
- Listado de pacientes con busqueda
- Registro de nuevos pacientes (DNI, nombre, fecha de nacimiento, genero, datos de contacto)
- Edicion de datos del paciente
- Visualizacion de perfil del paciente

**Entidades:** Patient

**Endpoints:**
- `GET /api/patients` — Listar pacientes
- `POST /api/patients` — Registrar paciente
- `GET /api/patients/[id]` — Obtener detalle
- `PUT /api/patients/[id]` — Actualizar paciente

---

### Modulo 6: Gestion de usuarios (Users)

**Descripcion:** Administracion de las cuentas de usuario del sistema, sus roles y perfiles extendidos segun tipo de usuario.

**Funcionalidades implementadas:**
- Listado de usuarios con filtros por rol y estado
- Creacion de cuentas con asignacion de rol
- Edicion de datos del usuario
- Activacion/desactivacion de cuentas
- Perfiles extendidos: DoctorProfile (CMP, especialidad, hospital), LawyerProfile (CAB, especialidades, rating), AdminProfile (departamento)

**Entidades:** User, DoctorProfile, LawyerProfile, AdminProfile

**Endpoints:**
- `GET /api/users` — Listar usuarios
- `POST /api/users` — Crear usuario
- `GET /api/users/[id]` — Obtener detalle
- `PATCH /api/users/[id]` — Actualizar usuario

---

### Modulo 7: Auditoria y trazabilidad (Audit)

**Descripcion:** Registro inmutable de todas las acciones realizadas en el sistema para cumplimiento regulatorio y trazabilidad forense.

**Funcionalidades implementadas:**
- Registro automatico de 9 tipos de accion: login, logout, create, update, delete, view, sign, download, share
- Cada registro incluye: usuario, accion, recurso, ID del recurso, descripcion, IP, user agent, metadata adicional
- Listado con filtros y busqueda
- Acceso exclusivo del administrador

**Entidades:** AuditLog

**Endpoints:**
- `GET /api/audit` — Listar logs de auditoria

---

### Modulo 8: Evaluacion de riesgo ML (ML-Risk) — Planificado

**Descripcion:** Motor de Machine Learning que evalua el riesgo medico-legal de un caso clinico y proporciona explicaciones comprensibles mediante tecnicas de inteligencia artificial explicable (XAI).

**Funcionalidades planificadas:**
- Evaluacion de riesgo con score 0-100 y clasificacion (bajo/medio/alto/critico)
- Analisis de factores de riesgo: tipo de procedimiento, documentacion existente, antecedentes del paciente, complejidad del caso
- Explicabilidad XAI con SHAP (importancia global de features) y LIME (explicacion local por prediccion)
- Historial de evaluaciones por paciente/caso
- Visualizacion interactiva de factores de riesgo
- Recomendaciones automaticas basadas en el nivel de riesgo

**Entidades planificadas:** RiskAssessment, RiskFactor, RiskExplanation

**Endpoints planificados:**
- `POST /api/ml/assess-risk` — Solicitar evaluacion de riesgo
- `GET /api/ml/risk-history/[patientId]` — Historial de evaluaciones
- `GET /api/ml/explain/[assessmentId]` — Explicacion XAI detallada

**Modelo de ML propuesto:**
- Algoritmo: Random Forest o XGBoost (clasificacion multiclase)
- Features de entrada: tipo de procedimiento, especialidad medica, edad del paciente, complejidad del caso, cantidad de documentacion, antecedentes de reclamaciones, tipo de consentimiento
- Output: score de riesgo (0-100), nivel (bajo/medio/alto/critico), top-N factores explicativos
- Explicabilidad: SHAP values para importancia global, LIME para explicacion por instancia
- Precision objetivo: >= 85%
- Tiempo de respuesta: < 1 segundo

---

# SECCION 5 — Adiciones al Marco Teorico (agregar en el Capitulo 2)

> Las siguientes definiciones deben **agregarse** al marco teorico existente, en la subseccion de tecnologias o herramientas. No reemplazan el contenido existente sobre ML, SHAP, LIME, etc., sino que lo complementan con las tecnologias realmente utilizadas en la implementacion.

---

## Next.js

Next.js es un framework de codigo abierto desarrollado por Vercel para la construccion de aplicaciones web con React. Proporciona capacidades de renderizado hibrido que incluyen Server-Side Rendering (SSR), Static Site Generation (SSG) y Client-Side Rendering (CSR), permitiendo optimizar el rendimiento y la experiencia de usuario segun el caso de uso.

Entre sus caracteristicas principales se encuentran:

- **App Router:** Sistema de enrutamiento basado en el sistema de archivos que utiliza convenciones de carpetas para definir rutas, layouts anidados y paginas.
- **API Routes:** Permite crear endpoints de backend dentro del mismo proyecto, lo que facilita el desarrollo full-stack sin necesidad de un servidor separado.
- **Server Components:** Componentes que se renderizan en el servidor, reduciendo el JavaScript enviado al cliente.
- **Middleware:** Permite ejecutar logica antes de que se complete una solicitud, util para autenticacion y redireccionamiento.

En el presente proyecto, Next.js 16 se utiliza como framework principal tanto para el frontend como para el backend simulado (API Routes con datos mock), aprovechando su arquitectura unificada para simplificar el desarrollo y despliegue.

**Referencia:** Vercel. (2024). *Next.js Documentation*. https://nextjs.org/docs

---

## React

React es una biblioteca de JavaScript de codigo abierto desarrollada por Meta (anteriormente Facebook) para la construccion de interfaces de usuario basadas en componentes. React introduce un paradigma declarativo donde el desarrollador describe como debe verse la interfaz en funcion del estado, y React se encarga de actualizar eficientemente el DOM.

Conceptos clave utilizados en el proyecto:

- **Componentes funcionales:** Unidades reutilizables de interfaz definidas como funciones de JavaScript.
- **Hooks:** Funciones que permiten acceder a estado (`useState`), efectos secundarios (`useEffect`) y contexto desde componentes funcionales.
- **Virtual DOM:** Representacion en memoria del DOM real que permite actualizaciones eficientes mediante un algoritmo de reconciliacion (diffing).

En el presente proyecto se utiliza React 19, la version mas reciente, que introduce mejoras en rendimiento con el compilador de React y soporte nativo para Server Components.

**Referencia:** Meta. (2024). *React Documentation*. https://react.dev

---

## TypeScript

TypeScript es un superconjunto tipado de JavaScript desarrollado por Microsoft que anade tipado estatico opcional al lenguaje. Permite detectar errores en tiempo de compilacion, mejorar la documentacion del codigo y facilitar el refactoring en proyectos de gran escala.

En Sinapsistencia, TypeScript se utiliza en modo estricto (`strict: true`) para garantizar la integridad de tipos en todo el proyecto, desde las entidades de dominio hasta los componentes de interfaz.

**Referencia:** Microsoft. (2024). *TypeScript Documentation*. https://www.typescriptlang.org/docs

---

## Tailwind CSS

Tailwind CSS es un framework de CSS que sigue el paradigma *utility-first*, proporcionando clases utilitarias de bajo nivel que se componen directamente en el HTML/JSX para construir disenos personalizados sin escribir CSS personalizado.

Ventajas aplicadas en el proyecto:

- Desarrollo rapido de interfaces responsive con clases como `flex`, `grid`, `md:`, `lg:`
- Sistema de diseno consistente con escalas predefinidas de espaciado, tipografia y color
- Purging automatico de clases no utilizadas para optimizar el tamano del bundle

**Referencia:** Tailwind Labs. (2024). *Tailwind CSS Documentation*. https://tailwindcss.com/docs

---

## shadcn/ui

shadcn/ui es una coleccion de componentes de interfaz reutilizables construidos sobre Radix UI (primitivos accesibles sin estilos) y estilizados con Tailwind CSS. A diferencia de bibliotecas de componentes tradicionales, shadcn/ui no se instala como dependencia sino que se copia directamente en el proyecto, permitiendo personalizacion total.

Componentes utilizados en Sinapsistencia: Button, Card, Dialog, Input, Select, Badge, Avatar, Tabs, Tooltip, Dropdown Menu, Separator, Label.

**Referencia:** shadcn. (2024). *shadcn/ui Documentation*. https://ui.shadcn.com

---

## Zustand

Zustand es una biblioteca de gestion de estado para React que se caracteriza por su simplicidad, tamano reducido (~1KB) y API minimalista basada en hooks. A diferencia de Redux, no requiere boilerplate, providers ni reducers.

En el proyecto, Zustand gestiona el estado de autenticacion (sesion del usuario, token, rol activo) y el estado de la interfaz de usuario (sidebar, modales).

**Referencia:** Daishi Kato. (2024). *Zustand Documentation*. https://zustand-demo.pmnd.rs

---

## TanStack React Query

TanStack React Query (anteriormente React Query) es una biblioteca para la gestion del estado del servidor en aplicaciones React. Proporciona mecanismos de caching, sincronizacion automatica, revalidacion en segundo plano e invalidacion de cache.

En Sinapsistencia, TanStack Query gestiona todas las operaciones de datos con el backend: listados, detalles, creaciones y actualizaciones de documentos, casos, pacientes, usuarios y logs de auditoria. Centraliza las query keys en un archivo unico (`src/lib/query-keys.ts`) para mantener la consistencia del cache.

**Referencia:** Tanner Linsley. (2024). *TanStack Query Documentation*. https://tanstack.com/query

---

## React Hook Form

React Hook Form es una biblioteca de manejo de formularios para React que prioriza el rendimiento mediante el uso de refs no controlados, minimizando los re-renders. Se integra con Zod para validacion de esquemas.

En el proyecto, todos los formularios (login, registro, creacion de documentos, creacion de casos, gestion de pacientes) utilizan React Hook Form con resolvers de Zod para validacion declarativa.

**Referencia:** Bill Luo. (2024). *React Hook Form Documentation*. https://react-hook-form.com

---

## Zod

Zod es una biblioteca de declaracion y validacion de esquemas con inferencia de tipos TypeScript. Permite definir la forma de los datos una sola vez y obtener tanto la validacion en runtime como el tipo estatico de TypeScript.

En Sinapsistencia, Zod define los esquemas de validacion para formularios de autenticacion (`loginSchema`, `registerSchema`) y formularios de dominio (`caseFormSchema`), garantizando que los datos cumplan las reglas de negocio antes de ser enviados al backend.

**Referencia:** Colin McDonnell. (2024). *Zod Documentation*. https://zod.dev

---

## Clean Architecture

Clean Architecture es un patron arquitectonico propuesto por Robert C. Martin que organiza el codigo en capas concentricas donde las dependencias apuntan hacia adentro (Dependency Rule). Las capas externas (frameworks, UI, base de datos) dependen de las internas (entidades, casos de uso), pero nunca al reves.

En Sinapsistencia, cada modulo de dominio implementa tres capas:

1. **Domain:** Entidades (`*.entity.ts`), interfaces de repositorio (`I*Repository.ts`) y casos de uso (`*.use-case.ts`). No tiene dependencias de frameworks.
2. **Infrastructure:** Implementaciones de repositorio (`Api*Repository.ts`, `Mock*Repository.ts`) y el cliente HTTP. Depende del Domain.
3. **Presentation:** Componentes React, hooks y stores. Depende del Domain e Infrastructure.

Esta separacion permite que la logica de negocio sea independiente del framework (Next.js, React) y de la fuente de datos (mock, API real, base de datos), facilitando las pruebas unitarias y la migracion futura del backend.

**Referencia:** Martin, R. C. (2017). *Clean Architecture: A Craftsman's Guide to Software Structure and Design*. Prentice Hall.

---

## Domain-Driven Design (DDD)

Domain-Driven Design es un enfoque de desarrollo de software que centra el diseno en el modelo del dominio de negocio. En el contexto de Sinapsistencia, se aplica la tecnica de **vertical slicing**: cada modulo de negocio (Auth, Documents, Cases, Matching, Patients, Users, Audit) contiene sus propias entidades, repositorios, casos de uso, componentes y hooks, en lugar de agrupar por capa tecnica.

Esto permite que los equipos trabajen en modulos independientes con minima interferencia, y que cada modulo evolucione segun las necesidades de su dominio.

**Referencia:** Evans, E. (2003). *Domain-Driven Design: Tackling Complexity in the Heart of Software*. Addison-Wesley.

---

# SECCION 6 — Referencias a la Clinica SANNA "El Golf"

> En toda la tesis, reemplazar las menciones al "Instituto Nacional de Salud del Nino - San Borja (INSN-SB)" o cualquier otro hospital por lo siguiente:

**Nombre completo:** Clinica SANNA "El Golf"

**Descripcion para el documento:**
La Clinica SANNA "El Golf" es una institucion de salud privada de alta complejidad ubicada en Av. Aurelio Miro Quesada 1030, San Isidro, Lima, Peru. Forma parte de la red SANNA, operada por Intercorp, que cuenta con multiples clinicas a nivel nacional. Ofrece servicios medicos en especialidades como cirugia general, cardiologia, pediatria, ginecologia, oncologia, traumatologia y medicina interna, entre otras.

**Justificacion del cambio de caso de estudio:**
Se selecciono la Clinica SANNA "El Golf" como caso de estudio por representar un centro de salud privado de referencia en Lima con las siguientes caracteristicas relevantes:

1. Alta complejidad clinica con multiples especialidades medicas expuestas a riesgo legal.
2. Volumen significativo de procedimientos invasivos y consultas especializadas.
3. Operacion bajo el marco regulatorio del MINSA, SUSALUD y la Ley General de Salud.
4. Infraestructura tecnologica que permite la adopcion de soluciones digitales.
5. Representatividad del sector clinico privado peruano, lo que facilita la escalabilidad de los hallazgos.

---

# SECCION 7 — Resumen de cambios por seccion de la tesis

| Seccion de la tesis | Accion | Detalle |
|---------------------|--------|---------|
| 1.1 Antecedentes | Revisar | Verificar que los antecedentes globales, regionales y nacionales sigan siendo pertinentes. No requiere cambios mayores ya que tratan sobre ML en salud en general. |
| 1.2 Definicion del problema | Ajustar | Cambiar referencias al INSN-SB por Clinica SANNA "El Golf". El problema central (falta de herramientas ML para asesoramiento medico-legal) se mantiene. |
| 1.3 Analisis del problema (arbol) | Ajustar | Actualizar causas y efectos si mencionan el hospital anterior. |
| 1.4.1 Caso de estudio | **Reescribir** | Usar el texto de la SECCION 1 de este documento. |
| 1.4.2 Formulacion del problema | Ajustar | Cambiar nombre del hospital. La pregunta de investigacion se mantiene. |
| 1.4.3 Objetivo general | **Reescribir** | Usar el OG de la SECCION 2. |
| 1.4.4 Objetivos especificos | **Reescribir** | Usar los OE1-OE4 de la SECCION 2. |
| 1.5 Diseno de la solucion | **Reescribir** | Usar toda la SECCION 3 de este documento. |
| 1.5.x Modulos | **Reescribir** | Usar la SECCION 4 de este documento. |
| 1.6 Gestion del proyecto | Revisar | Actualizar EDT y cronograma si mencionan tecnologias anteriores (Angular, Spring Boot). Costos pueden mantenerse o ajustarse. |
| Cap 2 — Marco teorico | **Agregar** | Insertar las definiciones de la SECCION 5 (Next.js, React, TypeScript, Tailwind, etc.). Mantener las definiciones existentes de ML, SHAP, LIME. |
| Cap 3 — Estado del arte | Mantener | Los 40 articulos sobre ML en contexto medico-legal siguen vigentes. No requiere cambios. |
| Conclusiones generales | Ajustar | Actualizar si mencionan tecnologias o el hospital anterior. |
| Referencias | **Agregar** | Incluir las referencias bibliograficas de la SECCION 5. |

---

*Documento generado el 2026-04-08 a partir del analisis del codigo fuente del proyecto Sinapsistencia (commit 7f0cea4, branch master).*
