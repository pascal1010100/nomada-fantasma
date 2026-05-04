-- Dev/local seed for Indian Nose.
-- Do not place this in migrations: production already has this tour with richer live data.

begin;

insert into public.tours (
  title,
  slug,
  pueblo_slug,
  description,
  full_description,
  price,
  currency,
  duration_text,
  pickup_time,
  min_guests,
  max_guests,
  cover_image_url,
  is_active,
  images,
  highlights,
  included,
  not_included,
  itinerary,
  faqs,
  is_featured,
  price_min,
  price_max,
  duration_hours,
  difficulty,
  category,
  meeting_point,
  what_to_bring,
  cover_image,
  rating,
  available_days,
  start_times,
  title_en,
  description_en,
  full_description_en
)
values (
  'Amanecer Indian Nose (Rostro Maya)',
  'amanecer-indian-nose-rostro-maya',
  'san-pedro',
  'Una caminata corta de madrugada para ver el amanecer sobre el Lago de Atitlan.',
  'Sube al mirador de Indian Nose para disfrutar un amanecer sobre el Lago de Atitlan y los volcanes San Pedro, Toliman y Atitlan. El tour incluye recojo temprano, guia local, ingreso al parque y bebida caliente en la cima.',
  150,
  'GTQ',
  '4 horas',
  '03:40',
  1,
  10,
  '/images/tours/san-pedro/volcan-san-pedro-1.jpg',
  true,
  array['/images/tours/san-pedro/volcan-san-pedro-1.jpg'],
  array[
    'Vistas panoramicas del lago',
    'Amanecer sobre los volcanes',
    'Caminata corta con guia local',
    'Bebida caliente en la cima'
  ],
  array[
    'Transporte ida y vuelta',
    'Guia local',
    'Entrada al parque',
    'Bebida caliente'
  ],
  array[
    'Comidas no mencionadas',
    'Propinas',
    'Gastos personales'
  ],
  '[
    {"time":"3:45 AM","title":"Recogida","description":"Recogida en tu hospedaje en San Pedro La Laguna."},
    {"time":"4:30 AM","title":"Inicio del sendero","description":"Breve charla y comienzo de la caminata."},
    {"time":"5:30 AM","title":"Amanecer en el mirador","description":"Disfruta el amanecer con cafe o te caliente."},
    {"time":"6:15 AM","title":"Regreso","description":"Descenso y retorno a San Pedro."}
  ]'::jsonb,
  '[
    {"question":"Es apto para ninos?","answer":"Si. El sendero es corto y seguro para familias."},
    {"question":"Necesito estar en gran forma fisica?","answer":"No. Es una caminata de aproximadamente 30 minutos a ritmo tranquilo."}
  ]'::jsonb,
  true,
  150,
  150,
  4,
  'Fácil',
  'Aventura',
  'Recogida en tu hospedaje en San Pedro La Laguna',
  array[
    'Ropa abrigada',
    'Zapatos comodos para caminar',
    'Agua',
    'Camara',
    'Linterna o frontal'
  ],
  '/images/tours/san-pedro/volcan-san-pedro-1.jpg',
  4.9,
  array['Todos los dias'],
  array[]::text[],
  'Indian Nose Sunrise (Mayan Face)',
  'A short pre-dawn hike to watch the sun rise over Lake Atitlan.',
  'Climb the iconic Indian Nose viewpoint for a memorable sunrise over Lake Atitlan and the volcanoes of San Pedro, Toliman, and Atitlan. The tour includes early pickup, a local guide, park access, and a hot drink at the summit.'
)
on conflict (slug) do update
set
  title = excluded.title,
  pueblo_slug = excluded.pueblo_slug,
  description = excluded.description,
  full_description = excluded.full_description,
  price = excluded.price,
  currency = excluded.currency,
  duration_text = excluded.duration_text,
  pickup_time = excluded.pickup_time,
  min_guests = excluded.min_guests,
  max_guests = excluded.max_guests,
  cover_image_url = excluded.cover_image_url,
  is_active = excluded.is_active,
  images = excluded.images,
  highlights = excluded.highlights,
  included = excluded.included,
  not_included = excluded.not_included,
  itinerary = excluded.itinerary,
  faqs = excluded.faqs,
  is_featured = excluded.is_featured,
  price_min = excluded.price_min,
  price_max = excluded.price_max,
  duration_hours = excluded.duration_hours,
  difficulty = excluded.difficulty,
  category = excluded.category,
  meeting_point = excluded.meeting_point,
  what_to_bring = excluded.what_to_bring,
  cover_image = excluded.cover_image,
  rating = excluded.rating,
  available_days = excluded.available_days,
  start_times = excluded.start_times,
  title_en = excluded.title_en,
  description_en = excluded.description_en,
  full_description_en = excluded.full_description_en;

commit;
