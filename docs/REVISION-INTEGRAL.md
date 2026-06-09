# Sinapsistencia — Revisión Integral de la Aplicación

> Auditoría técnica del estado **real** del código (no del estado planeado).
> Generado el 2026-06-09 a partir de la lectura directa de la codebase.
>
> **Qué es:** plataforma web de mediación médico-legal. Conecta médicos con abogados
> especializados en derecho médico para gestionar casos legales, documentos clínicos con
> trazabilidad y evaluación de riesgo asistida por Machine Learning explicable (XAI).
>
> **Caso de estudio:** Clínica SANNA "El Golf" — San Isidro, Lima, Perú.

---

## Índice

1. [Resumen ejecutivo](#1-resumen-ejecutivo)
2. [Stack tecnológico (verificado)](#2-stack-tecnológico-verificado)
3. [Arquitectura general](#3-arquitectura-general)
4. [Flujo de datos completo](#4-flujo-de-datos-completo)
5. [Autenticación y autorización](#5-autenticación-y-autorización)
6. [Base de datos (esquema Supabase)](#6-base-de-datos-esquema-supabase)
7. [Inventario de API Routes (BFF)](#7-inventario-de-api-routes-bff)
8. [Módulos de dominio](#8-módulos-de-dominio)
9. [Frontend: páginas y componentes](#9-frontend-páginas-y-componentes)
10. [Servicio ML + n8n (integraciones externas)](#10-servicio-ml--n8n-integraciones-externas)
11. [Variables de entorno](#11-variables-de-entorno)
12. [Estado real vs. documentación previa](#12-estado-real-vs-documentación-previa)
13. [Observaciones, riesgos y deuda técnica](#13-observaciones-riesgos-y-deuda-técnica)
14. [Cómo correr el proyecto](#14-cómo-correr-el-proyecto)
15. [Mapa de archivos clave](#15-mapa-de-archivos-clave)

---

## 1. Resumen ejecutivo

| Aspecto | Estado |
|---------|--------|
| **Tipo de app** | Aplicación full-stack Next.js (App Router) con BFF integrado |
| **Backend de datos** | **Supabase** (Postgres + Auth + Storage) — ya conectado y en uso real |
| **Patrón arquitectónico** | Domain-Driven Design por módulos (vertical slicing) + inyección de dependencias |
| **Roles** | `doctor`, `lawyer`, `admin` con portales y permisos separados |
| **Servicios externos** | Servicio ML en FastAPI (repo aparte) + workflow n8n para alertas |
| **Auth** | Supabase Auth (JWT en cookies httpOnly) + cookie de rol para el proxy |

> **Hallazgo central:** el proyecto **ya no está en "modo demo con mocks"** como afirma
> `CODEBASE.md`. Las API Routes consultan Supabase directamente con queries reales,
> relaciones embebidas y RLS. Los mocks en `src/mocks/` y los `Mock*Repository` siguen
> existiendo pero **el `container.ts` ya no los usa** — todos los repositorios activos son
> `Api*Repository`. Ver [sección 12](#12-estado-real-vs-documentación-previa).

---

## 2. Stack tecnológico (verificado)

Versiones leídas de `package.json`:

### Núcleo

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Next.js** | `16.2.2` | App Router, API Routes (BFF), `proxy.ts` (reemplaza `middleware.ts`) |
| **React** | `19.2.4` | UI, Server Components, `use()` para params async |
| **TypeScript** | `^5` | Tipado estricto en toda la base |
| **Tailwind CSS** | `^4` | Estilos utilitarios (vía `@tailwindcss/postcss`) |

### Datos y estado

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **@supabase/supabase-js** | `^2.103.0` | Cliente Supabase |
| **@supabase/ssr** | `^0.10.2` | Cliente Supabase con cookies SSR (server + proxy) |
| **@tanstack/react-query** | `^5.96.2` | Cache de datos del servidor, estados loading/error |
| **Zustand** | `^5.0.12` | Estado global (sesión + UI) |

### Formularios y validación

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **react-hook-form** | `^7.72.1` | Formularios |
| **@hookform/resolvers** | `^5.2.2` | Puente RHF ↔ Zod |
| **zod** | `^4.3.6` | Schemas de validación + inferencia de tipos |

### UI

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| **Radix UI** | varios | Primitivos accesibles: Avatar, Dialog, Dropdown, Label, Select, Separator, Slot, Tabs, Tooltip |
| **class-variance-authority** | `^0.7.1` | Variantes de componentes con type-safety |
| **clsx** + **tailwind-merge** | — | Composición de clases (`cn()`) |
| **lucide-react** | `^1.7.0` | Iconos |

### Dev

`eslint ^9` + `eslint-config-next 16.2.2`, `@types/*`, `typescript ^5`.

> ⚠️ `next.config.ts` está **vacío** (sin configuración custom). El `AGENTS.md` advierte que
> esta versión de Next.js (16) tiene breaking changes respecto a versiones previas: conviene
> consultar `node_modules/next/dist/docs/` antes de tocar APIs del framework.

---

## 3. Arquitectura general

El proyecto usa **DDD con vertical slicing**: cada módulo de negocio es autocontenido y
atraviesa tres capas.

```
src/
├── app/                      # Next.js App Router (UI + API Routes / BFF)
│   ├── (páginas por rol)     # doctor/  lawyer/  admin/  login/  register/
│   └── api/                  # BFF — endpoints que hablan con Supabase
│
├── modules/                  # Lógica de dominio (DDD) — 7 módulos
│   └── <módulo>/
│       ├── domain/           # entities + repositories (interfaces) + use-cases
│       ├── infrastructure/   # Api*Repository (activo) y Mock*Repository (legacy)
│       └── presentation/     # hooks (TanStack Query) + components
│
├── components/               # UI reutilizable (ui/ layout/ navigation/ dashboard/ profile/)
├── infrastructure/
│   ├── di/container.ts       # ⭐ punto único de inyección de dependencias
│   └── http/api-client.ts    # cliente HTTP base
├── lib/
│   ├── supabase/             # client.ts, server.ts, admin.ts, database.types.ts
│   ├── api.ts                # apiSuccess/apiError (server) + apiFetch (client)
│   ├── n8n.ts                # disparo de webhooks fire-and-forget
│   ├── query-client.ts, query-keys.ts
│   └── utils.ts, auth-cookie.ts
├── store/                    # auth.store.ts (re-export) + ui.store.ts
├── validators/               # auth.ts, case.ts (Zod)
├── constants/, types/
├── mocks/                    # ⚠️ legacy — ya no se consumen desde container.ts
└── proxy.ts                  # ⭐ middleware de Next 16 (auth + protección por rol)
```

### Las tres capas de un módulo

```
Página (React Client Component)
    ↓  usa
Hook de presentación (TanStack Query: useQuery / useMutation)
    ↓  invoca
Use Case (función pura, recibe el repositorio por parámetro)
    ↓  depende de
IRepository (interfaz — contrato de acceso a datos)
    ↓  implementado por
ApiRepository (hace fetch a /api/* vía apiFetch)
    ↓  llega a
API Route (BFF en src/app/api/) → Supabase (supabase-js con RLS)
```

**El único archivo que decide qué implementación se usa es
[`src/infrastructure/di/container.ts`](../src/infrastructure/di/container.ts).** Hoy
instancia 7 singletons `Api*Repository`. Migrar a otro backend (p. ej. Spring Boot) solo
requeriría cambiar las URLs base, sin tocar páginas, hooks ni use-cases.

---

## 4. Flujo de datos completo

### Ejemplo: un médico lista sus casos

```
/doctor/cases/page.tsx
  → useCases(doctorId, filters)                      [presentation/hooks]
  → getCasesByDoctorUseCase(caseRepository, ...)     [domain/use-cases]
  → ICaseRepository.findByDoctorId()                 [domain/repositories]
  → ApiCaseRepository.findByDoctorId()               [infrastructure]
       → apiFetch('/api/legal-cases?doctorId=...')
  → GET /api/legal-cases/route.ts                    [BFF]
       → supabase.from('cases').select(... joins ...) [Supabase + RLS]
```

Las API Routes ya hacen **joins embebidos** (`doctor:profiles!cases_doctor_id_fkey(...)`)
para evitar N+1, paginan con `.range()`, filtran por `status`/`priority`/`search` y
devuelven el sobre estándar `{ success, data }`.

### Contrato de respuesta de la API

Definido en [`src/lib/api.ts`](../src/lib/api.ts):

```ts
{ success: true,  data: T }          // apiSuccess(data, status)
{ success: false, error: string }    // apiError(message, status)
```

El cliente usa `apiFetch<T>()`, que lanza `Error` cuando `success === false`, integrándose
limpiamente con el manejo de errores de TanStack Query.

> Nota: `src/lib/api.ts` aún exporta `simulateLatency()` (vestigio del modo mock); no se usa
> en las rutas conectadas a Supabase.

---

## 5. Autenticación y autorización

### Doble capa de protección

1. **Servidor — `src/proxy.ts`** (reemplazo de `middleware.ts` en Next 16):
   - Si Supabase está configurado, refresca la sesión en cada request (`supabase.auth.getUser()`).
   - Deja pasar rutas públicas (`/`, `/login`, `/register`) y todas las `/api/*`.
   - Para rutas protegidas, lee la cookie **`sinapsistencia-role`**; si no es válida,
     redirige a `/login?redirect=...`.
   - Verifica que el prefijo de ruta (`/doctor`, `/lawyer`, `/admin`) coincida con el rol;
     si no, redirige al dashboard correcto.

2. **Cliente — `RoleGuard` / `useAuthStore`** (Zustand persistido) para gating en UI.

### Login (`POST /api/auth/login`)

Usa **Supabase Auth** (`signInWithPassword`) y soporta dos modos:

- **Email + password:** valida credenciales, carga el perfil de `profiles`, rechaza cuentas
  con `is_active = false`.
- **Rol demo:** `{ role: "doctor" | "lawyer" | "admin" }` mapea a cuentas demo predefinidas
  (`doctor.demo@sinapsistencia.pe`, etc.) que **deben existir en Supabase Auth**.

En éxito setea la cookie `sinapsistencia-role` (no httpOnly — el proxy debe leerla,
`maxAge` 7 días). La sesión de Supabase vive en cookies httpOnly gestionadas por `@supabase/ssr`.

### Clientes Supabase (`src/lib/supabase/`)

| Archivo | Uso |
|---------|-----|
| `client.ts` | Cliente browser (Client Components) |
| `server.ts` | Cliente server (API Routes / Server Components) — lee cookies, aplica RLS. Incluye `getAuthenticatedUser()` que usa `getUser()` (valida el JWT, no solo lee cookies) |
| `admin.ts` | Cliente con **service role key** — bypassa RLS. Solo server-side (p. ej. leer perfil del doctor al disparar alertas ML) |
| `database.types.ts` | Tipos generados del esquema Postgres |

---

## 6. Base de datos (esquema Supabase)

Derivado de [`database.types.ts`](../src/lib/supabase/database.types.ts). **12 tablas**:

| Tabla | Descripción | Relaciones clave |
|-------|-------------|------------------|
| `profiles` | Usuario base (id = auth.users.id, email, name, role, is_active, avatar_url) | raíz de todo |
| `doctor_profiles` | Perfil médico (cmp, specialty, sub_specialties, hospital, years_experience, languages, **embedding**) | → profiles, → hospitals |
| `lawyer_profiles` | Perfil abogado (cab, specialties, medical_areas, rating, resolved_cases, **embedding**) | → profiles |
| `admin_profiles` | Perfil admin (department, permissions[]) | → profiles |
| `hospitals` | Catálogo de hospitales (name, city, department, address) | — |
| `patients` | Pacientes (dni, name, last_name, birth_date, gender, blood_type, ...) | → profiles (created_by) |
| `clinical_episodes` | Episodios clínicos (title, diagnosis, start/end_date, is_active) | → patients, → profiles |
| `cases` | Casos legales (title, description, status, priority, notes) | → doctor, lawyer, patient, episode |
| `documents` | Documentos (title, type, status, current_version_id) | → author, case, episode, patient |
| `document_versions` | Versionado (version, content, file_url, notes) | → documents, → profiles |
| `document_signatures` | Firmas (type, hash, is_valid, signed_at) | → documents, → signer |
| `contact_requests` | Solicitudes médico→abogado (message, status, **ml_score**, response_message) | → from_doctor, → to_lawyer |
| `match_recommendations` | Recomendaciones ML (score, reasons[], algorithm_version, is_accepted) | → doctor, → lawyer |
| `audit_logs` | Auditoría (action, resource, resource_id, details, ip_address, user_agent) | → profiles |

### Enums Postgres

| Enum | Valores |
|------|---------|
| `user_role` | `doctor`, `lawyer`, `admin` |
| `case_priority` | `baja`, `media`, `alta`, `critica` |
| `case_status` | `nuevo`, `en_revision`, `activo`, `cerrado`, `archivado` |
| `contact_request_status` | `pendiente`, `aceptado`, `rechazado`, `cancelado` |
| `document_status` | `borrador`, `pendiente_firma`, `firmado`, `archivado` |
| `document_type` | `historia_clinica`, `consentimiento_informado`, `informe_medico`, `receta`, `orden_laboratorio`, `certificado_medico`, `documento_legal`, `otro` |
| `patient_gender` | `M`, `F`, `other` |
| `signature_type` | `digital`, `huella`, `firma_manuscrita` |

### Funciones

- `get_user_role()` → devuelve el `user_role` del usuario actual (probablemente usada en RLS policies).

> Las columnas `embedding` en `doctor_profiles` / `lawyer_profiles` sugieren soporte para
> vector search (pgvector) destinado al matching ML, aunque la ruta
> `/api/matching/relevant-cases` actual hace matching por coincidencia de `specialty` ↔
> `medical_areas`, **no por embeddings todavía**.

---

## 7. Inventario de API Routes (BFF)

Todas en `src/app/api/`. Verificado que consultan Supabase real.

| Endpoint | Métodos | Función |
|----------|---------|---------|
| `/api/auth/login` | POST | Login Supabase (email/password o rol demo) + cookie de rol |
| `/api/auth/logout` | POST | Cierra sesión, limpia cookies |
| `/api/auth/me` | GET | Sesión / perfil actual |
| `/api/auth/register` | POST | Registro de usuario |
| `/api/legal-cases` | GET, POST | Listar (filtros + paginación + joins) y crear casos |
| `/api/legal-cases/[id]` | GET, PUT | Detalle y actualización (status, lawyer, notas) |
| `/api/documents` | GET, POST | Listar y crear documentos |
| `/api/documents/[id]` | GET, PUT | Detalle y actualización |
| `/api/patients` | GET, POST | Listar y crear pacientes |
| `/api/patients/[id]` | GET, PUT | Detalle y actualización |
| `/api/users` | GET, POST | Listar y crear usuarios |
| `/api/users/[id]` | GET, PUT/PATCH | Detalle y actualización (estado) |
| `/api/audit` | GET | Listar logs de auditoría |
| `/api/profile` | GET, PUT | Perfil del usuario autenticado |
| `/api/profile/avatar` | POST | Subida de avatar (Supabase Storage) |
| `/api/matching/doctors` | GET | Lista perfiles de médicos |
| `/api/matching/lawyers` | GET/POST | Recomendaciones de abogados (proxy al ML) |
| `/api/matching/contact-requests` | GET, POST, PATCH | Solicitudes de contacto médico↔abogado |
| `/api/matching/relevant-cases` | GET | Casos sin abogado relevantes al perfil legal |
| `/api/ml/risk` | POST | Proxy al ML para evaluación de riesgo + disparo n8n |
| `/api/ml/health` | GET | Health check del servicio ML |

---

## 8. Módulos de dominio

7 módulos en `src/modules/`, todos con la estructura `domain / infrastructure / presentation`:

| Módulo | Entidad principal | Casos de uso destacados |
|--------|-------------------|-------------------------|
| `auth` | `SessionEntity` | login; store Zustand; `RoleGuard`, `Authorized`, hooks `useAuth`/`useRole`/`useIsAuthorized` |
| `cases` | `LegalCaseEntity` | getAllCases, getByDoctor, getById, createCase; componentes `CaseFormModal`, `CaseStatusBadge` |
| `documents` | `DocumentEntity` | getDocuments, createDocument; modales de detalle/form + status badge |
| `matching` | `MatchRecommendationEntity`, `ContactRequestEntity` | getRecommendations, sendContactRequest |
| `patients` | `PatientEntity` | getPatients, createPatient, updatePatient; `PatientFormModal` |
| `users` | `UserEntity` | createUser, toggleUserStatus; `UserFormModal` |
| `audit` | `AuditLogEntity` | getAuditLogs |

**Convención clave:** las entidades de dominio usan `Date` (no `string`) y "snapshots"
aplanados (p. ej. `DoctorSnapshot { fullName }`) en lugar de anidar tipos completos. Los
`Api*Repository` convierten el JSON crudo de la API → entidad vía una función `toEntity()`.

Cada módulo conserva además un `Mock*Repository` (legacy) que ya no se referencia desde
`container.ts`.

---

## 9. Frontend: páginas y componentes

### Páginas por rol

**Público:** `/` (landing), `/login`, `/register`.

**Doctor (`/doctor/*`):** `dashboard`, `cases`, `cases/[id]`, `documents`, `lawyers`,
`risk`, `profile`.

**Lawyer (`/lawyer/*`):** `dashboard`, `requests`, `doctors`, `profile`.

**Admin (`/admin/*`):** `dashboard`, `users`, `patients`, `episodes`, `documents`, `audit`,
`profile`.

Cada grupo tiene su `layout.tsx` que envuelve el `DashboardLayout` (Sidebar + Topbar). El
root `app/layout.tsx` monta la fuente Geist y `<Providers>` (QueryClientProvider).

### Componentes

| Carpeta | Contenido |
|---------|-----------|
| `components/ui/` | Primitivos con CVA + Tailwind: Button, Badge, Input, Textarea, Label, Card, Separator, Avatar, Dialog, Dropdown-menu, Select |
| `components/layout/` | `DashboardLayout` (shell) |
| `components/navigation/` | `Sidebar` (nav dinámica por rol) + `Topbar` |
| `components/dashboard/` | `StatCard` |
| `components/profile/` | `ProfileHeader`, `SaveFeedback`, hooks `use-profile`, `use-avatar-upload`, tipos |
| `components/shared/` | `Providers` (TanStack Query) |

> El `AGENTS.md` impone un **estándar de diseño obligatorio**: UI moderna y distintiva
> (jerarquía visual, paleta cohesiva, micro-interacciones, mobile-first, glassmorphism/
> gradientes). Nada de plantillas genéricas.

---

## 10. Servicio ML + n8n (integraciones externas)

### Servicio ML (FastAPI — repositorio separado `Sinapsistencia ML`)

El frontend lo consume vía proxy. No vive en este repo, pero las rutas que lo llaman son:

- **`POST /api/ml/risk`** → `${ML_SERVICE_URL}/api/v1/risk-assessment` (timeout 5 s).
  Normaliza la respuesta a camelCase (riskScore, riskLevel, riskFactors con SHAP-like
  contribution, recommendations, modelVersion). **Si `riskLevel` es `alto` o `critico`**,
  dispara la alerta n8n (fire-and-forget) enriqueciendo con nombre/email del doctor (vía
  `admin` client).
- **`GET /api/ml/health`** → consulta `/health` y `/api/v1/model/info` del ML en paralelo;
  devuelve `online`/`offline` y versión de los modelos.

Endpoints del ML (según doc maestro): `/api/v1/recommendations`, `/api/v1/risk-assessment`,
`/api/v1/train`, `/api/v1/train-from-supabase`, `/api/v1/model/info`, `/health`. Modelos:
TF-IDF + coseno (content/cold-start) e híbrido con SVD (colaborativo).

### n8n (`src/lib/n8n.ts` + `n8n/workflow-alerta-riesgo-alto.json`)

`triggerRiskAlert(payload)` hace `POST ${N8N_WEBHOOK_URL}/webhook/risk-alert` con timeout
3 s. **Es fire-and-forget**: si n8n no está disponible, loguea y continúa — no es una
dependencia dura. El workflow incluido recibe el webhook, filtra por `riskLevel` (alto|crítico)
y (según diseño) envía emails al director/admin y registra en `audit_logs`.

---

## 11. Variables de entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://<proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>     # solo server (admin.ts)

# Servicio ML (FastAPI)
ML_SERVICE_URL=http://localhost:8000             # dev; en prod, URL de Railway

# n8n
N8N_WEBHOOK_URL=https://<instancia>.app.n8n.cloud  # base; se le agrega /webhook/risk-alert
```

- El proxy detecta si Supabase está configurado por la presencia de
  `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`; si faltan, degrada a modo
  cookie de rol.
- `.env*` está en `.gitignore` (no hay `.env.example` en el repo — convendría agregarlo).

---

## 12. Por qué este documento es la única fuente de verdad

Antes existían tres documentos técnicos (`CODEBASE.md`, `docs/PROYECTO-MAESTRO.md` y
`docs/arquitectura-c4-er.md`) que describían un estado anterior del proyecto y **contradecían
el código real**. Fueron **eliminados** y reemplazados por esta revisión. La siguiente tabla
deja constancia de las discrepancias detectadas (qué decían vs. la realidad verificada):

| Afirmación en los docs eliminados | Realidad en el código |
|-----------------------------------|------------------------|
| "funciona en modo demo, datos en memoria (mocks)" | ❌ `container.ts` usa `Api*Repository` y las rutas consultan Supabase real |
| "Next.js 15" / "SPA + shadcn/ui" | ❌ Es **Next.js 16.2.2** (con `proxy.ts` en vez de `middleware.ts`) |
| "API Routes usan mock data (deuda alta)" | ❌ Las rutas usan `createSupabaseServer` con queries reales |
| "ML implementado pero NO integrado desde frontend" | 🟡 Parcial: existen `/api/ml/risk` y `/api/ml/health` que actúan como proxy al ML |
| login demo `dr.ramirez@hospital.pe` | ❌ El login real usa cuentas demo `*.demo@sinapsistencia.pe` en Supabase Auth |
| Mocks en `src/mocks/` | ⚠️ Siguen en el repo pero ya **no se consumen** desde el container |

> **Artefactos conservados** (no son docs técnicos del estado del app, sino de producto/tesis):
> `docs/historias-de-usuario.md`, `docs/product-backlog.md`, `docs/cambios-tesis.md` y los
> diagramas `.drawio`.

---

## 13. Observaciones, riesgos y deuda técnica

### Fortalezas

- ✅ Separación de capas limpia (DDD + DI) que abstrae bien el origen de datos.
- ✅ Contrato de API consistente (`{ success, data }`) y manejo de errores centralizado.
- ✅ Joins embebidos en Supabase para evitar N+1; paginación y filtros server-side.
- ✅ Auth robusta: `getUser()` (valida JWT) en vez de `getSession()`; doble capa de protección.
- ✅ Integraciones externas resilientes (ML con timeout, n8n fire-and-forget) que no tumban la app.
- ✅ Tipos de BD generados (`database.types.ts`) que dan type-safety end-to-end.

### Riesgos / pendientes

| Ítem | Detalle | Prioridad |
|------|---------|-----------|
| **Docs desincronizados** | `CODEBASE.md` y partes de `PROYECTO-MAESTRO.md` describen un estado anterior | Alta |
| **Código legacy (mocks)** | `src/mocks/` y `Mock*Repository` ya no se usan — limpiar o documentar como fixtures de test | Media |
| **`simulateLatency` huérfano** | Función residual en `lib/api.ts` | Baja |
| **RLS policies** | Existe `get_user_role()` pero conviene auditar que las policies cubran los 3 roles en todas las tablas | Alta |
| **`/api/auth/login` sin validación de body con Zod** | Lee `body.role`/`email`/`password` directo; faltaría validar con los schemas de `validators/` | Media |
| **Falta `.env.example`** | No hay plantilla de variables para onboarding | Media |
| **`next.config.ts` vacío** | Sin headers de seguridad, sin config de imágenes/dominios | Media |
| **Embeddings sin usar** | Columnas `embedding` existen pero el matching actual es por specialty/medical_areas, no vector | Baja |
| **Firma digital (hash)** | Modelo `document_signatures` existe; validar que el hash se genere realmente al firmar | Alta |
| **Sin tests** | No se observa carpeta de tests ni configuración de testing en el repo Next.js | Media |

---

## 14. Cómo correr el proyecto

```powershell
# 1. Instalar dependencias
npm install

# 2. Crear .env.local con las variables de la sección 11

# 3. Desarrollo
npm run dev        # http://localhost:3000

# 4. Producción
npm run build
npm run start

# 5. Lint
npm run lint
```

Para funcionalidad completa se necesitan, además: un proyecto **Supabase** con el esquema de
la sección 6 y cuentas demo creadas en Auth; el **servicio ML** corriendo (local en `:8000`
o en Railway); y opcionalmente una instancia de **n8n** con el workflow importado.

---

## 15. Mapa de archivos clave

| Archivo | Por qué importa |
|---------|-----------------|
| [`src/infrastructure/di/container.ts`](../src/infrastructure/di/container.ts) | Decide qué repositorio usa cada módulo |
| [`src/proxy.ts`](../src/proxy.ts) | Auth + protección de rutas por rol (Next 16) |
| [`src/lib/supabase/server.ts`](../src/lib/supabase/server.ts) | Cliente Supabase server + `getAuthenticatedUser()` |
| [`src/lib/supabase/database.types.ts`](../src/lib/supabase/database.types.ts) | Esquema completo de la BD (tipos) |
| [`src/lib/api.ts`](../src/lib/api.ts) | Contrato de API y `apiFetch` |
| [`src/app/api/auth/login/route.ts`](../src/app/api/auth/login/route.ts) | Flujo de login real |
| [`src/app/api/legal-cases/route.ts`](../src/app/api/legal-cases/route.ts) | Ejemplo canónico de ruta con joins + paginación |
| [`src/app/api/ml/risk/route.ts`](../src/app/api/ml/risk/route.ts) | Integración ML + disparo n8n |
| [`src/lib/n8n.ts`](../src/lib/n8n.ts) | Webhooks de alerta |
| [`docs/product-backlog.md`](./product-backlog.md) | Backlog Scrum: épicas, HU, story points, sprints |
| [`docs/historias-de-usuario.md`](./historias-de-usuario.md) | Historias de usuario con criterios de aceptación |

---

*Documento generado por revisión directa del código. Refleja el estado del repositorio al 2026-06-09.*
