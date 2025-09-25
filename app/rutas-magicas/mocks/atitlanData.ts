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
      { route: 'Ciudad de Guatemala → Panajachel', times: ['4:30', '7:00', '9:30', '12:00', '14:30', '17:00'] },
      { route: 'Panajachel → San Pedro', times: ['Cada 30 min', '5:30 - 18:30'] },
      { route: 'Panajachel → San Marcos', times: ['Cada 45 min', '6:00 - 18:00'] },
      { route: 'Panajachel → San Juan', times: ['Cada hora', '7:00 - 17:30'] },
      { route: 'Panajachel → Aeropuerto La Aurora', times: ['3:30', '6:00', '8:30', '11:00', '13:30', '16:00'] }
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
    slug: 'san-pedro-la-laguna',
    title: 'San Pedro La Laguna',
    summary: 'El pueblo más animado del lago con ambiente bohemio y vibrante vida nocturna',
    coverImage: '/images/rutas/san-pedro.jpg',
    region: 'america',
    durationDays: 3,
    groupSize: { min: 1, max: 12 },
    wifiRating: 4,
    priceTier: 'budget',
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
      { route: 'Panajachel → San Pedro', times: ['5:30', '7:00', '8:30', '10:00', '12:00', '14:00', '16:00', '17:30'] },
      { route: 'San Pedro → Santiago', times: ['7:00', '9:00', '11:00', '13:00', '15:00', '17:00'] },
      { route: 'San Pedro → San Marcos', times: ['Cada 30 min', '6:00 - 19:00'] },
      { route: 'San Pedro → San Juan', times: ['Cada 45 min', '6:30 - 18:30'] },
      { route: 'San Pedro → Ciudad de Guatemala', times: ['4:30', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00'] },
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
    slug: 'san-marcos-la-laguna',
    title: 'San Marcos La Laguna',
    summary: 'Paraíso de bienestar y espiritualidad',
    coverImage: '/images/rutas/san-marcos.jpg',
    region: 'america',
    durationDays: 2,
    groupSize: { min: 1, max: 8 },
    wifiRating: 3,
    priceTier: 'budget',
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
      { route: 'Panajachel → San Marcos', times: ['6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00'] },
      { route: 'San Marcos → San Pedro', times: ['7:30', '9:30', '11:30', '13:30', '15:30', '17:30'] },
      { route: 'San Marcos → San Juan', times: ['Cada hora', '7:00 - 19:00'] },
      { route: 'San Marcos → Ciudad de Guatemala', times: ['5:00', '7:00', '9:00', '11:00', '13:00', '15:00'] },
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
    slug: 'santiago-atitlan',
    title: 'Santiago Atitlán',
    summary: 'Cultura tz\'utujil y tradiciones ancestrales',
    coverImage: '/images/rutas/santiago.jpg',
    region: 'america',
    durationDays: 1,
    groupSize: { min: 2, max: 12 },
    wifiRating: 2,
    priceTier: 'budget',
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
      { route: 'Panajachel → Santiago', times: ['6:30', '9:00', '11:30', '14:00', '16:30'] },
      { route: 'Santiago → San Pedro', times: ['7:30', '10:00', '12:30', '15:00', '17:30'] },
      { route: 'Santiago → San Marcos', times: ['Cada hora', '7:00 - 18:00'] },
      { route: 'Santiago → Ciudad de Guatemala', times: ['4:00', '6:30', '9:00', '11:30', '14:00', '16:30'] },
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
    slug: 'san-juan-la-laguna',
    title: 'San Juan La Laguna',
    summary: 'Arte, textiles y café orgánico',
    coverImage: '/images/rutas/san-juan.jpg',
    region: 'america',
    durationDays: 1,
    groupSize: { min: 2, max: 10 },
    wifiRating: 3,
    priceTier: 'budget',
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
      { route: 'Panajachel → San Juan', times: ['7:00', '9:30', '12:00', '14:30', '17:00'] },
      { route: 'San Juan → San Pedro', times: ['Cada 45 min', '6:30 - 18:30'] },
      { route: 'San Juan → San Marcos', times: ['Cada hora', '7:00 - 18:00'] },
      { route: 'San Juan → Ciudad de Guatemala', times: ['5:30', '8:00', '10:30', '13:00', '15:30'] },
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
  }
];
