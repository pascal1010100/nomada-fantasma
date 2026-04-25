update public.tours
set
  description = 'Cabalgata panoramica en San Pedro con opciones grupales, extendidas y privadas desde Q350 por persona, operada junto a Free Riders Guild y Rancho Moises.',
  description_en = 'Panoramic horseback ride in San Pedro with group, extended, and private options from Q350 per person, operated with Free Riders Guild and Rancho Moises.',
  full_description = 'Free Riders Horseback Volcano View Trail Adventure es una experiencia de cabalgata en San Pedro pensada para viajeros que quieren explorar caminos rurales, montanas y vistas abiertas del Lago de Atitlan. La estructura comercial validada con la proveedora queda asi: ride grupal basico prescheduled desde Q350 por persona; ride extendido o split private desde Q500 por persona, minimo 2 personas; y ride privado desde Q1000. La experiencia incluye caballo para el recorrido e instruccion basica antes de salir. Duracion exacta, diferencias operativas entre opciones y punto final de encuentro quedan pendientes de confirmacion con la proveedora.',
  full_description_en = 'Free Riders Horseback Volcano View Trail Adventure is a horseback experience in San Pedro for travelers who want to explore rural roads, mountain scenery, and open views over Lake Atitlan. The provider-confirmed commercial structure is: basic prescheduled group ride from Q350 per person; extended or split-private ride from Q500 per person, 2-person minimum; and private ride from Q1000. The experience includes the horse for the ride and basic instruction before departure. Exact duration, operational differences between options, and final meeting point are still pending provider confirmation.',
  price = 350,
  price_min = 350,
  price_max = 1000,
  highlights = array[
    'Ride grupal basico prescheduled desde Q350 por persona',
    'Ride extendido o split private desde Q500 por persona, minimo 2 personas',
    'Ride privado desde Q1000',
    'Vistas del lago, volcanes y montanas alrededor de San Pedro'
  ],
  included = array[
    'Caballo para el recorrido',
    'Instruccion basica antes de salir',
    'Cabalgata panoramica con Free Riders Guild y Rancho Moises',
    'Opcion basica grupal prescheduled desde Q350 por persona',
    'Opcion extendida o split private desde Q500 por persona, minimo 2 personas',
    'Opcion privada desde Q1000'
  ],
  faqs = '[
    {
      "question": "Que opciones de precio hay?",
      "answer": "La opcion basica grupal prescheduled empieza en Q350 por persona. La opcion extendida o split private empieza en Q500 por persona con minimo 2 personas. El ride privado empieza en Q1000."
    },
    {
      "question": "Que datos faltan por confirmar?",
      "answer": "Estamos confirmando duracion exacta por opcion, diferencias entre basic / extended / private y punto final de encuentro."
    }
  ]'::jsonb
where slug = 'cabalgata-panoramica-san-pedro';
