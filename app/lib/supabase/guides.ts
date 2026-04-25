import { supabaseAdmin } from '@/app/lib/supabase/server';
import type { Database } from '@/types/database.types';

export type SupabaseGuide = Database['public']['Tables']['guides']['Row'];
export type SupabaseGuideService = Database['public']['Tables']['guide_services']['Row'];

export type GuideWithServices = SupabaseGuide & {
  services: SupabaseGuideService[];
};

async function getGuideServicesByGuideIds(guideIds: string[]): Promise<Map<string, SupabaseGuideService[]>> {
  if (guideIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabaseAdmin
    .from('guide_services')
    .select('*')
    .in('guide_id', guideIds)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching guide services:', error);
    return new Map();
  }

  const grouped = new Map<string, SupabaseGuideService[]>();
  for (const service of (data ?? []) as SupabaseGuideService[]) {
    const current = grouped.get(service.guide_id) ?? [];
    current.push(service);
    grouped.set(service.guide_id, current);
  }
  return grouped;
}

export async function getActiveGuidesByTownSlugFromDB(townSlug: string): Promise<GuideWithServices[]> {
  const { data, error } = await supabaseAdmin
    .from('guides')
    .select('*')
    .eq('town_slug', townSlug)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error(`Error fetching guides for town '${townSlug}':`, error);
    return [];
  }

  const guides = (data ?? []) as SupabaseGuide[];
  const servicesByGuide = await getGuideServicesByGuideIds(guides.map((guide) => guide.id));

  return guides.map((guide) => ({
    ...guide,
    services: servicesByGuide.get(guide.id) ?? [],
  }));
}

export async function getActiveGuidesForLakeFromDB(limit = 12): Promise<GuideWithServices[]> {
  const { data, error } = await supabaseAdmin
    .from('guides')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })
    .limit(limit);

  if (error) {
    console.error('Error fetching active guides for lake:', error);
    return [];
  }

  const guides = (data ?? []) as SupabaseGuide[];
  const servicesByGuide = await getGuideServicesByGuideIds(guides.map((guide) => guide.id));

  return guides.map((guide) => ({
    ...guide,
    services: servicesByGuide.get(guide.id) ?? [],
  }));
}

export async function getGuideBySlugFromDB(slug: string): Promise<GuideWithServices | null> {
  const { data, error } = await supabaseAdmin
    .from('guides')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching guide by slug '${slug}':`, error);
    return null;
  }

  if (!data) {
    return null;
  }

  const servicesByGuide = await getGuideServicesByGuideIds([data.id]);
  return {
    ...(data as SupabaseGuide),
    services: servicesByGuide.get(data.id) ?? [],
  };
}
