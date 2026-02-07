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

export type AccommodationType = 'hotel' | 'hostel' | 'camping';

export interface Review {
  id: string;
  user: string;
  date: string;
  rating: number;
  comment: string;
  tags?: string[];
  avatar?: string;
}

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  priceRange: string;
  rating: number;
  description: string;
  amenities: string[];
  image: string;
  gallery?: string[];
  vibeMetrics?: {
    chill: number; // 0-10
    party: number; // 0-10
    work: number; // 0-10
    social: number; // 0-10
  };
  contact?: string;
  bookingUrl?: string;
  reviews?: Review[];
  pricePerNight?: number; // Price in Quetzales per night
}

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
  accommodations?: Accommodation[];
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
      ],
      accommodations: [
        {
          id: 'pana-acc1',
          name: 'Hotel Atitlán',
          type: 'hotel',
          priceRange: '$$$',
          rating: 4.8,
          description: 'Elegancia colonial con jardines botánicos y vistas impresionantes al lago.',
          amenities: ['Piscina', 'Jardines', 'Restaurante', 'Wifi'],
          image: '/images/rutas/panajachel.jpg',
          contact: '+502 7762-1441',
          bookingUrl: '#'
        },
        {
          id: 'pana-acc2',
          name: 'Dreamboat Hostel',
          type: 'hostel',
          priceRange: '$',
          rating: 4.6,
          description: 'El hostal más social de Pana, famoso por su "family dinner" y ambiente festivo.',
          amenities: ['Bar', 'Wifi', 'Eventos diarios', 'Dormitorios'],
          image: '/images/rutas/airbnb-lake.jpg',
          contact: '+502 5555-4321'
        },
        {
          id: 'pana-acc3',
          name: 'Reserva Natural Atitlán',
          type: 'camping',
          priceRange: '$$',
          rating: 4.7,
          description: 'Acampa dentro de una reserva natural con cascadas, monos y mariposas.',
          amenities: ['Senderos', 'Playa privada', 'Duchas', 'Fogata'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 7762-2565'
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
      ],
      accommodations: [
        {
          id: 'acc1',
          name: 'Hotel Mikaso',
          type: 'hotel',
          priceRange: '$$',
          rating: 4.8,
          description: 'Hotel boutique con vistas espectaculares al lago y terraza panorámica.',
          amenities: ['Wifi', 'Restaurante', 'Terraza', 'Baño privado'],
          image: '/images/rutas/mikaso.jpg',
          contact: '+502 7721-8273',
          bookingUrl: '#'
        },
        {
          id: 'acc2',
          name: 'Hostal Mandalas',
          type: 'hostel',
          priceRange: '$',
          rating: 4.7,
          description: 'Un hogar bohemio lejos de casa. Ambiente tranquilo y artístico, ideal para relajar, cocinar y disfrutar de las vistas desde la terraza.',
          amenities: ['Terraza Panorámica', 'Cocina Compartida', 'Wifi Gratis', 'Jardín', 'Ambiente Bohemio'],
          image: '/images/rutas/mandalas-hostal.png',
          gallery: [
            '/images/rutas/mandalas-hostal.png',
            '/images/rutas/san-pedro.jpg', // Placeholder for view
            '/images/rutas/atitlan.jpg'    // Placeholder for lake
          ],
          vibeMetrics: {
            chill: 9,
            party: 2,
            work: 7,
            social: 8
          },
          contact: '+502 5555-6789', // Placeholder kept
          reviews: [
            {
              id: 'r1',
              user: 'Sarah Jenkins',
              date: 'Hace 2 semanas',
              rating: 5,
              comment: '¡Increíble lugar! La terraza es mágica para el yoga matutino y la comunidad es súper acogedora. Definitivamente el mejor vibe de San Pedro.',
              tags: ['🧘‍♀️ Yoga Friendly', '💻 Buen Wifi', '✨ Vistas Épicas'],
              avatar: 'https://i.pravatar.cc/150?u=sarah'
            },
            {
              id: 'r2',
              user: 'Mateo R.',
              date: 'Hace 1 mes',
              rating: 4,
              comment: 'Muy buen hostal, limpio y con buena cocina. Un poco de ruido los fines de semana pero nada grave. ¡Recomendado!',
              tags: ['🍳 Cocina Equipada', '🎉 Social'],
              avatar: 'https://i.pravatar.cc/150?u=mateo'
            },
            {
              id: 'r3',
              user: 'Elena K.',
              date: 'Hace 3 semanas',
              rating: 5,
              comment: 'Me sentí como en casa. El staff es súper amable y me ayudaron a organizar todos mis tours. Volveré seguro.',
              tags: ['❤️ Staff Amable', '🛡️ Seguro'],
              avatar: 'https://i.pravatar.cc/150?u=elena'
            }
          ],
          pricePerNight: 150 // Q150 per night for dorm bed
        },
        {
          id: 'acc3',
          name: 'Camping San Pedro',
          type: 'camping',
          priceRange: '$',
          rating: 4.5,
          description: 'Zona de camping segura con baños y duchas calientes.',
          amenities: ['Duchas', 'Seguridad 24h', 'Fogata', 'Alquiler de tiendas'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 5555-1234'
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
      ],
      accommodations: [
        {
          id: 'sm-acc1',
          name: 'Lush Atitlán',
          type: 'hotel',
          priceRange: '$$$',
          rating: 4.9,
          description: 'Suites ecológicas de lujo integradas en la ladera de la montaña.',
          amenities: ['Desayuno orgánico', 'Vistas', 'Jardines', 'Masajes'],
          image: '/images/rutas/san-marcos.jpg',
          contact: '+502 7723-4169',
          bookingUrl: '#'
        },
        {
          id: 'sm-acc2',
          name: "Eagle's Nest",
          type: 'hostel',
          priceRange: '$$',
          rating: 4.8,
          description: 'Famoso por su plataforma de yoga con vista de 360 grados y comunidad vibrante.',
          amenities: ['Yoga ilimitado', 'Sauna', 'Comida vegetariana', 'Eventos'],
          image: '/images/rutas/airbnb-lake.jpg',
          contact: '+502 5555-8888'
        },
        {
          id: 'sm-acc3',
          name: "Pierre's Place",
          type: 'camping',
          priceRange: '$',
          rating: 4.5,
          description: 'Camping económico y céntrico, cerca del muelle y la zona de restaurantes.',
          amenities: ['Cocina compartida', 'Wifi', 'Jardín', 'Seguridad'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 5555-9999'
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
      ],
      accommodations: [
        {
          id: 'stg-acc1',
          name: 'Posada de Santiago',
          type: 'hotel',
          priceRange: '$$',
          rating: 4.7,
          description: 'Cabañas de piedra volcánica y jardines frente al lago, muy acogedor.',
          amenities: ['Piscina', 'Restaurante', 'Muelle privado', 'Kayaks'],
          image: '/images/rutas/santiago.jpg',
          contact: '+502 7721-7366',
          bookingUrl: '#'
        },
        {
          id: 'stg-acc2',
          name: 'Tiosh Abaj',
          type: 'hotel',
          priceRange: '$$',
          rating: 4.6,
          description: 'Hotel cultural con arquitectura maya y amplios jardines.',
          amenities: ['Piscina', 'Temazcal', 'Restaurante', 'Museo'],
          image: '/images/rutas/mikaso.jpg',
          contact: '+502 7721-7272'
        },
        {
          id: 'stg-acc3',
          name: 'Camping El Mirador',
          type: 'camping',
          priceRange: '$',
          rating: 4.4,
          description: 'Área de camping rústica con las mejores vistas de los tres volcanes.',
          amenities: ['Vistas panorámicas', 'Agua potable', 'Seguridad', 'Fogata'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 5555-7777'
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
      ],
      accommodations: [
        {
          id: 'sj-acc1',
          name: 'Eco-Hotel Mayachik',
          type: 'hotel',
          priceRange: '$$',
          rating: 4.8,
          description: 'Bungalows ecológicos rodeados de naturaleza y tranquilidad.',
          amenities: ['Restaurante vegetariano', 'Sauna', 'Jardines', 'Wifi'],
          image: '/images/rutas/san-juan.jpg',
          contact: '+502 7723-4028',
          bookingUrl: '#'
        },
        {
          id: 'sj-acc2',
          name: 'Posada Mana',
          type: 'hostel',
          priceRange: '$',
          rating: 4.5,
          description: 'Hostal familiar y acogedor en el corazón del pueblo.',
          amenities: ['Cocina compartida', 'Terraza', 'Wifi', 'Información turística'],
          image: '/images/rutas/airbnb-lake.jpg',
          contact: '+502 5555-6666'
        },
        {
          id: 'sj-acc3',
          name: 'Camping La Nariz',
          type: 'camping',
          priceRange: '$',
          rating: 4.7,
          description: 'Experiencia única de camping en la cima de la Nariz del Indio (requiere guía).',
          amenities: ['Vistas amanecer', 'Fogata', 'Guía incluido', 'Tiendas'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 5555-5555'
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
      ],
      accommodations: [
        {
          id: 'sc-acc1',
          name: 'Laguna Lodge',
          type: 'hotel',
          priceRange: '$$$',
          rating: 4.9,
          description: 'Reserva natural y hotel de lujo, accesible solo por lancha.',
          amenities: ['Spa', 'Restaurante gourmet', 'Reserva privada', 'Piscina'],
          image: '/images/rutas/santa-cruz-authentic.jpg',
          contact: '+502 7762-0080',
          bookingUrl: '#'
        },
        {
          id: 'sc-acc2',
          name: 'La Iguana Perdida',
          type: 'hostel',
          priceRange: '$',
          rating: 4.7,
          description: 'El hostal legendario de Santa Cruz, hogar de buceadores y viajeros.',
          amenities: ['Escuela de buceo', 'Restaurante familiar', 'Bar', 'Juegos'],
          image: '/images/rutas/airbnb-lake.jpg',
          contact: '+502 7762-0011'
        },
        {
          id: 'sc-acc3',
          name: 'Free Cerveza',
          type: 'camping',
          priceRange: '$$',
          rating: 4.8,
          description: 'Glamping de lujo frente al lago con ambiente social y divertido.',
          amenities: ['Glamping', 'Paddleboards gratis', 'Cenas comunales', 'Bar'],
          image: '/images/rutas/camping.jpg',
          contact: '+502 5555-4444'
        }
      ]
    }
  ];
