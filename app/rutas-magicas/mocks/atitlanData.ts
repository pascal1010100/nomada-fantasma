import { Route } from '../lib/types';

export const atitlanInfo = {
  id: '1',
  slug: 'lago-atitlan',
  title: 'Lago de Atitlán',
  summary: 'Un paraíso rodeado de volcanes en Guatemala',
  coverImage: '/images/rutas/atitlan.jpg',
  fullDescription: `El Lago de Atitlán es uno de los destinos más impresionantes de Centroamérica, rodeado de volcanes y pueblos mayas llenos de color y tradición. Conocido por sus aguas cristalinas y paisajes espectaculares, es el lugar perfecto para desconectar y sumergirse en la cultura local.`,
  highlights: [
    'Vistas panorámicas del lago y volcanes',
    'Pueblos indígenas mayas llenos de cultura',
    'Actividades acuáticas y senderismo',
    'Gastronomía local única',
    'Amaneceres y atardeceres inolvidables'
  ],
  facts: {
    location: 'Sierra Madre de Guatemala',
    depth: '340 metros (más profundo de Centroamérica)',
    elevation: '1,560 metros sobre el nivel del mar',
    formation: 'Origen volcánico (hace 84,000 años)',
    bestTime: 'Noviembre a abril (temporada seca)'
  }
};

