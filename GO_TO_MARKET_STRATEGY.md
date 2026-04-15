# 🚀 ESTRATEGIA GO-TO-MARKET: NÓMADA FANTASMA
## Plan de Acción para Monetización - Proyecto Turístico Lago Atitlán

**Documento Estratégico** | **Versión 1.0** | **Abril 2026**

---

## 📊 DIAGNÓSTICO ACTUAL

### Estado del Producto
```
ETAPA: MVP → BETA (Fase de Validación de Mercado)
- ✅ Plataforma técnica lista (Next.js, Supabase, Resend email)
- ✅ Core features: Reservas de shuttles funcionales
- ✅ Sistema de rutas mágicas con estructura de datos
- ⚠️  Datos de tours parcialmente en mocks (requiere consolidación DB)
- ⚠️  Sin partnerships activos con proveedores
- ⚠️  Sin material de marketing (stickers, flyers, branding)
- ⚠️  No hay tráfico/usuarios reales generando ingresos
```

### Mercado Objetivo
- **Geografía**: Lago de Atitlán, Guatemala (Panajachel, San Pedro, Santa Catarina, Santiago, Chichicastenango)
- **Segmento 1**: Viajeros independientes (backpackers, mochileros) - Edad 25-45
- **Segmento 2**: Tours organizados por agencias - B2B
- **Segmento 3**: Alojamientos locales (hostales, hotels) - Referidos
- **Demanda**: ALTA - 150k+ turistas/año en Lago Atitlán

### Puntos Fuertes
- Plataforma multilingüe (ES/EN) + Chat IA
- UX/DX moderna y profesional
- Rate limiting + seguridad implementada
- Validaciones robustas
- Base de datos bien estructurada

### Bloqueadores Actuales
- Cero proveedores activos en sistema
- Sin inventario de tours verificados
- Sin proceso de onboarding de partners
- Sin material físico/digital para promoción
- Cero tráfico orgánico/pago

---

## 🎯 OBJETIVOS ESTRATÉGICOS

### Meta 12 Meses
```
Alcanzar $5,000 USD/mes en ingresos recurrentes
= 100-150 reservas promedio/mes 
= 15-20% comisión de tours/shuttles
```

### Hitos Críticos
| Hito | Timeline | Meta |
|------|----------|------|
| **Fase 1**: Consolidar DB + Onboard 10 proveedores | Semana 1-4 | 50 tours activos en DB |
| **Fase 2**: Lanzar material marketing | Semana 5-8 | 5k impresiones, 3 agencias interested |
| **Fase 3**: Primeras reservas pagadas | Semana 9-12 | 50 reservas de prueba |
| **Fase 4**: Escalar partnerships | Semana 13-24 | 30+ proveedores, 500+ reservas/mes |
| **Fase 5**: Monetización punto de inflexión | Mes 12 | $5k/mes estimado |

---

## 📋 FASE 1: CONSOLIDACIÓN DE OFERTA (Semana 1-4)

### 1.1 Auditoría y Consolidación de Base de Datos

**Responsable**: Tú (producto/técnico)

**Tareas**:
- [ ] **Tarea 1.1.1**: Revisar archivo `supabase/schema.sql`
  - Verificar tabla `tours` con estructura completa
  - Campos necesarios: id, slug, nombre_es, nombre_en, descripción, precio, capacidad, duración, ubicación
  
- [ ] **Tarea 1.1.2**: Migrar datos de mocks a Supabase
  - Usar script `scripts/migrate-routes-to-supabase.ts` (ya existe)
  - Validar que no hay duplicados en DB
  - Endpoint: `app/api/internal/tours/sync` para sincronizar si es necesario
  
- [ ] **Tarea 1.1.3**: Estructurar tabla de `providers` (proveedores)
  - Campos: id, nombre, email, teléfono, pueblo, categoría (tour guide, accommodation, artisan), comisión_porcentaje, estado (active/pending/inactive)
  - Crear migration SQL

- [ ] **Tarea 1.1.4**: Crear tabla de `partnerships` (alianzas)
  - Campos: id, provider_id, tour_id, estado, vigencia_desde, vigencia_hasta, comisión_custom
  
**Output Esperado**:
- ✅ 50+ tours activos en Supabase con datos verificados
- ✅ Tabla de providers lista para onboarding
- ✅ Link tours ↔ providers establecido

---

### 1.2 Estrategia de Proveedores

**Responsable**: Tú (como PM)

#### SEGMENTACIÓN DE PROVEEDORES

```
TIER 1: HIGH PRIORITY (Impacto Inmediato)
├─ Tour Guides Freelancers (10-15 personas)
│  └─ Contacto: Recomendaciones, Facebook groups, Airbnb guides
│  └─ Comisión: 15-20% por reserva
│  └─ Categoría: TOUR GUIDES
│
├─ Hostales/Alojamientos (5-8 establecimientos)
│  └─ Contacto: Booking.com, Hostelworld, Google Maps
│  └─ Comisión: 10-15% por referido (affiliate)
│  └─ Categoría: ACCOMMODATION
│
└─ Agencias Locales (3-5 agencias)
   └─ Contacto: Tourism boards, TripAdvisor authorities
   └─ Comisión: Negociada por volumen
   └─ Categoría: AGENCIES

TIER 2: MEDIUM PRIORITY (Escalabilidad)
├─ Artesanos/Tiendas (regalo souvenirs)
├─ Restaurantes/Cafés
├─ Weaving Workshops
└─ Photography Tours

TIER 3: FUTURE (Expansión)
├─ Spa/Wellness
├─ Adventure Activities
└─ Day trips fuera de Lago
```

