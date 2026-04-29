# Plan Maestro: Booking de Guias Independientes

## Objetivo

Integrar la opcion de reservar guias independientes como una capacidad de primera clase dentro del motor de reservas de Nómada Fantasma, reutilizando la infraestructura existente donde aporte valor, pero corrigiendo las piezas que hoy estan fragmentadas entre catalogo, intake publico y operacion interna.

## Diagnostico Ejecutivo

Hoy el proyecto ya tiene una base util:

- Existe modelado relacional en Supabase para `guides` y `guide_services`
- El endpoint publico `/api/reservations` ya acepta `reservation_type = guide`
- La UI ya expone una experiencia de booking para guias

Pero la integracion esta incompleta:

- El catalogo publico principal sigue dependiendo de `towns.guides` y modelos legacy
- La UI construye servicios desde texto parseado en vez de `guide_services`
- El backoffice interno solo entiende `tour` y `shuttle`
- Los emails y la logica operativa tratan una reserva de guia como si fuera un tour

Conclusion:

La feature existe a nivel superficial, pero no a nivel de dominio ni de operacion.

## Vision Objetivo

Queremos que una reserva de guia siga este ciclo completo:

1. El catalogo publico lista guias y servicios desde `guides` + `guide_services`
2. El cliente reserva un servicio de guia real, con IDs reales y datos consistentes
3. La reserva entra al sistema con semantica explicita de `guide`
4. El backoffice la visualiza, prioriza, actualiza y notifica como request operativo de primera clase
5. El cliente y el proveedor reciben comunicaciones correctas segun el tipo de servicio
6. WhatsApp queda como fallback deliberado, no como ruta silenciosa por defecto

## Principios Arquitectonicos

- Una sola fuente de verdad por dominio
- Un request operativo debe ser visible y operable de punta a punta
- Los tipos del dominio deben estar alineados entre DB, API, UI y backoffice
- Los fallbacks no deben ocultar errores estructurales
- La feature de guias debe converger con el motor, no bifurcarlo

## Arquitectura Objetivo

### 1. Dominio de catalogo

Fuente de verdad:

- `guides`
- `guide_services`

Responsabilidad:

- `guides` describe al proveedor o perfil operativo
- `guide_services` describe las experiencias reservables

Decision:

- `towns.guides` deja de ser fuente primaria para booking
- Puede mantenerse temporalmente como contenido editorial, pero no como motor transaccional

### 2. Dominio de reservas

Fuente de verdad:

- `reservations`

Campos clave para guias:

- `reservation_type = 'guide'`
- `guide_id`
- `guide_service_id`
- `guide_service_name`

Decision:

- Para una reserva de guia, `guide_service_id` debe ser obligatorio
- `guide_service_name` debe persistirse como snapshot operativo
- La reserva debe guardar suficiente contexto para operar aunque luego cambie el catalogo

### 3. Dominio operativo interno

El backoffice debe reconocer tres tipos:

- `tour`
- `guide`
- `shuttle`

Capacidades requeridas:

- listado interno
- transiciones de estado
- timeline de cambios
- notificaciones
- filtros
- detalle operacional

### 4. Dominio de comunicaciones

No debemos seguir reutilizando la semantica de tour para guia.

Necesitamos al menos:

- email al cliente: solicitud recibida
- email interno/admin: nueva solicitud de guia
- email al proveedor o agencia asignada: nueva solicitud
- emails de cancelacion y confirmacion coherentes con guias

## Brechas Actuales

### Brecha A: Catalogo dual

Problema:

- Existe `app/lib/supabase/guides.ts`, pero el flujo principal sigue usando `town.guides`

Impacto:

- doble verdad
- datos inconsistentes
- feature dificil de mantener

### Brecha B: Servicios legacy

Problema:

- La UI deriva servicios parseando `specialties`

Impacto:

- IDs ficticios
- fallback a WhatsApp aunque haya infraestructura real
- imposibilidad de operar con consistencia

### Brecha C: Intake incompleto

Problema:

- `guideId` entra, pero `guideServiceId` no esta elevado a requerimiento de dominio

Impacto:

- reservas ambiguas
- auditoria pobre
- mayor esfuerzo manual en ops

### Brecha D: Backoffice incompleto

Problema:

- `internal_requests` y `status` no soportan `guide`

Impacto:

