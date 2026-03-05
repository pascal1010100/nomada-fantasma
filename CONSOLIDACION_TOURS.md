# 📋 Plan de Consolidación de Funciones de Tours

## Estado Actual

### Archivos con funciones de tours:

1. **`lib/tours/db.ts`** ❓
   - `fetchTourBySlug(puebloSlug, tourSlug)` - Con fallback a mocks
   - `fetchToursByPueblo(puebloSlug)` - Mergea Supabase + mocks
   - **Uso**: No se encontró ningún import de este archivo

2. **`app/lib/supabase/tours.ts`** ✅ (ACTIVO)
   - `getTourBySlugFromDB(slug)` - Solo Supabase, busca por slug o ID
   - `getToursByPuebloFromDB(puebloSlug)` - Solo Supabase, mapea a tipo `Tour`
   - **Uso**: Se usa en 4 archivos:
     - `app/[locale]/rutas-magicas/lago-atitlan/[pueblo]/page.tsx`
     - `app/[locale]/rutas-magicas/lago-atitlan/[pueblo]/tours/[tour]/page.tsx`
     - `app/[locale]/reservas/confirmacion/page.tsx`
     - `app/[locale]/reservar/[id]/page.tsx`

## Análisis

### `lib/tours/db.ts` - NO SE USA
- ❌ No hay imports de este archivo en el código
- ✅ Tiene fallback a mocks (útil para desarrollo)
- ⚠️ Retorna tipos mezclados (SupabaseTour | MockTour)

### `app/lib/supabase/tours.ts` - EN USO
- ✅ Se usa activamente en 4 lugares
- ✅ Tipos bien definidos
- ✅ Mapea a tipo `Tour` UI consistente
- ❌ No tiene fallback a mocks

## Recomendación

### Opción 1: Eliminar `lib/tours/db.ts` (Simple)
**Pros**:
- Elimina código no utilizado
- Reduce confusión
- Mantiene código activo intacto

**Contras**:
- Pierde funcionalidad de fallback a mocks (pero no se usa)

**Acción**: Eliminar `lib/tours/db.ts` y `lib/tours/mapper.ts` si existe

### Opción 2: Añadir fallback a mocks a `app/lib/supabase/tours.ts` (Completo)
**Pros**:
- Mantiene funcionalidad útil
- Consolida en un solo lugar
- Mejora experiencia de desarrollo

**Contras**:
- Requiere modificar código activo
- Más complejo
- Necesita testing

**Acción**: 
1. Añadir parámetro opcional `fallbackToMocks?: boolean` a funciones
2. Implementar fallback similar a `lib/tours/db.ts`
3. Eliminar `lib/tours/db.ts`

## Decisión Recomendada

**Opción 1** - Eliminar código no utilizado

**Razón**:
- El código no se usa actualmente
- Si se necesita fallback a mocks en el futuro, se puede añadir fácilmente
- Menor riesgo de romper código activo
- Sigue el principio YAGNI (You Aren't Gonna Need It)

## Implementación

```bash
# 1. Verificar que no se usa
grep -r "from.*lib/tours/db" .
grep -r "fetchTourBySlug\|fetchToursByPueblo" .

# 2. Si no hay resultados, eliminar:
rm lib/tours/db.ts
# Y verificar si mapper.ts se usa
rm lib/tours/mapper.ts  # Si existe y no se usa
```

## Nota

Si en el futuro necesitas fallback a mocks, puedes añadirlo a `app/lib/supabase/tours.ts`:

```typescript
export async function getToursByPuebloFromDB(
  puebloSlug: string,
  options?: { fallbackToMocks?: boolean }
) {
  // ... código actual ...
  
  if (options?.fallbackToMocks && tours.length === 0) {
    // Fallback a mocks
  }
  
  return tours;
}
```
