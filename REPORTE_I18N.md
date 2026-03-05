# 🔍 Reporte Profundo: Problemas de Internacionalización (i18n)

**Fecha**: $(date)  
**Objetivo**: Identificar todas las partes de la aplicación que no respetan el cambio de idioma

---

## 📊 Resumen Ejecutivo

### Problemas Encontrados:
- 🔴 **3 APIs** con mensajes hardcodeados en español
- 🔴 **1 Schema de validación** con mensajes en español
- 🟡 **3 Componentes** con validaciones hardcodeadas en español
- 🟡 **2 Plantillas de email** con texto/formato hardcodeado en español
- 🟡 **1 Componente** con mensajes de error hardcodeados

**Total**: ~15 lugares que necesitan corrección

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. API `/api/shuttles/reserve` - Mensajes Hardcodeados

**Archivo**: `app/api/shuttles/reserve/route.ts`

#### Problemas encontrados:

**Línea 17**: Rate limiting
```typescript
error: 'Demasiadas solicitudes. Intenta más tarde.',
```
❌ **No usa traducciones**

**Línea 65**: Error de base de datos
```typescript
error: 'Error al registrar la reserva en la base de datos.',
```
❌ **No usa traducciones**

**Línea 91**: Mensaje de éxito
```typescript
message: 'Solicitud enviada exitosamente. Nos pondremos en contacto contigo pronto.',
```
❌ **No usa traducciones**

**Línea 99**: Error genérico
```typescript
error: 'Error interno del servidor'
```
❌ **No usa traducciones**

#### Solución:
- Detectar locale del request usando `getLocaleFromRequest()`
- Cargar traducciones con `getTranslations()`
- Usar keys de `messages/es.json` y `messages/en.json`

---

### 2. API `/api/reservations` - Mensajes Hardcodeados

**Archivo**: `app/api/reservations/route.ts`

#### Problemas encontrados:

**Línea 46**: Rate limiting
```typescript
error: 'Demasiadas solicitudes. Intenta más tarde.',
```
❌ **No usa traducciones** (aunque ya detecta locale)

**Línea 177**: Error de base de datos
```typescript
error: 'Error al crear la reserva en la base de datos'
```
❌ **No usa traducciones**

**Línea 306**: Error al obtener reservas
```typescript
error: 'Error al obtener las reservas'
```
❌ **No usa traducciones**

**Línea 373**: Error al actualizar reserva
```typescript
error: 'Error al actualizar la reserva'
```
❌ **No usa traducciones**

#### Nota:
- ✅ Ya detecta locale correctamente (línea 60)
- ✅ Ya carga traducciones para algunos mensajes
- ❌ Pero algunos mensajes de error no están traducidos

---

### 3. API `/api/emails/shuttle-confirmation` - Mensajes Hardcodeados

**Archivo**: `app/api/emails/shuttle-confirmation/route.ts`

#### Problemas encontrados:

**Línea 19**: Rate limiting
```typescript
error: 'Demasiadas solicitudes. Intenta más tarde.',
```
❌ **No usa traducciones**

**Línea 42**: Error de configuración
```typescript
error: 'Email service is not configured'
```
❌ **No usa traducciones** (además está en inglés)

**Línea 85**: Campos faltantes
```typescript
error: 'Missing required fields'
```
❌ **No usa traducciones** (en inglés)

**Línea 167**: Error al enviar email
```typescript
error: 'Failed to send confirmation email'
```
❌ **No usa traducciones** (en inglés)

**Línea 174**: Error interno
```typescript
error: 'Internal server error'
```
❌ **No usa traducciones** (en inglés)

---

### 4. Schema de Validación - Mensajes en Español

**Archivo**: `app/lib/validations.ts`

#### Problemas encontrados:

**Líneas 128-136**: `ShuttleRequestSchema`
```typescript
customerName: z.string().min(2, 'El nombre es muy corto'),
customerEmail: z.string().email('Email inválido'),
routeOrigin: z.string().min(1, 'El origen es requerido'),
routeDestination: z.string().min(1, 'El destino es requerido'),
date: z.string().min(1, 'La fecha es requerida'),
time: z.string().min(1, 'La hora es requerida'),
passengers: z.number().int().min(1, 'Debe haber al menos 1 pasajero'),
pickupLocation: z.string().min(5, 'Por favor indica un lugar de recogida claro'),
```
❌ **Todos los mensajes están en español**

