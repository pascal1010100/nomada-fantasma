import type { Database } from '@/types/database.types';

type SupabaseTour = Database['public']['Tables']['tours']['Row'];

export function getTourCoverImage(tour: Pick<SupabaseTour, 'cover_image' | 'cover_image_url' | 'images'>) {
  return tour.cover_image ?? tour.cover_image_url ?? tour.images?.[0] ?? '/images/tours/default-tour.svg';
}

export function formatTourTimeDisplay(value?: string | null) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return '';
  }

  const timeMatch = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(?:\s*([AaPp][Mm]))?$/);
  if (!timeMatch) {
    return trimmed;
  }

  const [, rawHours, minutes, meridiem] = timeMatch;
  const numericHours = Number.parseInt(rawHours, 10);
  if (Number.isNaN(numericHours)) {
    return trimmed;
  }

  if (meridiem) {
    return `${numericHours}:${minutes} ${meridiem.toUpperCase()}`;
  }

  const normalizedHours = numericHours % 24;
  const suffix = normalizedHours >= 12 ? 'PM' : 'AM';
  const hours12 = normalizedHours % 12 || 12;
  return `${hours12}:${minutes} ${suffix}`;
}
