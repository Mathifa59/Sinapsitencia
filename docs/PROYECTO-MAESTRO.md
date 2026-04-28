# Sinapsistencia — Contexto Maestro del Proyecto

> Documento de referencia unificado. Consolida stack, arquitectura, reglas de negocio,
> estado de desarrollo y trabajo pendiente. Fuente única de verdad para onboarding y toma
> de decisiones.
>
> **Caso de estudio:** Clínica SANNA "El Golf" — San Isidro, Lima, Perú
> **Product Owner / Desarrollador principal:** Vasquez Requejo Augusto Mathias Leonardo
> **Equipo:** 2 desarrolladores · Metodología Scrum · Sprints de 2 semanas
> **Fecha de inicio:** 2026-01-13 · Cierre estimado: 2026-04-18 (7 sprints)

---

## Índice

1. [Descripción general](#1-descripción-general)
2. [Stack técnico](#2-stack-técnico)
3. [Repositorios y estructura de carpetas](#3-repositorios-y-estructura-de-carpetas)
4. [Arquitectura y flujo de datos](#4-arquitectura-y-flujo-de-datos)
5. [Módulos del sistema](#5-módulos-del-sistema)
6. [Reglas de negocio clave](#6-reglas-de-negocio-clave)
7. [Estado actual del desarrollo](#7-estado-actual-del-desarrollo)
8. [Lo que falta / está en progreso](#8-lo-que-falta--está-en-progreso)
9. [Variables de entorno y configuración](#9-variables-de-entorno-y-configuración)
10. [Datos de acceso demo](#10-datos-de-acceso-demo)

---

## 1. Descripción general

**Sinapsistencia** es una plataforma web de mediación médico-legal. Conecta médicos de la Clínica SANNA "El Golf" con abogados especializados en derecho médico para gestionar casos legales, documentos clínicos con trazabilidad legal y evaluaciones de riesgo mediante Machine Learning explicable (XAI).

### Tres roles de usuario

| Rol | Prefijo de ruta | Responsabilidad principal |
|-----|----------------|--------------------------|
| `doctor` | `/doctor/*` | Crear casos, gestionar documentos, buscar abogados vía ML |
| `lawyer` | `/lawyer/*` | Revisar solicitudes de contacto, asesorar casos, gestionar perfil |
| `admin` | `/admin/*` | Supervisar usuarios, pacientes, episodios, auditoría del sistema |

### Propósito del sistema (4 objetivos específicos)

| OE | Módulo | Indicador de éxito |
|----|--------|--------------------|
| OE1 | Gestión documental | 100 % de documentos con autor, fecha, versiones y firma con hash |
| OE2 | Matching + casos legales | Flujo completo: creación → asignación → seguimiento → cierre |
| OE3 | Evaluación de riesgo ML | Precisión ≥ 85 %, ≥ 3 factores SHAP por predicción, < 1 s respuesta |
| OE4 | Admin + auditoría | 100 % de acciones críticas en log con usuario, IP, timestamp |

---

## 2. Stack técnico

### Frontend + BFF (repo `Sinapsitencia`)

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | 16.2.2 | Framework principal: App Router, SSR/CSR híbrido, API Routes (BFF) |
| **React** | 19.2.4 | UI declarativa, Server Components |
| **TypeScript** | 5.x | Tipado estricto en toda la codebase |
| **Tailwind CSS** | 4.x | Utility-first CSS, diseño responsivo |
| **Radix UI** | varios | Primitivos accesibles: Avatar, Dialog, Tabs, Dropdown, Select, Tooltip |
| **CVA** | 0.7.1 | Variantes de componentes con type-safety |
| **Lucide React** | 1.7.0 | Sistema de iconos |
| **Zustand** | 5.0.12 | Estado global: sesión + UI (sidebar) |
| **TanStack Query** | 5.96.2 | Cache de datos del servidor, loading/error states |
| **React Hook Form** | 7.72.1 | Formularios performantes |
| **Zod** | 4.3.6 | Validación de esquemas + inferencia de tipos |
| **@supabase/supabase-js** | 2.103.0 | Cliente Supabase (browser) |
| **@supabase/ssr** | 0.10.2 | Cliente Supabase con cookies SSR (server) |

### ML Service (repo `Sinapsistencia ML`)

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **FastAPI** | — | Framework HTTP, routers, validación vía Pydantic |
| **Python** | 3.11 | Lenguaje base |
| **Uvicorn / Gunicorn** | — | Servidor ASGI |
| **scikit-learn** | — | TF-IDF, SVD, cosine similarity, scalers |
| **pydantic-settings** | — | Configuración con .env |
| **Docker** | — | Containerización para Railway |

### Infraestructura

| Servicio | Rol |
|---------|-----|
| **Vercel** | Hosting Next.js (Edge Network global) |
| **Supabase** (us-east-1) | Postgres 15, Auth (GoTrue + JWT), Storage S3-compat, PostgREST, Realtime, Edge Functions, Backups PITR |
| **Railway** | Container FastAPI ML (Dockerfile) + volume de `.pkl` |
| **n8n Cloud** | Automatización: workflow de alerta ante riesgo alto/crítico |
| **GitHub** | Control de versiones + CI/CD (dos repos separados) |
| **Resend / SMTP** | Envío de correos vía n8n |
| **Cloudflare DNS** | Gestión del dominio |

---

## 3. Repositorios y estructura de carpetas

### Repo 1 — `Sinapsitencia` (Next.js)

```
C:\Users\MathiasVasquez\Desktop\TP1\Sinapsitencia\
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Landing pública
│   │   ├── login/ + register/      # Autenticación
│   │   ├── doctor/                 # Portal médico (6 páginas)
│   │   ├── lawyer/                 # Portal abogado (4 páginas)
│   │   ├── admin/                  # Panel admin (6 páginas)
│   │   └── api/                    # BFF — 15 endpoints mock
│   │       ├── auth/               # login, logout, me, register
│   │       ├── legal-cases/        # CRUD casos
│   │       ├── documents/          # CRUD documentos
│   │       ├── matching/           # contact-requests
│   │       ├── users/ + patients/  # CRUD admin
│   │       └── audit/              # Lectura logs
│   ├── modules/                    # DDD — vertical slicing
│   │   ├── auth/                   # domain + infra + presentation
│   │   ├── cases/
│   │   ├── documents/
│   │   ├── matching/
│   │   ├── patients/
│   │   ├── users/
│   │   └── audit/
│   ├── components/
│   │   ├── ui/                     # Button, Badge, Input, Card, Avatar...
│   │   ├── layout/                 # DashboardLayout
│   │   ├── navigation/             # Sidebar + Topbar
│   │   └── dashboard/              # StatCard
│   ├── infrastructure/
│   │   ├── di/container.ts         # Punto de inyección de dependencias
│   │   └── http/api-client.ts      # Cliente HTTP base
│   ├── store/
│   │   ├── auth.store.ts           # Re-export (compatibilidad)
│   │   └── ui.store.ts             # sidebar open/close
│   ├── lib/
│   │   ├── utils.ts                # cn(), formatDate(), getInitials()
│   │   ├── query-client.ts         # TanStack Query config
│   │   └── query-keys.ts           # Claves de cache centralizadas
│   ├── validators/auth.ts          # loginSchema, registerSchema (Zod)
│   ├── constants/index.ts          # Labels, nav, especialidades
│   ├── types/index.ts              # 15 tipos globales del dominio
│   └── mocks/                      # Datos demo en memoria
│       ├── users.ts
│       ├── cases.ts
│       ├── documents.ts
│       └── matching.ts
├── n8n/
│   └── workflow-alerta-riesgo-alto.json
└── docs/
    ├── PROYECTO-MAESTRO.md         # este archivo
    ├── CODEBASE.md                 # guía técnica detallada
    ├── product-backlog.md
    ├── cambios-tesis.md
    ├── diagrama-fisico.drawio
    └── diagrama-logico.drawio
```

### Repo 2 — `Sinapsistencia ML` (FastAPI)

```
C:\Users\MathiasVasquez\Desktop\TP1\Sinapsistencia ML\
├── main.py                         # FastAPI app + lifespan (carga modelos)
├── Dockerfile
├── requirements.txt
├── app/
│   ├── config.py                   # Settings (pydantic-settings + .env)
│   ├── api/routes/
│   │   ├── health.py               # GET /health
│   │   └── recommendations.py      # POST /api/v1/recommendations
│   │                               # POST /api/v1/risk-assessment
│   │                               # POST /api/v1/train
│   │                               # POST /api/v1/train-from-supabase
│   │                               # GET  /api/v1/model/info
│   ├── domain/entities.py          # Pydantic models: DoctorProfile,
│   │                               # LawyerProfile, Interaction,
│   │                               # RecommendationRequest/Response,
│   │                               # RiskAssessmentRequest/Response,
│   │                               # TrainingData, ModelMetrics
│   ├── services/
│   │   ├── recommender.py          # RecommenderService (orquesta los modelos)
│   │   └── supabase_loader.py      # Lee lawyer_profiles + contact_requests
│   └── models/                     # Implementaciones de los modelos ML
├── artifacts/                      # .pkl serializados (tfidf, svd, hybrid...)
├── training/
│   ├── train.py                    # Pipeline de entrenamiento (datos locales)
│   └── evaluate.py                 # Métricas: Precision@K, Recall@K, NDCG, MAP
├── data/                           # Datos de entrenamiento
└── tests/
```

---

## 4. Arquitectura y flujo de datos

### Patrón DDD por módulo

```
Página (React)
    ↓  llama
Hook (TanStack Query)
    ↓  invoca
Use Case (lógica de negocio pura — sin dependencias de framework)
    ↓  usa interfaz
IRepository (contrato)
    ↓  implementado por
Api*Repository  →  Next.js API Route (BFF)  →  Supabase (supabase-js)
    (actual)
```

El único archivo que cambia al conectar un backend real es `src/infrastructure/di/container.ts`.

### Flujo de recomendación ML

```
/doctor/lawyers (UI)
    → useMatchRecommendations hook
    → POST /api/matching/lawyers (Next.js BFF)
    → ML proxy → POST http://[railway]/api/v1/recommendations
    → FastAPI RecommenderService.recommend()
        ├── ContentModel (TF-IDF + coseno) — para cold-start
        └── HybridModel (Content + SVD) — si hay historial
    → Devuelve top-K abogados con score + feature_importance + reasons
```

### Flujo de evaluación de riesgo + alerta n8n

```
Médico solicita evaluación desde caso
    → POST /api/v1/risk-assessment (FastAPI)
    → RiskAssessment (factores ponderados: especialidad, complejidad,
       documentación, consentimiento, historial, temporalidad, prioridad)
    → risk_score (0-1), risk_level (bajo/moderado/alto/critico)
    → Si alto o critico:
        → Next.js BFF hace POST a n8n webhook /risk-alert
        → n8n workflow: IF(alto|critico) → emailSend director + admin
                                         → httpRequest audit_logs Supabase
```

---

## 5. Módulos del sistema

| # | Módulo | Épica | HU IDs | Estado |
|---|--------|-------|--------|--------|
| 1 | **Auth** | Épica 1 + 10 | HU-001 a HU-005, HU-032, HU-033 | ✅ Completo |
| 2 | **Documents** | Épica 2 + 11 + 12 | HU-006 a HU-010, HU-034 a HU-036, HU-041, HU-042 | 🟡 Parcial |
| 3 | **Cases** | Épica 3 | HU-011 a HU-014, HU-037, HU-038 | 🟡 Parcial |
| 4 | **Matching** | Épica 4 | HU-015 a HU-017, HU-019, HU-020, HU-039 | 🟡 Parcial |
| 5 | **Patients** | Épica 5 | HU-021 a HU-023 | ✅ Completo |
| 6 | **Users** | Épica 6 | HU-024 a HU-026 | ✅ Completo |
| 7 | **Audit** | Épica 7 | HU-027, HU-043 | 🟡 Parcial |
| 8 | **Dashboard** | Épica 8 | HU-028, HU-018, HU-029 | ✅ Completo |
| 9 | **Profile** | Épica 9 | HU-030, HU-031, HU-040 | 🟡 Parcial |
| 10 | **ML Risk** | Épica 13 | HU-044 a HU-047 | ⏳ Pendiente |

### Endpoints BFF activos (`/src/app/api/`)

| Endpoint | Métodos | Descripción |
|----------|---------|-------------|
| `/api/auth/login` | POST | Autenticar con email/contraseña |
| `/api/auth/logout` | POST | Cerrar sesión (limpia cookie) |
| `/api/auth/me` | GET | Sesión actual |
| `/api/auth/register` | POST | Registro (placeholder) |
| `/api/legal-cases` | GET, POST | Listado y creación de casos |
| `/api/legal-cases/[id]` | GET, PUT | Detalle y actualización |
| `/api/documents` | GET, POST | Listado y creación |
| `/api/documents/[id]` | GET, PUT | Detalle y actualización |
| `/api/matching/contact-requests` | GET, POST, PATCH | Solicitudes de contacto |
| `/api/users` | GET, POST | Usuarios |
| `/api/users/[id]` | GET, PATCH | Detalle y actualización |
| `/api/patients` | GET, POST | Pacientes |
| `/api/patients/[id]` | GET, PUT | Detalle |
| `/api/audit` | GET | Logs de auditoría |

### Endpoints ML (`/api/v1/` en FastAPI)

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/v1/recommendations` | POST | Top-K abogados para un médico (content / hybrid) |
| `/api/v1/risk-assessment` | POST | Score de riesgo + factores + recomendaciones |
| `/api/v1/train` | POST | Reentrenar con datos manuales |
| `/api/v1/train-from-supabase` | POST | Reentrenar desde `lawyer_profiles` + `contact_requests` en Supabase |
| `/api/v1/model/info` | GET | Estado de los modelos entrenados |
| `/health` | GET | Health check |

---

## 6. Reglas de negocio clave

### Acceso y roles

- El administrador **no tiene acceso** al módulo de casos legales ni al módulo de matching — son asuntos privados entre médico y abogado.
- La protección es de doble capa: middleware en servidor (cookie) + `RoleGuard` en cliente (Zustand store).
- Cada portal tiene rutas exclusivas: `/doctor/*`, `/lawyer/*`, `/admin/*`. Cruzar rutas redirige automáticamente.

### Documentos

- Ciclo de estados: `borrador → pendiente_firma → firmado → archivado` (no se puede retroceder desde `firmado`).
- 8 tipos: historia clínica, consentimiento informado, informe médico, receta, orden de laboratorio, certificado médico, documento legal, otro.
- Toda firma digital incluye hash de integridad (trazabilidad legal).
- El administrador ve documentos en modo solo lectura.

### Casos legales

- Estados: `nuevo → en_revision → activo → cerrado → archivado`.
- Prioridades: `baja | media | alta | critica`.
- Un caso puede tener múltiples documentos de evidencia adjuntos.
- Solo el médico crea casos; el abogado los revisa y asesora.

### Matching y solicitudes de contacto

- El sistema ML recomienda abogados según similitud de especialidad (TF-IDF + coseno) y patrones históricos de matches (SVD).
- El médico envía una solicitud de contacto con mensaje al abogado recomendado.
- El abogado puede aceptar o rechazar la solicitud.
- Una solicitud aceptada habilita la comunicación directa y puede derivar en asignación a un caso.

### Evaluación de riesgo

- Los factores evaluados son: especialidad médica, complejidad del procedimiento, estado de documentación, existencia de consentimiento informado, historial de quejas, tiempo desde el evento, prioridad del caso.
- Niveles de salida: `bajo | moderado | alto | critico`.
- Si el nivel es `alto` o `critico`, se dispara automáticamente el workflow de n8n que notifica por email al director médico y al administrador.

### Auditoría

- 9 tipos de acción rastreados: `login, logout, create, update, delete, view, sign, download, share`.
- Cada registro incluye: usuario, acción, recurso, ID del recurso, descripción, IP, user agent, metadata adicional.
- Solo el administrador accede al log. Es inmutable (solo lectura).

---

## 7. Estado actual del desarrollo

### Resumen por sprint

| Sprint | Período | Épicas | Story Points | Estado |
|--------|---------|--------|-------------|--------|
| S1 | Semana 1-2 | Auth + Landing | 32 SP | ✅ Done |
| S2 | Semana 3-4 | Documentos básicos + Dashboard médico | ~36 SP | ✅ Done |
| S3 | Semana 5-6 | Casos + Matching + Dashboards abogado | ~46 SP | ✅ Done |
| S4 | Semana 7-8 | Pacientes + Usuarios + Admin + Auditoría + Episodios | ~42 SP | ✅ Done |
| S5 | Semana 9-10 | Perfiles + trabajo parcial | ~25 SP | 🟡 Parcial |
| S6 | Semana 11-12 | Firmas, adjuntos, consentimiento, mejoras | ~39 SP | ⏳ Pendiente |
| S7 | Semana 13-14 | Épica 13 completa (ML Risk + UI) | ~39 SP | ⏳ Pendiente |

### Historia por historia — completadas vs. pendientes

**Done (sprints 1–4 completos + parte de S5):**
HU-001 a HU-005 (Auth), HU-032/033 (Landing/Registro), HU-006 a HU-010 (Documentos base),
HU-028 (Dashboard médico), HU-011 a HU-014 (Casos + Episodios admin),
HU-015 a HU-017/019/020 (Matching completo), HU-018 (Dashboard abogado),
HU-021 a HU-023 (Pacientes), HU-024 a HU-026 (Usuarios),
HU-027 (Auditoría), HU-029 (Dashboard admin), HU-030/031 (Perfiles médico y abogado)

**Total completado: ~38 HU / ~220 SP**

---

## 8. Lo que falta / está en progreso

### Sprint 5 — pendientes

| HU | Descripción | Dependencia |
|----|-------------|-------------|
| HU-037 | Asignación de abogado a un caso legal | HU-013 ✅ |
| HU-038 | Edición de notas de un caso legal | HU-013 ✅ |
| HU-041 | Historial de versiones de un documento | HU-008 ✅ |
| HU-042 | Búsqueda y filtrado avanzado de documentos | HU-006 ✅ |

### Sprint 6 — no iniciado

| HU | Descripción | SP |
|----|-------------|-----|
| HU-039 | Mensaje de respuesta al gestionar solicitudes | 3 |
| HU-040 | Toggle de disponibilidad del abogado | 2 |
| HU-034 | Firma de un documento por el médico | 5 |
| HU-035 | Gestión de registros de consentimiento informado | 8 |
| HU-036 | Adjuntar documentos a un caso legal | 8 |
| HU-043 | Exportar listado de auditoría a CSV | 3 |

### Sprint 7 — Épica 13 completa (ML Risk)

| HU | Descripción | SP |
|----|-------------|-----|
| HU-044 | Evaluación de riesgo médico-legal de un caso | 13 |
| HU-045 | Visualización de factores de riesgo (XAI) | 8 |
| HU-046 | Historial de evaluaciones de riesgo por paciente | 5 |
| HU-047 | Alertas automáticas por riesgo alto (n8n integrado) | 13 |

### Deuda técnica / integraciones pendientes

| Ítem | Descripción | Prioridad |
|------|-------------|-----------|
| **Supabase real** | Las API Routes usan mock data. Migrar a `supabase-js` en cada repositorio | Alta |
| **ML conectado** | FastAPI está implementado pero NO está integrado desde el frontend todavía | Alta |
| **n8n deployment** | El workflow `.json` existe pero no está desplegado ni conectado | Media |
| **RLS policies** | Row Level Security de Supabase no está configurado para los 3 roles | Alta |
| **Storage upload** | Upload real de PDFs al bucket de Supabase Storage no implementado | Media |
| **Firma digital** | Hash de integridad en documentos es simulado, no integrado con storage | Alta |
| **train-from-supabase** | El endpoint ML existe; el cron o trigger para reentrenamiento periódico no | Baja |
| **Registro real** | `/api/auth/register` es placeholder; no crea usuarios en Supabase Auth | Media |

---

## 9. Variables de entorno y configuración

### Next.js (`Sinapsitencia/.env.local`)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo server-side (API Routes)

# FastAPI ML
NEXT_PUBLIC_API_URL=http://localhost:8000/api   # dev
# NEXT_PUBLIC_API_URL=https://[proyecto].railway.app/api   # prod

# n8n
N8N_WEBHOOK_URL=https://[instancia-n8n].app.n8n.cloud/webhook/risk-alert
```

### FastAPI ML (`Sinapsistencia ML/.env`)

```env
SUPABASE_URL=https://[proyecto].supabase.co
SUPABASE_SERVICE_KEY=eyJ...   # Para train-from-supabase
DEBUG=false
MODELS_DIR=artifacts
```

---

## 10. Datos de acceso demo

En la pantalla de login hay botones de acceso rápido por rol. También se puede usar el formulario:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Médico | `dr.ramirez@hospital.pe` | cualquiera |
| Médico | `dr.gutierrez@hospital.pe` | cualquiera |
| Abogado | `abg.vasquez@legal.pe` | cualquiera |
| Abogado | `abg.mendez@legal.pe` | cualquiera |
| Admin | `admin@hngai.pe` | cualquiera |

> En modo demo, toda la autenticación es simulada. No se valida contraseña.
> El estado de sesión persiste en `localStorage` via Zustand.

---

*Generado el 2026-04-28 a partir del análisis del código fuente y documentación existente.*
*Para el stack técnico detallado, ver [CODEBASE.md](./CODEBASE.md).*
*Para los diagramas de infraestructura, ver [diagrama-fisico.drawio](./diagrama-fisico.drawio) y [diagrama-logico.drawio](./diagrama-logico.drawio).*
