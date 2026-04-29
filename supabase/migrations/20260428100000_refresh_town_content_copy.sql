begin;

update public.towns
set
  title = 'San Marcos La Laguna',
  summary = 'Bienestar, naturaleza y lago tranquilo',
  full_description = 'San Marcos es el pueblo más enfocado en bienestar del lago: yoga, meditación, cacao, terapias y cafés tranquilos cerca del muelle. También funciona para nadar, caminar y descansar, especialmente en Cerro Tzankujil. Es mejor para viajeros que buscan calma y naturaleza, no vida nocturna.',
  vibe = 'Yoga & Místico',
  highlights = '["Cerro Tzankujil: natación, rocas y vistas al lago","Bienestar: yoga, meditación y ceremonias de cacao","Ambiente: noches tranquilas y energía de retiro","Movimiento: pueblo compacto y fácil de caminar","Ideal para: bajar el ritmo, nadar y hacer day retreats"]'::jsonb,
  activities = '["Tomar una clase de yoga con vista al lago","Nadar o saltar al agua en Cerro Tzankujil","Unirse a una meditación o ceremonia de cacao","Caminar por senderos tranquilos cerca del pueblo","Hacer kayak temprano o al atardecer","Visitar cafés vegetarianos y espacios de bienestar","Tomar un tuk-tuk o caminar hacia Tzununá","Reservar Indian Nose con guía local si buscas amanecer"]'::jsonb
where slug = 'san-marcos';

update public.towns
set
  title = 'San Juan La Laguna',
  summary = 'Textiles, murales y turismo comunitario',
  full_description = 'San Juan es uno de los pueblos más organizados para turismo cultural en Atitlán. Es conocido por sus cooperativas de tejido con tintes naturales, murales, galerías, café local y calles limpias para caminar con calma. Funciona muy bien como visita de medio día desde San Pedro o como parada tranquila para comprar artesanía con más contexto.',
  vibe = 'Arte & Cultura',
  highlights = '["Textiles: cooperativas y tintes naturales","Murales: calles coloridas y galerías locales","Mirador Kaqasiiwaan: subida corta con vistas del lago","Café: fincas, tostadores y degustaciones locales","Ideal para: cultura, compras y caminata tranquila"]'::jsonb,
  activities = '["Visitar cooperativas de tejido y tintes naturales","Caminar por los murales y calles principales","Subir al Mirador Kaqasiiwaan","Hacer un tour de café o una degustación local","Entrar a galerías y talleres de arte","Comprar textiles directamente a cooperativas","Moverte en tuk-tuk desde San Pedro","Volver en lancha o caminar si vas con tiempo"]'::jsonb
where slug = 'san-juan';

update public.towns
set
  title = 'Santiago Atitlán',
  summary = 'Tradición, mercado y Maximón',
  full_description = 'Santiago Atitlán es uno de los pueblos con más peso cultural del lago. Aquí la visita se centra en el mercado, la Iglesia de Santiago Apóstol, las cofradías y Maximón, siempre con respeto y, si es posible, con guía local. Es una parada fuerte para entender la vida tz''utujil, probar comida local y ver un Atitlán menos turístico.',
  vibe = 'Tradición Maya',
  highlights = '["Maximón: visita con respeto y guía local","Mercado: textiles, comida y vida cotidiana","Iglesia Santiago Apóstol: historia y comunidad","Lanchas: conexión con San Pedro y Panajachel","Ideal para: cultura, comida local e historia viva"]'::jsonb,
  activities = '["Recorrer el mercado municipal por la mañana","Visitar la Iglesia de Santiago Apóstol","Visitar a Maximón con guía local","Conocer cofradías y tradiciones comunitarias","Probar comida típica cerca del mercado","Comprar textiles y artesanía local","Tomar lancha desde el muelle secundario de San Pedro","Hacer la visita con respeto y permiso para fotos"]'::jsonb
where slug = 'santiago';

update public.towns
set
  title = 'Panajachel',
  summary = 'Puerta de entrada, servicios y conexiones por lancha',
  full_description = 'Panajachel, o Pana, es el punto más práctico para entrar y salir del Lago de Atitlán. Tiene muelles con conexión a otros pueblos, shuttles, bancos, farmacias, agencias y la Calle Santander para compras, comida y tours. No siempre es el pueblo más tranquilo, pero es el mejor para logística, primeras noches y resolver necesidades de viaje.',
  vibe = 'Cosmopolita & Compras',
  highlights = '["Transporte: hub fuerte de lanchas y shuttles","Calle Santander: tiendas, comida y agencias","Servicios: bancos, farmacias y supermercados","Naturaleza: reserva natural y vistas del lago","Ideal para: llegada, logística y compras"]'::jsonb,
  activities = '["Paseo por la Calle Santander","Comprar artesanías y resolver pendientes de viaje","Tomar lancha hacia otros pueblos del lago","Visitar la Reserva Natural Atitlán","Hacer kayak o paseo en bote al atardecer","Reservar shuttles hacia Antigua o Ciudad de Guatemala","Comer en restaurantes cerca de Santander","Usar Pana como primera o última noche del lago"]'::jsonb
where slug = 'panajachel';

update public.towns
set
  title = 'Santa Cruz La Laguna',
  summary = 'Vistas amplias, lago tranquilo y caminata a Jaibalito',
  full_description = 'Santa Cruz es una opción tranquila y escénica, accesible principalmente por lancha. La zona del lago concentra hospedajes, restaurantes y actividades acuáticas, mientras que el pueblo local está más arriba en la montaña. Es ideal para descansar, nadar, hacer kayak, caminar hacia Jaibalito y disfrutar vistas grandes sin el ritmo de San Pedro o Panajachel.',
  vibe = 'Relax & Vistas',
  highlights = '["Lago: hospedajes, muelles y zonas tranquilas para nadar","Buceo: escuela de buceo de altura en Atitlán","Pueblo: comunidad local y CECAP en la parte alta","Sendero: caminata escénica hacia Jaibalito","Importante: llevar efectivo, servicios limitados"]'::jsonb,
  activities = '["Nadar, hacer kayak o paddleboard","Probar buceo de altura en el lago","Caminar hacia Jaibalito por la costa","Subir al pueblo y visitar CECAP","Almorzar en restaurantes frente al lago","Descansar en hospedajes con vista","Moverte en lancha hacia Pana, San Marcos o San Pedro","Llevar efectivo porque no hay cajeros confiables"]'::jsonb
where slug = 'santa-cruz';

commit;
