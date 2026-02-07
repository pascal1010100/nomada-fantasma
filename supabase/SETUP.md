# Configuración de Supabase

Guía paso a paso para configurar Supabase en el proyecto Nómada Fantasma.

---

## 1. Crear Cuenta y Proyecto en Supabase

### Paso 1: Registro
1. Ve a [supabase.com](https://supabase.com)
2. Click en "Start your project"
3. Sign up con GitHub (recomendado) o email

### Paso 2: Crear Nuevo Proyecto
1. Click en "New Project"
2. Configura:
   - **Name:** `nomada-fantasma`
   - **Database Password:** (genera una segura, guárdala)
   - **Region:** `South America (São Paulo)` (más cercano a Guatemala)
   - **Plan:** Free tier ✅

3. Click "Create new project"
4. Espera ~2 minutos mientras se provisiona

---

## 2. Obtener Credenciales

### En el Dashboard de Supabase:

1. Ve a **Settings** → **API**

2. Copia estas credenciales:

```bash
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://[tu-proyecto].supabase.co

# anon/public key (segura para uso en browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# service_role key (SOLO server-side, NUNCA en browser)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

---

## 3. Configurar Variables de Entorno

### Actualizar `.env.local`:

```bash
# Supabase (AGREGAR ESTAS LÍNEAS)
NEXT_PUBLIC_SUPABASE_URL=tu_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key_aqui

# Existentes (mantener)
GROQ_API_KEY=...
RESEND_API_KEY=...
```

**⚠️ IMPORTANTE:** 
- El archivo `.env.local` ya está en `.gitignore`
- **NUNCA** commits las keys al repositorio

---

## 4. Ejecutar Schema SQL

### Opción A: Desde el Dashboard (Recomendado)

1. En Supabase Dashboard → **SQL Editor**
2. Click en "+ New query"
3. Copia y pega el contenido completo de `supabase/schema.sql`
4. Click "Run" (▶️)
5. Verifica que se crearon las tablas en **Table Editor**

### Opción B: Desde CLI (Avanzado)

```bash
# Instalar Supabase CLI
brew install supabase/tap/supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref [tu-project-ref]

# Aplicar migrations
supabase db push
```

---

## 5. Verificar Instalación

### Test de Conexión:

```bash
# Desde la raíz del proyecto
npm run dev

# En otra terminal:
curl http://localhost:3000/api/reservations
```

**Respuesta esperada:**
```json
{
  "success": true,
  "reservations": [],
  "total": 0
}
```

---

## 6. Migrar Datos Existentes (Opcional)

Si tienes reservas en `data/reservations.json`:

```bash
# Ejecutar script de migración
npx tsx scripts/migrate-to-supabase.ts
```

**Este script:**
- Lee `data/reservations.json`
- Valida cada reserva
- Inserta en Supabase
- Crea backup automático

---

## 7. Explorar el Dashboard

### Table Editor
- Ver/editar datos directamente
- Filtros y búsqueda
- Export a CSV

### SQL Editor
- Ejecutar queries personalizadas
- Ver logs de queries

### Auth (Futuro)
- Cuando agregues login de admin
- Configurar providers (Google, GitHub, etc.)

### Storage (Futuro)
- Para imágenes de tours
- CDN integrado

---

## 8. Troubleshooting

### Error: "Missing Supabase environment variables"

**Solución:**
1. Verifica que `.env.local` tiene las 3 variables
2. Reinicia el servidor: `npm run dev`

### Error: RLS policy violation

**Causa:** Intentando operación no permitida

**Solución:** Las políticas RLS ya están configuradas correctamente en el schema

### Error: Connection timeout

**Solución:**
- Verifica que el proyecto de Supabase está activo (no pausado)
- Check región del proyecto (debería ser geográficamente cercano)

---

## 9. Próximos Pasos

Una vez configurado:

✅ Crear una reserva de prueba desde `/reservar`
✅ Verificar en Supabase Dashboard → Table Editor → `reservations`
✅ Confirmar que llegó el email

---

## Recursos Útiles

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase + Next.js](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
