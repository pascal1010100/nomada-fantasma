import type { Route } from './types';
import { EDITORIAL_ROUTES } from './editorialRoutes';

export async function getCatalogRoutes(): Promise<Route[]> {
  return EDITORIAL_ROUTES;
}