export const pueblosAtitlan: (Route & {
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    feelsLike: number;
    forecast: Array<{
      day: string;
      icon: string;
      high: number;
      low: number;
      pop: number;
    }>;
  };
  activities: string[];
  transportSchedule: Array<{
    route: string;
    times: string[] | string;
  }>;
  services: {
    atms: string[];
    essentials: string[];
  };
  guides: Array<{
    name: string;
    contact: string;
    languages: string[];
    tours: string[];
  }>;
})[] = [
    {
      id: 'p0',
      slug: 'panajachel',
      title: 'Panajachel',
      summary: 'La puerta de entrada al Lago de Atitlán. Conocida cariñosamente como "Pana", es el principal punto de acceso al Lago de Atitlán.',
      coverImage: '/images/rutas/panajachel.jpg',
      region: 'america',
      durationDays: 3,
      groupSize: { min: 1, max: 12 },
      wifiRating: 5,
      priceTier: 'standard',
      vibe: 'Cosmopolita & Compras',
      highlights: [
        'Calle Santander con tiendas y restaurantes',
        'Vida nocturna animada',
        'Vistas panorámicas del lago',
        'Acceso a otros pueblos del lago',
        'Mercado de artesanías'
      ],
      fullDescription: 'Panajachel, conocida cariñosamente como "Pana", es el principal punto de acceso al Lago de Atitlán. Ofrece una mezcla perfecta entre comodidades modernas y encanto local, con su famosa Calle Santander llena de tiendas, restaurantes y vida nocturna. Es el lugar ideal para comenzar tu aventura en el lago, con fácil acceso a los demás pueblos y una amplia gama de servicios turísticos.',
      price: 350,
      rating: 4.7,
      weather: {
        temp: 22,
        condition: 'Parcialmente nublado',
        humidity: 65,
        wind: 8,
        feelsLike: 24,
        forecast: [
          { day: 'Hoy', icon: '☀️', high: 26, low: 16, pop: 10 },
          { day: 'Mañana', icon: '⛅', high: 24, low: 15, pop: 20 },
          { day: 'Vie', icon: '🌧️', high: 22, low: 15, pop: 60 },
          { day: 'Sáb', icon: '🌦️', high: 23, low: 15, pop: 40 },
          { day: 'Dom', icon: '☀️', high: 25, low: 16, pop: 10 }
        ]
      },
      activities: [
        'Paseo por la Calle Santander',
        'Tour de compras de artesanías',
        'Paseo en bote por el lago',
        'Tour gastronómico',
        'Observación de aves',
        'Kayak al atardecer',
        'Visita a reservas naturales cercanas',
        'Tour fotográfico'
      ],
      transportSchedule: [
        { route: 'Lanchas Públicas (Muelle Tzanjuyú)', times: ['Salen cada 20-30 min hacia todos los pueblos (6:30 AM - 7:30 PM). Precio: Q25 extranjeros / Q10 locales.'] },
        { route: 'Shuttles a Antigua/Guate', times: ['5:30 AM, 8:00 AM, 12:00 PM, 4:00 PM. Precio: $15-25 USD. Reserva en agencias de Calle Santander.'] },
        { route: 'Chicken Bus (La Aventura)', times: ['Salidas frecuentes desde la parada principal. Ruta: Pana -> Sololá -> Los Encuentros -> Destino final. Precio: ~Q50 total.'] }
      ],
      services: {
        atms: ['Banco Industrial', 'Banrural', 'BAC', 'Banco G&T'],
        essentials: [
          'Farmacias: Farmacia Pana',
          'Hospital: Centro de Salud Panajachel',
          'Supermercados: Despensa Familiar',
          'Lavanderías',
          'Oficina de turismo'
        ]
      },
      guides: [
        {
          name: 'María González',
          contact: 'maria@nomadafantasma.com',
          languages: ['Español', 'Inglés'],
          tours: ['Tour Gastronómico', 'Tour Cultural']
        },
        {
          name: 'Juan Pérez',
          contact: 'juan@nomadafantasma.com',
          languages: ['Español', 'Kakchiquel', 'Inglés básico'],
          tours: ['Tour de Naturaleza', 'Tour de Aventura']
        }
      ]
    },
    {
      id: 'p1',
      slug: 'san-pedro',
      title: 'San Pedro La Laguna',
      summary: 'El pueblo más animado del lago con ambiente bohemio y vibrante vida nocturna',
      coverImage: '/images/rutas/san-pedro.jpg',
      region: 'america',
      durationDays: 3,
      groupSize: { min: 1, max: 12 },
      wifiRating: 4,
      priceTier: 'budget',
      vibe: 'Fiesta & Mochilero',
      price: 380,
      rating: 4.8,
      isRecommended: true,
      highlights: [
        'Escuelas de español',
        'Vida nocturna animada',
        'Vistas al volcán San Pedro',
        'Mercado local colorido'
      ],
      fullDescription: 'San Pedro La Laguna es conocido por su ambiente relajado y su vibrante escena de mochileros. Es el lugar perfecto para aprender español, disfrutar de la vida nocturna o simplemente relajarse en uno de sus muchos cafés con vista al lago.',
      weather: {
        temp: 22,
        condition: 'Soleado',
        humidity: 65,
        wind: 12,
        feelsLike: 24,
        forecast: [
          { day: 'Hoy', icon: 'sun', high: 26, low: 18, pop: 10 },
          { day: 'Mañana', icon: 'cloud-rain', high: 24, low: 17, pop: 40 },
          { day: 'Jue', icon: 'sun', high: 25, low: 18, pop: 20 },
          { day: 'Vie', icon: 'sunset', high: 26, low: 19, pop: 10 },
        ]
      },
      activities: [
        'Senderismo al Volcán San Pedro (4-6 horas de subida)',
        'Kayak al amanecer en el lago',
        'Clases de español en escuelas locales',
        'Tours de café por fincas locales',
        'Visita al mercado local de artesanías',
        'Clases de cocina tradicional',
        'Yoga al amanecer con vista al lago',
        'Paseo en bote a otros pueblos del lago'
      ],
      transportSchedule: [
        { route: 'Lanchas a Panajachel', times: ['Salen cada 20 min desde el muelle principal (6:00 AM - 5:00 PM). Precio: Q25.'] },
        { route: 'Lanchas a Santiago', times: ['Directo cada hora o vía otros pueblos. Última lancha ~4:30 PM.'] },
        { route: 'Tuk-tuks a San Juan', times: ['Trayecto de 10 min. Precio: Q10-15 por persona. Disponible todo el día.'] },
        { route: 'Shuttles a Antigua', times: ['Salidas diarias 4:30 AM, 8:30 AM, 2:00 PM. Reserva con tu hostal.'] }
      ],
      services: {
        atms: ['Banco Industrial', 'Banrural', '5B'],
        essentials: [
          'Farmacias: Farmacia San Pedro, Farmacia La Bendición',
          'Lavanderías: Lavandería La Esquina, Lavandería Central',
          'Supermercados: Despensa Familiar, Supermercado San Pedro',
          'Centro médico: Centro de Salud San Pedro La Laguna',
          'Oficina de correos: En el centro del pueblo'
        ]
      },
      guides: [
        {
          name: 'Juan Pérez',
          contact: '+502 1234-5678',
          languages: ['Español', 'Inglés'],
          tours: [
            'Tour al Volcán San Pedro (Q150-200 por persona)',
            'Tour de café por fincas locales (Q100-150)',
            'Tour cultural por el pueblo (Q80-120)'
          ]
        }
      ]
    },
    {
      id: 'p2',
      slug: 'san-marcos',
      title: 'San Marcos La Laguna',
      summary: 'Paraíso de bienestar y espiritualidad',
      coverImage: '/images/rutas/san-marcos.jpg',
      region: 'america',
      durationDays: 2,
      groupSize: { min: 1, max: 8 },
      wifiRating: 3,
      priceTier: 'budget',
      vibe: 'Yoga & Místico',
      price: 400,
      rating: 4.6,
      highlights: [
        'Retiros de yoga y meditación',
        'Clases de terapias alternativas',
        'Playas tranquilas',
        'Comunidad espiritual'
      ],
      fullDescription: 'San Marcos es un refugio para aquellos que buscan paz y conexión espiritual. Con su ambiente relajado y su oferta de terapias alternativas, es el lugar ideal para desconectar y recargar energías.',
      weather: {
        temp: 23,
        condition: 'Parcialmente nublado',
        humidity: 70,
        wind: 8,
        feelsLike: 25,
        forecast: [
          { day: 'Hoy', icon: 'cloud-sun', high: 25, low: 19, pop: 20 },
          { day: 'Mañana', icon: 'sun', high: 26, low: 18, pop: 10 },
          { day: 'Jue', icon: 'sun', high: 26, low: 19, pop: 10 },
          { day: 'Vie', icon: 'cloud-sun', high: 25, low: 18, pop: 20 },
        ]
      },
      activities: [
        'Clases de yoga al amanecer',
        'Sesiones de meditación guiada',
        'Masajes y terapias alternativas',
        'Círculos de canto y sonido',
        'Talleres de crecimiento personal',
        'Paseos en kayak al atardecer',
        'Caminatas por senderos naturales',
        'Clases de acroyoga'
      ],
      transportSchedule: [
        { route: 'Lanchas (Muelle Principal)', times: ['Hacia Pana o San Pedro cada 30 min (6:30 AM - 6:30 PM). Precio: Q25/Q15.'] },
        { route: 'Tuk-tuks a Tzununá', times: ['Viaje corto de 10 min. Precio: Q10 por persona.'] },
        { route: 'Caminata a Tzununá', times: ['Sendero seguro por la costa, aprox 45 min con vistas increíbles.'] }
      ],
      services: {
        atms: ['Banco Industrial', 'Banrural'],
        essentials: [
          'Farmacia: Farmacia San Marcos',
          'Tiendas de productos naturales',
          'Cafeterías con opciones veganas',
          'Centros de yoga y bienestar',
          'Oficina de turismo local'
        ]
      },
      guides: [
        {
          name: 'Ana Martínez',
          contact: 'ana@sanmarcosyoga.com',
          languages: ['Español', 'Inglés', 'Alemán'],
          tours: [
            'Retiro de yoga y meditación (Q200/día)',
            'Tour de sanación energética (Q150)',
            'Clase de acroyoga (Q80)'
          ]
        }
      ]
    },
    {
      id: 'p3',
      slug: 'santiago',
      title: 'Santiago Atitlán',
      summary: 'Cultura tz\'utujil y tradiciones ancestrales',
      coverImage: '/images/rutas/santiago.jpg',
      region: 'america',
      durationDays: 1,
      groupSize: { min: 2, max: 12 },
      wifiRating: 2,
      priceTier: 'budget',
      vibe: 'Tradición & Cultura',
      price: 380,
      rating: 4.5,
      highlights: [
        'Mercado indígena auténtico',
        'Iglesia de Santiago Apóstol',
        'Cofradías mayas',
        'Artesanías tradicionales'
      ],
      fullDescription: 'Santiago Atitlán es el mayor de los pueblos que rodean el lago y el centro de la cultura tz\'utujil. Con su impresionante iglesia colonial y su mercado lleno de color, ofrece una visión auténtica de la vida maya contemporánea.',
      weather: {
        temp: 24,
        condition: 'Soleado',
        humidity: 68,
        wind: 10,
        feelsLike: 26,
        forecast: [
          { day: 'Hoy', icon: 'sun', high: 27, low: 19, pop: 15 },
          { day: 'Mañana', icon: 'sun', high: 28, low: 20, pop: 5 },
          { day: 'Jue', icon: 'cloud-sun', high: 26, low: 19, pop: 20 },
          { day: 'Vie', icon: 'sun', high: 27, low: 20, pop: 10 },
        ]
      },
      activities: [
        'Recorrido por el mercado indígena',
        'Visita a la Iglesia de Santiago Apóstol',
        'Tour por las cofradías mayas',
        'Taller de artesanías locales',
        'Paseo en bote por el lago',
        'Visita al museo local',
        'Degustación de comida típica',
        'Caminata por el centro histórico'
      ],
      transportSchedule: [
        { route: 'Lanchas a Panajachel', times: ['Directo (30 min) cada hora. Última lancha ~5:00 PM. Precio: Q25.'] },
        { route: 'Lanchas a San Pedro', times: ['Frecuentes desde el muelle cerca del mercado. Precio: Q25.'] },
        { route: 'Chicken Bus a San Lucas', times: ['Salen del parque central. Conexión a la costa sur.'] }
      ],
      services: {
        atms: ['Banco Industrial', 'Banrural', 'BAM'],
        essentials: [
          'Farmacia: Farmacia Santiago',
          'Centro de salud local',
          'Mercado municipal',
          'Oficina de correos',
          'Tiendas de artesanías'
        ]
      },
      guides: [
        {
          name: 'Carlos Méndez',
          contact: 'carlos@toursantiago.com',
          languages: ['Español', 'Inglés', 'Tz\'utujil'],
          tours: [
            'Tour cultural por Santiago (Q120)',
            'Visita a las cofradías mayas (Q150)',
            'Taller de tejido tradicional (Q100)'
          ]
        }
      ]
    },
    {
      id: 'p4',
      slug: 'san-juan',
      title: 'San Juan La Laguna',
      summary: 'Arte, textiles y café orgánico',
      coverImage: '/images/rutas/san-juan.jpg',
      region: 'america',
      durationDays: 1,
      groupSize: { min: 2, max: 10 },
      wifiRating: 3,
      priceTier: 'budget',
      vibe: 'Arte & Café',
      price: 420,
      rating: 4.4,
      highlights: [
        'Cooperativas de mujeres tejedoras',
        'Talleres de teñido natural',
        'Cafetales orgánicos',
        'Galerías de arte local'
      ],
      fullDescription: 'San Juan La Laguna es famoso por sus cooperativas de tejido y su compromiso con el comercio justo. Sus calles están llenas de coloridos murales que cuentan la historia y las tradiciones de la comunidad.',
      weather: {
        temp: 23,
        condition: 'Parcialmente nublado',
        humidity: 67,
        wind: 9,
        feelsLike: 25,
        forecast: [
          { day: 'Hoy', icon: 'cloud-sun', high: 26, low: 19, pop: 20 },
          { day: 'Mañana', icon: 'sun', high: 27, low: 20, pop: 10 },
          { day: 'Jue', icon: 'sun', high: 27, low: 20, pop: 10 },
          { day: 'Vie', icon: 'cloud-sun', high: 26, low: 19, pop: 20 },
        ]
      },
      activities: [
        'Visita a cooperativas de tejido',
        'Taller de teñido natural',
        'Tour por cafetales orgánicos',
        'Recorrido por galerías de arte',
        'Caminata por el pueblo y sus murales',
        'Clase de tejido tradicional',
        'Degustación de café local',
        'Paseo en bote al atardecer'
      ],
      transportSchedule: [
        { route: 'Tuk-tuks a San Pedro', times: ['Rápido y divertido (10 min). Precio: Q10-15.'] },
        { route: 'Lanchas (Muelle)', times: ['Hacia Pana cada 30-45 min. Precio: Q25.'] },
        { route: 'Caminata a San Pedro', times: ['Agradable paseo de 30-40 min por la carretera pavimentada.'] }
      ],
      services: {
        atms: ['Banco Industrial', 'Banrural'],
        essentials: [
          'Farmacia: Farmacia San Juan',
          'Tiendas de artesanías',
          'Cafeterías locales',
          'Oficina de información turística',
          'Tiendas de productos orgánicos'
        ]
      },
      guides: [
        {
          name: 'María González',
          contact: 'maria@artesaniasanjuan.com',
          languages: ['Español', 'Inglés'],
          tours: [
            'Tour por las cooperativas de tejido (Q120)',
            'Taller de teñido natural (Q150)',
            'Tour de café orgánico (Q100)'
          ]
        }
      ]
    },
    {
      id: 'p5',
      slug: 'santa-cruz',
      title: 'Santa Cruz La Laguna',
      summary: 'Pueblo tranquilo con las mejores vistas y buceo de altura',
      coverImage: '/images/rutas/santa-cruz-authentic.jpg',
      region: 'america',
      durationDays: 2,
      groupSize: { min: 1, max: 8 },
      wifiRating: 3,
      priceTier: 'standard',
      vibe: 'Relax & Vistas',
      price: 450,
      rating: 4.7,
      highlights: [
        'Buceo de altura en el lago',
        'Vistas panorámicas increíbles',
        'Senderismo a Jaibalito',
        'Hoteles con acceso directo al lago'
      ],
      fullDescription: 'Santa Cruz La Laguna es un pueblo pintoresco y tranquilo, accesible solo por lancha. Es famoso por tener algunas de las mejores vistas del lago y los volcanes, así como por ser el hogar de la única escuela de buceo profesional en Atitlán. Es el lugar perfecto para relajarse, nadar y disfrutar de la naturaleza sin las multitudes.',
      weather: {
        temp: 24,
        condition: 'Soleado',
        humidity: 60,
        wind: 10,
        feelsLike: 26,
        forecast: [
          { day: 'Hoy', icon: 'sun', high: 26, low: 18, pop: 0 },
          { day: 'Mañana', icon: 'sun', high: 26, low: 18, pop: 0 },
          { day: 'Mié', icon: 'cloud-sun', high: 25, low: 19, pop: 20 },
          { day: 'Jue', icon: 'sun', high: 27, low: 19, pop: 0 }
        ]
      },
      activities: [
        'Buceo y snorkeling',
        'Kayak y paddleboard',
        'Senderismo por la costa',
        'Clases de cocina maya',
        'Relajación en hamacas frente al lago',
        'Visita al centro vocacional CECAP'
      ],
      transportSchedule: [
        { route: 'Lanchas a Panajachel', times: ['Muy frecuentes (cada 20 min). Precio: Q10 (tarifa local/corta). Última lancha 7:00 PM.'] },
        { route: 'Lanchas a San Pedro', times: ['Pasan cada 30 min rumbo oeste. Haz señas desde el muelle. Precio: Q20-25.'] },
        { route: 'Caminata a Jaibalito', times: ['Sendero escénico de 20-30 min. ¡Vistas increíbles!'] }
      ],
      services: {
        atms: [], // No hay cajeros
        essentials: [
          'Centro de Salud',
          'Pequeñas tiendas locales',
          'Escuela de buceo',
          'Restaurantes de hoteles'
        ]
      },
      guides: [
        {
          name: 'Carlos Mendez',
          contact: 'carlos@santacruzdiving.com',
          languages: ['Español', 'Inglés'],
          tours: [
            'Discovery Dive (Q650)',
            'Caminata a Jaibalito (Q150)',
            'Tour de Kayak (Q200)'
          ]
        }
      ]
    }
  ];
