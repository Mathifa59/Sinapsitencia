# Historias de Usuario — Sinapsistencia

Plataforma médico-legal para la protección de profesionales de la salud.

---

## Épica 1: Autenticación y Control de Acceso

---

### HU-001 · Inicio de sesión por credenciales

**Como** usuario del sistema (médico, abogado o administrador),
**quiero** iniciar sesión con mi correo electrónico y contraseña,
**para** acceder de forma segura a las funcionalidades correspondientes a mi rol.

**Criterios de Aceptación:**

- El formulario solicita correo electrónico y contraseña.
- Se valida que ambos campos estén completos antes de enviar.
- Si las credenciales son incorrectas, se muestra un mensaje de error claro sin revelar qué campo falló.
- Si las credenciales son correctas, se redirige automáticamente al dashboard correspondiente al rol del usuario.
- El botón de submit se deshabilita mientras se procesa la petición para evitar doble envío.
- Existe un toggle para mostrar/ocultar la contraseña.

**Definition of Done:**

- [ ] Formulario implementado con validación (Zod + React Hook Form).
- [ ] Integración con endpoint POST /api/auth/login.
- [ ] Redirección post-login funcional según rol (doctor → /doctor/dashboard, lawyer → /lawyer/dashboard, admin → /admin/dashboard).
- [ ] Mensaje de error visible cuando las credenciales son inválidas.
- [ ] Estado de carga visible durante el proceso de autenticación.
- [ ] Sin errores de TypeScript ni warnings en consola.
- [ ] Probado manualmente con los 3 roles.

---

### HU-002 · Cierre de sesión

**Como** usuario autenticado,
**quiero** cerrar mi sesión de forma segura,
**para** proteger mi cuenta al dejar de usar la plataforma.

**Criterios de Aceptación:**

- Existe un botón de logout visible en la barra superior.
- Al hacer click, se elimina la sesión del almacenamiento local y la cookie de autenticación.
- Se redirige al usuario a la página de login.
- No es posible acceder a rutas protegidas después del cierre de sesión.

**Definition of Done:**

- [ ] Botón de logout en el Topbar.
- [ ] Limpieza de estado en Zustand, localStorage y cookie.
- [ ] Redirección a /login tras logout.
- [ ] Middleware/proxy redirige a /login si se intenta acceder sin sesión.
- [ ] Probado manualmente.

---

### HU-003 · Protección de rutas por rol

**Como** administrador del sistema,
**quiero** que cada rol solo pueda acceder a las rutas de su portal,
**para** garantizar que ningún usuario vea o manipule información fuera de su ámbito.

**Criterios de Aceptación:**

