// app/mapa/types.ts
import type { LucideIcon } from 'lucide-react';
import type { CategoryKey } from './constants';
export { CATEGORIES } from './constants';
export type { CategoryKey };

export interface Point {
  id: string;
  name: string;
  category: CategoryKey;
  lat: number;
  lng: number;
  description?: string;
}

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  color: string;
  icon: LucideIcon;
}
