import type { Database } from '@/types/database.types';

type SupabaseTour = Database['public']['Tables']['tours']['Row'];

export function getTourCoverImage(tour: Pick<SupabaseTour, 'cover_image' | 'cover_image_url' | 'images'>) {
  return tour.cover_image ?? tour.cover_image_url ?? tour.images?.[0] ?? '/images/tours/default-tour.svg';
}
