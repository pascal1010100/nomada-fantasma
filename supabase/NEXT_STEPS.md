# Migración a Supabase - Nómada Fantasma

## ✅ Completado

### Infraestructura
- [x] Dependencias instaladas (`@supabase/supabase-js`, `zod`, `dotenv`, `tsx`)
- [x] Schema SQL creado con 4 tablas
- [x] Clientes de Supabase (browser y server)
- [x] TypeScript types generados
- [x] Validación con Zod implementada

### API Migration
- [x] `/api/reservations` migrado a Supabase
- [x] Validación de inputs con Zod
- [x] GET, POST, PATCH endpoints
- [x] Integración con email mantenida

### Scripts
- [x] Script de migración de datos (`scripts/migrate-to-supabase.ts`)
- [x] Guía de setup (`supabase/SETUP.md`)

---

## 🎯 Próximos Pasos REQUERIDOS

### 1. Configurar Supabase (URGENTE)

**Necesitas hacer esto AHORA para que funcione:**

1. **Crear cuenta en Supabase:**
   - Ve a https://supabase.com
   - Sign up gratis
   - Crea nuevo proyecto: "nomada-fantasma"
   - Región: South America (São Paulo)

2. **Obtener credenciales:**
   - Dashboard → Settings → API
   - Copia las 3 keys

3. **Actualizar `.env.local`:**
   ```bash
   # Reemplaza estos valores
   NEXT_PUBLIC_SUPABASE_URL=tu_url_real
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_real
   SUPABASE_SERVICE_ROLE_KEY=tu_service_key_real
   ```

4. **Ejecutar schema SQL:**
   - Dashboard → SQL Editor
   - Copia contenido de `supabase/schema.sql`
   - Click "Run"

5. **Verificar:**
   ```bash
   npm run dev
   # Ir a /reservar y crear una reserva de prueba
   ```

---

## 📋 Sigue la guía completa

Ver: `supabase/SETUP.md` para instrucciones detalladas paso a paso.

---

## ⚠️ Importante

- Sin configuración de Supabase, la app NO funcionará
- Las credenciales YA están en `.env.local` como placeholders
- Solo necesitas reemplazarlas con las reales