#### TÁCTICAS DE CONTACTO

**Canales de Contacto**:
1. **Facebook/WhatsApp** (90% de guides en Lago Atitlán)
   - Crear grupo: "Nómada Fantasma - Proveedores"
   - Publicar video de explicación en español
   
2. **Email** (profesionales)
   - Usar plantilla personalizada
   - Subject: "Monetiza tus tours/servicios con Nómada Fantasma"
   
3. **In-person** (reuniones)
   - Visitar Panajachel, San Pedro, Santa Catarina
   - Demo física + material impreso
   
4. **Referidos** (networking)
   - Pedir a primeros clientes que recomienden

**Plantilla Email (TRADUCIR AL ESPAÑOL)**:
```
Asunto: 🌄 Gana dinero extra con Nómada Fantasma | Tours Lago Atitlán

Hola [NOMBRE],

Soy [TU NOMBRE], PM de Nómada Fantasma - una plataforma de reservas 
de tours para el Lago de Atitlán con +5k visitas/mes.

Te contacto porque vimos que haces tours en [PUEBLO] y queremos 
ayudarte a vender más. Ofrecemos:

✅ Plataforma gratis (no hay comisión hasta primera venta)
✅ Comisión justa: 15-20% por reserva (TÚ controlas precios)
✅ Promoción en español e inglés
✅ Herramientas: Fotos, descripciones, calendario
✅ Pago automático (Stripe, bank transfer)

¿Podemos hacer una demo por WhatsApp/Zoom? [LINK CALENDARIO]

¡Saludos!
[TU NOMBRE]
```

---

### 1.3 Onboarding de Proveedores

**Responsable**: Tú (se puede automatizar después)

#### FLUJO DE ONBOARDING

```
PASO 1: CONTACTO INICIAL (Day 1)
└─ Enviar email/mensaje + link demo
└─ Respuesta esperada: 24-48 horas

PASO 2: DEMO (Day 2-3)
└─ Call Zoom 15-20 minutos
└─ Mostrar: Plataforma, cómo funciona, comisiones, ejemplos
└─ Resolver dudas

PASO 3: CREACIÓN DE CUENTA (Day 4)
└─ Enviar link de registro provider
└─ Campos a llenar: Nombre, email, teléfono, pueblo, bio
└─ Foto de perfil + foto thumbnail de tour

PASO 4: VERIFICACIÓN (Day 5)
└─ Tú validas email/teléfono
└─ Apruebas perfil (cambiar estado a "active")
└─ Notificación: "¡Bienvenido a Nómada Fantasma!"

PASO 5: LANZAMIENTO DE TOUR (Day 6-7)
└─ Provider agrega su primer tour
└─ Campos: Nombre, descripción, precio, cantidad de lugares, fotos
└─ Tú revisas y publicas en la plataforma
└─ Lanzamiento con promoción en redes

PASO 6: PRIMERAS RESERVAS (Day 8+)
└─ Cuando haya reserva → email automático + pago procesado
```

#### CHECKLIST TÉCNICO (Tareas de Dev)

- [ ] **Crear panel de provider** (webapp simple o admin dashboard)
  - URL: `/provider/dashboard`
  - Login con email/contraseña (o Google OAuth)
  - Campos editables: bio, fotos, banco para pagos
  
- [ ] **Crear formulario de agregar tours**
  - Campos: nombre, descripción (ES/EN), precio, capacidad, duración, horarios disponibles
  - Upload de fotos (máx 5)
  - Validación: precio > 0, capacidad > 0
  
- [ ] **Crear tabla de reservas para provider**
  - Vista: Reservas recibidas, estado, ingresos
  - Acción: Confirmar/rechazar reserva
  
- [ ] **Crear notificación por email** cuando provider recibe reserva nueva
  - Template: Detalles cliente, número de persona, monto ganado

**Timeline**: 1-1.5 semanas de desarrollo

---

### 1.4 Primeros Proveedores Target

**Contactar en ORDEN PRIORITARIO**:

| Semana | # Proveedores | Tipo | Acción |
|--------|---------------|------|--------|
| S1 | 3 | Tour Guides locales (referidos) | In-person + WhatsApp |
| S2 | 5 | Hostales Panajachel | Email + 1 reunión |
| S2 | 4 | Guides independientes | Facebook + WhatsApp |
| S3 | 3 | Agencias pequeñas | Email profesional |
| S4 | 5+ | Más guides por referido | Bola de nieve |

**Meta S4**: 10+ proveedores activos con al menos 1 tour publicado cada uno

---

## 🎨 FASE 2: MATERIAL DE MARKETING (Semana 5-8)

### 2.1 Identidad Visual y Branding

**Componentes a crear**:

#### 2.1.1 Logo + Colores
- **Estado**: ¿Ya existe logo? Si no, necesita diseño
- **Recomendación**: Contratar diseñador en Fiverr ($50-100)
- **Elementos**: Símbolo que represente "fantasma" + "ruta mágica" + viajes
- **Paleta**: Colores Lago Atitlán (azules, verdes, magentas de tradición)

