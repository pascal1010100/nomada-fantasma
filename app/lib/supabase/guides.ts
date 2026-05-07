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

  let data: SupabaseGuideService[] | null = null;
  try {
    const result = await supabaseAdmin
      .from('guide_services')
      .select('*')
      .in('guide_id', guideIds)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (result.error) {
      return new Map();
    }

    data = (result.data ?? []) as SupabaseGuideService[];
  } catch {
    return new Map();
  }

  const grouped = new Map<string, SupabaseGuideService[]>();
  for (const service of data ?? []) {
    const current = grouped.get(service.guide_id) ?? [];
    current.push(service);
    grouped.set(service.guide_id, current);
  }
  return grouped;
}

export async function getActiveGuidesByTownSlugFromDB(townSlug: string): Promise<GuideWithServices[]> {
  let data: SupabaseGuide[] | null = null;
  try {
    const result = await supabaseAdmin
      .from('guides')
      .select('*')
      .eq('town_slug', townSlug)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (result.error) {
      return [];
    }

    data = (result.data ?? []) as SupabaseGuide[];
  } catch {
    return [];
  }

  const guides = data ?? [];
  const servicesByGuide = await getGuideServicesByGuideIds(guides.map((guide) => guide.id));

  return guides.map((guide) => ({
    ...guide,
    services: servicesByGuide.get(guide.id) ?? [],
  }));
}

export async function getActiveGuidesForLakeFromDB(limit = 12): Promise<GuideWithServices[]> {
  let data: SupabaseGuide[] | null = null;
  try {
    const result = await supabaseAdmin
      .from('guides')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .limit(limit);

    if (result.error) {
      return [];
    }

    data = (result.data ?? []) as SupabaseGuide[];
  } catch {
    return [];
  }

  const guides = data ?? [];
  const servicesByGuide = await getGuideServicesByGuideIds(guides.map((guide) => guide.id));

  return guides.map((guide) => ({
    ...guide,
    services: servicesByGuide.get(guide.id) ?? [],
  }));
}

export async function getGuideBySlugFromDB(slug: string): Promise<GuideWithServices | null> {
  let data: SupabaseGuide | null = null;
  try {
    const result = await supabaseAdmin
      .from('guides')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();

    if (result.error) {
      return null;
    }

    data = result.data as SupabaseGuide | null;
  } catch {
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
