# 🚀 Guía Rápida de Refactorización

## ⚡ Acciones Inmediatas (30 minutos)

### 1. Refactorizar Rate Limiting en `reservations/route.ts`

**Archivo**: `app/api/reservations/route.ts`

**Cambios**:
```typescript
// ELIMINAR líneas 34-56 (código duplicado)
const rateLimitStore = new Map<string, { count: number; start: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
// ... resto del código duplicado

// AÑADIR al inicio del archivo:
import { checkRateLimit, getClientIP } from '@/app/lib/rate-limit';

// REEMPLAZAR líneas 41-56 con:
const ip = getClientIP(request);
const rateLimitResult = checkRateLimit(ip);

if (!rateLimitResult.allowed) {
    return NextResponse.json(
        { 
            error: 'Demasiadas solicitudes. Intenta más tarde.',
            retryAfter: rateLimitResult.retryAfter 
        },
        { 
            status: 429,
            headers: {
                'Retry-After': rateLimitResult.retryAfter?.toString() || '600',
                'X-RateLimit-Limit': '5',
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': new Date(rateLimitResult.resetAt).toISOString(),
            }
        }
    );
}
```

**Tiempo**: 10 minutos  
**Riesgo**: ⚠️ Muy bajo

---

### 2. Refactorizar Rate Limiting en `emails/shuttle-confirmation/route.ts`

**Archivo**: `app/api/emails/shuttle-confirmation/route.ts`

**Cambios similares** al paso 1.

**Tiempo**: 10 minutos  
**Riesgo**: ⚠️ Muy bajo

---

### 3. Eliminar Archivo No Utilizado `i18n.ts`

**Archivo**: `i18n.ts` (raíz del proyecto)

**Verificación**:
- ✅ `next.config.ts` usa `createNextIntlPlugin()` que busca `i18n/request.ts`
- ✅ No hay imports de `i18n.ts` en el código
- ✅ `i18n/request.ts` es el archivo activo

**Acción**: Eliminar `i18n.ts`

**Tiempo**: 1 minuto  
**Riesgo**: ⚠️ Muy bajo

---

## 📋 Checklist de Verificación Post-Refactor

Después de hacer los cambios:

```bash
# 1. Verificar que compila
pnpm typecheck

# 2. Verificar que no hay errores de lint
pnpm lint

# 3. Probar que las APIs funcionan
# - Hacer una reserva de shuttle
# - Hacer una reserva general
# - Verificar que rate limiting funciona (6ta request debe fallar)
```

---

## 🎯 Resultado Esperado

Después de estos 3 pasos:

- ✅ **-60 líneas** de código duplicado eliminadas
- ✅ **2 archivos** usando utilidad centralizada de rate limiting
- ✅ **1 archivo** no utilizado eliminado
- ✅ **Código más mantenible** y preparado para Redis futuro

**Tiempo total**: ~30 minutos  
**Impacto**: Alto (elimina duplicación crítica)

---

## 📝 Notas

- Todos los cambios son **reversibles** (git)
- No cambian funcionalidad, solo estructura
- Puedes hacerlos uno por uno y probar entre cada cambio

---

**¿Listo para empezar?** → Ve a `ANALISIS_ARQUITECTURA.md` para ver el análisis completo.
