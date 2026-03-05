# Plan de Mejoras Incrementales - Nómada Fantasma

## 🎯 Filosofía: Pasos Pequeños y Seguros

Cada paso es:
- ✅ **Reversible**: Puedes volver atrás fácilmente
- ✅ **Testeable**: Verificable manualmente sin romper nada
- ✅ **Incremental**: Construye sobre lo que ya funciona
- ✅ **Bajo riesgo**: No cambia funcionalidad crítica existente

---

## FASE 1: Fortalecimiento de Seguridad (Semana 1-2)

### Paso 1.1: Centralizar Rate Limiting ⚡
**Objetivo**: Crear una utilidad reutilizable para rate limiting (preparación para Redis futuro)

**Riesgo**: ⚠️ Bajo - Solo refactor, no cambia comportamiento

**Archivos a crear**:
- `app/lib/rate-limit.ts` - Función centralizada

**Archivos a modificar**:
- `app/api/shuttles/reserve/route.ts`
- `app/api/reservations/route.ts`
- `app/api/emails/shuttle-confirmation/route.ts`

**Tiempo estimado**: 1-2 horas

**Cómo verificar**:
1. Hacer 5 reservas rápidas → Debe bloquear la 6ta
2. Esperar 10 minutos → Debe permitir nuevas reservas

---

### Paso 1.2: Añadir Logging Estructurado 📊
**Objetivo**: Mejor visibilidad de errores sin exponer datos sensibles

**Riesgo**: ⚠️ Muy bajo - Solo añade logs

**Archivos a crear**:
- `app/lib/logger.ts` - Logger con redacción automática

**Archivos a modificar**:
- Reemplazar `console.error` en APIs críticas

**Tiempo estimado**: 1 hora

**Cómo verificar**:
1. Provocar un error intencional
2. Verificar que logs no contengan emails/phones completos

---

### Paso 1.3: Validación de Variables de Entorno 🔐
**Objetivo**: Falla rápido si falta configuración crítica

**Riesgo**: ⚠️ Muy bajo - Solo validación al inicio

**Archivos a crear**:
- `app/lib/env.ts` - Validación con Zod

**Tiempo estimado**: 30 minutos

**Cómo verificar**:
1. Quitar temporalmente `RESEND_API_KEY`
2. Verificar que la app muestre error claro al iniciar

---

## FASE 2: Migración de Datos (Semana 2-3)

### Paso 2.1: Script de Migración de Rutas Mágicas 📦
**Objetivo**: Mover datos de `mocks/routes.ts` a Supabase `tours`

**Riesgo**: ⚠️ Medio - Requiere cuidado con datos existentes

**Estrategia**: 
1. Crear script que lee mocks y los inserta en Supabase
2. Script es **idempotente** (puede ejecutarse múltiples veces)
3. No modifica código de UI todavía

**Archivos a crear**:
- `scripts/migrate-routes-to-supabase.ts`

**Tiempo estimado**: 2-3 horas

**Cómo verificar**:
1. Ejecutar script
2. Verificar en Supabase Dashboard que `tours` tiene datos
3. Ejecutar script de nuevo → No debe duplicar

---

### Paso 2.2: Modo Híbrido (Mock + DB) 🔄
**Objetivo**: UI lee de Supabase, pero tiene fallback a mocks

**Riesgo**: ⚠️ Bajo - Fallback garantiza que nunca rompa

**Archivos a modificar**:
- `app/[locale]/rutas-magicas/components/FilteredRoutes.tsx`
- Crear `app/lib/tours/fetch-tours.ts`

**Tiempo estimado**: 2 horas

**Cómo verificar**:
1. Con DB funcionando → Muestra datos de Supabase
2. Desconectar DB temporalmente → Muestra mocks
3. UI sigue funcionando en ambos casos

---

### Paso 2.3: Eliminar Dependencia de Mocks 🗑️
**Objetivo**: Una vez verificado que DB funciona, quitar mocks

**Riesgo**: ⚠️ Medio - Solo hacer si Paso 2.2 funciona perfecto

**Archivos a modificar**:
- Remover `mocks/routes.ts` (o moverlo a `scripts/legacy/`)
- Actualizar imports

**Tiempo estimado**: 30 minutos

---

## FASE 3: Testing Básico (Semana 3-4)

### Paso 3.1: Setup de Testing 🧪
**Objetivo**: Infraestructura básica para tests

**Riesgo**: ⚠️ Muy bajo - Solo añade dependencias

**Comandos**:
```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom
```

**Archivos a crear**:
- `vitest.config.ts`
- `tests/setup.ts`

**Tiempo estimado**: 1 hora

---

### Paso 3.2: Tests de Validación Zod ✅
**Objetivo**: Verificar que schemas de validación funcionan

**Riesgo**: ⚠️ Muy bajo - Solo tests, no toca código de producción

**Archivos a crear**:
- `tests/validations.test.ts`

**Tiempo estimado**: 1-2 horas

**Cómo verificar**:
```bash
pnpm test
```

---

### Paso 3.3: Test E2E de Reserva Completa 🎯
**Objetivo**: Un solo test que verifica flujo completo de reserva

**Riesgo**: ⚠️ Bajo - Solo añade test

**Archivos a crear**:
- `tests/e2e/reservation-flow.test.ts`

**Tiempo estimado**: 2-3 horas

**Nota**: Usar base de datos de test o mocks para no afectar producción

---

## FASE 4: Panel Admin Básico (Semana 4-5)

