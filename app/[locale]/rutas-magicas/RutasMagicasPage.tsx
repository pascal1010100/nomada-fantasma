import RutasMagicasClient from './RutasMagicasClient';
import { getCatalogRoutes } from './lib/catalogRoutes';

export default async function RutasMagicasPage() {
  const routes = await getCatalogRoutes();

  return <RutasMagicasClient routes={routes} />;
}
