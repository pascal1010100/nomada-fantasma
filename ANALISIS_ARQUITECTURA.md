# 🔍 Análisis Profundo de Arquitectura - Nómada Fantasma

**Fecha**: $(date)  
**Objetivo**: Identificar duplicación de código, código no utilizado, y problemas estructurales

---

## 📊 Resumen Ejecutivo

### Problemas Críticos Encontrados
- 🔴 **3 duplicaciones de rate limiting** (2 sin usar utilidad centralizada)
- 🔴 **2 funciones duplicadas para obtener tours** (`lib/tours/db.ts` vs `app/lib/supabase/tours.ts`)
- 🔴 **2 archivos de configuración i18n** (`i18n.ts` vs `i18n/request.ts`)
- 🟡 **Endpoint de email redundante** (`/api/emails/shuttle-confirmation` vs función en `lib/email.ts`)
- 🟡 **Extracción de IP duplicada** en 3 lugares
- 🟡 **Detección de locale duplicada** (lógica compleja en `reservations/route.ts`)

### Código No Utilizado
- ⚠️ Endpoint `/api/emails/shuttle-confirmation` (parece no usarse)
- ⚠️ Archivo `i18n.ts` (duplicado, probablemente no se usa)

---

## 🔴 PROBLEMAS CRÍTICOS

### 1. Rate Limiting Duplicado (3 implementaciones)

**Problema**: El código de rate limiting está duplicado en 3 lugares diferentes.

#### Estado Actual:
- ✅ `app/api/shuttles/reserve/route.ts` - **USA** `app/lib/rate-limit.ts` (correcto)
- ❌ `app/api/reservations/route.ts` - **NO USA** la utilidad (líneas 34-56)
- ❌ `app/api/emails/shuttle-confirmation/route.ts` - **NO USA** la utilidad (líneas 7-29)

#### Código Duplicado:
```typescript
// Este código está repetido en 2 archivos:
const rateLimitStore = new Map<string, { count: number; start: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const ipHeader = request.headers.get('x-forwarded-for') || '';
const ip = ipHeader.split(',')[0].trim() || 'unknown';
// ... resto de lógica duplicada
```

**Impacto**: 
- Mantenimiento difícil (cambios en 3 lugares)
- Inconsistencias potenciales
- No preparado para Redis futuro

**Solución**: Refactorizar ambos archivos para usar `app/lib/rate-limit.ts`

---

### 2. Extracción de IP Duplicada (3 lugares)

**Problema**: La lógica para extraer IP del request está duplicada.

#### Archivos afectados:
1. `app/api/reservations/route.ts` (líneas 41-42)
2. `app/api/emails/shuttle-confirmation/route.ts` (líneas 14-15)
3. `app/lib/rate-limit.ts` - Ya tiene `getClientIP()` ✅

**Código duplicado**:
```typescript
const ipHeader = request.headers.get('x-forwarded-for') || '';
const ip = ipHeader.split(',')[0].trim() || 'unknown';
```

**Solución**: Usar `getClientIP(request)` de `app/lib/rate-limit.ts` en todos los lugares

---

### 3. Funciones Duplicadas para Obtener Tours

**Problema**: Hay dos implementaciones diferentes para obtener tours de Supabase.

#### Archivos:
1. `lib/tours/db.ts` - Funciones: `fetchTourBySlug()`, `fetchToursByPueblo()`
2. `app/lib/supabase/tours.ts` - Funciones: `getTourBySlugFromDB()`, `getToursByPuebloFromDB()`

#### Diferencias:
- `lib/tours/db.ts`: Tiene fallback a mocks, mergea datos
- `app/lib/supabase/tours.ts`: Solo Supabase, mapea a tipo `Tour` UI

#### Uso actual:
- `lib/tours/db.ts` se usa en: `app/[locale]/rutas-magicas/lago-atitlan/[pueblo]/page.tsx`
- `app/lib/supabase/tours.ts` se usa en: `app/[locale]/rutas-magicas/components/ToursSection.tsx`

**Impacto**:
- Confusión sobre cuál usar
- Mantenimiento duplicado
- Posibles inconsistencias

**Solución**: Consolidar en una sola ubicación (recomendado: `app/lib/supabase/tours.ts`)

---

### 4. Configuración i18n Duplicada

**Problema**: Hay dos archivos de configuración de next-intl.

#### Archivos:
1. `i18n.ts` (raíz) - Usa `locale` como parámetro
2. `i18n/request.ts` - Usa `requestLocale` como parámetro

#### Análisis:
- `i18n.ts` parece ser el archivo antiguo
- `i18n/request.ts` es el formato recomendado por next-intl v4+
- Next.js busca `i18n/request.ts` por defecto