### Paso 4.1: Página Admin Protegida (Solo Localhost) 🔒
**Objetivo**: Dashboard básico que solo funciona en desarrollo

**Riesgo**: ⚠️ Bajo - Protección por entorno

**Archivos a crear**:
- `app/[locale]/admin/page.tsx`
- `app/[locale]/admin/layout.tsx` (con verificación de entorno)

**Tiempo estimado**: 2 horas

**Cómo verificar**:
1. En desarrollo → Accesible
2. En producción → 404 o redirect

---

### Paso 4.2: Lista de Reservas (Solo Lectura) 📋
**Objetivo**: Ver todas las reservas en tabla

**Riesgo**: ⚠️ Bajo - Solo lectura, usa API existente

**Archivos a crear**:
- `app/[locale]/admin/reservations/page.tsx`
- `app/components/admin/ReservationsTable.tsx`

**Tiempo estimado**: 3-4 horas

**Cómo verificar**:
1. Ver lista de reservas
2. Filtrar por status/email
3. Ver detalles de cada reserva

---

### Paso 4.3: Actualizar Estado de Reserva ✏️
**Objetivo**: Cambiar status (pending → confirmed)

**Riesgo**: ⚠️ Medio - Modifica datos, pero usa API existente

**Archivos a modificar**:
- `app/components/admin/ReservationsTable.tsx` (añadir botones)
- Usar `PATCH /api/reservations` existente

**Tiempo estimado**: 2 horas

**Cómo verificar**:
1. Cambiar status de una reserva
2. Verificar que se actualiza en DB
3. Verificar que email se envía (si aplica)

---

## FASE 5: Mejoras de UX Incrementales (Semana 5-6)

### Paso 5.1: Loading States Mejorados ⏳
**Objetivo**: Skeletons más informativos

**Riesgo**: ⚠️ Muy bajo - Solo UI

**Archivos a modificar**:
- Componentes de reserva
- Componentes de rutas mágicas

**Tiempo estimado**: 2 horas

---

### Paso 5.2: Mensajes de Error Más Claros 💬
**Objetivo**: Errores traducidos y específicos

**Riesgo**: ⚠️ Muy bajo - Solo mejora UX

**Archivos a modificar**:
- `messages/es.json` y `messages/en.json`
- Componentes de formularios

**Tiempo estimado**: 1-2 horas

---

### Paso 5.3: Confirmación Visual de Reservas ✅
**Objetivo**: Toast/Modal de éxito más claro

**Riesgo**: ⚠️ Muy bajo - Solo UI

**Archivos a modificar**:
- `ShuttleBookingModal.tsx`
- `ReservationForm.tsx`

**Tiempo estimado**: 1 hora

---

## FASE 6: Preparación para Pagos (Semana 6-7)

### Paso 6.1: Añadir Campos de Pago en Schema 💳
**Objetivo**: Preparar DB para pagos (sin integrar gateway todavía)

**Riesgo**: ⚠️ Bajo - Solo añade columnas opcionales

**Archivos a crear**:
- `supabase/migrations/add_payment_fields.sql`

**Tiempo estimado**: 1 hora

**Nota**: Campos como `payment_status`, `payment_intent_id`, `amount_paid`

---

### Paso 6.2: Mock de Flujo de Pago (UI) 🎨
**Objetivo**: UI de "pagar" que no procesa realmente

**Riesgo**: ⚠️ Bajo - Solo UI, no toca dinero

**Archivos a crear**:
- `app/components/payment/MockPaymentForm.tsx`

**Tiempo estimado**: 2-3 horas

**Nota**: Esto permite diseñar UX antes de integrar Stripe

---

## 📋 Checklist de Seguridad para Cada Paso

Antes de hacer cualquier cambio:

- [ ] **Backup**: Commit actual en git
- [ ] **Branch**: Crear branch específico (`git checkout -b paso-X.Y`)
- [ ] **Test Local**: Verificar que funciona en desarrollo
- [ ] **Revisar**: Leer código relacionado antes de modificar
- [ ] **Pequeño**: Si el paso se vuelve grande, dividirlo más
- [ ] **Commit**: Commit frecuente con mensajes claros

---

## 🚨 Señales de Alerta

**Detente y revisa si**:
- Un paso toma más de 4 horas
- Necesitas modificar más de 5 archivos a la vez
- No estás seguro de cómo verificar que funciona
- Rompe algo que ya funcionaba

**En esos casos**:
1. Revertir cambios (`git reset --hard`)
2. Dividir el paso en pasos más pequeños
3. Pedir ayuda o revisar documentación

---

## 🎯 Priorización Recomendada

**Si tienes poco tiempo** (1-2 horas/semana):
- ✅ Paso 1.3 (Validación de ENV) - 30 min
- ✅ Paso 1.2 (Logging) - 1 hora
- ✅ Paso 5.2 (Mensajes de error) - 1 hora

**Si tienes tiempo moderado** (5-10 horas/semana):
- ✅ Fase 1 completa (Seguridad)
- ✅ Paso 2.1 (Script de migración)
- ✅ Paso 4.2 (Lista de reservas)

**Si tienes tiempo completo** (20+ horas/semana):
- ✅ Seguir orden secuencial
- ✅ Completar 2-3 fases por semana

---

## 📝 Notas Finales

- **No tengas prisa**: Mejor hacer 1 paso bien que 3 mal
- **Documenta**: Si algo no es obvio, añade comentarios
- **Celebra**: Cada paso completado es progreso real
- **Itera**: Si un paso no funciona, ajusta y continúa

---

**Última actualización**: $(date)
**Versión del plan**: 1.0
