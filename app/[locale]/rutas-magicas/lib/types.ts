export type Region = 'europe' | 'asia' | 'america';
export type RouteEntityType = 'editorial_route' | 'town' | 'tour';

export interface Route {
  id: string;
  entityType: RouteEntityType;
  slug: string;
  title: string;
  summary: string;
  coverImage: string;
  region: Region;
  durationDays: number;
  groupSize: { min: number; max: number };
  wifiRating: 1 | 2 | 3 | 4 | 5;
  priceTier: 'budget' | 'standard' | 'premium';
  highlights: string[];
  fullDescription: string;
  price: number;
  rating: number;
  difficulty?: 'FÁCIL' | 'MEDIO' | 'DIFÍCIL' | 'EXTREMO';
  isRecommended?: boolean;
  isSubRoute?: boolean;
  tags?: string[];
  vibe?: string;
  isComingSoon?: boolean;
}
