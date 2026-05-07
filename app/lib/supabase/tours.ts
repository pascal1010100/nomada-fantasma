import { supabaseAdmin } from '@/app/lib/supabase/server';
import type { Database } from '@/types/database.types';
import { normalizeId, normalizeSlug, type Tour } from '@/app/lib/types';
import { getTourCoverImage } from '@/app/lib/tours';
import logger from '@/app/lib/logger';

export type SupabaseTour = Database['public']['Tables']['tours']['Row'];

const mapSupabaseTourToUi = (tour: SupabaseTour): Tour => {
  const meetingPoint = (tour as { meeting_point?: string | null }).meeting_point ?? '';
  const pickupTime = (tour as { pickup_time?: string | null }).pickup_time ?? null;
  const imageUrl = getTourCoverImage(tour);
  const slug = normalizeSlug(tour.slug) ?? normalizeId(tour.id) ?? '';

  return {
    id: tour.id,
    created_at: tour.created_at,
    name: tour.title,
    title: tour.title,
    description: tour.description ?? '',
    pueblo_slug: tour.pueblo_slug,
    price: tour.price_min ?? null,
    price_min: tour.price_min ?? null,
    price_max: tour.price_max ?? null,
    image_url: imageUrl,
    duration_hours: tour.duration_hours ?? 0,
    is_active: tour.is_active,
    meeting_point: meetingPoint,
    pickup_time: pickupTime,
    slug,
  };
};

export async function getTourBySlugFromDB(slug?: string, puebloSlug?: string) {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  try {
    let slugQuery = supabaseAdmin
      .from('tours')
      .select('*')
      .eq('slug', normalizedSlug);

    if (puebloSlug) {
      slugQuery = slugQuery.eq('pueblo_slug', puebloSlug);
    }

    const { data } = await slugQuery.single();

    if (data) {
      return data;
    }

    let idQuery = supabaseAdmin
      .from('tours')
      .select('*')
      .eq('id', normalizedSlug);

    if (puebloSlug) {
      idQuery = idQuery.eq('pueblo_slug', puebloSlug);
    }

    const { data: byId } = await idQuery.single();

    if (byId) {
      return byId;
    }
  } catch {
    return null;
  }

  return null;
}

export async function getToursByPuebloFromDB(puebloSlug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('pueblo_slug', puebloSlug)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    const tours: SupabaseTour[] = data ?? [];
    return tours
      .map((tour) => mapSupabaseTourToUi(tour))
      .filter((tour) => Boolean(normalizeSlug(tour.slug) ?? normalizeId(tour.id)));
  } catch {
    return [];
  }
}

export async function getRecommendedToursFromDB(excludeSlug?: string, limit = 3): Promise<SupabaseTour[]> {
  const normalizedExcludeSlug = normalizeSlug(excludeSlug);
  try {
    let query = supabaseAdmin
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false })
      .limit(limit);

    if (normalizedExcludeSlug) {
      query = query.neq('slug', normalizedExcludeSlug);
    }

    const { data, error } = await query;

    if (error) {
      logger.warn('Unable to load recommended tours; continuing without related routes.', {
        excludeSlug: normalizedExcludeSlug,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return [];
    }

    return data ?? [];
  } catch (error) {
    logger.warn('Unable to load recommended tours; continuing without related routes.', {
      excludeSlug: normalizedExcludeSlug,
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}

export async function getActiveToursFromDB(): Promise<SupabaseTour[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('tours')
      .select('*')
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('rating', { ascending: false });

    if (error) {
      return [];
    }

    return data ?? [];
  } catch {
    return [];
  }
}
