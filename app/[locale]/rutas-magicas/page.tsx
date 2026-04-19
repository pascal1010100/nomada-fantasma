import type { Metadata } from 'next';
import RutasMagicasClient from './RutasMagicasClient';
import { getCatalogRoutes } from './lib/catalogRoutes';

export const metadata: Metadata = {
  title: 'Rutas Magicas en Guatemala | Nomada Fantasma',
  description:
    'Descubre destinos, pueblos y experiencias en Guatemala. Explora Lago Atitlan, rutas inolvidables y transporte util para viajar mejor.',
};

export default async function RutasMagicasPage() {
  const routes = await getCatalogRoutes();

  return <RutasMagicasClient routes={routes} />;
}
