export type Difficulty = 'Fácil' | 'Moderado' | 'Difícil';

export interface Price {
  adult: number;
  child?: number;
  privateGroup?: number;
}

export interface ItineraryItem {
  time: string;
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Capacity {
  min: number;
  max: number;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  duration: string;
  difficulty: Difficulty;
  price: Price;
  includes: string[];
  notIncludes: string[];
  meetingPoint: string;
  whatToBring: string[];
  images: string[];
  highlights: string[];
  itinerary: ItineraryItem[];
  faqs?: FAQ[];
  recommendations?: string[];
  capacity: Capacity;
  availableDays: string[];
  startTimes: string[];
  isPopular?: boolean;
  rating?: number;
  availability?: string;
}
