# Sinapsistencia — Guía de la Codebase

> Documento de referencia para desarrolladores. Explica cómo está organizado el proyecto, dónde vive cada cosa y cómo extenderlo.

---

## Índice

1. [¿Qué es este proyecto?](#1-qué-es-este-proyecto)
2. [Stack tecnológico](#2-stack-tecnológico)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Arquitectura: el flujo completo de datos](#4-arquitectura-el-flujo-completo-de-datos)
5. [Módulos del dominio](#5-módulos-del-dominio)
6. [Capas detalladas](#6-capas-detalladas)
7. [Estado global (Stores)](#7-estado-global-stores)
8. [Routing y páginas](#8-routing-y-páginas)
9. [Componentes UI](#9-componentes-ui)
10. [Mocks y datos de demo](#10-mocks-y-datos-de-demo)
11. [Cómo agregar una nueva feature](#11-cómo-agregar-una-nueva-feature)
12. [Cómo migrar al backend real](#12-cómo-migrar-al-backend-real)
13. [Convenciones de código](#13-convenciones-de-código)

---

## 1. ¿Qué es este proyecto?

**Sinapsistencia** es una plataforma de mediación médico-legal. Conecta médicos con abogados especializados en derecho médico para gestionar casos legales, documentos clínicos y consentimientos informados.

### Tres tipos de usuario

| Rol | Portal | Qué puede hacer |
|-----|--------|-----------------|
| `doctor` | `/doctor/*` | Crear casos, gestionar documentos, buscar abogados |
| `lawyer` | `/lawyer/*` | Ver solicitudes de contacto, aceptar/rechazar casos |
| `admin`  | `/admin/*`  | Supervisar usuarios, pacientes, documentos, auditoría |

### Estado actual

El proyecto funciona en **modo demo** — todos los datos son ficticios y viven en memoria (mocks). La arquitectura está diseñada para que, cuando el backend esté listo, solo se cambien los repositorios sin tocar ninguna página ni hook.

---

## 2. Stack tecnológico

| Tecnología | Uso |
|-----------|-----|
| **Next.js 15** (App Router) | Framework principal, routing, SSR |
| **React 19** | UI, `use(params)` para params asíncronos |
| **TypeScript** | Tipado estricto en toda la codebase |
| **Tailwind CSS** | Estilos utilitarios |
| **Zustand** | Estado global (sesión + UI) con persistencia |
| **TanStack Query v5** | Cache de datos, loading/error states |
| **React Hook Form** | Formularios con validación |
| **Zod** | Schemas de validación |
| **Lucide React** | Iconos |
| **Radix UI** | Componentes accesibles (Slot, Avatar) |
| **CVA** | Variantes de componentes UI |

---

## 3. Estructura de carpetas

```
src/
├── app/                        # Páginas (Next.js App Router)
│   ├── page.tsx                # Landing pública
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── doctor/                 # Portal del médico
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── cases/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── documents/page.tsx
│   │   ├── lawyers/page.tsx
│   │   └── profile/page.tsx
│   ├── lawyer/                 # Portal del abogado
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── requests/page.tsx
│   │   ├── doctors/page.tsx
│   │   └── profile/page.tsx
│   └── admin/                  # Panel de administración
│       ├── layout.tsx
│       ├── dashboard/page.tsx
│       ├── users/page.tsx
│       ├── patients/page.tsx
│       ├── episodes/page.tsx
│       ├── documents/page.tsx
│       └── audit/page.tsx
│
├── modules/                    # Módulos de dominio (DDD)
│   ├── auth/
│   ├── cases/
│   ├── documents/
│   ├── matching/
│   ├── audit/
│   ├── users/
│   └── patients/
│
├── components/                 # Componentes reutilizables
│   ├── ui/                     # Primitivos (Button, Badge, Input...)
│   ├── layout/                 # Shell del dashboard
│   ├── navigation/             # Sidebar + Topbar
│   ├── dashboard/              # StatCard
│   └── shared/                 # Providers (QueryClient)
│
├── infrastructure/
│   ├── di/container.ts         # ← PUNTO CENTRAL: inyección de dependencias
│   └── http/api-client.ts      # Cliente HTTP (preparado para el backend)
│
├── store/
│   ├── auth.store.ts           # Re-export de auth (compatibilidad)
│   └── ui.store.ts             # Estado de la UI (sidebar open/close)
│
├── lib/
│   ├── utils.ts                # cn(), formatDate(), formatDateTime(), getInitials()
│   ├── query-client.ts         # Configuración de TanStack Query
│   └── query-keys.ts           # Claves de caché centralizadas
│
├── validators/
│   └── auth.ts                 # loginSchema, registerSchema (Zod)
│
├── constants/
│   └── index.ts                # Labels, navegación, especialidades
│
├── types/
│   └── index.ts                # Tipos globales (interfaces planas del dominio)
│
└── mocks/                      # Datos ficticios para modo demo
    ├── users.ts
    ├── cases.ts
    ├── documents.ts
    └── matching.ts
```

---

## 4. Arquitectura: el flujo completo de datos

El proyecto usa **Domain-Driven Design (DDD)** con tres capas por módulo:

```
Página (UI)
    ↓ llama
Hook (TanStack Query)
    ↓ invoca
Use Case (lógica de negocio pura)
    ↓ usa
Repositorio (contrato: interfaz)
    ↓ implementado por
MockRepository (hoy) → ApiRepository (mañana)
    ↓ lee de
Mocks en memoria (hoy) → API REST (mañana)
```

### Ejemplo real: un médico ve sus casos

```
/doctor/cases/page.tsx
    → useCases(doctorId, filters)
    → getCasesByDoctorUseCase(caseRepository, doctorId, filters)
    → ICaseRepository.findByDoctorId()
    → MockCaseRepository.findByDoctorId()    ← lee mockCases[]
```

Cuando llegue el backend:
```
    → ApiCaseRepository.findByDoctorId()     ← hace GET /api/cases?doctorId=...
```
Solo cambia la última línea, en `container.ts`.

---

## 5. Módulos del dominio

Cada módulo en `src/modules/` sigue la misma estructura:

```
modules/[nombre]/
├── domain/
│   ├── entities/[nombre].entity.ts       # Tipo de dominio + helpers puros
│   ├── repositories/I[Nombre]Repository.ts  # Contrato (interfaz)
│   └── use-cases/
│       └── [accion]-[nombre].use-case.ts # Lógica de negocio
├── infrastructure/
│   └── repositories/
│       └── Mock[Nombre]Repository.ts     # Implementación con datos mock
└── presentation/
    ├── hooks/use[Nombre].ts              # Hook React (TanStack Query)
    └── components/                       # Componentes específicos del módulo
```

### Módulos existentes

| Módulo | Entidad principal | Qué hace |
|--------|------------------|----------|
| `auth` | `SessionEntity`, `UserEntity` | Login, logout, persistencia de sesión |
| `cases` | `LegalCaseEntity` | Casos legales por médico o todos (admin) |
| `documents` | `DocumentEntity` | Documentos médicos con versiones y firmas |
| `matching` | `MatchRecommendationEntity`, `ContactRequestEntity` | Recomendaciones y solicitudes de contacto |
| `patients` | `PatientEntity` | Gestión de pacientes |
| `audit` | `AuditLogEntity` | Registro de eventos del sistema |
| `users` | `UserEntity` | Listado de usuarios del sistema |

---

## 6. Capas detalladas

### 6.1 Entidades de dominio (`domain/entities/`)

Son **interfaces TypeScript** con fechas como `Date` (no strings). Incluyen funciones helper puras.

```typescript
// src/modules/cases/domain/entities/legal-case.entity.ts

export interface LegalCaseEntity {
  id: string;
  title: string;
  status: CaseStatus;
  priority: CasePriority;
  doctor: DoctorSnapshot;     // objeto aplanado, no el tipo global
  lawyer?: LawyerSnapshot;
  patient?: PatientSnapshot;
  documentIds: string[];      // solo IDs, no los documentos completos
  createdAt: Date;            // Date, no string
  updatedAt: Date;
}

// Helpers de dominio — funciones puras, sin efectos secundarios
export function isActiveCase(c: LegalCaseEntity): boolean {
  return c.status === "activo" || c.status === "en_revision";
}
```

**Nota:** Las entidades usan "snapshots" aplanados (ej. `DoctorSnapshot` con `fullName: string`) en lugar de anidar el tipo completo de `DoctorProfile`. Esto evita grafos de objetos profundos.

### 6.2 Repositorios (`domain/repositories/I*.ts`)

Son **interfaces** que definen el contrato de acceso a datos. No saben si los datos vienen de un mock, una API o una base de datos.

```typescript
// src/modules/cases/domain/repositories/ICaseRepository.ts

export interface ICaseRepository {
  findAll(filters?: CaseFilters): Promise<PaginatedCases>;        // admin
  findByDoctorId(doctorId: string, filters?: CaseFilters): Promise<PaginatedCases>;
  findById(id: string): Promise<LegalCaseEntity | null>;
  create(data: CreateCaseInput): Promise<LegalCaseEntity>;
  updateStatus(id: string, status: CaseStatus): Promise<LegalCaseEntity>;
  assignLawyer(caseId: string, lawyerId: string): Promise<LegalCaseEntity>;
}
```

### 6.3 Use Cases (`domain/use-cases/`)

**Funciones puras** que reciben el repositorio como parámetro y ejecutan la lógica de negocio.

```typescript
// src/modules/cases/domain/use-cases/get-cases-by-doctor.use-case.ts

export async function getCasesByDoctorUseCase(
  caseRepository: ICaseRepository,
  doctorId: string,
  filters?: CaseFilters
): Promise<PaginatedCases> {
  return caseRepository.findByDoctorId(doctorId, filters);
}
```

### 6.4 Repositorios Mock (`infrastructure/repositories/Mock*.ts`)

Implementan la interfaz del repositorio usando los datos en `src/mocks/`. Simulan latencia de red con `setTimeout`.

```typescript
// src/modules/cases/infrastructure/repositories/MockCaseRepository.ts

export class MockCaseRepository implements ICaseRepository {
  private cases: LegalCaseEntity[] = mockCases.map(toEntity);

  async findByDoctorId(doctorId: string, filters?: CaseFilters) {
    await new Promise((r) => setTimeout(r, 300)); // simula latencia
    let data = this.cases.filter((c) => c.doctorId === doctorId);
    // ... aplica filtros ...
    return { data, total, page, pageSize, totalPages };
  }
}
```

La función `toEntity()` convierte los datos del mock (que usan el tipo global de `@/types`) a la entidad de dominio.

### 6.5 Hooks de presentación (`presentation/hooks/`)

Conectan los use cases con TanStack Query. Son el único lugar donde se obtienen datos en los componentes.

```typescript
// src/modules/cases/presentation/hooks/useCases.ts

export function useCases(doctorId: string, filters?: CaseFilters) {
  return useQuery({
    queryKey: queryKeys.cases.byDoctorFiltered(doctorId, filters ?? {}),
    queryFn: async () => {
      // Importa el repositorio de forma lazy para evitar problemas de SSR
      const { caseRepository } = await import("@/infrastructure/di/container");
      return getCasesByDoctorUseCase(caseRepository, doctorId, filters);
    },
    enabled: Boolean(doctorId),
  });
}
```

**Regla:** las páginas **nunca** importan mocks directamente. Solo usan hooks.

---

## 7. Estado global (Stores)

### Auth Store (`src/modules/auth/presentation/stores/auth.store.ts`)

Gestiona la sesión del usuario con Zustand + persistencia en `localStorage`.

```typescript
const { user, isAuthenticated, login, loginByRole, logout } = useAuthStore();
```

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `user` | `UserEntity \| null` | Usuario autenticado |
| `token` | `string \| null` | JWT (vacío en modo mock) |
| `isAuthenticated` | `boolean` | Si hay sesión activa |
| `isLoading` | `boolean` | Durante el proceso de login |
| `error` | `string \| null` | Mensaje de error |

**Métodos:**
- `loginByRole(role)` — Login demo por rol (doctor/lawyer/admin)
- `login(credentials)` — Login con email y contraseña (para el backend real)
- `logout()` — Cierra sesión y limpia el store

**Importación:** siempre desde `@/store/auth.store` (el re-export en `/store/` es para compatibilidad con imports existentes).

### UI Store (`src/store/ui.store.ts`)

Estado simple para controlar el sidebar en móvil.

```typescript
const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
```

---

## 8. Routing y páginas

### Rutas públicas

| Ruta | Archivo | Descripción |
|------|---------|-------------|
| `/` | `app/page.tsx` | Landing pública |
| `/login` | `app/login/page.tsx` | Inicio de sesión (con acceso rápido demo) |
| `/register` | `app/register/page.tsx` | Registro (placeholder, sin lógica real aún) |

### Portal médico (`/doctor/*`)

| Ruta | Hook(s) usado | Descripción |
|------|--------------|-------------|
| `/doctor/dashboard` | `useCases`, `useDocuments`, `useMatchRecommendations`, `useAuditLogs` | Resumen general |
| `/doctor/cases` | `useCases(user.id)` | Lista de casos propios |
| `/doctor/cases/[id]` | `useCaseDetail(id)` | Detalle de un caso |
| `/doctor/documents` | `useDocuments({ authorId })` | Documentos propios |
| `/doctor/lawyers` | `useLawyerProfiles`, `useMatchRecommendations`, `useSendContactRequest` | Buscar abogados + enviar solicitudes |
| `/doctor/profile` | `useDoctorProfiles` + auth store | Editar perfil profesional |

### Portal abogado (`/lawyer/*`)

| Ruta | Hook(s) usado | Descripción |
|------|--------------|-------------|
| `/lawyer/dashboard` | `useContactRequestsForLawyer`, `useDoctorProfiles` | Solicitudes pendientes y casos activos |
| `/lawyer/requests` | `useContactRequestsForLawyer`, `useRespondContactRequest` | Aceptar/rechazar solicitudes |
| `/lawyer/doctors` | `useDoctorProfiles` | Ver médicos disponibles |
| `/lawyer/profile` | `useLawyerProfiles` + auth store | Editar perfil legal |

### Panel admin (`/admin/*`)

| Ruta | Hook(s) usado | Descripción |
|------|--------------|-------------|
| `/admin/dashboard` | `useUsers`, `usePatients`, `useDocuments`, `useAuditLogs` | Estadísticas generales |
| `/admin/users` | `useUsers` | Gestión de usuarios del sistema |
| `/admin/patients` | `usePatients` | Gestión de pacientes |
| `/admin/episodes` | `useAllCases` | Episodios/casos clínicos |
| `/admin/documents` | `useDocuments` | Gestión documental |
| `/admin/audit` | `useAuditLogs` | Registro de auditoría |

### Layouts

- `app/layout.tsx` — Root layout: fuente Geist + `<Providers>` (QueryClientProvider)
- `app/doctor/layout.tsx`, `app/lawyer/layout.tsx`, `app/admin/layout.tsx` — Envuelven `<DashboardLayout>` (Sidebar + Topbar + main)

---

## 9. Componentes UI

### Primitivos en `src/components/ui/`

Construidos con **CVA** (class-variance-authority) + Tailwind. Todos aceptan `className` para sobrescribir estilos.

| Componente | Variantes principales | Uso |
|-----------|----------------------|-----|
| `Button` | `primary`, `outline`, `ghost`, `secondary`, `destructive` | Botones de acción |
| `Badge` | `info`, `success`, `warning`, `destructive`, `secondary`, `outline` | Etiquetas de estado |
| `Input` | — | Campo de texto |
| `Textarea` | — | Campo de texto multilínea |
| `Label` | — | Etiqueta de formulario |
| `Card` | — | Contenedor con borde |
| `Separator` | `horizontal`, `vertical` | Divisor visual |
| `Avatar` | — | Imagen de perfil (Radix Avatar) |

### Componentes de layout

- `DashboardLayout` (`components/layout/dashboard-layout.tsx`) — Shell con Sidebar + Topbar
- `Sidebar` (`components/navigation/sidebar.tsx`) — Navegación lateral dinámica por rol
- `Topbar` (`components/navigation/topbar.tsx`) — Barra superior con título y logout

### StatCard (`components/dashboard/stat-card.tsx`)

Tarjeta de estadística para dashboards.

```tsx
<StatCard
  title="Casos activos"
  value={12}
  icon={Briefcase}
  color="blue"
  description="En seguimiento"
  trend={{ value: 8, label: "este mes" }}  // opcional
/>
```

---

## 10. Mocks y datos de demo

Los datos de demo viven en `src/mocks/` y son los únicos que acceden los repositorios mock.

| Archivo | Datos que contiene |
|---------|-------------------|
| `mocks/users.ts` | 5 usuarios (2 doctores, 2 abogados, 1 admin) + sus perfiles |
| `mocks/cases.ts` | 3 pacientes + 4 casos legales |
| `mocks/documents.ts` | 4 documentos médicos + registros de auditoría |
| `mocks/matching.ts` | 2 recomendaciones de matching + 3 solicitudes de contacto |

### Datos de acceso demo

En la pantalla de login hay botones de acceso rápido. También puedes usar estos emails en el formulario:

| Rol | Email | Contraseña (demo) |
|-----|-------|-------------------|
| Médico | `dr.ramirez@hospital.pe` | cualquiera |
| Médico | `dr.gutierrez@hospital.pe` | cualquiera |
| Abogado | `abg.vasquez@legal.pe` | cualquiera |
| Abogado | `abg.mendez@legal.pe` | cualquiera |
| Admin | `admin@hngai.pe` | cualquiera |

---

## 11. Cómo agregar una nueva feature

### Ejemplo: agregar "Notificaciones"

#### Paso 1 — Crear la entidad de dominio

```typescript
// src/modules/notifications/domain/entities/notification.entity.ts

export interface NotificationEntity {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
```

#### Paso 2 — Definir el repositorio (contrato)

```typescript
// src/modules/notifications/domain/repositories/INotificationRepository.ts

export interface INotificationRepository {
  findByUserId(userId: string): Promise<NotificationEntity[]>;
  markAsRead(id: string): Promise<NotificationEntity>;
}
```

#### Paso 3 — Crear el use case

```typescript
// src/modules/notifications/domain/use-cases/get-notifications.use-case.ts

export async function getNotificationsUseCase(
  notificationRepository: INotificationRepository,
  userId: string
): Promise<NotificationEntity[]> {
  return notificationRepository.findByUserId(userId);
}
```

#### Paso 4 — Implementar el repositorio mock

```typescript
// src/modules/notifications/infrastructure/repositories/MockNotificationRepository.ts

export class MockNotificationRepository implements INotificationRepository {
  private notifications: NotificationEntity[] = [
    { id: "n1", userId: "u1", title: "Nueva solicitud", message: "...", isRead: false, createdAt: new Date() }
  ];

  async findByUserId(userId: string) {
    await new Promise((r) => setTimeout(r, 200));
    return this.notifications.filter((n) => n.userId === userId);
  }

  async markAsRead(id: string) {
    const idx = this.notifications.findIndex((n) => n.id === id);
    this.notifications[idx] = { ...this.notifications[idx], isRead: true };
    return this.notifications[idx];
  }
}
```

#### Paso 5 — Registrar en el contenedor de dependencias

```typescript
// src/infrastructure/di/container.ts  — agregar:

import { MockNotificationRepository } from "@/modules/notifications/infrastructure/repositories/MockNotificationRepository";
export const notificationRepository = new MockNotificationRepository();
```

#### Paso 6 — Agregar la query key

```typescript
// src/lib/query-keys.ts  — agregar en el objeto queryKeys:

notifications: {
  byUser: (userId: string) => ["notifications", "user", userId] as const,
},
```

#### Paso 7 — Crear el hook

```typescript
// src/modules/notifications/presentation/hooks/useNotifications.ts

export function useNotifications(userId: string) {
  return useQuery({
    queryKey: queryKeys.notifications.byUser(userId),
    queryFn: async () => {
      const { notificationRepository } = await import("@/infrastructure/di/container");
      return getNotificationsUseCase(notificationRepository, userId);
    },
    enabled: Boolean(userId),
  });
}
```

#### Paso 8 — Usar en la página

```typescript
// En cualquier page:
const { user } = useAuthStore();
const { data: notifications = [], isLoading } = useNotifications(user?.id ?? "");
```

---

## 12. Cómo migrar al backend real

Cuando el backend REST esté listo, el proceso por módulo es:

### Paso 1 — Crear el repositorio HTTP

```typescript
// src/modules/cases/infrastructure/repositories/ApiCaseRepository.ts

import { apiClient } from "@/infrastructure/http/api-client";
import type { ICaseRepository, CaseFilters, PaginatedCases } from "../../domain/repositories/ICaseRepository";

export class ApiCaseRepository implements ICaseRepository {
  async findByDoctorId(doctorId: string, filters?: CaseFilters): Promise<PaginatedCases> {
    const response = await apiClient.get(`/cases`, {
      params: { doctorId, ...filters }
    });
    return response.data;
  }

  async findById(id: string) {
    const response = await apiClient.get(`/cases/${id}`);
    return response.data;
  }

  // ... resto de métodos
}
```

### Paso 2 — Cambiar el container (UN SOLO ARCHIVO)

```typescript
// src/infrastructure/di/container.ts

// ANTES:
import { MockCaseRepository } from "@/modules/cases/infrastructure/repositories/MockCaseRepository";
export const caseRepository = new MockCaseRepository();

// DESPUÉS:
import { ApiCaseRepository } from "@/modules/cases/infrastructure/repositories/ApiCaseRepository";
import { apiClient } from "@/infrastructure/http/api-client";
export const caseRepository = new ApiCaseRepository(apiClient);
```

**Eso es todo.** Ninguna página, hook ni use case necesita cambiar.

### Módulo por módulo

Puedes migrar módulo a módulo de forma independiente. Por ejemplo, migrar primero `auth`, luego `cases`, sin afectar el resto que aún usa mocks.

---

## 13. Convenciones de código

### Naming

| Elemento | Convención | Ejemplo |
|---------|-----------|---------|
| Archivos de componente | PascalCase | `CaseStatusBadge.tsx` |
| Archivos de página | `page.tsx` (Next.js) | `doctor/cases/page.tsx` |
| Archivos de hook | camelCase con `use` | `useCases.ts` |
| Archivos de entidad | kebab-case + `.entity.ts` | `legal-case.entity.ts` |
| Archivos de use case | kebab-case + `.use-case.ts` | `get-cases-by-doctor.use-case.ts` |
| Archivos de repositorio | PascalCase + `Repository.ts` | `MockCaseRepository.ts` |
| Interfaces de repositorio | PascalCase con `I` | `ICaseRepository` |
| Stores de Zustand | camelCase con `use` | `useAuthStore` |
| Variables locales | camelCase descriptivo | `pendingRequests`, `filteredDoctors` |

### Imports

- Siempre usar el alias `@/` para imports absolutos
- Orden: React → Next → librerías externas → módulos internos → tipos
- Los tipos solo con `import type`

```typescript
// Correcto
import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useCases } from "@/modules/cases/presentation/hooks/useCases";
import { useAuthStore } from "@/store/auth.store";
import { formatDate } from "@/lib/utils";
import type { CaseStatus } from "@/modules/cases/domain/entities/legal-case.entity";
```

### TypeScript

- **Prohibido:** `any` sin justificación
- **Preferir:** tipos nombrados sobre inline en repositorios
- **Fechas en entidades:** siempre `Date`, no `string`
- **Fechas en tipos globales (`@/types`):** `string` (ISO 8601)
- Los mocks convierten strings → Date al crear entidades

### Formularios

- Siempre `react-hook-form` + `zodResolver`
- Los schemas de validación van en `src/validators/` si son compartidos
- Si el schema es específico de una página, puede vivir en la misma página
- Los campos del formulario deben tener nombres descriptivos del dominio

```typescript
// Malo:
const { register } = useForm();
<Input {...register("field1")} />

// Bueno:
type DoctorProfileForm = { cmp: string; specialty: string; hospital: string; };
<Input {...register("cmp")} />
```

### Páginas

- **Nunca** importar mocks directamente en páginas
- **Siempre** usar hooks del módulo correspondiente
- Separar los estados de loading/error en el render

```typescript
// Estructura de una página típica
export default function MiPagina() {
  const { user } = useAuthStore();
  const { data: items = [], isLoading } = useItems(user?.id ?? "");

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      {items.map((item) => ( ... ))}
    </div>
  );
}
```

---

## Apéndice: archivos clave

| Archivo | Por qué leerlo primero |
|---------|----------------------|
| `src/infrastructure/di/container.ts` | Punto de ensamblaje: qué repositorio usa cada módulo |
| `src/types/index.ts` | Tipos globales del dominio (lo que manejan los mocks) |
| `src/lib/query-keys.ts` | Todas las claves de caché de TanStack Query |
| `src/modules/auth/presentation/stores/auth.store.ts` | Estado de sesión: cómo funciona el login |
| `src/constants/index.ts` | Labels, navegación, especialidades médicas y legales |
| `src/mocks/users.ts` | Usuarios y perfiles disponibles en el demo |
| `src/app/doctor/dashboard/page.tsx` | Ejemplo de página bien estructurada con hooks |
| `src/modules/cases/` | Módulo más completo: modelo de cómo están organizados todos los demás |
