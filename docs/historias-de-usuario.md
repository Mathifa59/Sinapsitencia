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

### HU-014 · Listado de episodios clínicos (vista administrador)

**Como** administrador,
**quiero** ver todos los casos legales del sistema,
**para** supervisar el estado de los procesos médico-legales de la institución.

**Criterios de Aceptación:**

- Se muestra una tabla con: título, paciente, médico responsable, estado, fecha de inicio.
- Incluye un botón para crear nuevos episodios.
- Muestra el total de episodios registrados.

**Definition of Done:**

- [ ] Página /admin/episodes consume todos los casos sin filtrar por médico.
- [ ] CaseStatusBadge para el estado de cada fila.
- [ ] Modal de creación de caso integrado.
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
