// app/mapa/types.ts
import { Wifi, Bed, Coffee, CreditCard, Anchor } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export type CategoryKey = 'wifi' | 'hospedaje' | 'cowork' | 'banco' | 'puerto';

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

export const CATEGORIES: CategoryInfo[] = [
  { 
    key: 'wifi', 
    label: 'Wi-Fi', 
    color: '#3b82f6', // blue-500
    icon: Wifi 
  },
  { 
    key: 'hospedaje', 
    label: 'Hospedaje', 
    color: '#8b5cf6', // purple-500
    icon: Bed 
  },
  { 
    key: 'cowork', 
    label: 'Coworking', 
    color: '#10b981', // emerald-500
    icon: Coffee 
  },
  { 
    key: 'banco', 
    label: 'Banco/ATM', 
    color: '#f59e0b', // amber-500
    icon: CreditCard 
  },
  { 
    key: 'puerto', 
    label: 'Puerto', 
    color: '#ef4444', // red-500
    icon: Anchor 
  }
];