- la feature no cierra operacionalmente
- se incrementa trabajo manual fuera del sistema

### Brecha E: Mensajeria mal especializada

Problema:

- una reserva de guia hoy cae en flujo de `sendTourConfirmationEmails`

Impacto:

- semantica equivocada
- plantillas y asuntos incorrectos
- dificultad para futuras automatizaciones

## Roadmap de Ejecucion

### Fase 0. Alineacion de dominio

Objetivo:

- Definir y congelar el modelo destino antes de tocar demasiadas capas

Entregables:

- confirmar `guide` como request type oficial
- confirmar que `guide_service_id` es requerido para booking interno
- definir si proveedor de guia se opera por `agency_id`, `guide.email`, o ambos
- decidir si `towns.guides` queda editorial o se elimina gradualmente

Riesgo principal:

- implementar rapido sin cerrar estas decisiones y volver a duplicar el dominio

### Fase 1. Catalogo unificado

Objetivo:

- Hacer que la capa publica consuma guias reales desde Supabase

Trabajo:

- integrar `getActiveGuidesByTownSlugFromDB` en las paginas de pueblo
- crear mapper de `GuideWithServices` a view model de UI
- dejar de depender de `atitlanTowns` para la parte transaccional
- usar `guide_services` reales en `GuideCard` y `BookingModal`

Definition of Done:

- cada guia visible en UI tiene UUID real
- cada servicio visible en modal tiene UUID real
- el booking ya no depende de parsear texto

### Fase 2. Intake robusto

Objetivo:

- Endurecer la creacion de reservas de guia

Trabajo:

- hacer obligatorio `guideServiceId` cuando `type = guide`
- validar que `guide_service_id` pertenece al `guide_id`
- persistir `guide_service_name`
- opcionalmente resolver `meeting_point` y snapshot operativo si aplica
- diferenciar mensajes de error de guia vs tour

Definition of Done:

- no puede entrar una reserva de guia sin servicio real valido
- la reserva queda autosuficiente para operacion

### Fase 3. Backoffice de primera clase

Objetivo:

- Soportar guias dentro del motor interno

Trabajo:

- extender `RequestKind` a `tour | guide | shuttle`
- actualizar constraints o migraciones necesarias para request transitions y notifications
- mapear reservas `guide` en `/api/internal/requests`
- habilitar transiciones en `/api/internal/requests/status`
- mostrar nombre del guia, servicio, horario y datos operativos en recepcion

Definition of Done:

- una reserva de guia aparece, cambia de estado y deja auditoria igual que tour/shuttle

### Fase 4. Mensajeria especializada

Objetivo:

- Mandar comunicaciones correctas y mantenibles

Trabajo:

- separar flujo de emails de guia del flujo de tour
- crear subject lines y plantillas base para guia
- resolver destinatario operativo correcto
- registrar eventos en `internal_request_notifications`

Definition of Done:

- cliente, admin y proveedor reciben mensajes consistentes con el dominio guide

### Fase 5. Limpieza y convergencia

Objetivo:

- Reducir deuda tecnica remanente

Trabajo:

- dejar `towns.guides` solo como contenido editorial o removerlo
- consolidar view models de guide
- actualizar `supabase/schema.sql` y tipos si hay drift
- documentar flujo operativo real

Definition of Done:

- no quedan caminos productivos importantes usando el modelo legacy

## Orden Recomendado de Implementacion

1. Fase 0
2. Fase 1
3. Fase 2
4. Fase 3
5. Fase 4
6. Fase 5

Motivo:

Si tocamos backoffice o emails antes de unificar catalogo e intake, vamos a estabilizar una entrada todavia inconsistente.

## Riesgos de Proyecto

### Riesgo 1. Migrar demasiado pronto todo el contenido legacy

Mitigacion:

- separar claramente contenido editorial de flujo transaccional

### Riesgo 2. Mezclar proveedor guia con agencia

Mitigacion:

- definir una regla operacional unica antes de automatizar emails

### Riesgo 3. Romper tours mientras se generaliza el motor

Mitigacion:

- introducir `guide` como extension incremental, no como refactor total en una sola entrega

### Riesgo 4. Mantener fallbacks silenciosos

Mitigacion:

- instrumentar cuando una reserva cae a WhatsApp fallback
- reducir ese camino a casos intencionales