**Verificación necesaria**: Revisar `next.config.ts` para ver cuál se está usando

**Solución**: Eliminar `i18n.ts` si no se usa, o consolidar en uno solo

---

## 🟡 PROBLEMAS MEDIANOS

### 5. Endpoint de Email Redundante

**Problema**: Hay dos formas de enviar emails de shuttle.

#### Implementaciones:
1. **Función**: `app/lib/email.ts` → `sendShuttleConfirmationEmails()` ✅ (se usa en `shuttles/reserve/route.ts`)
2. **Endpoint**: `app/api/emails/shuttle-confirmation/route.ts` ❓ (no se encontró uso)

#### Análisis:
- El endpoint parece ser una implementación alternativa o de prueba
- Tiene mucho código de debug (`console.log` excesivo)
- No se encontró ningún `fetch('/api/emails/shuttle-confirmation')` en el código

**Recomendación**: 
- Si no se usa → Eliminar
- Si se planea usar → Documentar y limpiar código de debug

---

### 6. Detección de Locale Duplicada

**Problema**: Lógica compleja para detectar locale en `app/api/reservations/route.ts`.

#### Código (líneas 58-67):
```typescript
const url = new URL(request.url);
const urlLocale = url.pathname.split('/')[1];
const headerLocale = request.headers.get('x-locale');
const acceptLanguage = request.headers.get('accept-language');
const candidateLocale = headerLocale || acceptLanguage?.split(',')[0] || urlLocale || 'es';
const localeToken = candidateLocale.split('-')[0].toLowerCase();
const supportedLocales = ['es', 'en'] as const;
const locale = supportedLocales.includes(localeToken as (typeof supportedLocales)[number])
    ? localeToken
    : 'es';
```

**Problema**: Esta lógica está solo en un lugar, pero podría necesitarse en otros endpoints.

**Solución**: Crear utilidad `app/lib/locale.ts` con función `getLocaleFromRequest(request)`

---

### 7. Schema de Validación en Route

**Problema**: `ShuttleRequestSchema` está definido directamente en el route.

#### Archivo:
- `app/api/shuttles/reserve/route.ts` (líneas 8-18)

**Problema**: 
- No está centralizado con otros schemas
- Difícil de reutilizar
- No sigue el patrón de `app/lib/validations.ts`

**Solución**: Mover a `app/lib/validations.ts` como `ShuttleReservationSchema`

---

### 8. Console.log Excesivo

**Problema**: Muchos `console.log` sin estructura, especialmente en desarrollo.

#### Archivos con más console.log:
- `app/api/emails/shuttle-confirmation/route.ts` - 15+ console.log con prefijo `=== EMAIL DEBUG ===`
- `app/lib/email.ts` - Varios console.log para simulación
- `lib/tours/db.ts` - console.error sin estructura

**Impacto**:
- Logs desordenados en producción
- Difícil de filtrar/buscar
- No hay niveles (info, warn, error)

**Solución**: Implementar logger estructurado (ver Paso 1.2 del plan)

---

## 🟢 PROBLEMAS MENORES

### 9. Dos Carpetas `lib/`

**Estructura actual**:
```
/lib/              # Raíz del proyecto
  - tours/
  - utils.ts
/app/lib/          # Dentro de app/
  - supabase/
  - email.ts
  - validations.ts
```

**Problema**: Puede causar confusión sobre dónde poner código.

**Recomendación**: 
- `lib/` (raíz) → Utilidades compartidas, no específicas de Next.js
- `app/lib/` → Utilidades específicas de Next.js App Router

**Estado actual**: Parece estar bien organizado, solo documentar la convención

---

### 10. Validación de Zod Duplicada

**Problema**: La función `getIssueKey()` en `app/api/reservations/route.ts` (líneas 73-84) podría ser reutilizable.

**Código**:
```typescript
const getIssueKey = (issue: ZodIssue) => {
    const field = issue.path[0];
    if (field === 'tourId') return 'requiredTour';
    if (field === 'accommodationId') return 'requiredAccommodation';
    // ... más mapeos
};
```

**Solución**: Mover a `app/lib/validations.ts` como utilidad exportada

---

## ⚠️ CÓDIGO POTENCIALMENTE NO UTILIZADO

### 11. Endpoint `/api/emails/shuttle-confirmation`

**Archivo**: `app/api/emails/shuttle-confirmation/route.ts`

**Análisis**:
- No se encontró ningún `fetch()` a este endpoint
- La función `sendShuttleConfirmationEmails()` en `app/lib/email.ts` se usa directamente
- Parece ser código legacy o de prueba

**Acción**: Verificar si se usa, si no → eliminar

---

### 12. Archivo `i18n.ts` (raíz)

**Archivo**: `i18n.ts`

