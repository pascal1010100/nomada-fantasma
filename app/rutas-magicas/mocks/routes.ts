import { Route } from '../lib/types';

export const mockRoutes: Route[] = [
  {
    id: '1',
    slug: 'lago-atitlan',
    title: 'Lago de Atitlán',
    summary: 'Un paraíso rodeado de volcanes en Guatemala',
    coverImage: '/images/rutas/atitlan.jpg',
    region: 'america',
    durationDays: 5,
    groupSize: { min: 4, max: 12 },
    wifiRating: 4,
    priceTier: 'standard',
    highlights: [
      'Vistas panorámicas del lago',
      'Pueblos indígenas mayas',
      'Amaneceres inolvidables'
    ],
    fullDescription: 'El Lago de Atitlán es uno de los destinos más impresionantes de Centroamérica, rodeado de volcanes y pueblos mayas llenos de color y tradición.',
    price: 750,
    rating: 4.8
  },
  {
    id: '2',
    slug: 'selva-amazonica',
    title: 'Selva Amazónica',
    summary: 'Aventura en el pulmón del planeta',
    coverImage: '/images/rutas/amazonas.jpg',
    region: 'america',
    durationDays: 7,
    groupSize: { min: 6, max: 15 },
    wifiRating: 2,
    priceTier: 'premium',
    highlights: [
      'Avistamiento de fauna exótica',
      'Navegación por el río Amazonas',
      'Alojamiento en ecolodges'
    ],
    fullDescription: 'Sumérgete en la biodiversidad más grande del mundo con esta experiencia única en la selva amazónica.',
    price: 1200,
    rating: 4.9
  },
  {
    id: '3',
    slug: 'islas-griegas',
    title: 'Islas Griegas',
    summary: 'Navega por el Egeo entre islas de ensueño',
    coverImage: '/images/rutas/grecia.jpg',
    region: 'europe',
    durationDays: 10,
    groupSize: { min: 8, max: 20 },
    wifiRating: 5,
    priceTier: 'premium',
    highlights: [
      'Puestas de sol en Santorini',
      'Playas de aguas cristalinas',
      'Gastronomía mediterránea'
    ],
    fullDescription: 'Descubre la magia de las islas griegas con este recorrido que combina historia, playas y cultura.',
    price: 1800,
    rating: 4.7
  }
];