## KPIs de Exito

- porcentaje de reservas de guia que entran por flujo interno real
- porcentaje de reservas de guia visibles en backoffice
- tasa de fallback a WhatsApp
- tiempo operativo desde request a primer contacto
- errores de validacion por mismatch entre `guide_id` y `guide_service_id`

## Backlog Inmediato

### Sprint 1

- conectar UI de pueblo a `guides` + `guide_services`
- eliminar IDs legacy en booking modal
- endurecer validacion de reservas de guia
- persistir `guide_service_name`

### Sprint 2

- soportar `guide` en internal requests
- soportar `guide` en status transitions
- exponer data operativa de guia en panel interno

### Sprint 3

- especializar emails
- registrar notificaciones de guide
- reducir fallback a WhatsApp

## Recomendacion de PM

No intentaria lanzar esto como un gran refactor transversal. Lo trataria como una integracion por capas con un criterio binario por fase:

- catalogo real
- intake robusto
- operacion real
- comunicacion real

La meta no es solo "que se pueda reservar", sino "que el equipo pueda operar la reserva sin salir del sistema".

## Propuesta de Ejecucion Inmediata

La secuencia de trabajo recomendada desde este punto es:

1. implementar Fase 1: unificar catalogo y modal de booking
2. implementar Fase 2: endurecer intake y persistencia
3. implementar Fase 3: cerrar el circuito interno

Esa es la ruta con mejor balance entre impacto, riesgo y velocidad.

## Guardrails para no romper nada

### Guardrail 1. No reemplazar todo de golpe

La migracion de guias debe hacerse con una estrategia de compatibilidad temporal:

- primero leer desde Supabase en paralelo al modelo legacy
- mapear ambos formatos a un view model comun de UI
- remover la dependencia legacy solo cuando el flujo nuevo este verificado

Esto reduce el riesgo de romper pueblos que hoy siguen dependiendo de `towns.guides`.

### Guardrail 2. No tocar el motor de tours para generalizar demasiado pronto

Tours hoy son el flujo mas maduro. No conviene rediseñar todo el motor antes de cerrar guias.

Regla:

- extender el dominio con `guide`
- evitar una refactorizacion total de `tour` y `shuttle` en la primera iteracion

### Guardrail 3. Agregar validacion fuerte antes de automatizar mas

Antes de ampliar emails y backoffice:

- validar `guide_service_id`
- validar pertenencia entre servicio y guia
- persistir snapshot del servicio

Si no hacemos esto primero, el resto del motor operara sobre datos ambiguos.

### Guardrail 4. WhatsApp solo como fallback observado

No debemos quitar el fallback de golpe, pero tampoco dejarlo oculto.

Regla:

- mantener fallback solo si faltan IDs validos o si falla el endpoint
- instrumentar cada fallback como evento para medir deuda real

### Guardrail 5. Cambios pequeños y verificables

Cada fase debe salir con verificacion puntual:

- render de guias por pueblo
- creacion de reserva guide
- visibilidad en backoffice
- cambio de estado
- envio de notificacion

## Guardrails de esencia Nómada Fantasma

### 1. La marca no es marketplace generico

La experiencia actual combina:

- mapa util y exploracion
- tonos cyberpunk controlados
- sensacion de operacion premium
- energia local y misterio del territorio

La integracion de guias no debe parecer un widget externo ni una ficha de freelancer generica.

### 2. El booking debe sentirse como expedicion curada, no formulario frio

Patrones ya presentes en la app:

- gradientes intensos pero dirigidos
- cards oscuras o glass con brillo cian y acento morado
- copy de acompañamiento operacional, no copy agresivo de venta
- jerarquia fuerte entre descubrimiento, contexto y accion

Aplicacion para guias:

- mantener el modal y cards con la misma familia visual de tours y rutas
- usar lenguaje de coordinacion y experiencia local
- destacar claridad operativa: fecha, horario, grupo, siguiente paso

### 3. La interfaz debe preservar continuidad con tours

Los tours ya marcan el lenguaje del producto:

- hero con atmosfera
- cards con imagen, contexto y CTA claro
- booking con sensacion de concierge operativo

Regla:

- guias debe sentirse como una extension natural del sistema de tours
- no introducir una estetica distinta ni componentes “startup SaaS”

### 4. La operacion tambien hace parte de la marca