#### 2.1.2 Assets Digitales
```
✅ Logotipo (PNG, SVG, favicon)
✅ Tarjeta de presentación digital (PDF)
✅ Presentación Canva (15-20 diapositivas para demos)
✅ Mockups de la app (para redes y presentaciones)
```

---

### 2.2 Material Impreso

#### 2.2.1 FLYERS (Volantes)

**Especificaciones**:
- Tamaño: A5 (14.8x21 cm) - Económico de imprimir
- Cantidad: 2,000 unidades
- Costo estimado: $80-120 USD (imprenta local Guatemala)
- Tiempo: 3-5 días

**Diseño 1: PARA VIAJEROS** (Backpackers/Turistas)
```
┌─────────────────────────────┐
│  NÓMADA FANTASMA 👻         │
│                             │
│  Tours Mágicos en Atitlán   │
│  🗺️ Descubre pueblos        │
│  🏔️ Experiencias auténticas │
│  💰 Desde Q50 per person    │
│                             │
│  nomada-fantasma.com        │
│  WhatsApp: +502 XXXX XXXX   │
│                             │
│  [QR CODE: Link WhatsApp]   │
│                             │
│  "Vive la magia" ✨         │
└─────────────────────────────┘
```

**Diseño 2: PARA PROVEEDORES** (Guides, Hostales)
```
┌─────────────────────────────┐
│  ¡GANA DINERO! 💵           │
│                             │
│  Vende tus tours y           │
│  servicios en Nómada         │
│  Fantasma                    │
│                             │
│  ✅ Comisión 15-20%         │
│  ✅ 0% setup fee            │
│  ✅ +5k turistas potenciales│
│                             │
│  providers.nomada-fantasma  │
│  [QR CODE]                  │
│                             │
│  Contacta: [EMAIL]          │
└─────────────────────────────┘
```

**Distribución**:
- 1,000 en hostales/tours operators
- 800 en puntos turísticos (ATMs, info centers, tour offices)
- 200 reserva para eventos

#### 2.2.2 STICKERS

**Especificaciones**:
- Tamaño: 5x5 cm (cute pero visible)
- Material: Vinilo resistente al agua (laptop, botella)
- Cantidad: 1,000 unidades
- Costo estimado: $40-60 USD
- Diseño: Logo minimalista + "Nómada Fantasma" + "nomada-fantasma.com"

**Distribución**:
- 200 en parques, plazas (pegar en vitrinas con permiso)
- 500 stock para hacer trading (dar a clientes, guides)
- 300 eventos/ferias

**Proveedor sugerido**: Printful, Sticker Mule, o imprenta local

#### 2.2.3 TARJETAS DE PRESENTACIÓN

**Cantidad**: 500 unidades
**Costo**: $20-30 USD
**Dados por**: Tú a providers, agencias, en networking

```
FRENTE:
┌────────────────────────────┐
│  Nómada Fantasma           │
│  Reservas de Tours         │
│  Turismo Lago Atitlán      │
│                            │
│  nomada-fantasma.com       │
│  WhatsApp: +502 XXXX XXXX  │
│  Email: contact@nomada...  │
└────────────────────────────┘

REVERSO:
[QR a /provider o a tour popular]
"Descubre la magia de Atitlán"
```

---

### 2.3 Material Digital

#### 2.3.1 Redes Sociales

Crear cuentas en:
- Instagram (@nomada.fantasma)
- Facebook (Nómada Fantasma)
- TikTok (@nomadafantasma)
- WhatsApp Business (chatbot básico)

**Contenido Template** (Crear calendario):

**Semana 1: Lanzamiento** (5 posts)
- Post 1: Teaser "Nómada Fantasma está aquí" [Clip video mystical]
- Post 2: "¿Qué es Nómada Fantasma?" [Carousel 5 slides]
- Post 3: "Meet the Pueblos" - San Pedro [Tour photos + prices]
- Post 4: "Meet the Pueblos" - Panajachel [Tour photos + prices]
- Post 5: "Primeros tours disponibles - Book now!" [CTA]

**Semana 2: Engagement** (5 posts)
- Post 1: Testimonial fake/staging (si necesitas) o user generated
- Post 2: "Guía de viajero: Qué ver en Atitlán"
- Post 3: Provider spotlight - "Meet Juan, tour guide"
- Post 4: Comparativa: Versus otros apps similar
- Post 5: "¿Buscas aventura?" [Story/Reel]

#### 2.3.2 Presentación Interactiva (Canva)

Crear deck para presentar a investors/partners:
- Slide 1: Portada
- Slide 2: Problema (turismo desorganizado en Atitlán)
- Slide 3: Solución (Nómada Fantasma)
- Slide 4: Mercado size (tourism market data)
- Slide 5: Negocio (3 revenue streams)
- Slide 6: Tracción (primeras reservas, partners)
- Slide 7: Ask (dinero/partnerships necesarios)

---

### 2.4 Email Marketing

**Herramienta**: Usar Resend (ya integrado) o Mailchimp free tier

**Listas**:
1. **Providers** - Actualizaciones, tips, promociones de referido
2. **Customers** - Newsletters, nuevos tours, ofertas
3. **Leads** - Newsletters de educación (SEO, email capture)

