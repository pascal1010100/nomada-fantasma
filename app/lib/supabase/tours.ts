import { supabaseAdmin } from '@/app/lib/supabase/server';
import type { Database } from '@/types/database.types';
import { normalizeId, normalizeSlug, type Tour } from '@/app/lib/types';

type SupabaseTour = Database['public']['Tables']['tours']['Row'];

const mapSupabaseTourToUi = (tour: SupabaseTour): Tour => {
  const meetingPoint = (tour as { meeting_point?: string | null }).meeting_point ?? '';
  const imageUrl = tour.cover_image ?? tour.images?.[0] ?? '';
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
    slug,
  };
};

export async function getTourBySlugFromDB(slug?: string) {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return null;
  }

  const { data, error } = await supabaseAdmin
    .from('tours')
    .select('*')
    .eq('slug', normalizedSlug)
    .single();

  if (data) {
    return data;
  }

  if (error && error.code !== 'PGRST116') {
    console.error(`Error fetching tour by slug '${slug}':`, error);
  }

  const { data: byId, error: byIdError } = await supabaseAdmin
    .from('tours')
    .select('*')
    .eq('id', normalizedSlug)
    .single();

  if (byId) {
    return byId;
  }

  if (byIdError && byIdError.code !== 'PGRST116') {
    console.error(`Error fetching tour by id '${slug}':`, byIdError);
  }

  return null;
}

export async function getToursByPuebloFromDB(puebloSlug: string) {
  const { data, error } = await supabaseAdmin
    .from('tours')
    .select('*')
    .eq('pueblo_slug', puebloSlug);

  if (error) {
    console.error(`Error fetching tours for pueblo '${puebloSlug}':`, error);
    return [];
  }

  const tours: SupabaseTour[] = data ?? [];
  return tours
    .map((tour) => mapSupabaseTourToUi(tour))
    .filter((tour) => Boolean(normalizeSlug(tour.slug) ?? normalizeId(tour.id)));
}
