export const destinationImages: Record<string, string> = {
  'Antigua Guatemala': '/images/destinations/antigua-guatemala.svg',
  'Ciudad de Guatemala / Aeropuerto': '/images/destinations/guatemala-city.svg',
  'El Paredón (Playa)': '/images/destinations/paredon-beach.svg',
  'Lanquín (Semuc Champey)': '/images/destinations/semuc-champey.svg',
  'Quetzaltenango (Xela)': '/images/destinations/xela.svg',
  'Río Dulce / Livingston': '/images/destinations/rio-dulce.svg',
};

export const getDestinationImage = (destination: string): string => {
  return destinationImages[destination] || '/images/shuttles/default-shuttle.svg';
};