**Secuencia de emails (Automation)**:

```
EMAIL 1 (Day 0 - Cliente nuevo): "Bienvenido a Nómada Fantasma"
├─ Presentación
├─ Top 3 tours más populares
├─ Link para explorar más

EMAIL 2 (Day 2): "Completa tu perfil"
├─ Por qué es importante
├─ Link a editar preferencias

EMAIL 3 (Day 5): "Recomendaciones personalizadas"
├─ Tours según su interés declarado
├─ Ofertas limitadas

EMAIL 4 (Day 10): "Testimonios de clientes"
├─ Success stories
├─ Ratings/reviews

EMAIL 5 (Day 15): "Booking importante - Descuento"
├─ 10% off en próxima reserva
├─ Válido por 7 días
```

---

## 💰 FASE 3: MODELO DE NEGOCIO Y MONETIZACIÓN (Semana 9-12)

### 3.1 Revenue Streams

#### STREAM 1: Comisión por Tours (60% de ingresos)
```
Precio tour: Q200 ($25 USD)
Comisión Nómada: 15% = Q30 ($3.75)
Tour guide recibe: Q170 ($21.25)

Proyección mes 12:
- 200 tours activos
- Ocupación promedio: 60% (1.2 personas por tour)
- Ingresos: 200 × 60% × $3.75 = $450/mes

Año 1: $5,400 (conservador)
Año 2: $20,000+ (con scaled partnerships)
```

#### STREAM 2: Comisión por Shuttle/Transporte (25% de ingresos)
```
Precio transporte: Q50 ($6 USD)
Comisión Nómada: 20% = Q10 ($1.20)

Proyección mes 12:
- 300+ viajes/mes
- Ingresos: 300 × $1.20 = $360/mes

Año 1: $4,320
Año 2: $12,000+
```

#### STREAM 3: Comisión por Alojamientos - Affiliate (10% de ingresos)
```
Hotel booking: $50
Comisión Nómada: 10% = $5

Proyección mes 12:
- 50 bookings/mes
- Ingresos: 50 × $5 = $250/mes

Año 1: $3,000
Año 2: $8,000+
```

#### STREAM 4: Premium Features (5% de ingresos) - FUTURO
```
- Provider premium: $5/mes
- Featured tour listings: $2/semana
- Analytics dashboard: $10/mes

Proyección: Sujeto a adoption rate
```

---

### 3.2 Estructura de Pagos

**Plataforma de pagos**: Stripe (ya está en proyecto)

#### Para Clientes:
- Pago al hacer reserva
- Métodos: Tarjeta crédito, Google Pay, Apple Pay
- Comisión Stripe: 2.9% + $0.30 (internacional)
- Security: PCI compliant, tokenización

#### Para Providers:
- Pago semanal (cada lunes)
- Métodos: Bank transfer (Guatemala), Stripe payout
- Deducción: Comisión Nómada + fees Stripe
- Monto mínimo: $10 USD para payout

**Ejemplo dashboard provider**:
```
┌─────────────────────────────────┐
│ MI CUENTA DE INGRESOS           │
├─────────────────────────────────┤
│ Saldo disponible: Q2,130 ($267) │
│ Próximo pago: 2026-04-21        │
│ Reservas este mes: 12           │
│ Ingresos totales: Q9,500 ($1,187)|
│ Comisión plataforma: -Q1,425    │
│ Comisión Stripe: -$35           │
│                                 │
│ [SOLICITAR PAYOUT ANTICIPADO]   │
│ [VER DETALLES DE RESERVAS]      │
└─────────────────────────────────┘
```

---

### 3.3 Pricing Strategy

#### Precios Tours (Referencia para negotiate con providers)
```
Tier 1: Budget (Q50-100 / $6-13)
├─ Short walks (2-3 horas)
├─ Grupos grandes (10+ personas)
└─ Experiencias básicas

Tier 2: Mid-range (Q100-250 / $13-30)
├─ Full day tours (6-8 horas)
├─ Experiencias especializadas
└─ Grupos pequeños (5-8 personas)

Tier 3: Premium (Q250+ / $30+)
├─ Private tours
├─ Multi-day experiences
├─ Experiencias exclusivas (spa, chef dinners)
└─ Pequeños grupos (1-4 personas)
```

#### Comisiones por Tipo (Negotiable por volumen)

| Tipo | Standard | Volumen<br/>10+ tours | Volumen<br/>30+ tours |
|------|----------|----------------------|----------------------|
| Tours | 15% | 12% | 10% |
| Shuttles | 20% | 15% | 12% |
| Alojamientos | 10% (affiliate) | 8% | 5% |
| Artesanía | 15% | 12% | 10% |

---

## 📱 FASE 4: TÁCTICAS DE ADQUISICIÓN (Semana 13-24)

### 4.1 Marketing Channels

#### CHANNEL 1: Word-of-Mouth / Networking (Alto ROI, Bajo costo)
```
Budget: $500 (eventos, dinners)

Tácticas:
- Invitar a primeros clientes a evento "meet-up"
- Referral program: Q50 ($6) crédito por referido
- Pedir a providers que compartan en sus grupos
- Networking con tourism boards locales
```