La esencia no es solo visual. Tambien es confiabilidad.

Para Nómada Fantasma, marca = experiencia + operacion.

Entonces:

- estados claros
- mensajes consistentes
- tono humano y premium
- datos suficientes para responder rapido

### 5. Copy recomendado para mantener tono

Mantener:

- “coordinamos contigo”
- “confirmamos disponibilidad”
- “logistica final”
- “experiencia local”

Evitar:

- lenguaje demasiado transaccional
- tono de agregador barato
- etiquetas tipo “seller”, “vendor”, “gig”, “instant booking” si no son reales operativamente

## Criterios de aceptacion de marca y regresion

La implementacion de guias solo debe considerarse correcta si cumple ambas capas:

### Capa tecnica

- no rompe el flujo actual de tours
- no rompe pueblos sin guias relacionales aun migrados
- no genera reservas guide sin servicio valido
- no deja requests invisibles para operaciones

### Capa de producto

- visualmente se siente Nómada Fantasma
- el flujo de guia se percibe premium y local
- la transicion entre tours y guias es natural
- el fallback a WhatsApp no domina la experiencia principal

## Checklist antes de merge por fase

### Fase 1

- la UI de pueblo sigue renderizando aunque no haya guias relacionales
- cada guia nuevo muestra nombre, bio, idiomas y servicios sin parseo manual
- el modal conserva la misma direccion visual del resto de rutas magicas

### Fase 2

- no existe reserva guide sin `guide_id` ni `guide_service_id`
- se persiste `guide_service_name`
- los mensajes de error siguen localizados

### Fase 3

- internal requests lista guides sin afectar tours y shuttles
- las transiciones funcionan con auditoria
- recepcion entiende el request sin depender del campo `notes`

### Fase 4

- customer email, admin email y provider email usan semantica de guide
- no se reciclan asuntos o textos de tour si generan confusion
- las notificaciones quedan registradas en timeline operativo

## Matriz Ejecutiva de Prioridades

Escala usada:

- impacto en monetizacion: 1 bajo, 5 muy alto
- esfuerzo: 1 bajo, 5 alto
- riesgo: 1 bajo, 5 alto
- urgencia: 1 baja, 5 muy alta

| Prioridad | Iniciativa | Impacto en monetizacion | Esfuerzo | Riesgo | Urgencia | Beneficio principal |
| --- | --- | --- | --- | --- | --- | --- |
| P1 | Cerrar flujo guide end-to-end | 5 | 4 | 3 | 5 | Habilita inventario vendible y operable |
| P1 | Dejar health checks en verde (`lint`, `test`) | 4 | 2 | 2 | 5 | Reduce riesgo de incidentes en reservas |
| P1 | Instrumentar funnel y fallback a WhatsApp | 5 | 2 | 1 | 5 | Permite medir conversion real y fuga de leads |
| P2 | Soportar `guide` en backoffice interno | 5 | 4 | 3 | 4 | Convierte interes comercial en operacion repetible |
| P2 | Especializar emails y notificaciones de guide | 4 | 3 | 2 | 4 | Mejora confianza de cliente y proveedor |
| P2 | Consolidar narrativa comercial y SEO | 4 | 2 | 1 | 4 | Mejora captacion y confianza inicial |
| P3 | Generalizar motor interno fuera de San Pedro | 4 | 4 | 3 | 3 | Prepara expansion territorial y de partners |
| P3 | Limpiar dependencias legacy de guias | 3 | 3 | 3 | 3 | Reduce deuda y costo de evolucion |
| P4 | Endurecer gobierno interno de accesos | 3 | 2 | 2 | 2 | Mejora trazabilidad y control operativo |

## Scorecard Ejecutivo por Area

| Area | Estado | Lectura ejecutiva |
| --- | --- | --- |
| Producto | Amarillo | La propuesta ya atrae, pero guias aun no cierra el circuito completo |
| Arquitectura | Amarillo | La direccion es correcta, pero conviven modelo nuevo y legacy |
| QA / release readiness | Amarillo-rojo | `typecheck` pasa, `lint` y `test` no |
| Operacion interna | Amarillo | Tours y shuttles estan mejor resueltos que guides |
| UX / UI | Verde-amarillo | La marca y la atmosfera son fuertes, con zonas mixtas de madurez |
| Datos y dominio | Amarillo-rojo | Existe base relacional buena, pero intake y snapshots siguen incompletos |
| Monetizacion | Verde-amarillo | Hay capacidad real de cobrar, pero parte del funnel se fuga fuera del motor |