**Análisis**:
- Duplicado de `i18n/request.ts`
- Next.js v4+ busca `i18n/request.ts` por defecto
- Probablemente no se usa

**Acción**: Verificar `next.config.ts`, si no se referencia → eliminar

---

## 📋 PLAN DE REFACTORIZACIÓN RECOMENDADO

### Fase 1: Consolidar Rate Limiting (Prioridad Alta)
1. ✅ Ya hecho: `app/api/shuttles/reserve/route.ts`
2. ⏭️ Refactorizar: `app/api/reservations/route.ts`
3. ⏭️ Refactorizar: `app/api/emails/shuttle-confirmation/route.ts`

**Tiempo estimado**: 1-2 horas  
**Riesgo**: Bajo (solo refactor, no cambia funcionalidad)

---

### Fase 2: Consolidar Funciones de Tours (Prioridad Media)
1. Decidir cuál mantener: `lib/tours/db.ts` o `app/lib/supabase/tours.ts`
2. Migrar usos al elegido
3. Eliminar el otro archivo

**Tiempo estimado**: 2-3 horas  
**Riesgo**: Medio (requiere actualizar imports)

---

### Fase 3: Limpiar Configuración i18n (Prioridad Baja)
1. Verificar cuál se usa en `next.config.ts`
2. Eliminar el duplicado
3. Documentar

**Tiempo estimado**: 30 minutos  
**Riesgo**: Muy bajo

---

### Fase 4: Centralizar Utilidades (Prioridad Media)
1. Crear `app/lib/locale.ts` con `getLocaleFromRequest()`
2. Mover `ShuttleRequestSchema` a `app/lib/validations.ts`
3. Mover `getIssueKey()` a `app/lib/validations.ts`

**Tiempo estimado**: 1-2 horas  
**Riesgo**: Bajo

---

### Fase 5: Limpiar Código No Utilizado (Prioridad Baja)
1. Verificar uso de `/api/emails/shuttle-confirmation`
2. Eliminar si no se usa
3. Eliminar `i18n.ts` si no se usa

**Tiempo estimado**: 30 minutos  
**Riesgo**: Muy bajo (solo eliminar)

---

## 📊 Métricas de Duplicación

### Código Duplicado Encontrado:
- **Rate Limiting**: ~30 líneas × 2 archivos = 60 líneas duplicadas
- **Extracción IP**: ~2 líneas × 2 archivos = 4 líneas duplicadas
- **Funciones Tours**: ~70 líneas de lógica similar
- **Config i18n**: ~10 líneas duplicadas

**Total estimado**: ~144 líneas de código duplicado

### Impacto de Eliminación:
- ✅ Reducción de ~15% en código duplicado
- ✅ Facilita mantenimiento futuro
- ✅ Reduce bugs por inconsistencias
- ✅ Mejora preparación para escalado (Redis, etc.)

---

## 🎯 Recomendaciones Inmediatas

### Esta Semana (Alta Prioridad):
1. ✅ **Refactorizar rate limiting** en `reservations/route.ts` y `emails/shuttle-confirmation/route.ts`
2. ✅ **Usar `getClientIP()`** en lugar de código duplicado

### Próxima Semana (Media Prioridad):
3. ⏭️ **Consolidar funciones de tours** (decidir cuál mantener)
4. ⏭️ **Centralizar detección de locale**

### Cuando Tengas Tiempo (Baja Prioridad):
5. ⏭️ **Limpiar código no utilizado** (endpoint email, i18n.ts)
6. ⏭️ **Implementar logger estructurado** (reemplazar console.log)

---

## ✅ Checklist de Verificación

Antes de eliminar código, verificar:

- [ ] ¿Se importa en algún lugar? (`grep -r "import.*from.*archivo"`)
- [ ] ¿Se referencia en rutas? (`grep -r "/api/endpoint"`)
- [ ] ¿Está en `next.config.ts` o similar?
- [ ] ¿Hay tests que lo usen?
- [ ] ¿Está documentado como "en desarrollo"?

---

## 📝 Notas Finales

### Fortalezas del Proyecto:
- ✅ Arquitectura general muy buena
- ✅ Separación de responsabilidades clara
- ✅ TypeScript bien utilizado
- ✅ Validación con Zod implementada

### Áreas de Mejora:
- 🔧 Consolidar código duplicado
- 🔧 Centralizar utilidades comunes
- 🔧 Limpiar código legacy/no usado
- 🔧 Mejorar logging

**Conclusión**: El proyecto tiene una base sólida, pero se beneficiaría mucho de una ronda de refactorización para eliminar duplicaciones y consolidar utilidades. Las mejoras son incrementales y de bajo riesgo.

---

**Última actualización**: $(date)  
**Versión del análisis**: 1.0