#### CHANNEL 2: Redes Sociales Orgánicas (Alto engagement, 0 costo inicial)
```
Budget: $0 (solo tiempo) / $500/mes para ads posteriores

Tácticas:
- Publicar 5x/semana (reels, carousels, stories)
- Engagement: Responder todos los comentarios en <1 hora
- Hashtags: #LakosAtitlan #TourGuatemalans #BackpackerLife
- Colaboraciones con travel Instagram accounts
- User generated content: Repostar fotos de clientes
```

#### CHANNEL 3: SEO + Content Marketing (Long-term, compounding)
```
Budget: $0 (DIY) o $150-300/mes (freelancer writer)

Topics a rankear:
1. "Tours Lago Atitlán desde Panajachel"
2. "San Pedro Volcano Hike + Reviews"
3. "Best Hostels in Lake Atitlán"
4. "Atitlán itinerary 3 days"
5. "Scams in Lake Atitlán (how to avoid)"

Strategy:
- Crear 1 blog post/week (1500 palabras)
- Optimizar para long-tail keywords
- Backlinks: Pedir a providers que linkeen
- Internal linking: tours → tour guides → alojamientos
```

#### CHANNEL 4: Email Marketing (Costo bajo, ROI alto)
```
Budget: $0 (Resend free tier) o $15/mes (Mailchimp)

Segmentación:
- Email 1: Travelers who visited but didn't book
- Email 2: Past customers (upselling)
- Email 3: Newsletter subscribers (nurture)

Sequences:
- Welcome series (5 emails)
- Cart abandonment (3 emails)
- Post-booking (2 emails)
- Re-engagement (2 emails)
```

#### CHANNEL 5: Paid Ads (Cuando hayas validado product-market fit)
```
Budget: $200-500/mes (Phase 4 onwards)

Plataformas:
1. Google Ads (Search: "tours Lake Atitlán")
   └─ Budget: $150/mes, Target CPC: $0.50
   
2. Facebook/Instagram (Tourists 25-45, Backpacker interests)
   └─ Budget: $150/mes, Target ROAS: 3:1
   
3. TikTok (Future, Gen Z travelers)
   └─ Budget: $100/mes, Target engagement rate: >5%

No hacer paid ads hasta:
- ✅ Conversion rate: >5% (visits → request)
- ✅ CAC < $5
- ✅ LTV > $50
```

#### CHANNEL 6: Partnerships B2B (High LTV, pero slow)
```
Budget: Tiempo + dinero de viajes para meetings

Estrategia:
1. Contactar Travel Blogs/YouTube channels
   └─ Oferta: Free tours + comisión affiliate
   └─ Meta: 2-3 partnerships/mes
   
2. Agencias de touroperadores locales
   └─ Oferta: White-label API o bulk booking rates
   └─ Meta: 1 partnership grande = 50+ bookings/mes
   
3. Hostales/Hotels (referral partners)
   └─ Oferta: Comisión + co-marketing
   └─ Meta: 15 hostales en network
   
4. Tourism boards (Polegamala, Atitlán tourist office)
   └─ Oferta: Free listing + commission share
   └─ Meta: Ser recomendado oficial
```

---

### 4.2 Customer Journey Map

```
AWARENESS
├─ Google: "Tours Lake Atitlán"
├─ Facebook: Ads a travelers
├─ Instagram: Hashtag #BackpackersAtitlán
├─ Word-of-mouth: Friend recommendation
└─ Tour operator: Ref from hostal

    ↓ CLICK

CONSIDERATION
├─ Website visit: 2-3 min browsing
├─ Compare tours: Precio/ratings
├─ Read reviews: ¿Otros compraron?
├─ Check availability: Calendario
└─ Chat con AI: "¿Qué me recomiendas?"

    ↓ ADD TO CART / REQUEST

DECISION
├─ Llenar formulario reserva
├─ Ingresar email
├─ Seleccionar método pago
├─ Email de confirmación
└─ WhatsApp from tour guide

    ↓ BOOKING CONFIRMATION

EXPERIENCE
├─ Día del tour: Tour happens
├─ Momento memorable: Fotos, video
├─ Post-tour: Email follow-up
├─ Request rating/review
└─ Discount for next tour

    ↓ LOYALTY

ADVOCACY
├─ Customer posts en Instagram
├─ Referral: Recomienda a amigo
├─ Repeat booking: Próximo tour
├─ Membership: Premium features
└─ Becomes brand ambassador
```

---

## 📊 FASE 5: OPERACIONAL Y KPIs (Continuo)

### 5.1 OKRs (Objetivos y Key Results)

#### Q1 2026 (Abril-Junio)
```
OBJECTIVE 1: Establecer Supply Side (Tours/Providers)
├─ KR 1: 50 tours activos en plataforma
├─ KR 2: 15 providers verificados y activos
├─ KR 3: 90%+ provider satisfaction score
└─ KR 4: 20+ tours con photos/descriptions actualizadas

OBJECTIVE 2: Generar Primeras Reservas
├─ KR 1: 100 unique visitors/semana
├─ KR 2: 20 reservas pagadas
├─ KR 3: 40%+ conversion rate (request → booking)
└─ KR 4: $500+ en ingresos (después comisiones)

OBJECTIVE 3: Validar Unit Economics
├─ KR 1: CAC < $10
├─ KR 2: LTV > $50
├─ KR 3: Repeat booking rate > 20%
└─ KR 4: Net Promoter Score > 50
```

