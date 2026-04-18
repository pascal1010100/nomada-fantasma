import type { Route } from './types';

export const EDITORIAL_ROUTES: Route[] = [
  {
    id: '1',
    entityType: 'editorial_route',
    slug: 'lago-atitlan',
    title: 'Lago de Atitlan',
    summary: 'Un paraiso rodeado de volcanes en Guatemala',
    coverImage: '/images/rutas/atitlan.jpg',
    region: 'america',
    durationDays: 5,
    groupSize: { min: 4, max: 12 },
    wifiRating: 4,
    priceTier: 'standard',
    highlights: [
      'Vistas panoramicas del lago',
      'Pueblos indigenas mayas',
      'Amaneceres inolvidables',
    ],
    fullDescription:
      'El Lago de Atitlan es uno de los destinos mas impresionantes de Centroamerica, rodeado de volcanes y pueblos mayas llenos de color y tradicion.',
    price: 750,
    vibe: 'Paraiso Volcanico',
    rating: 4.8,
    isRecommended: true,
  },
  {
    id: '2',
    entityType: 'editorial_route',
    slug: 'coban',
    title: 'Coban',
    summary: 'Naturaleza exuberante y cultura viva en Alta Verapaz',
    coverImage: '/images/rutas/coban.jpg',
    region: 'america',
    durationDays: 4,
    groupSize: { min: 6, max: 15 },
    wifiRating: 3,
    priceTier: 'standard',
    highlights: [
      'Semuc Champey y sus pozas turquesas',
      'Orquigonia y reservas naturales',
      "Cultura Q'eqchi' y gastronomia local",
    ],
    fullDescription:
      'Adentrate en el corazon verde de Guatemala, donde la niebla besa las montanas y las aguas cristalinas de Semuc Champey te invitan a la aventura.',
    price: 600,
    vibe: 'Naturaleza & Grutas',
    rating: 4.8,
    isComingSoon: true,
  },
  {
    id: '3',
    entityType: 'editorial_route',
    slug: 'antigua-guatemala',
    title: 'Antigua Guatemala',
    summary: 'Historia colonial y volcanes majestuosos',
    coverImage: '/images/rutas/antigua.jpg',
    region: 'america',
    durationDays: 3,
    groupSize: { min: 2, max: 20 },
    wifiRating: 5,
    priceTier: 'standard',
    highlights: [
      'Arco de Santa Catalina y calles empedradas',
      'Ruinas coloniales y museos',
      'Vistas impresionantes de volcanes',
    ],
    fullDescription:
      'Recorre las calles de una de las ciudades coloniales mas bellas del mundo, rodeada de volcanes y llena de historia en cada rincon.',
    price: 450,
    vibe: 'Historia Colonial',
    rating: 4.9,
    isComingSoon: true,
  },
];

export function getEditorialRouteBySlug(slug: string): Route | null {
  return EDITORIAL_ROUTES.find((route) => route.slug === slug || route.id === slug) ?? null;
}
