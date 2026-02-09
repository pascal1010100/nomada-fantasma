# Configuración de Resend para Nómada Fantasma

## 📧 Pasos para configurar el sistema de emails

### 1. Crear cuenta en Resend
1. Ve a [resend.com](https://resend.com)
2. Crea una cuenta y verifica tu email
3. Obtén tu API Key desde el dashboard

### 2. Configurar dominio de envío
1. En el dashboard de Resend, añade tu dominio: `nomadafantasma.com`
2. Sigue los pasos de verificación DNS (registros TXT, CNAME, etc.)
3. Espera la verificación (puede tomar hasta 24 horas)

### 3. Configurar variables de entorno
Crea tu archivo `.env.local` basado en `.env.example`:

```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus valores reales:
RESEND_API_KEY=re_your_actual_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Probar el sistema
Una vez configurado, el sistema de emails funcionará automáticamente cuando:

- Un cliente complete el formulario de reserva de shuttle
- Se enviarán dos emails:
  - ✅ Confirmación al cliente con detalles de su solicitud
  - 📊 Notificación al admin con información para procesar la reserva

## 🎯 Características implementadas

### Templates de Email
- **ShuttleConfirmationEmail**: Email profesional para el cliente
- **ShuttleAdminNotification**: Notificación detallada para el equipo

### Endpoint API
- `/api/emails/shuttle-confirmation`: Procesa y envía ambos emails

### Integración
- Integrado en el formulario de reservas existente
- No bloquea el proceso si el email falla
- Manejo de errores robusto

## 📋 Flujo completo

1. **Cliente** completa formulario de reserva
2. **Sistema** guarda en base de datos (Supabase)
3. **Sistema** envía email de confirmación al cliente
4. **Sistema** envía notificación al admin
5. **Equipo** recibe email y procesa reserva manualmente
6. **Equipo** responde directamente al cliente con confirmación final

## 🔧 Troubleshooting

### Emails no llegan
- Verifica que `RESEND_API_KEY` sea correcta
- Confirma que el dominio esté verificado en Resend
- Revisa logs de la consola del navegador

### Error 500 en API
- Verifica variables de entorno
- Revisa logs de Vercel/Next.js
- Confirma que los templates de email compilen correctamente

### Dominio no verificado
- Paciencia: la verificación DNS puede tomar hasta 24 horas
- Verifica que todos los registros DNS estén configurados correctamente
- Contacta soporte de Resend si persiste

## 🚀 Siguientes pasos

Una vez que Resend esté funcionando:
1. Monitorea las entregas de email
2. Considera añadir analytics de apertura/clics
3. Implementa templates para tours y otros servicios
4. Añade sistema de recordatorios automáticos