#### Q2 2026 (Julio-Septiembre)
```
OBJECTIVE 1: Escalar Proveedores
├─ KR 1: 30+ tours activos
├─ KR 2: 25+ providers activos
├─ KR 3: Occupancy rate promedio: 60%+
└─ KR 4: Provider monthly revenue promedio: $200+

OBJECTIVE 2: Escalar Demanda
├─ KR 1: 500 unique visitors/semana
├─ KR 2: 150 reservas/mes
├─ KR 3: Cost per acquisition: <$5
└─ KR 4: $2,000+/mes en ingresos

OBJECTIVE 3: Validar Modelo de Negocio
├─ KR 1: Margin rates > 60%
├─ KR 2: Repeat customer rate: 25%+
├─ KR 3: Churn rate: <5%
└─ KR 4: Referral rate: 15% of new bookings
```

---

### 5.2 Métricas Críticas a Monitorear

#### TOP LINE METRICS (Negocio)
| Métrica | Meta Q1 | Meta Q2 | Cálculo |
|---------|---------|---------|---------|
| **Ingresos Brutos** | $500 | $2,000 | Comisiones totales antes gastos |
| **Ingresos Netos** | $300 | $1,400 | Ingresos - Stripe fees - overhead |
| **Run Rate Anual** | $6k | $16.8k | Ingresos/mes × 12 |
| **# Reservas** | 20 | 150 | Total bookings |
| **AOV (Valor promedio)** | $25 | $25 | Precio promedio por booking |

#### CUSTOMER METRICS
| Métrica | Goal | Cómo medir |
|---------|------|-----------|
| **Unique Visitors** | 100→500/semana | Google Analytics |
| **Conversion (Visit → Request)** | >5% | Events en GA |
| **Conversion (Request → Booking)** | >40% | Form completions vs submits |
| **CAC (Cost per Acquisition)** | <$10 | Total marketing spend / new customers |
| **LTV (Lifetime Value)** | >$50 | Avg revenue per customer × repeat rate |
| **NPS (Net Promoter Score)** | >50 | Post-booking survey |
| **Repeat Booking Rate** | >20% | Customers con 2+ bookings |

#### PROVIDER METRICS
| Métrica | Goal | Cómo medir |
|---------|------|-----------|
| **# Proveedores activos** | 15 → 25 | Count en DB donde estado='active' |
| **# Tours activos** | 50 → 200+ | Count en DB con bookable capacity |
| **Avg tours/provider** | 3-4 | Total tours / # providers |
| **Avg income/provider/mes** | $50 → $200 | Sum(bookings × comisión) / providers |
| **Provider satisfaction** | >90% | Post-payout survey (1-5 stars) |
| **Provider churn rate** | <5% | Providers que cancellaron / total |
| **Time to revenue** | <7 días | Days de signup → primera reserva |

#### PRODUCT METRICS
| Métrica | Goal | Herramienta |
|---------|------|-------------|
| **Site uptime** | >99.9% | Uptime monitor (Monitoring.so) |
| **Page load time** | <2s | Lighthouse, Web Vitals |
| **Mobile traffic** | >70% | Google Analytics |
| **SEO rankings** | Top 10 × 5 keywords | SEMrush, Ahrefs |

---

### 5.3 Dashboard de Control

**Tool sugerido**: Google Sheets + Google Data Studio (free, simple)

**Crear dashboard con**:
- Hoja 1: KPIs Principales (update daily)
- Hoja 2: Revenue (update daily)
- Hoja 3: Proveedores (update weekly)
- Hoja 4: Clientes (update weekly)
- Hoja 5: Marketing channels performance (update weekly)

**Ejemplo Hoja 1 formato**:
```
DATE          | UNIQUE VISITORS | REQUESTS | BOOKINGS | REVENUE | NOTES
2026-04-01    | 145            | 8        | 2        | $47.50  | Launched flyers
2026-04-02    | 128            | 6        | 1        | $23.75  | -
2026-04-03    | 210            | 15       | 4        | $95.00  | Featured on IG
2026-04-04    | 195            | 12       | 3        | $71.25  | -
WEEKLY TOTAL  | 678            | 41       | 10       | $237.50 | Week 1 baseline
```

---

### 5.4 Reuniones de Seguimiento

**Cadencia**:
- **Daily Standup**: 10 min, async (Slack update)
  - Qué hizo ayer
  - Qué hace hoy
  - Bloqueadores
  
- **Weekly Review**: 30 min, viernes 3pm
  - KPIs de la semana
  - Top wins y learns
  - Próximas prioridades
  
- **Monthly Planning**: 1 hora, último día del mes
  - Análisis completo mes anterior
  - Proyecciones próximo mes
  - Ajustes de estrategia

---

## 🎁 FASE 6: ESTRATEGIAS TÁCTICAS ESPECÍFICAS

### 6.1 Captar Primeros 10 Proveedores

**TÁCTICAS ESPECÍFICAS**:

#### Tática 1: "Encontrar a influyentes locales"
```
Qué buscar: Guides con >500 seguidores en Facebook, reviews positivos en TripAdvisor

Dónde encontrar:
1. Buscar en TripAdvisor "Top Rated by Travelers" en Atitlán
2. Extraer nombres, fotos, reviews
3. Googlear nombre + Facebook
4. Notar patrones de quiénes son los más recomendados

Aproximación:
- Estos guides YA tienen demanda
- Pueden generar volumen inmediato
- Son influencia local valiosa
- Motivación: Más ingresos + visibility

Mensaje personalizado:
"Hola [NOMBRE], vi que tienes excelentes reviews en TripAdvisor 
[NÚMERO X]. Te contacto porque Nómada Fantasma es una plataforma 
que te ayuda a vender MÁS tours sin más esfuerzo de marketing. 
¿Tienes 15 min para platear?"
```

#### Tática 2: "Volverlos partners vía incentivos"
```
Oferta especial para primeros 10:
- 0% comisión en primeras 20 reservas (Tú subsidias)
- Marketing feature: "Featured Provider of the Week"
- Bono referral: $10 por cada guide que refieran
- Acceso early a features premium

Validación:
- Confirma que modelo funciona
- Genera primeras reviews/testimonios
- Builds social proof for scaling

Costo: $200 máximo (20 reservas × 3 providers × promedio $3 comisión)
Retorno: Proof of concept + 6 tours en plataforma
```

#### Tática 3: "Hacer mini-eventos locales"
```
Evento: "Nómada Fantasma Meetup - Proveedores"
Cuándo: Fin de semana (sábado)
Dónde: Hostal, café con vista lago (Panajachel)
Invitación: Máximo 15 personas (guides, hostal owners, artisans)
Duración: 2 horas
Costo: $50-100 (refrigerios, materiales)

Agenda:
0:00 - Bienvenida + networking
0:15 - Presentación Nómada Fantasma (15 min)
0:30 - Demo en vivo de provider dashboard
0:45 - Q&A
1:00 - Breakout: 1-on-1 signups

Outcomes:
- 5-8 nuevos providers que se registran en vivo
- Face-to-face builds trust
- Foto grupal para social media content
- Video/testimonios de participantes
```

---

### 6.2 Primeras Campañas de Marketing

#### Campaña 1: "Launch Blitz" (Week 1-2)
```
Objetivo: Generar buzz, awareness inicial

Tácticas:
1. Publicar en Facebook groups (backpacker communities)
   - 5 grupos principales + 2 grupos locales (Guatemala tourism)
   - Post: "Nuevo platform de tours en Atitlán - ayuda local"
   - Tone: Community-driven, no salesy
   
2. Contactar travel bloggers (micro-influencers)
   - Buscar "Lake Atitlán travels" en Google
   - Encontrar blogs pequeños (5k-50k monthly views)
   - Oferta: "Free tour + commission affiliate if you write about us"
   - Meta: 1-2 blogs escriben feature

3. Presencia Reddit
   - Subreddits: r/travel, r/backpacking, r/guatemala
   - Participar en discussiones, recomendar donde relevante
   - NO spam, solo genuina

4. Lanzar primeros 10-15 tours
   - Con fotos decentes (no necesita ser pro)
   - Descripciones en ES/EN
   - Ocupación limitada (1-2 cupos) para crear urgencia

Budget: $0 (time-intensive)
```

#### Campaña 2: "Provider Spotlights" (Week 3-8)
```
Objetivo: Humanizar plataforma, crear content

Tácticas:
1. Crear serie "Provider of the Week"
   - Seleccionar provider cada semana
   - Entrevista 15 min (WhatsApp video o Zoom)
   - Publicar en redes: clip + story
   - Pregunta: "¿Por qué haces tours? ¿Qué es lo mejor?"
   
2. User Generated Content
   - Pedir a clientes que compartan fotos
   - Repostar en redes con crédito
   - Hashtag: #NomadaFantasmaReview
   
3. Testimonios en video
   - Grabar 2-3 clientes después de tour
   - Pregunta simple: "¿Qué te pareció?"
   - 30-60 segundo clips para Stories/TikTok

Budget: $0 + time
Output: 8-12 pieces de content orgánico
```

#### Campaña 3: "Early Bird Referral" (Week 4+)
```
Objetivo: Viral growth loop, LTV increase

Programa:
- Customer hace booking → Recibe referral link
- Comparte link con amigo → Amigo booking
- Tanto customer como amigo: $5 discount próxima reserva
- Tracking: Usar parámetro URL ?ref=CUSTOMER_ID

Incentivo adicional (para primeros 50 referrals):
- 10% descuento en cualquier tour
- Solo si referido completa booking
- Comunicar via email con urgencia ("Limited to first 50")

Projección: 
- Customer ROI: Usa descuento para comprar tour adicional
- Business ROI: CAC reduction 30-40%

Budget: Máximo $150 en descuentos (30 referrals × $5)
```

---

### 6.3 Estrategia de Retention

#### Reactivar Clientes (No just acquire)

**Email Secuencia de Re-engagement**:
```
EMAIL 1 (30 días post-booking):
Subject: "¿Qué tal fue tu experiencia en [TOUR NAME]?"
Body: Pedir rating + review

EMAIL 2 (45 días post-booking):
Subject: "Recomendaciones personalizadas basadas en tu tour"
Body: 3 tours relacionados con slight discount (5%)

EMAIL 3 (60 días post-booking):
Subject: "Regresa - 10% discount en próxima aventura"
Body: Special offer válida por 14 días

EMAIL 4 (90 días sin re-booking):
Subject: "Te extrañamos 👻 - 15% final offer"
Body: Last chance, urgency language
```