- Un usuario no autenticado que intenta acceder a /doctor/*, /lawyer/* o /admin/* es redirigido a /login.
- Un médico que intenta acceder a /admin/* o /lawyer/* es redirigido a /doctor/dashboard.
- Un abogado que intenta acceder a /doctor/* o /admin/* es redirigido a /lawyer/dashboard.
- Un administrador que intenta acceder a /doctor/* o /lawyer/* es redirigido a /admin/dashboard.
- Si un usuario autenticado visita /login, es redirigido a su dashboard.
- La URL original se preserva como parámetro redirect para restaurar después del login.

**Definition of Done:**

- [ ] Proxy/middleware (proxy.ts) implementado con reglas de redirección por rol.
- [ ] RoleGuard como protección client-side en los layouts de cada rol.
- [ ] Cookie de rol sincronizada con el store de autenticación.
- [ ] Parámetro ?redirect= en la URL de login para retorno post-autenticación.
- [ ] Probado con los 3 roles intentando acceder a rutas ajenas.
- [ ] Build exitoso sin errores de TypeScript.

---

### HU-004 · Acceso rápido por rol (modo demo)

**Como** evaluador o revisor del proyecto,
**quiero** poder iniciar sesión rápidamente seleccionando un rol,
**para** probar las funcionalidades de cada portal sin necesidad de recordar credenciales.

**Criterios de Aceptación:**

- La página de login muestra 3 botones de acceso rápido: Médico demo, Abogado demo, Admin demo.
- Al hacer click en uno de ellos, se inicia sesión inmediatamente con el usuario correspondiente.
- Se redirige al dashboard del rol seleccionado.

**Definition of Done:**

- [ ] Tres botones de acceso rápido en /login.
- [ ] Cada botón dispara loginByRole con el rol correspondiente.
- [ ] Redirección funcional al dashboard del rol.
- [ ] Probado manualmente.

---

### HU-005 · Cambio de rol desde el sidebar (testing)

**Como** evaluador del sistema,
**quiero** poder cambiar de rol sin cerrar sesión desde el sidebar,
**para** comparar rápidamente las vistas y permisos de cada rol.

**Criterios de Aceptación:**

- En el sidebar se muestran 3 botones (Médico, Abogado, Administrador).
- El rol activo está visualmente destacado.
- Al hacer click en otro rol, se cambia la sesión y se redirige al dashboard del nuevo rol.
- La navegación y el contenido del sidebar se actualizan inmediatamente.

**Definition of Done:**

- [ ] Componente de role-switcher integrado en el sidebar.
- [ ] loginByRole se ejecuta al seleccionar un rol distinto.
- [ ] Cookie de rol actualizada.
- [ ] Redirección al dashboard del nuevo rol.
- [ ] Sidebar muestra la navegación correspondiente al nuevo rol.
- [ ] Probado alternando entre los 3 roles.

---

## Épica 2: Gestión Documental Clínica-Legal

---

### HU-006 · Listado de documentos con filtros

**Como** médico,
**quiero** ver todos mis documentos clínico-legales en una tabla con búsqueda y filtros,
**para** localizar rápidamente un documento específico por título, paciente o estado.

**Criterios de Aceptación:**

- Se muestra una tabla con columnas: Documento, Tipo, Paciente, Estado, Firmas, Última actualización.
- Existe un campo de búsqueda que filtra por título y nombre de paciente.
- Cada fila muestra un ícono visual según el estado (firmado, pendiente, borrador).
- Se muestra el total de documentos encontrados.
- Si no hay resultados, se muestra un mensaje indicándolo.
- Se muestra un loader mientras se cargan los datos.

**Definition of Done:**

- [ ] Tabla de documentos renderizada con datos reales del API.
- [ ] Búsqueda funcional por título y paciente.
- [ ] Badge de estado con variante de color correcta.
- [ ] Conteo de firmas válidas por documento.
- [ ] Estado de carga visible.
- [ ] Estado vacío visible cuando no hay resultados.
- [ ] Responsive: columnas secundarias ocultas en mobile.
- [ ] Sin errores de TypeScript.

---

### HU-007 · Creación de documentos

**Como** médico,
**quiero** crear un nuevo documento clínico-legal seleccionando tipo, paciente y contenido inicial,
**para** iniciar el proceso de documentación formal de un acto médico.

**Criterios de Aceptación:**

- Se abre un modal al hacer click en "Nuevo documento".
- El formulario solicita: título (obligatorio), tipo de documento (obligatorio), paciente (opcional, seleccionable de lista existente), contenido inicial (opcional).
- Los tipos disponibles son: Historia Clínica, Consentimiento Informado, Informe Médico, Receta, Orden de Laboratorio, Certificado Médico, Documento Legal, Otro.
- Al crear, el documento se guarda con estado "borrador" y versión 1.
- El modal se cierra y la tabla se actualiza mostrando el nuevo documento.

**Definition of Done:**

- [ ] Modal de creación con formulario validado (Zod).
- [ ] Select de tipo de documento con todos los tipos.
- [ ] Select de paciente poblado desde el API.
- [ ] Integración con POST /api/documents.
- [ ] Invalidación de cache TanStack Query tras creación.
- [ ] Modal se cierra tras creación exitosa.
- [ ] Documento nuevo aparece en la tabla.
- [ ] Sin errores de TypeScript.

---

### HU-008 · Detalle y trazabilidad de un documento

**Como** médico o administrador,
**quiero** ver el detalle completo de un documento incluyendo versiones, firmas y metadatos,
**para** verificar la trazabilidad completa y el historial de cambios.

**Criterios de Aceptación:**

- Al hacer click en una fila de la tabla, se abre un modal con el detalle completo.
- Se muestra: título, tipo, estado, paciente, autor, fecha de creación, última actualización.
- Se lista el historial de versiones con número de versión, autor, fecha y notas.
- Se listan las firmas con nombre del firmante, tipo de firma, fecha y validez.
- Se muestran botones de acción según el estado actual del documento.

**Definition of Done:**

- [ ] Modal de detalle implementado y conectado a la tabla.
- [ ] Sección de metadatos completa.
- [ ] Listado de versiones con datos formateados.
- [ ] Listado de firmas con indicador visual de validez.
- [ ] Botones de acción contextuales (enviar a firma, marcar firmado, archivar).
- [ ] Sin errores de TypeScript.

---

### HU-009 · Cambio de estado de un documento

**Como** médico,
**quiero** cambiar el estado de un documento (enviar a firma, marcar como firmado, archivar),
**para** reflejar el avance del proceso de documentación legal.

**Criterios de Aceptación:**

- Un documento en estado "borrador" puede enviarse a firma (→ pendiente_firma).
- Un documento en "pendiente_firma" puede marcarse como firmado (→ firmado).
- Un documento en "firmado" puede archivarse (→ archivado).
- El cambio de estado se refleja inmediatamente en la tabla y el modal.
- No se permite retroceder a un estado anterior.

**Definition of Done:**

- [ ] Botones de acción condicionales según estado actual.
- [ ] Integración con PUT /api/documents/:id.
- [ ] Invalidación de cache tras cambio de estado.
- [ ] UI actualizada inmediatamente tras la acción.
- [ ] Transiciones de estado validadas (no se puede retroceder).
- [ ] Probado para cada transición de estado.

---

### HU-010 · Listado de documentos (vista administrador)

**Como** administrador,
**quiero** ver todos los documentos del sistema (no solo los míos),
**para** supervisar la documentación clínico-legal de toda la institución.

**Criterios de Aceptación:**

- La tabla muestra todos los documentos del sistema sin filtrar por autor.
- Incluye búsqueda por título y paciente.
- Permite crear nuevos documentos.
- Permite ver el detalle de cualquier documento haciendo click en la fila.

**Definition of Done:**

- [ ] Página /admin/documents consume la API sin filtro de autor.
- [ ] Funcionalidad de búsqueda operativa.
- [ ] Modal de creación y modal de detalle integrados.
- [ ] Sin errores de TypeScript.

---

## Épica 3: Gestión de Casos Legales

> **Alcance:** Este módulo es exclusivo de médicos y abogados. El administrador hospitalario **no tiene visibilidad** sobre los casos legales, ya que corresponden a la defensa profesional personal del médico y son confidenciales respecto a la institución.

---

### HU-011 · Listado de casos del médico

**Como** médico,
**quiero** ver mis casos legales activos con su estado y prioridad,
**para** hacer seguimiento a las situaciones legales que me afectan.

**Criterios de Aceptación:**

- Se muestra una tabla con: título, estado, prioridad, abogado asignado, paciente, fecha.
- Cada fila muestra badges de color para estado y prioridad.
- Existe un botón para crear un nuevo caso.
- Se muestra un loader durante la carga y un mensaje si no hay casos.

**Definition of Done:**

- [ ] Tabla de casos filtrada por doctorId del usuario autenticado.
- [ ] Badges de estado (CaseStatusBadge) y prioridad (CasePriorityBadge).
- [ ] Botón "Nuevo caso" conectado a modal de creación.
- [ ] Estado de carga y estado vacío.
- [ ] Sin errores de TypeScript.

---

### HU-012 · Creación de un caso legal

**Como** médico,
**quiero** registrar un nuevo caso legal con título, descripción, prioridad y paciente,
**para** documentar formalmente una situación que requiere asesoría legal.

**Criterios de Aceptación:**

- El formulario solicita: título (mín. 5 caracteres), descripción (mín. 10 caracteres), prioridad (baja/media/alta/crítica), paciente (opcional), notas (opcional).
- Al crear, el caso se guarda con estado "nuevo".
- El modal se cierra y la lista se actualiza.
- Se muestra error de validación si los campos obligatorios no cumplen los requisitos.

**Definition of Done:**

- [ ] Modal con formulario validado (Zod + React Hook Form).
- [ ] Integración con POST /api/legal-cases.
- [ ] Caso creado con estado "nuevo" y doctor = usuario actual.
- [ ] Invalidación de cache tras creación.
- [ ] Errores de validación visibles en el formulario.
- [ ] Probado con datos válidos e inválidos.

---

### HU-013 · Detalle de un caso legal

**Como** médico,
**quiero** ver el detalle completo de un caso incluyendo descripción, documentos asociados y abogado asignado,
**para** tener una visión integral de la situación legal.

**Criterios de Aceptación:**

- La página de detalle muestra: título, descripción, estado, prioridad, médico, abogado asignado (si existe), paciente, notas, fechas.
- Se muestran badges de estado y prioridad.
- Se lista la información del abogado asignado (nombre, CAB, especialidades, teléfono).
- Se muestra la información del paciente (nombre, DNI, tipo de sangre).

**Definition of Done:**

- [ ] Página /doctor/cases/[id] implementada con datos del API.
- [ ] Secciones de información organizadas y completas.
- [ ] Badges de estado y prioridad reutilizados.
- [ ] Estado de carga y manejo de caso no encontrado (404).
- [ ] Sin errores de TypeScript.

---

### HU-014 · Gestión de episodios clínicos hospitalarios (vista administrador)

**Como** administrador del hospital,
**quiero** registrar y visualizar los episodios clínicos asociados a pacientes (ingresos, intervenciones, altas),
**para** llevar el control de la actividad asistencial de la institución, independientemente de los procesos legales del médico.

> **Nota:** Los episodios clínicos son registros hospitalarios (ingreso, diagnóstico, alta) y NO deben confundirse con los casos legales que el médico gestiona de forma privada con su abogado. El administrador no tiene acceso a estos últimos.

**Criterios de Aceptación:**

- Se muestra una tabla con: título del episodio, paciente, médico responsable, diagnóstico, estado (activo/cerrado/archivado), fecha de inicio.
- Se puede crear un nuevo episodio clínico desde un modal con: paciente, médico, título, descripción, diagnóstico (opcional), fecha de inicio.
- El estado de un episodio puede cambiarse a "cerrado" cuando el paciente recibe el alta.
- Se muestra el total de episodios registrados.
- La tabla permite búsqueda por nombre de paciente o médico responsable.

**Definition of Done:**

- [ ] Página /admin/episodes consume GET /api/episodes (entidad ClinicalEpisode, no LegalCase).
- [ ] Modal de creación con formulario validado (Zod): paciente, médico, título, descripción, fecha inicio.
- [ ] Botón de cambio de estado (activo → cerrado → archivado).
- [ ] Búsqueda funcional por paciente y médico.
- [ ] Sin acceso al módulo de casos legales desde esta vista.
- [ ] Sin errores de TypeScript.

---

## Épica 4: Vinculación Médico-Abogado (Matching)

---

### HU-015 · Recomendaciones de abogados para médico

**Como** médico,
**quiero** ver una lista de abogados recomendados según mi perfil y caso,
**para** elegir al profesional legal más adecuado para mi situación.

**Criterios de Aceptación:**

- Se muestra una lista de abogados ordenados por score de compatibilidad.
- Cada tarjeta muestra: nombre, CAB, especialidades, experiencia, rating, casos atendidos, score de match.
- Se listan las razones de la recomendación.
- Las recomendaciones con score ≥ 90 se destacan visualmente.
- Existe un botón "Solicitar contacto" para cada abogado.

**Definition of Done:**

- [ ] Listado de recomendaciones consumido desde GET /api/matching/lawyers?doctorId=.
- [ ] Tarjetas de abogado con toda la información requerida.
- [ ] Indicador visual para match alto (≥ 90).
- [ ] Botón de solicitud de contacto funcional.
- [ ] Sin errores de TypeScript.

---

### HU-016 · Envío de solicitud de contacto

**Como** médico,
**quiero** enviar una solicitud de contacto a un abogado recomendado con un mensaje personalizado,
**para** iniciar la comunicación profesional y solicitar asesoría legal.

**Criterios de Aceptación:**

- Se abre un modal al hacer click en "Solicitar contacto".
- El formulario solicita un mensaje obligatorio.
- Al enviar, la solicitud se crea con estado "pendiente".
- Se muestra confirmación de envío exitoso.
- No se permite enviar solicitudes duplicadas al mismo abogado.

**Definition of Done:**

- [ ] Modal de solicitud con campo de mensaje.
- [ ] Integración con POST /api/matching/contact-requests.
- [ ] Estado "pendiente" asignado automáticamente.
- [ ] Invalidación de cache tras envío.
- [ ] Confirmación visual de envío exitoso.
- [ ] Sin errores de TypeScript.

---

### HU-017 · Gestión de solicitudes recibidas (abogado)

**Como** abogado,
**quiero** ver las solicitudes de contacto recibidas y poder aceptarlas o rechazarlas,
**para** decidir qué casos atender.

**Criterios de Aceptación:**

- Se muestra una tabla/lista con las solicitudes recibidas.
- Cada solicitud muestra: médico solicitante (nombre, especialidad, hospital), mensaje, fecha, estado.
- Las solicitudes pendientes tienen botones "Aceptar" y "Rechazar".
- Al aceptar o rechazar, el estado se actualiza inmediatamente.
- Los botones se deshabilitan mientras se procesa la acción.

**Definition of Done:**

- [ ] Página /lawyer/requests con listado de solicitudes.
- [ ] Filtrado por toLawyerId = usuario autenticado.
- [ ] Botones Aceptar/Rechazar para solicitudes pendientes.
- [ ] Integración con PATCH /api/matching/contact-requests.
- [ ] Invalidación de cache tras respuesta.
- [ ] Estado de carga en botones durante la petición.
- [ ] Sin errores de TypeScript.

---

### HU-018 · Dashboard del abogado con solicitudes pendientes

**Como** abogado,
**quiero** ver un resumen de mis solicitudes pendientes y casos activos en mi dashboard,
**para** tener una vista rápida de mi carga de trabajo.

**Criterios de Aceptación:**

- Se muestran 4 estadísticas: solicitudes nuevas, casos activos, médicos disponibles, valoración promedio.
- Se listan las solicitudes pendientes con opción de aceptar/rechazar directamente.
- Se listan los casos en seguimiento (solicitudes aceptadas).
- Enlace "Ver todas" lleva a la página de solicitudes completa.

**Definition of Done:**

- [ ] Página /lawyer/dashboard con 4 StatCards.
- [ ] Sección de solicitudes pendientes con acciones inline.
- [ ] Sección de casos en seguimiento.
- [ ] Datos consumidos desde la API.
- [ ] Enlace funcional a /lawyer/requests.
- [ ] Sin errores de TypeScript.

---

### HU-019 · Directorio de abogados (vista médico)

**Como** médico,
**quiero** explorar un directorio de abogados disponibles con sus perfiles profesionales,
**para** conocer las opciones de asesoría legal antes de solicitar contacto.

**Criterios de Aceptación:**

- Se muestran tarjetas de abogados con: nombre, CAB, especialidades, hospital, experiencia, biografía.
- Existe un campo de búsqueda que filtra por nombre o especialidad.
- Al hacer click en "Ver perfil completo", se abre un modal con la información detallada.
- Cada tarjeta muestra un badge "Activo".

**Definition of Done:**

- [ ] Página /doctor/lawyers con grid de tarjetas.
- [ ] Búsqueda funcional por nombre y especialidad.
- [ ] Modal de perfil completo.
- [ ] Datos consumidos desde la API de matching.
- [ ] Sin errores de TypeScript.

---

### HU-020 · Directorio de médicos (vista abogado)

**Como** abogado,
**quiero** ver un directorio de los médicos registrados en la plataforma,
**para** conocer los profesionales que podrían requerir asesoría legal.

**Criterios de Aceptación:**

- Se muestran tarjetas de médicos con: nombre, CMP, especialidad, hospital, experiencia, biografía.
- Existe un campo de búsqueda que filtra por nombre o especialidad.
- Al hacer click en "Ver perfil completo", se abre un modal con información detallada (CMP, hospital, teléfono, bio).

**Definition of Done:**

- [ ] Página /lawyer/doctors con grid de tarjetas.
- [ ] Búsqueda funcional.
- [ ] Modal de perfil detallado.
- [ ] Datos consumidos desde GET /api/matching/doctors.
- [ ] Sin errores de TypeScript.

---

## Épica 5: Gestión de Pacientes

---

### HU-021 · Listado de pacientes

**Como** administrador,
**quiero** ver todos los pacientes registrados en el sistema con búsqueda,
**para** gestionar la información de los pacientes de la institución.

**Criterios de Aceptación:**

- Se muestra una tabla con: nombre completo, DNI, género, teléfono, tipo de sangre, fecha de registro.
- Existe un campo de búsqueda que filtra por nombre o DNI.
- Se muestra el total de pacientes.
- Se muestra loader durante carga y mensaje cuando no hay resultados.

**Definition of Done:**

- [ ] Página /admin/patients con tabla paginada.
- [ ] Búsqueda funcional por nombre y DNI.
- [ ] Datos consumidos desde GET /api/patients.
- [ ] Estado de carga y estado vacío.
- [ ] Sin errores de TypeScript.

---

### HU-022 · Registro de nuevo paciente

**Como** administrador,
**quiero** registrar un nuevo paciente con sus datos personales y médicos,
**para** incorporarlo al sistema y asociarlo a documentos y casos.

**Criterios de Aceptación:**

- Se abre un modal al hacer click en "Nuevo paciente".
- El formulario solicita: nombre, apellido, DNI (obligatorios), fecha de nacimiento, género, teléfono, email, dirección, tipo de sangre.
- Se valida que el DNI tenga 8 dígitos.
- Al crear, el paciente aparece en la tabla.
- Se muestra error de validación para campos inválidos.

**Definition of Done:**

- [ ] Modal de creación con formulario validado (Zod).
- [ ] Integración con POST /api/patients.
- [ ] Invalidación de cache tras creación.
- [ ] Errores de validación visibles.
- [ ] Probado con datos válidos e inválidos.

---

### HU-023 · Edición de paciente

**Como** administrador,
**quiero** editar los datos de un paciente existente,
**para** mantener la información actualizada.

**Criterios de Aceptación:**

- Existe un botón de edición (ícono lápiz) en cada fila de la tabla.
- Al hacer click, se abre el modal pre-rellenado con los datos actuales del paciente.
- Se pueden modificar: nombre, apellido, teléfono, email, dirección, tipo de sangre.
- Al guardar, los cambios se reflejan inmediatamente en la tabla.

**Definition of Done:**

- [ ] Botón de edición en cada fila.
- [ ] Modal reutilizado en modo edición (pre-rellenado).
- [ ] Integración con PUT /api/patients/:id.
- [ ] Invalidación de cache tras actualización.
- [ ] Sin errores de TypeScript.

---

## Épica 6: Gestión de Usuarios

---

### HU-024 · Listado de usuarios del sistema

**Como** administrador,
**quiero** ver todos los usuarios del sistema con su rol y estado,
**para** gestionar el acceso a la plataforma.

**Criterios de Aceptación:**

- Se muestra una tabla con: nombre, email, rol (con badge de color), estado (activo/inactivo), fecha de registro.
- Cada fila tiene un botón para activar/desactivar al usuario.
- Se muestra el total de usuarios.

**Definition of Done:**

- [ ] Página /admin/users con tabla de usuarios.
- [ ] Badge de rol con colores diferenciados (doctor=info, lawyer=secondary, admin=warning).
- [ ] Botón de toggle de estado funcional.
- [ ] Datos consumidos desde GET /api/users.
- [ ] Sin errores de TypeScript.

---

### HU-025 · Creación de nuevo usuario

**Como** administrador,
**quiero** registrar un nuevo usuario asignándole nombre, email y rol,
**para** otorgar acceso a la plataforma a nuevos profesionales.

**Criterios de Aceptación:**

- Se abre un modal al hacer click en "Nuevo usuario".
- El formulario solicita: nombre completo, email y rol (doctor/lawyer/admin).
- Se valida que el email no esté duplicado.
- Al crear, el usuario aparece en la tabla con estado activo.

**Definition of Done:**

- [ ] Modal de creación con formulario validado.
- [ ] Select de rol con las 3 opciones.
- [ ] Integración con POST /api/users.
- [ ] Invalidación de cache tras creación.
- [ ] Error visible si el email ya existe.
- [ ] Sin errores de TypeScript.

---

### HU-026 · Activar/desactivar usuario

**Como** administrador,
**quiero** activar o desactivar un usuario,
**para** controlar quién tiene acceso activo a la plataforma sin eliminar su registro.

**Criterios de Aceptación:**

- Un botón en cada fila permite alternar entre activo e inactivo.
- El estado se actualiza inmediatamente en la tabla.
- El botón muestra un texto contextual ("Activar" o "Desactivar") según el estado actual.

**Definition of Done:**

- [ ] Botón contextual de toggle en cada fila.
- [ ] Integración con PATCH /api/users/:id.
- [ ] Invalidación de cache tras cambio.
- [ ] Cambio visual inmediato en la tabla.
- [ ] Sin errores de TypeScript.

---

## Épica 7: Auditoría y Trazabilidad

---

### HU-027 · Registro de auditoría

**Como** administrador,
**quiero** ver un registro cronológico de todas las acciones realizadas en el sistema,
**para** garantizar la trazabilidad y cumplimiento normativo.

**Criterios de Aceptación:**

- Se muestra una tabla con: usuario, rol, acción, recurso, descripción, IP, fecha/hora.
- Cada tipo de acción tiene un badge de color diferenciado (login=success, create=info, update=warning, delete=destructive, etc.).
- Existe un campo de búsqueda que filtra por descripción o nombre de usuario.
- Se muestra el total de registros.

**Definition of Done:**

- [ ] Página /admin/audit con tabla de logs.
- [ ] Badges de acción con variantes de color centralizadas en constantes.
- [ ] Búsqueda funcional.
- [ ] Datos consumidos desde GET /api/audit.
- [ ] Sin errores de TypeScript.

---

## Épica 8: Dashboard y Visualización

---

### HU-028 · Dashboard del médico

**Como** médico,
**quiero** ver un resumen de mis casos activos, documentos pendientes y recomendaciones de abogados,
**para** tener una vista rápida del estado de mis asuntos legales.

**Criterios de Aceptación:**

- Se muestran estadísticas: casos activos, documentos pendientes de firma, contactos de abogados.
- Se listan los casos recientes con estado y prioridad.
- Se muestra un acceso rápido a las recomendaciones de abogados.
- Los datos se cargan desde las APIs correspondientes.

**Definition of Done:**

- [ ] Página /doctor/dashboard con StatCards.
- [ ] Datos calculados dinámicamente desde la API.
- [ ] Links funcionales a las secciones respectivas.
- [ ] Estado de carga visible.
- [ ] Sin errores de TypeScript.

---

### HU-029 · Dashboard del administrador

**Como** administrador,
**quiero** ver un resumen global del sistema con estadísticas de usuarios, documentos, casos y actividad reciente,
**para** supervisar el funcionamiento general de la plataforma.

**Criterios de Aceptación:**

- Se muestran estadísticas: total de usuarios, documentos, casos, pacientes.
- Se muestra distribución de usuarios por rol.
- Se listan los últimos logs de auditoría.
- Se muestra actividad reciente con nombre, rol y acción.

**Definition of Done:**

- [ ] Página /admin/dashboard con múltiples StatCards.
- [ ] Listado de auditoría reciente.
- [ ] Distribución de usuarios por rol con badges.
- [ ] Datos consumidos desde múltiples endpoints API.
- [ ] Sin errores de TypeScript.

---

## Épica 9: Perfil de Usuario

---

### HU-030 · Visualización y edición de perfil del médico

**Como** médico,
**quiero** ver y editar mi perfil profesional (CMP, especialidad, hospital, teléfono, biografía),
**para** mantener mi información actualizada y visible para los abogados.

**Criterios de Aceptación:**

- Se muestra el perfil actual con todos los campos profesionales.
- Existe un formulario de edición con validación.
- Los campos editables son: teléfono, biografía.
- Los campos de solo lectura son: nombre, email, CMP, especialidad, hospital.
- Al guardar, se muestra confirmación de éxito.

**Definition of Done:**

- [ ] Página /doctor/profile con vista del perfil.
- [ ] Formulario de edición con validación Zod.
- [ ] Campos de solo lectura claramente diferenciados.
- [ ] Confirmación visual al guardar.
- [ ] Sin errores de TypeScript.

---

### HU-031 · Visualización y edición de perfil del abogado

**Como** abogado,
**quiero** ver y editar mi perfil profesional (CAB, especialidades, experiencia, disponibilidad, biografía),
**para** que los médicos puedan evaluar mi perfil antes de solicitar contacto.

**Criterios de Aceptación:**

- Se muestra el perfil actual con todos los campos profesionales.
- Se puede editar: teléfono, biografía, disponibilidad.
- Los campos de solo lectura son: nombre, email, CAB, especialidades.
- Al guardar, se muestra confirmación de éxito.

**Definition of Done:**

- [ ] Página /lawyer/profile con vista del perfil.
- [ ] Formulario de edición con validación.
- [ ] Toggle de disponibilidad.
- [ ] Confirmación visual al guardar.
- [ ] Sin errores de TypeScript.

---

## Épica 10: Landing y Registro

---

### HU-032 · Página de inicio (landing)

**Como** visitante no autenticado,
**quiero** ver una página de inicio que explique qué es Sinapsistencia y sus funcionalidades,
**para** entender el propósito de la plataforma antes de registrarme o iniciar sesión.

**Criterios de Aceptación:**

- Se muestra el nombre y descripción de la plataforma.
- Se describen los 2 módulos principales: Gestión Documental y Vinculación Médico-Abogado.
- Se describen los 3 roles de acceso (Médico, Abogado, Administrador).
- Existen CTAs para acceder al login.
- La página es responsive.

**Definition of Done:**

- [ ] Página / con hero, features, roles y footer.
- [ ] CTAs funcionales con enlaces a /login.
- [ ] Diseño responsive.
- [ ] Sin errores de TypeScript.

---

### HU-033 · Formulario de solicitud de acceso

**Como** profesional de la salud o abogado,
**quiero** solicitar acceso a la plataforma proporcionando mis datos profesionales,
**para** poder utilizar las herramientas de documentación y matching.

**Criterios de Aceptación:**

- Se muestra un formulario con: nombre, email, rol deseado, datos profesionales.
- Se validan los campos obligatorios.
- Al enviar, se muestra un mensaje de confirmación de que la solicitud fue recibida.
- Enlace para volver a login si ya tiene cuenta.

**Definition of Done:**

- [ ] Página /register con formulario.
- [ ] Validación de campos con Zod.
- [ ] Mensaje de confirmación tras envío.
- [ ] Enlace funcional a /login.
- [ ] Sin errores de TypeScript.

---

## Épica 11: Firmas Digitales y Consentimiento Informado

---

### HU-034 · Firma de un documento por parte del médico

**Como** médico,
**quiero** registrar mi firma en un documento clínico-legal desde la plataforma,
**para** validar el documento con mi autoría de forma legalmente trazable.

**Criterios de Aceptación:**

- El botón "Firmar documento" aparece en el detalle del documento cuando el estado es "pendiente_firma".
- Al hacer click, se abre un modal de confirmación que muestra el nombre del firmante, la fecha/hora y el tipo de firma (digital).
- Al confirmar, se crea un `SignatureRecord` asociado al documento con tipo `digital`, fecha actual y `isValid: true`.
- El documento pasa automáticamente a estado "firmado" si se alcanza el número mínimo de firmas requeridas.
- La firma registrada aparece en la sección de firmas del detalle del documento.
- No se puede volver a firmar un documento que ya fue firmado por el mismo usuario.

**Definition of Done:**

- [ ] Modal de confirmación de firma implementado.
- [ ] Integración con POST /api/documents/:id/signatures.
- [ ] `SignatureRecord` creado con tipo `digital`, fecha, isValid=true y hash generado.
- [ ] Estado del documento actualizado automáticamente si el criterio de firmas se cumple.
- [ ] Sección de firmas en el modal de detalle muestra la nueva firma.
- [ ] Botón no visible si el usuario ya firmó el documento.
- [ ] Invalidación de cache TanStack Query tras la firma.
- [ ] Sin errores de TypeScript.

---

### HU-035 · Gestión de registros de consentimiento informado

**Como** médico,
**quiero** generar y hacer seguimiento de registros de consentimiento informado asociados a un documento,
**para** asegurar que el paciente autorizó el acto médico de forma explícita y trazable.

**Criterios de Aceptación:**

- Desde el detalle de un documento de tipo "Consentimiento Informado", se puede crear un registro de consentimiento.
- El formulario solicita: paciente (obligatorio), fecha de expiración (opcional), notas (opcional).
- El registro se crea con estado "pendiente".
- Se listan los consentimientos asociados al documento con: paciente, estado, fecha de firma, fecha de expiración.
- El estado puede actualizarse a "firmado" o "rechazado".
- Un consentimiento expirado se muestra con badge diferenciado.

**Definition of Done:**

- [ ] Sección de consentimientos en el modal de detalle de documentos tipo "Consentimiento Informado".
- [ ] Formulario de creación con validación Zod.
- [ ] Integración con POST /api/documents/:id/consents.
- [ ] Integración con PATCH /api/consents/:id para cambio de estado.
- [ ] Badges de estado: pendiente, firmado, rechazado, expirado (usando `CONSENT_STATUS_LABELS`).
- [ ] Invalidación de cache tras cada acción.
- [ ] Sin errores de TypeScript.

---

## Épica 12: Gestión de Archivos Adjuntos

---

### HU-036 · Adjuntar documentos a un caso legal

**Como** médico,
**quiero** adjuntar archivos (PDF, imágenes, documentos clínicos) a un caso legal,
**para** consolidar toda la evidencia relevante en un único lugar.

**Criterios de Aceptación:**

- En la página de detalle de un caso, existe un botón "Adjuntar" en la sección de documentos.
- Al hacer click, se abre un selector de archivos que acepta: PDF, PNG, JPG, DOCX (máx. 10 MB por archivo).
- El archivo se sube y queda vinculado al caso.
- La lista de adjuntos muestra: nombre del archivo, tipo, tamaño, fecha de carga y botón de descarga.
- Si el archivo supera el límite de tamaño, se muestra un error antes de iniciar la carga.
- El botón "Adjuntar" está deshabilitado durante la subida.

**Definition of Done:**

- [ ] Selector de archivos con validación de tipo y tamaño en el cliente.
- [ ] Integración con POST /api/legal-cases/:id/attachments (multipart/form-data).
- [ ] Listado de adjuntos consumido desde GET /api/legal-cases/:id/attachments.
- [ ] Botón de descarga funcional por archivo.
- [ ] Estado de carga visible durante la subida.
- [ ] Mensaje de error si el archivo es inválido.
- [ ] Invalidación de cache tras adjuntar.
- [ ] Sin errores de TypeScript.

---

## Épica 3 (continuación): Gestión de Casos Legales

---

### HU-037 · Asignación de abogado a un caso legal

**Como** médico,
**quiero** asignar un abogado directamente a mi caso legal,
**para** formalizar la relación profesional dentro de mi expediente.

**Criterios de Aceptación:**

- En el detalle de un caso, si no hay abogado asignado, se muestra un botón "Asignar abogado".
- Al hacer click, se abre un selector de abogados disponibles (con nombre, CAB y especialidades).
- Al confirmar la selección, el abogado queda vinculado al caso.
- La información del abogado asignado se muestra en la sección correspondiente del detalle.
- Solo se puede tener un abogado asignado por caso. Si ya hay uno asignado, se muestra un botón "Cambiar abogado".
- El abogado asignado puede ver el caso en su lista de casos activos.

**Definition of Done:**

- [ ] Botón "Asignar abogado" / "Cambiar abogado" contextual en el detalle del caso.
- [ ] Modal de selección de abogado con datos del directorio.
- [ ] Integración con PUT /api/legal-cases/:id/assign-lawyer.
- [ ] Llama al método `assignLawyer(caseId, lawyerId)` del repositorio de casos.
- [ ] Detalle del caso refleja inmediatamente al abogado asignado.
- [ ] Invalidación de cache tras la asignación.
- [ ] Sin errores de TypeScript.

---

### HU-038 · Edición de notas de un caso legal

**Como** médico,
**quiero** editar las notas de un caso legal después de su creación,
**para** agregar contexto, actualizaciones o información relevante conforme avanza el caso.

**Criterios de Aceptación:**

- En el detalle de un caso, el campo de notas tiene un botón de edición (ícono lápiz).
- Al hacer click, el campo de notas se convierte en un textarea editable con el contenido actual.
- Hay botones "Guardar" y "Cancelar".
- Al guardar, el cambio se persiste y el campo vuelve al modo solo lectura.
- Al cancelar, se descarta el cambio y el campo vuelve a su valor anterior.
- Si el campo está vacío, se muestra un placeholder "Sin notas".

**Definition of Done:**

- [ ] Modo edición inline del campo de notas en el detalle del caso.
- [ ] Integración con PATCH /api/legal-cases/:id con payload `{ notes: string }`.
- [ ] Validación mínima: notas no supera 2000 caracteres.
- [ ] Estado de carga durante el guardado.
- [ ] Mensaje de error si falla la actualización.
- [ ] Invalidación de cache tras guardar.
- [ ] Sin errores de TypeScript.

---

## Épica 4 (continuación): Vinculación Médico-Abogado

---

### HU-039 · Mensaje de respuesta al gestionar solicitudes de contacto

**Como** abogado,
**quiero** incluir un mensaje personalizado al aceptar o rechazar una solicitud de contacto,
**para** comunicarle al médico mis razones o próximos pasos de forma profesional.

**Criterios de Aceptación:**

- Al hacer click en "Aceptar" o "Rechazar", se abre un modal con un campo de mensaje opcional.
- El mensaje tiene un placeholder contextual según la acción ("Estaré encantado de ayudarte..." / "Por el momento no puedo atender este caso...").
- Al confirmar, el estado de la solicitud se actualiza junto con el `responseMessage`.
- El médico puede ver el mensaje de respuesta en el historial de su solicitud.
- Si no se ingresa mensaje, se guarda la respuesta sin texto adicional.

**Definition of Done:**

- [ ] Modal de respuesta con campo de mensaje opcional para Aceptar y Rechazar.
- [ ] Integración con PATCH /api/matching/contact-requests/:id con payload `{ status, responseMessage }`.
- [ ] `responseMessage` visible en la vista de historial de solicitudes del médico.
- [ ] Invalidación de cache tras la respuesta.
- [ ] Sin errores de TypeScript.

---

## Épica 9 (continuación): Perfil de Usuario

---

### HU-040 · Toggle de disponibilidad del abogado

**Como** abogado,
**quiero** indicar si estoy disponible para aceptar nuevos casos desde mi perfil,
**para** que los médicos y el sistema de recomendaciones solo me sugieran cuando puedo atender.

**Criterios de Aceptación:**

- En la página de perfil del abogado, se muestra un toggle de disponibilidad con estado actual (Disponible / No disponible).
- Al cambiar el toggle, el estado se persiste inmediatamente.
- El campo `available` del perfil del abogado se actualiza en la API.
- Los abogados marcados como no disponibles no aparecen en el listado de recomendaciones del médico.
- Se muestra confirmación visual tras el cambio (toast o badge actualizado).

**Definition of Done:**

- [ ] Toggle de disponibilidad integrado en /lawyer/profile.
- [ ] Integración con PATCH /api/lawyers/:id con payload `{ available: boolean }`.
- [ ] Cambio reflejado inmediatamente en el estado del componente.
- [ ] Abogados con `available: false` excluidos del endpoint GET /api/matching/lawyers.
- [ ] Confirmación visual tras el cambio.
- [ ] Sin errores de TypeScript.

---

## Épica 2 (continuación): Gestión Documental Clínica-Legal

---

### HU-041 · Historial de versiones de un documento

**Como** médico o administrador,
**quiero** ver el historial completo de versiones de un documento y poder consultar el contenido de cada versión,
**para** auditar los cambios realizados y verificar qué se modificó en cada revisión.

**Criterios de Aceptación:**

- En el modal de detalle del documento, la sección "Versiones" lista todas las versiones con: número de versión, autor, fecha y notas del cambio.
- Al hacer click en una versión, se expande el contenido de esa versión en un panel de solo lectura.
- La versión actual está visualmente destacada (badge "Actual").
- Si solo existe una versión, se muestra el mensaje "Sin historial de cambios previos".
- Los datos de versión provienen de `DocumentVersionEntity[]` del repositorio.

**Definition of Done:**

- [ ] Sección de historial de versiones expandible en el modal de detalle.
- [ ] Panel de contenido de versión en modo solo lectura.
- [ ] Badge "Actual" en la última versión.
- [ ] Estado vacío cuando solo existe la versión 1.
- [ ] Datos consumidos desde GET /api/documents/:id/versions.
- [ ] Sin errores de TypeScript.

---

### HU-042 · Búsqueda y filtrado avanzado de documentos

**Como** médico o administrador,
**quiero** filtrar los documentos por tipo, estado y rango de fechas, además de buscar por texto,
**para** localizar documentos específicos de manera más precisa en listados extensos.

**Criterios de Aceptación:**

- La tabla de documentos incluye, además de la búsqueda por texto, filtros por: tipo de documento, estado y rango de fechas (desde/hasta).
- Los filtros son opcionales y combinables entre sí.
- Al aplicar filtros, la tabla se actualiza mostrando solo los documentos que cumplen todos los criterios.
- Existe un botón "Limpiar filtros" que restablece todos los filtros a su estado inicial.
- Se muestra el total de documentos filtrados.

**Definition of Done:**

- [ ] Controles de filtro (selects y date pickers) integrados sobre la tabla de documentos.
- [ ] Filtros enviados como query params al endpoint GET /api/documents.
- [ ] Botón "Limpiar filtros" funcional.
- [ ] Conteo de documentos actualizado según filtros.
- [ ] Estado vacío visible cuando ningún documento cumple los filtros.
- [ ] Sin errores de TypeScript.

---

### HU-043 · Exportar listado de auditoría a CSV

**Como** administrador,
**quiero** exportar el registro de auditoría a un archivo CSV,
**para** compartirlo con auditores externos o integrarlo a herramientas de análisis.

**Criterios de Aceptación:**

- En la página de auditoría existe un botón "Exportar CSV".
- Al hacer click, se descarga un archivo `.csv` con los registros visibles (aplicando los filtros actuales de búsqueda).
- El CSV incluye columnas: Usuario, Rol, Acción, Recurso, Descripción, IP, Fecha/Hora.
- El nombre del archivo incluye la fecha de exportación (ej. `auditoria-2025-06-01.csv`).
- Si no hay registros, el botón está deshabilitado.

**Definition of Done:**

- [ ] Botón "Exportar CSV" en /admin/audit.
- [ ] Generación del CSV en el cliente a partir de los datos cargados.
- [ ] Descarga automática del archivo con nombre que incluye la fecha.
- [ ] Columnas correctas y valores correctamente escapados.
- [ ] Botón deshabilitado cuando no hay registros.
- [ ] Sin errores de TypeScript.

---

## Definition of Done Global (aplica a todas las HU)

Además de los criterios específicos de cada historia, toda historia de usuario se considera terminada cuando cumple:

- [ ] Código compilable sin errores de TypeScript (strict mode).
- [ ] Sin warnings en consola del navegador.
- [ ] Responsive: funcional en desktop (≥1024px) y mobile (≥375px).
- [ ] Datos consumidos desde API Routes (/api/*), no directamente de mocks.
- [ ] Componentes usan hooks de TanStack Query para estado del servidor.
- [ ] Estado de carga visible (spinner) durante peticiones asíncronas.
- [ ] Estado vacío visible cuando no hay datos.
- [ ] Mensajes de error visibles cuando una operación falla.
- [ ] Protección de ruta aplicada (no accesible sin autenticación ni con rol incorrecto).
- [ ] Build exitoso (`next build` sin errores).
