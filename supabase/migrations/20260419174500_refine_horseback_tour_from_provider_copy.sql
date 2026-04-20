update public.tours
set
  title = 'Free Riders Horseback Volcano View Trail Adventure',
  title_en = 'Free Riders Horseback Volcano View Trail Adventure',
  description = 'Cabalgata panoramica con vistas al lago y volcanes desde San Pedro, operada junto a Free Riders Guild y Rancho Moises, ideal para principiantes y niveles mas avanzados.',
  description_en = 'Horseback trail adventure with lake and volcano views from San Pedro, operated together with Free Riders Guild and Rancho Moises, suitable for beginners as well as more advanced riders.',
  full_description = 'Free Riders Horseback Volcano View Trail Adventure es una experiencia de cabalgata en San Pedro pensada para viajeros que quieren algo distinto al hiking clasico. Segun la informacion actual de la proveedora, el ride se realiza los martes y jueves, con vistas abiertas del lago, volcanes y montanas, e incluye instruccion basica antes de salir. El punto de encuentro puede confirmarse entre San Pedro Dock / Crown Coffee o directamente en Rancho Moises, segun el horario elegido al reservar.',
  full_description_en = 'Free Riders Horseback Volcano View Trail Adventure is a horseback experience in San Pedro for travelers looking for something different from the classic hike. Based on the provider information we have so far, the ride runs on Tuesdays and Thursdays, features open views of the lake, volcanoes, and mountains, and includes basic instruction before departure. The meetup is confirmed on booking and may be either San Pedro Dock / Crown Coffee or directly at Rancho Moises depending on the selected schedule.',
  price_min = 350,
  price_max = 700,
  price = 350,
  duration_hours = 3,
  duration_text = '3 horas',
  difficulty = 'Todos los niveles',
  meeting_point = 'Meetup por confirmar entre San Pedro Dock / Crown Coffee o Rancho Moises',
  highlights = array[
    'Vistas del lago, volcanes y montanas alrededor de San Pedro',
    'Bienvenida para principiantes con instruccion basica antes del ride',
    'Opciones para riders intermedios o avanzados segun disponibilidad'
  ],
  included = array[
    'Caballo para el recorrido',
    'Instruccion basica antes de salir',
    'Cabalgata panoramica con Free Riders Guild y Rancho Moises'
  ],
  not_included = array[
    'Transporte hasta el punto de salida',
    'Fotos profesionales',
    'Comidas o bebidas',
    'Propinas'
  ],
  itinerary = '[
    {"time":"9:30 AM","title":"Meetup en San Pedro","description":"Encuentro en San Pedro Dock / Crown Coffee o confirmacion para llegar a Rancho Moises."},
    {"time":"10:00 AM","title":"Instruccion y salida","description":"Introduccion basica para principiantes y preparacion antes de comenzar la cabalgata."},
    {"time":"11:00 AM","title":"Ruta panoramica","description":"Recorrido por caminos rurales con vistas al lago, montanas y volcanes."},
    {"time":"1:00 PM","title":"Cierre del ride","description":"Fin de la experiencia y regreso al punto acordado."}
  ]'::jsonb,
  available_days = array['martes','jueves'],
  start_times = array['10:00'],
  category = 'Horseback'
where slug = 'cabalgata-panoramica-san-pedro';