**Community Building**:
```
1. Crear Facebook Group: "Nómada Fantasma Explorers"
   - Share tips, fotos, experiencias
   - Provider AMA sessions
   - Próximos tours early access
   
2. Newsletter Quincenal
   - Historias de clientes
   - Tips para Atitlán
   - New tours + special offers
   
3. VIP Program (Futuro)
   - 5+ bookings → VIP status
   - Early access a nuevos tours
   - 1 free upgrade o discount garantizado
```

---

## ⚠️ RIESGOS Y MITIGACIÓN

### Riesgo 1: Falta de supply (tours/providers)
```
Severidad: 🔴 CRÍTICA
Probabilidad: 🟡 MEDIA

Síntoma: Menos de 10 tours a las 4 semanas
Mitigación:
- Comenzar with hand-selected, high-quality providers
- Pagar personalmente por 1-2 tours como test antes de lanzar
- Tener backup: Importar tours curated desde ToursByLocals (data partnership)
```

### Riesgo 2: Bajo conversion rate
```
Severidad: 🔴 CRÍTICA
Probabilidad: 🟡 MEDIA

Síntoma: <1% conversion rate (visits → requests)
Mitigación:
- A/B testing en hero section + CTAs
- Exit intent popup con discount si se van
- Live chat con AI para answer questions on page
```

### Riesgo 3: Churn de providers (se van a competencia)
```
Severidad: 🟡 MEDIA
Probabilidad: 🟡 MEDIA

Síntoma: >20% de providers inactive después 30 días
Mitigación:
- Pagar en 3 días en lugar de semanal (retention)
- Proactive: Call/WhatsApp mensual para ver cómo va
- Offer support: Ayudar con fotos, descripciones
```

### Riesgo 4: Payment/Fraud issues
```
Severidad: 🔴 CRÍTICA
Probabilidad: 🟢 BAJA (Stripe protege)

Síntoma: Chargebacks, fraudulent bookings
Mitigación:
- Validación de email confirmado
- SMS verification para reservas $50+
- Reservation confirmation con foto ID para high-value
```

### Riesgo 5: Reputational damage (bad experience)
```
Severidad: 🟡 MEDIA
Probabilidad: 🟢 BAJA

Síntoma: <2 star reviews, tour no-shows
Mitigación:
- Quality control: Visit algunos tours antes de launch
- Ratings/reviews transparentes
- 100% refund policy para no-shows
- Support rápido (<2 horas) para issues
```

---

## 🔄 NEXT STEPS INMEDIATOS (Próximas 48-72 horas)

### Phase 1: ESTRUCTURACIÓN (Este fin de semana)

- [ ] **1. Revisar schema.sql** - Verificar que tabla `providers` y `partnerships` estén correctas
- [ ] **2. Crear Trello/Notion** - Para trackear tareas del team (si hay más gente)
- [ ] **3. Listar 20 providers target** - Nombres reales de guides en Panajachel/San Pedro
- [ ] **4. Escribir 3 email templates** - Para contacto inicial (provider, customer, hostal)

### Phase 2: LANZAMIENTO RÁPIDO (Próximas 2 semanas)

- [ ] **5. Contactar 5 guides locales** - Via WhatsApp con oferta especial "0% comisión"
- [ ] **6. Conseguir 10 fotos de tours** - Pedirles a guides que envíen, o compilar de Google
- [ ] **7. Crear 5-10 posts en redes** - Lanzar Instagram/(Facebook
- [ ] **8. Imprimir 500 flyers** - Primera batch para distribución

### Phase 3: TRACCIÓN (Semanas 3-4)

- [ ] **9. Hacer mini-evento en Panajachel** - Invite 10 providers, demo en vivo
- [ ] **10. Setup analytics** - GA4 + Stripe reporting dashboard
- [ ] **11. Primeras 20 reservas** - Track cada una, follow-up con clientes

---

## 📚 CONCLUSIÓN

Este plan estructura a **Nómada Fantasma** en 6 fases claras para pasar de idea a negocio rentable. Lo crítico es **empezar pequeño, validar rápido, escalar lo que funciona**.

### Resumen Ejecutivo del Plan:
```
✅ Mes 1-2: Asegurar proveedores + lanzar marketing básico
✅ Mes 3-4: Primeras 100+ reservas, validar unit economics
✅ Mes 5-8: Escalar a 200+ tours, 30+ providers
✅ Mes 9-12: Alcanzar $5k/mes, preparar inversión/expansion

Inversión total requerida: $800-1,500 (flyers, stickers, imprenta)
Revenue potencial Año 1: $5,400-10,000 USD

ROI: 4-8x en 12 meses
```

**Próximo Paso**: Revisar este documento con tu equipo, ajustar números según tu contexto local, y comenzar con la Fase 1 inmediatamente.

---

**Documento preparado por**: PM Estratégico
**Última actualización**: Abril 2026
**Próxima revisión**: Mayo 2026 (ajustes basados en tracción inicial)
