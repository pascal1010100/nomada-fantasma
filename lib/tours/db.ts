import { supabaseAdmin } from '@/app/lib/supabase/server';
import { getTourBySlug as getMockTourBySlug, getToursByPueblo as getMockToursByPueblo } from '@/app/[locale]/rutas-magicas/mocks/tours';
import type { Database } from '@/types/database.types';

/**
 * Fetches a tour by its slug, checking Supabase first and falling back to mock data.
 * @param puebloSlug The pueblo slug
 * @param tourSlug The tour slug
 */
export async function fetchTourBySlug(puebloSlug: string, tourSlug: string) {
    try {
        // Try Supabase first
        const { data: supabaseTour, error } = await supabaseAdmin
            .from('tours')
            .select('*')
            .eq('pueblo_slug', puebloSlug)
            .eq('slug', tourSlug)
            .maybeSingle();

        if (supabaseTour && !error) {
            return supabaseTour;
        }
    } catch (e) {
        console.error('Error fetching tour from Supabase:', e);
    }

    // Fallback to mock data
    return getMockTourBySlug(puebloSlug, tourSlug);
}

/**
 * Fetches all tours for a pueblo, combining Supabase and mock data.
 * Supabase tours hide mock tours with the same slug.
 * @param puebloSlug The pueblo slug
 */
type SupabaseTour = Database['public']['Tables']['tours']['Row'];
type MockTour = ReturnType<typeof getMockToursByPueblo>[number];
type TourRecord = SupabaseTour | MockTour;

export async function fetchToursByPueblo(puebloSlug: string) {
    let supabaseTours: SupabaseTour[] = [];
    try {
        const { data, error } = await supabaseAdmin
            .from('tours')
            .select('*')
            .eq('pueblo_slug', puebloSlug)
            .eq('is_active', true);

        if (data && !error) {
            supabaseTours = data;
        }
    } catch (e) {
        console.error('Error fetching tours from Supabase:', e);
    }

    const mockTours = getMockToursByPueblo(puebloSlug);

    // Merge: Supabase tours take precedence
    const allTours: TourRecord[] = [...supabaseTours];
    const supabaseSlugs = new Set(allTours.map(t => t.slug));

    mockTours.forEach(mock => {
        if (!supabaseSlugs.has(mock.slug)) {
            allTours.push(mock);
        }
    });

    return allTours;
}
