import { Tour } from './types';
import sanPedroTours from './san-pedro-tours';
import sanMarcosTours from './san-marcos-tours';
import santiagoTours from './santiago-tours';
import sanJuanTours from './san-juan-tours';
import panajachelTours from './panajachel-tours';

// Tipado para el objeto de tours por pueblo
type PuebloTours = {
  [key: string]: Tour[];
};

// Inicializamos el objeto vacío
const allTours: PuebloTours = {};

// Función para registrar los tours de un pueblo
const registerTours = (puebloSlug: string, tours: Tour[]) => {
  allTours[puebloSlug] = tours;
};

// Registrar los tours de cada pueblo
registerTours('san-pedro-la-laguna', sanPedroTours);
registerTours('san-marcos-la-laguna', sanMarcosTours);
registerTours('santiago-atitlan', santiagoTours);
registerTours('san-juan-la-laguna', sanJuanTours);
registerTours('panajachel', panajachelTours);

// Función para obtener tours por pueblo
export const getToursByPueblo = (puebloSlug: string): Tour[] => {
  return allTours[puebloSlug] || [];
};

// Función para obtener un tour específico por su slug
export const getTourBySlug = (puebloSlug: string, tourSlug: string): Tour | undefined => {
  const tours = allTours[puebloSlug];
  return tours ? tours.find(tour => tour.slug === tourSlug) : undefined;
};

// Función para obtener un tour por su ID en todos los pueblos
export const getTourById = (tourId: string): Tour | undefined => {
  // Buscar en todos los pueblos
  for (const puebloSlug in allTours) {
    const tour = allTours[puebloSlug].find(t => t.id === tourId);
    if (tour) return tour;
  }
  return undefined;
};

// Exportamos funciones para su uso en otros archivos
export * from './types';
