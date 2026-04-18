begin;

create table if not exists public.towns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  summary text not null,
  full_description text,
  cover_image text not null,
  wifi_rating integer not null default 0,
  rating numeric(3,2) not null default 0,
  vibe text,
  highlights jsonb not null default '[]'::jsonb,
  weather jsonb not null default '{}'::jsonb,
  activities jsonb not null default '[]'::jsonb,
  transport_schedule jsonb not null default '[]'::jsonb,
  services jsonb not null default '{"atms":[],"essentials":[]}'::jsonb,
  guides jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  is_active boolean not null default true
);

create index if not exists idx_towns_slug on public.towns (slug);
create index if not exists idx_towns_is_active on public.towns (is_active) where is_active = true;

alter table public.towns enable row level security;

drop policy if exists "Public can view active towns" on public.towns;
create policy "Public can view active towns"
on public.towns
for select
using (is_active = true);

drop policy if exists "Service role can manage towns" on public.towns;
create policy "Service role can manage towns"
on public.towns
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

grant select on table public.towns to anon;
grant select on table public.towns to authenticated;
grant all on table public.towns to service_role;

insert into public.towns (
  slug, title, summary, full_description, cover_image, wifi_rating, rating, vibe, highlights, weather, activities, transport_schedule, services, guides, sort_order
)
values
  (
    'panajachel',
    'panajachel.title',
    'panajachel.summary',
    'panajachel.fullDescription',
    '/images/rutas/panajachel.jpg',
    5,
    4.7,
    'panajachel.vibe',
    '["panajachel.highlights.0","panajachel.highlights.1","panajachel.highlights.2","panajachel.highlights.3","panajachel.highlights.4"]'::jsonb,
    '{"temp":22,"condition":"Parcialmente nublado","humidity":65,"wind":8,"feelsLike":24}'::jsonb,
    '["Paseo por la Calle Santander","Tour de compras de artesanías","Paseo en bote por el lago","Tour gastronómico","Observación de aves","Kayak al atardecer","Visita a reservas naturales cercanas","Tour fotográfico"]'::jsonb,
    '[{"route":"Lanchas Públicas (Muelle Tzanjuyú)","times":["Salen cada 20-30 min hacia todos los pueblos (6:30 AM - 7:30 PM). Precio: Q25 extranjeros / Q10 locales."]},{"route":"Shuttles a Antigua/Guate","times":["5:30 AM, 8:00 AM, 12:00 PM, 4:00 PM. Precio: Q15-25. Reserva en agencias de Calle Santander."]},{"route":"Chicken Bus (La Aventura)","times":["Salidas frecuentes desde la parada principal. Ruta: Pana -> Sololá -> Los Encuentros -> Destino final. Precio: ~Q50 total."]}]'::jsonb,
    '{"atms":["Banco Industrial","Banrural","BAC","Banco G&T"],"essentials":["Farmacias: Farmacia Pana","Hospital: Centro de Salud Panajachel","Supermercados: Despensa Familiar","Lavanderías","Oficina de turismo"]}'::jsonb,
    '[{"name":"María González","contact":"maria@nomadafantasma.com","languages":["Español","Inglés"],"tours":["Tour Gastronómico","Tour Cultural"]},{"name":"Juan Pérez","contact":"juan@nomadafantasma.com","languages":["Español","Kakchiquel","Inglés básico"],"tours":["Tour de Naturaleza","Tour de Aventura"]}]'::jsonb,
    10
  ),
  (
    'san-pedro',
    'san-pedro.title',
    'san-pedro.summary',
    'san-pedro.fullDescription',
    '/images/tours/san-pedro/volcan-san-pedro-1.jpg',
    4,
    4.8,
    'san-pedro.vibe',
    '["san-pedro.highlights.0","san-pedro.highlights.1","san-pedro.highlights.2","san-pedro.highlights.3"]'::jsonb,
    '{"temp":22,"condition":"Soleado","humidity":65,"wind":12,"feelsLike":24}'::jsonb,
    '["Senderismo al Volcán San Pedro (4-6 horas de subida)","Kayak al amanecer en el lago","Clases de español en escuelas locales","Tours de café por fincas locales","Visita al mercado local de artesanías","Clases de cocina tradicional","Yoga al amanecer con vista al lago","Paseo en bote a otros pueblos del lago"]'::jsonb,
    '[{"route":"Lanchas a Panajachel","times":["Salen cada 20 min desde el muelle principal (6:00 AM - 5:00 PM). Precio: Q25."]},{"route":"Lanchas a Santiago","times":["Directo cada hora o vía otros pueblos. Última lancha ~4:30 PM."]},{"route":"Tuk-tuks a San Juan","times":["Trayecto de 10 min. Precio: Q10-15 por persona. Disponible todo el día."]},{"route":"Shuttles a Antigua","times":["Salidas diarias 4:30 AM, 8:30 AM, 2:00 PM. Reserva con tu hostal."]}]'::jsonb,
    '{"atms":["Banco Industrial","Banrural","5B"],"essentials":["Farmacias: Farmacia San Pedro, Farmacia La Bendición","Lavanderías: Lavandería La Esquina, Lavandería Central","Supermercados: Despensa Familiar, Supermercado San Pedro","Centro médico: Centro de Salud San Pedro La Laguna","Oficina de correos: En el centro del pueblo"]}'::jsonb,
    '[{"name":"Juan Pérez","contact":"+502 1234-5678","languages":["Español","Inglés"],"tours":["Tour al Volcán San Pedro (Q150-200 por persona)","Tour de café por fincas locales (Q100-150)","Tour cultural por el pueblo (Q80-120)"]}]'::jsonb,
    20
  ),
  (
    'san-marcos',
    'san-marcos.title',
    'san-marcos.summary',
    'san-marcos.fullDescription',
    '/images/rutas/san-marcos.jpg',
    3,
    4.6,
    'san-marcos.vibe',
    '["san-marcos.highlights.0","san-marcos.highlights.1","san-marcos.highlights.2","san-marcos.highlights.3"]'::jsonb,
    '{"temp":23,"condition":"Parcialmente nublado","humidity":70,"wind":8,"feelsLike":25}'::jsonb,
    '["Clases de yoga al amanecer","Sesiones de meditación guiada","Masajes y terapias alternativas","Círculos de canto y sonido","Talleres de crecimiento personal","Paseos en kayak al atardecer","Caminatas por senderos naturales","Clases de acroyoga"]'::jsonb,
    '[{"route":"Lanchas (Muelle Principal)","times":["Hacia Pana o San Pedro cada 30 min (6:30 AM - 6:30 PM). Precio: Q25/Q15."]},{"route":"Tuk-tuks a Tzununá","times":["Viaje corto de 10 min. Precio: Q10 por persona."]},{"route":"Caminata a Tzununá","times":["Sendero seguro por la costa, aprox 45 min con vistas increíbles."]}]'::jsonb,
    '{"atms":["Banco Industrial","Banrural"],"essentials":["Farmacia: Farmacia San Marcos","Tiendas de productos naturales","Cafeterías con opciones veganas","Centros de yoga y bienestar","Oficina de turismo local"]}'::jsonb,
    '[{"name":"Ana Martínez","contact":"ana@sanmarcosyoga.com","languages":["Español","Inglés","Alemán"],"tours":["Retiro de yoga y meditación (Q200/día)","Tour de sanación energética (Q150)","Clase de acroyoga (Q80)"]}]'::jsonb,
    30
  ),
  (
    'santiago',
    'santiago.title',
    'santiago.summary',
    'santiago.fullDescription',
    '/images/rutas/santiago.jpg',
    2,
    4.5,
    'santiago.vibe',
    '["santiago.highlights.0","santiago.highlights.1","santiago.highlights.2","santiago.highlights.3"]'::jsonb,
    '{"temp":24,"condition":"Soleado","humidity":68,"wind":10,"feelsLike":26}'::jsonb,
    '["Recorrido por el mercado indígena","Visita a la Iglesia de Santiago Apóstol","Tour por las cofradías mayas","Taller de artesanías locales","Paseo en bote por el lago","Visita al museo local","Degustación de comida típica","Caminata por el centro histórico"]'::jsonb,
    '[{"route":"Lanchas a Panajachel","times":["Directo (30 min) cada hora. Última lancha ~5:00 PM. Precio: Q25."]},{"route":"Lanchas a San Pedro","times":["Frecuentes desde el muelle cerca del mercado. Precio: Q25."]},{"route":"Chicken Bus a San Lucas","times":["Salen del parque central. Conexión a la costa sur."]}]'::jsonb,
    '{"atms":["Banco Industrial","Banrural","BAM"],"essentials":["Farmacia: Farmacia Santiago","Centro de salud local","Mercado municipal","Oficina de correos","Tiendas de artesanías"]}'::jsonb,
    '[{"name":"Carlos Méndez","contact":"carlos@toursantiago.com","languages":["Español","Inglés","Tz''utujil"],"tours":["Tour cultural por Santiago (Q120)","Visita a las cofradías mayas (Q150)","Taller de tejido tradicional (Q100)"]}]'::jsonb,
    40
  ),
  (
    'san-juan',
    'San Juan La Laguna',
    'Arte, textiles y café orgánico',
    'San Juan La Laguna es famoso por sus cooperativas de tejido y su compromiso con el comercio justo. Sus calles están llenas de coloridos murales que cuentan la historia y las tradiciones de la comunidad.',
    '/images/rutas/san-juan.jpg',
    3,
    4.4,
    'Arte & Café',
    '["Cooperativas de mujeres tejedoras","Talleres de teñido natural","Cafetales orgánicos","Galerías de arte local"]'::jsonb,
    '{"temp":23,"condition":"Parcialmente nublado","humidity":67,"wind":9,"feelsLike":25}'::jsonb,
    '["Visita a cooperativas de tejido","Taller de teñido natural","Tour por cafetales orgánicos","Recorrido por galerías de arte","Caminata por el pueblo y sus murales","Clase de tejido tradicional","Degustación de café local","Paseo en bote al atardecer"]'::jsonb,
    '[{"route":"Tuk-tuks a San Pedro","times":["Rápido y divertido (10 min). Precio: Q10-15."]},{"route":"Lanchas (Muelle)","times":["Hacia Pana cada 30-45 min. Precio: Q25."]},{"route":"Caminata a San Pedro","times":["Agradable paseo de 30-40 min por la carretera pavimentada."]}]'::jsonb,
    '{"atms":["Banco Industrial","Banrural"],"essentials":["Farmacia: Farmacia San Juan","Tiendas de artesanías","Cafeterías locales","Oficina de información turística","Tiendas de productos orgánicos"]}'::jsonb,
    '[{"name":"María González","contact":"maria@artesaniasanjuan.com","languages":["Español","Inglés"],"tours":["Tour por las cooperativas de tejido (Q120)","Taller de teñido natural (Q150)","Tour de café orgánico (Q100)"]}]'::jsonb,
    50
  ),
  (
    'santa-cruz',
    'Santa Cruz La Laguna',
    'Pueblo tranquilo con las mejores vistas y buceo de altura',
    'Santa Cruz La Laguna es un pueblo pintoresco y tranquilo, accesible solo por lancha. Es famoso por tener algunas de las mejores vistas del lago y los volcanes, así como por ser el hogar de la única escuela de buceo profesional en Atitlán. Es el lugar perfecto para relajarse, nadar y disfrutar de la naturaleza sin las multitudes.',
    '/images/rutas/santa-cruz-authentic.jpg',
    3,
    4.7,
    'Relax & Vistas',
    '["Buceo de altura en el lago","Vistas panorámicas increíbles","Senderismo a Jaibalito","Hoteles con acceso directo al lago"]'::jsonb,
    '{"temp":24,"condition":"Soleado","humidity":60,"wind":10,"feelsLike":26}'::jsonb,
    '["Buceo y snorkeling","Kayak y paddleboard","Senderismo por la costa","Clases de cocina maya","Relajación en hamacas frente al lago","Visita al centro vocacional CECAP"]'::jsonb,
    '[{"route":"Lanchas a Panajachel","times":["Muy frecuentes (cada 20 min). Precio: Q10 (tarifa local/corta). Última lancha 7:00 PM."]},{"route":"Lanchas a San Pedro","times":["Pasan cada 30 min rumbo oeste. Haz señas desde el muelle. Precio: Q20-25."]},{"route":"Caminata a Jaibalito","times":["Sendero escénico de 20-30 min. ¡Vistas increíbles!"]}]'::jsonb,
    '{"atms":[],"essentials":["Centro de Salud","Pequeñas tiendas locales","Escuela de buceo","Restaurantes de hoteles"]}'::jsonb,
    '[{"name":"Carlos Mendez","contact":"carlos@santacruzdiving.com","languages":["Español","Inglés"],"tours":["Discovery Dive (Q650)","Caminata a Jaibalito (Q150)","Tour de Kayak (Q200)"]}]'::jsonb,
    60
  )
on conflict (slug) do update
set
  title = excluded.title,
  summary = excluded.summary,
  full_description = excluded.full_description,
  cover_image = excluded.cover_image,
  wifi_rating = excluded.wifi_rating,
  rating = excluded.rating,
  vibe = excluded.vibe,
  highlights = excluded.highlights,
  weather = excluded.weather,
  activities = excluded.activities,
  transport_schedule = excluded.transport_schedule,
  services = excluded.services,
  guides = excluded.guides,
  sort_order = excluded.sort_order,
  is_active = true,
  updated_at = now();

commit;