## Beneficio Directo para Monetizacion

### 1. Cerrar guide como dominio de primera clase

Beneficia monetizacion porque:

- habilita un inventario de alta flexibilidad y margen alto
- permite comisionar servicios concretos, no leads ambiguos
- reduce trabajo manual por cada reserva
- mejora la confianza del partner y aumenta retencion de oferta

Impacto esperado:

- mas disponibilidad operable sin aumentar tanto la carga de coordinacion
- mejor tasa de confirmacion de reservas de guias
- mejor capacidad de escalar partnerships pequenos

### 2. Medir funnel real y fallback a WhatsApp

Beneficia monetizacion porque:

- revela cuantos leads salen del sistema sin trazabilidad
- permite distinguir conversion real de conversion aparente
- ayuda a priorizar donde invertir tiempo de producto

Impacto esperado:

- mejor lectura de CAC organico y conversion por canal
- capacidad de reducir fuga de ingresos hacia coordinacion manual

### 3. Backoffice de guide

Beneficia monetizacion porque:

- convierte una reserva en ingreso procesable
- reduce tiempo de respuesta y perdida por abandono
- permite operar mas solicitudes con el mismo equipo

Impacto esperado:

- menor tiempo desde request a primer contacto
- menos reservas olvidadas o resueltas fuera del sistema

### 4. Emails y semantica correcta

Beneficia monetizacion porque:

- mejora la confianza de cliente y proveedor
- reduce confusion sobre disponibilidad, pago y pasos siguientes
- aumenta probabilidad de cierre cuando la respuesta no es inmediata

Impacto esperado:

- mejor conversion post-request
- mejor tasa de respuesta del proveedor

### 5. Salud tecnica del repo

Beneficia monetizacion porque:

- reduce riesgo de romper reservas en release
- baja el costo de cada iteracion comercial
- permite avanzar mas rapido con menos miedo

Impacto esperado:

- mas velocidad para lanzar mejoras que afectan ingresos
- menos tiempo apagando incendios

## Roadmap Ejecutivo por Sprints

### Sprint 1. Integridad y base de venta

Objetivo:

- pasar de “feature visible” a “feature vendible sin ambiguedad”

Entregables:

- UI de guias consume `guides` + `guide_services`
- booking modal deja de depender de IDs legacy
- `guide_service_id` se vuelve obligatorio para guides
- se valida pertenencia entre `guide_id` y `guide_service_id`
- se persiste `guide_service_name`
- `lint` y `test` quedan en verde
- instrumentacion minima de eventos de fallback a WhatsApp

Resultado de negocio:

- ya no se vende una experiencia ambigua
- cada lead de guide entra con mejor calidad operativa

### Sprint 2. Operacion y control interno

Objetivo:

- convertir reservas de guias en requests visibles y gestionables

Entregables:

- `guide` soportado en internal requests
- `guide` soportado en status transitions
- timeline y notificaciones operativas para guides
- recepcion muestra guia, servicio, horario y contexto sin leer `notes`
- fallback por allowlist interna reducido progresivamente

Resultado de negocio:

- reservas operables desde el sistema
- menor dependencia de coordinacion manual dispersa

### Sprint 3. Confianza comercial y optimizacion de conversion

Objetivo:

- hacer que el sistema no solo reciba requests, sino que los convierta mejor

Entregables:

- emails especializados para guide
- medicion de tasas de fallback, confirmacion y error
- metadata y copy comercial ajustado por locale
- mejoras de UX en confirmacion y estados de siguiente paso
- decision explicita sobre legado editorial vs legado transaccional

Resultado de negocio:

- mas claridad para el usuario
- mejor conversion de request a reserva cerrada

## Plan de Ejecucion Completo

### Frente 1. QA y release readiness

Trabajos:

- corregir errores actuales de `lint`
- alinear tests con el contrato vigente de shuttle
- agregar tests para reservas `guide` validas e invalidas
- cubrir mismatch entre `guide_id` y `guide_service_id`

Definition of Done:

- CI local en verde
- errores de validacion cubiertos por test

### Frente 2. Arquitectura y dominio

Trabajos:

- consolidar source of truth de guides
- separar view model editorial de view model transaccional
- eliminar parseo de `specialties` como fuente de booking
- persistir snapshots operativos necesarios

Definition of Done:

- una reserva guide conserva contexto suficiente aunque cambie el catalogo

### Frente 3. Operacion interna

Trabajos:

- agregar `guide` a tipos internos y queries
- extender transiciones y auditoria
- registrar notificaciones por request kind
- revisar dependencias duras a San Pedro donde bloqueen expansion

Definition of Done:

- operaciones puede trabajar una reserva guide sin salir del panel

### Frente 4. UI / UX

Trabajos:

- mantener coherencia visual con tours y rutas
- explicitar “que sigue ahora” sin sonar a promesa falsa
- evitar que WhatsApp domine la accion principal
- mejorar estados de exito y error con lenguaje operativo claro

Definition of Done:

- el flujo se siente premium, local y confiable

### Frente 5. Monetizacion y go-to-market

Trabajos:

- definir KPI semanal por tipo de reserva
- medir origen de lead y salida por canal
- documentar SLA de contacto y confirmacion
- alinear catalogo con oferta realmente operable por partners

Definition of Done:

- ya es posible saber que parte del sistema genera ingreso y cual genera deuda

## Dependencias y Secuencia Recomendada

1. Primero cerrar integridad de datos y tests.
2. Luego cerrar operacion interna.
3. Despues especializar comunicaciones.
4. Finalmente optimizar conversion y narrativa comercial.

Motivo:

Sin datos confiables y requests visibles, cualquier mejora de UX o marketing acelera una deuda que el equipo aun no puede operar con consistencia.

## Riesgos Ejecutivos si No se Hace

- crecimiento de leads fuera del sistema sin trazabilidad
- aumento de trabajo manual por reserva
- confusion entre promesa comercial y capacidad operativa real
- degradacion de confianza de proveedores por procesos inconsistentes
- dificultad para escalar fuera de San Pedro

## Decisiones de PM Recomendadas Esta Semana

### Decision 1. `guide` debe ser request kind oficial

Recomendacion:

- aprobarlo como decision de dominio y no dejarlo como caso especial de `tour`

### Decision 2. `guide_service_id` debe ser obligatorio

Recomendacion:

- hacerlo requisito de booking interno desde ya

### Decision 3. WhatsApp sigue, pero como fallback medido

Recomendacion:

- no retirarlo en esta etapa
- medirlo y reducirlo sprint a sprint

### Decision 4. El legado de guias no debe seguir siendo fuente primaria de booking

Recomendacion:

- mantenerlo solo como apoyo editorial temporal

## KPIs Ejecutivos para Seguimiento Semanal

### KPIs de crecimiento y conversion

- solicitudes de guide creadas por semana
- porcentaje de solicitudes de guide creadas por flujo interno
- porcentaje de guias con servicios reales reservables
- tasa de fallback a WhatsApp
- tasa de confirmacion por tipo de reserva

### KPIs operativos

- tiempo desde request a primer contacto
- tiempo desde request a cambio de estado
- porcentaje de requests visibles en backoffice
- porcentaje de notificaciones fallidas

### KPIs de calidad

- `lint` status
- `test` status
- cantidad de errores de validacion por dominio
- cantidad de incidentes donde ops necesita resolver fuera del sistema

## Criterio de Exito de Esta Etapa

Esta etapa debe considerarse exitosa cuando:

- guides deja de ser una feature parcial y pasa a ser un flujo operable
- el equipo puede medir cuantas reservas se crean, cuantas se fugan y cuantas se cierran
- el producto mantiene la esencia visual y narrativa de Nómada Fantasma
- las mejoras tecnicas se traducen en mejor conversion y menor carga operativa

## Veredicto Ejecutivo

La mejor inversion inmediata no es agregar mas superficie visual ni mas destinos. La mejor inversion es cerrar el sistema de guias como unidad de negocio operable, medible y coherente con la marca.

Eso beneficia al proyecto porque:

- mejora la fiabilidad del producto
- reduce deuda acumulada
- prepara la operacion para escalar

Y beneficia la monetizacion porque:

- convierte mejor el interes en reservas reales
- reduce fuga de leads fuera del sistema
- aumenta la capacidad de cobrar comision sobre oferta realmente operable