#### Problema adicional:
- `CreateReservationSchema` (líneas 12-13) tiene mensajes en **inglés**:
  ```typescript
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  ```
  ❌ **Inconsistente** - algunos en inglés, otros en español

#### Solución:
- Los schemas de Zod no pueden usar traducciones directamente
- Necesitamos mapear errores después de la validación
- O usar una función que retorne el mensaje según locale

---

## 🟡 PROBLEMAS MEDIANOS

### 5. Componente `ShuttleBookingModal` - Validaciones Hardcodeadas

**Archivo**: `app/[locale]/shuttles/components/ShuttleBookingModal.tsx`

#### Problemas encontrados:

**Líneas 69-71**: Validaciones
```typescript
if (!name.trim() || name.trim().length < 2) return 'Por favor ingresa tu nombre';
if (!email || !validateEmail(email)) return 'Ingresa un correo válido';
if (!date) return 'Selecciona una fecha';
```
❌ **Mensajes en español hardcodeados**

#### Nota:
- ✅ El componente usa `useTranslations('Shuttles')` en otras partes
- ❌ Pero las validaciones del formulario no usan traducciones

---

### 6. Componente `ReservarClient` - Mensajes de Error Hardcodeados

**Archivo**: `app/[locale]/reservar/ReservarClient.tsx`

#### Problemas encontrados:

**Línea 209**: Error genérico
```typescript
'Error al enviar la solicitud'
```
❌ **No usa traducciones**

**Línea 217**: Error genérico
```typescript
'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo.'
```
❌ **No usa traducciones**

**Línea 780**: Mensaje de éxito
```typescript
<h2 className="text-3xl font-bold mb-2">¡Solicitud enviada con éxito!</h2>
<p className="text-muted-foreground">Hemos recibido tu solicitud de viaje.</p>
```
❌ **Texto hardcodeado en español**

#### Nota:
- El componente es muy grande (835 líneas)
- Usa traducciones en algunas partes pero no en todas

---

### 7. Componente `BookingModal` - Validaciones Hardcodeadas

**Archivo**: `app/[locale]/rutas-magicas/components/BookingModal.tsx`

#### Problemas encontrados:

**Líneas 51-54**: Validaciones
```typescript
newErrors.name = 'El nombre es requerido';
// ...
newErrors.name = 'El nombre debe tener al menos 2 caracteres';
```
❌ **Mensajes en español hardcodeados**

---

### 8. Plantillas de Email - Texto y Formato Hardcodeado

#### 8.1 `ShuttleConfirmationEmail.tsx`

**Archivo**: `app/components/emails/ShuttleConfirmationEmail.tsx`

**Problema línea 28**: Formato de fecha
```typescript
return date.toLocaleDateString('es-ES', {
```
❌ **Locale hardcodeado a 'es-ES'**

**Problema**: Todo el contenido del email está en español hardcodeado
- Títulos, textos, botones, etc.

#### 8.2 `ShuttleAdminNotification.tsx`

**Archivo**: `app/components/emails/ShuttleAdminNotification.tsx`

**Problema línea 30**: Formato de fecha
```typescript
return date.toLocaleDateString('es-ES', {
```
❌ **Locale hardcodeado a 'es-ES'**

**Problema línea 223**: Texto hardcodeado
```typescript
Por favor responder al cliente dentro de las próximas 24 horas
```
❌ **Texto en español hardcodeado**

---

## 📋 Checklist de Correcciones Necesarias

### APIs (Prioridad Alta)
- [ ] `app/api/shuttles/reserve/route.ts` - 4 mensajes
- [ ] `app/api/reservations/route.ts` - 4 mensajes (ya detecta locale)
- [ ] `app/api/emails/shuttle-confirmation/route.ts` - 5 mensajes

### Validaciones (Prioridad Alta)
- [ ] `app/lib/validations.ts` - `ShuttleRequestSchema` (8 mensajes)
- [ ] `app/lib/validations.ts` - `CreateReservationSchema` (inconsistencia ES/EN)

### Componentes (Prioridad Media)
- [ ] `app/[locale]/shuttles/components/ShuttleBookingModal.tsx` - 3 validaciones
- [ ] `app/[locale]/reservar/ReservarClient.tsx` - 3 mensajes
- [ ] `app/[locale]/rutas-magicas/components/BookingModal.tsx` - 2 validaciones

### Emails (Prioridad Media)
- [ ] `app/components/emails/ShuttleConfirmationEmail.tsx` - formato fecha + contenido
- [ ] `app/components/emails/ShuttleAdminNotification.tsx` - formato fecha + texto

