begin;

update public.towns
set
  summary = 'san-pedro.summary',
  full_description = 'san-pedro.fullDescription',
  highlights = '[
    "san-pedro.highlights.0",
    "san-pedro.highlights.1",
    "san-pedro.highlights.2",
    "san-pedro.highlights.3",
    "san-pedro.highlights.4"
  ]'::jsonb,
  activities = '[
    "Subir el Volcán San Pedro con guía local",
    "Caminar o ir en tuk-tuk hacia La Finca y Playa La Finca",
    "Kayak temprano o paseo corto en lancha",
    "Comer en Pita Sabij o probar pan y pizza en Al Tempo",
    "Tomar café local en Cafe Las Cristalinas o Cafe Atitlan",
    "Salir de noche por Bar Sublime",
    "Estudiar español en escuelas locales",
    "Visitar el mercado y la parte alta del pueblo",
    "Conectar con San Juan, Santiago y Panajachel desde el muelle correcto"
  ]'::jsonb,
  transport_schedule = '[
    {
      "route": "Lanchas a Panajachel",
      "times": [
        "Salen cada 20-30 min desde el muelle principal, normalmente 6:00 AM - 5:00 PM. Precio aprox.: Q25-35."
      ]
    },
    {
      "route": "Lanchas a Santiago",
      "times": [
        "Salen desde el muelle secundario. Normalmente hay viajes directos cada hora o vía pueblos cercanos. Las últimas lanchas suelen salir alrededor de 4:30 PM."
      ]
    },
    {
      "route": "Tuk-tuks a San Juan",
      "times": [
        "Trayecto aprox. de 10 min. Precio típico: Q10-15 por persona. Confirmar localmente antes de subir."
      ]
    },
    {
      "route": "Shuttles a Antigua",
      "times": [
        "Salidas comunes temprano, media mañana y tarde, normalmente alrededor de 5:00 AM, 9:00-9:30 AM y 2:00-2:30 PM. Confirmar disponibilidad antes de reservar."
      ]
    }
  ]'::jsonb,
  services = '{
    "atms": [
      "Banrural",
      "ATM 5B",
      "Llevar efectivo recomendado"
    ],
    "essentials": [
      "Farmacias disponibles alrededor del centro",
      "Lavanderías locales cerca del área turística",
      "Tiendas básicas y pequeños supermercados",
      "Centro de salud local para atención médica básica",
      "Llevar efectivo, especialmente para lanchas, tuk-tuks y tiendas pequeñas"
    ]
  }'::jsonb
where slug = 'san-pedro';

commit;
