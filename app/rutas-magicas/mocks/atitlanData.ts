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

export const pueblosAtitlan: Route[] = [
  {
    id: 'p1',
    slug: 'san-pedro-la-laguna',
    title: 'San Pedro La Laguna',
    summary: 'El pueblo más animado del lago con ambiente bohemio',
    coverImage: '/images/rutas/san-pedro.jpg',
    region: 'america',
    durationDays: 2,
    groupSize: { min: 1, max: 10 },
    wifiRating: 4,
    priceTier: 'budget',
    price: 450,
    rating: 4.8,
    isRecommended: true,
    highlights: [
      'Escuelas de español',
      'Vida nocturna animada',
      'Vistas al volcán San Pedro',
      'Mercado local colorido'
    ],
    fullDescription: 'San Pedro La Laguna es conocido por su ambiente relajado y su vibrante escena de mochileros. Es el lugar perfecto para aprender español, disfrutar de la vida nocturna o simplemente relajarse en uno de sus muchos cafés con vista al lago.'
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
    fullDescription: 'San Marcos es un refugio para aquellos que buscan paz y conexión espiritual. Con su ambiente relajado y su oferta de terapias alternativas, es el lugar ideal para desconectar y recargar energías.'
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
    fullDescription: 'Santiago Atitlán es el mayor de los pueblos que rodean el lago y el centro de la cultura tz\'utujil. Con su impresionante iglesia colonial y su mercado lleno de color, ofrece una visión auténtica de la vida maya contemporánea.'
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
    fullDescription: 'San Juan La Laguna es famoso por sus cooperativas de tejido y su compromiso con el comercio justo. Sus calles están llenas de coloridos murales que cuentan la historia y las tradiciones de la comunidad.'
  }
];