---

## 🛠️ Estrategia de Solución

### Para APIs:
1. Usar `getLocaleFromRequest()` (ya creado)
2. Cargar traducciones con `getTranslations({ locale, namespace: 'ApiErrors' })`
3. Crear namespace `ApiErrors` en `messages/es.json` y `messages/en.json`

### Para Validaciones Zod:
1. Crear función helper que retorne mensaje según locale
2. O mapear errores después de validación usando traducciones
3. Mantener schemas sin mensajes, añadir traducciones en el mapeo

### Para Componentes:
1. Asegurar que todos usen `useTranslations()`
2. Mover mensajes hardcodeados a archivos de traducción
3. Verificar que todos los textos visibles usen `t()`

### Para Emails:
1. Pasar `locale` como prop a los componentes de email
2. Usar `locale` en `toLocaleDateString()`
3. Crear versiones traducidas del contenido o usar plantillas dinámicas

---

## 📝 Archivos de Traducción a Crear/Actualizar

### Nuevos Namespaces Necesarios:

1. **`ApiErrors`** (nuevo)
   ```json
   {
     "rateLimitExceeded": "Demasiadas solicitudes. Intenta más tarde.",
     "databaseError": "Error al registrar la reserva en la base de datos.",
     "successMessage": "Solicitud enviada exitosamente. Nos pondremos en contacto contigo pronto.",
     "internalError": "Error interno del servidor",
     "emailNotConfigured": "El servicio de email no está configurado",
     "missingFields": "Faltan campos requeridos",
     "emailSendFailed": "Error al enviar el email de confirmación"
   }
   ```

2. **`ValidationErrors`** (nuevo)
   ```json
   {
     "nameTooShort": "El nombre es muy corto",
     "invalidEmail": "Email inválido",
     "originRequired": "El origen es requerido",
     "destinationRequired": "El destino es requerido",
     "dateRequired": "La fecha es requerida",
     "timeRequired": "La hora es requerida",
     "minPassengers": "Debe haber al menos 1 pasajero",
     "pickupLocationRequired": "Por favor indica un lugar de recogida claro"
   }
   ```

3. **Actualizar `Shuttles.modal`** (ya existe, verificar cobertura)

4. **Actualizar `ReservationForm`** (ya existe, verificar cobertura)

---

## 🎯 Plan de Implementación Recomendado

### Fase 1: APIs (2-3 horas)
1. Crear namespace `ApiErrors` en ambos idiomas
2. Refactorizar `app/api/shuttles/reserve/route.ts`
3. Refactorizar `app/api/reservations/route.ts` (completar lo que falta)
4. Refactorizar `app/api/emails/shuttle-confirmation/route.ts`

### Fase 2: Validaciones (1-2 horas)
1. Crear namespace `ValidationErrors`
2. Crear función helper para mapear errores Zod a traducciones
3. Actualizar `ShuttleRequestSchema` para usar helper
4. Estandarizar `CreateReservationSchema` (todo en inglés o todo traducible)

### Fase 3: Componentes (2-3 horas)
1. Actualizar `ShuttleBookingModal.tsx`
2. Actualizar `ReservarClient.tsx`
3. Actualizar `BookingModal.tsx`

### Fase 4: Emails (1-2 horas)
1. Modificar componentes de email para aceptar `locale`
2. Actualizar llamadas para pasar `locale`
3. Usar `locale` en formateo de fechas
4. Traducir contenido hardcodeado

**Tiempo total estimado**: 6-10 horas

---

## ✅ Verificación Post-Implementación

Después de hacer los cambios, verificar:

1. **Cambiar idioma en la UI** → Todos los textos cambian
2. **Hacer reserva en español** → Mensajes en español
3. **Hacer reserva en inglés** → Mensajes en inglés
4. **Errores de validación** → Aparecen en el idioma correcto
5. **Emails recibidos** → Están en el idioma del usuario
6. **Errores de API** → Respuestas en el idioma correcto

---

## 📊 Impacto

### Antes:
- ❌ ~15 lugares con texto hardcodeado
- ❌ Experiencia inconsistente para usuarios en inglés
- ❌ Errores siempre en español

### Después:
- ✅ 100% de textos traducibles
- ✅ Experiencia consistente en ambos idiomas
- ✅ Errores y mensajes en el idioma del usuario

---

**Última actualización**: $(date)  
**Versión del reporte**: 1.0
