import type { Database } from '@/types/database.types';
import { Tour as MockTour } from '@/app/[locale]/rutas-magicas/mocks/tours/types';

type SupabaseTour = Database['public']['Tables']['tours']['Row'];

type ItineraryItem = {
    time: string;
    title: string;
    description: string;
};

type FaqItem = {
    question: string;
    answer: string;
};

type SupabaseTourExtended = SupabaseTour & {
    child_price?: number | null;
    meeting_point?: string | null;
    what_to_bring?: string[] | null;
    itinerary?: ItineraryItem[] | null;
    faqs?: FaqItem[] | null;
    available_days?: string[] | number[] | null;
    start_times?: string[] | null;
    rating?: number | null;
};

type UnifiedTour = {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    duration: string;
    difficulty: string;
    price: {
        adult: number;
        child?: number | null;
        private?: number | null;
    };
    capacity: {
        min: number;
        max: number;
    };
    images: string[];
    highlights: string[];
    includes: string[];
    notIncludes: string[];
    meetingPoint: string;
    whatToBring: string[];
    itinerary: {
        time: string;
        title: string;
        description: string;
    }[];
    faqs: {
        question: string;
        answer: string;
    }[];
    puebloSlug: string;
    isMock: boolean;
    rating: number;
    isPopular: boolean;
    availableDays: string[];
    startTimes: string[];
};

/**
 * Maps any tour data source (Supabase or Mock) to a UnifiedTour object.
 * This ensures consistency across the UI.
 * 
 * @param tour The raw tour object (SupabaseTour or MockTour)
 * @param t The common translation function (from next-intl)
 * @param tTours The 'Tours' namespace translation function
 * @param puebloSlug The slug of the pueblo if not present in the tour object
 * @returns A UnifiedTour object
 */
export const mapTourToUnified = (
    tour: SupabaseTour | MockTour,
    t: (key: string) => string,
    tTours: (key: string, values?: Record<string, string | number>) => string,
    puebloSlug: string
): UnifiedTour => {
    const isMockTour = (candidate: SupabaseTour | MockTour): candidate is MockTour =>
        'price' in candidate && typeof candidate.price === 'object';
    const isMock = isMockTour(tour);

    const translate = (val: string | null | undefined) => {
        if (!val) return '';
        return val.startsWith('Data.') ? t(val) : val;
    };

    const getLocalizedDifficulty = (diff: string | null | undefined) => {
        if (!diff) return tTours('difficulty.easy');
        const lowerDiff = diff.toLowerCase();
        if (['fácil', 'easy', 'fÁcil'].includes(lowerDiff)) return tTours('difficulty.easy');
        if (['moderado', 'medium', 'moderate', 'medio'].includes(lowerDiff)) return tTours('difficulty.medium');
        if (['difícil', 'hard', 'difÍcil'].includes(lowerDiff)) return tTours('difficulty.hard');
        return diff;
    };

    if (isMock) {
        const m = tour;
        return {
            id: m.id,
            title: translate(m.title),
            slug: m.slug,
            summary: translate(m.summary),
            description: translate(m.description),
            duration: translate(m.duration),
            difficulty: getLocalizedDifficulty(m.difficulty),
            price: {
                adult: m.price.adult,
                child: m.price.child,
                private: m.price.privateGroup,
            },
            capacity: {
                min: m.capacity.min,
                max: m.capacity.max,
            },
            images: m.images || [],
            highlights: (m.highlights || []).map(translate),
            includes: (m.includes || []).map(translate),
            notIncludes: (m.notIncludes || []).map(translate),
            meetingPoint: translate(m.meetingPoint),
            whatToBring: (m.whatToBring || []).map(translate),
            itinerary: (m.itinerary || []).map(i => ({
                time: i.time,
                title: translate(i.title),
                description: translate(i.description),
            })),
            faqs: (m.faqs || []).map(f => ({
                question: translate(f.question),
                answer: translate(f.answer),
            })),
            puebloSlug: puebloSlug,
            isMock: true,
            rating: m.rating || 5,
            isPopular: m.isPopular || false,
            availableDays: m.availableDays || [],
            startTimes: m.startTimes || [],
        };
    } else {
        const s = tour as SupabaseTourExtended;
        const availableDays = (s.available_days ?? []).map(String);
        return {
            id: s.id,
            title: s.title,
            slug: s.slug,
            summary: s.description || '',
            description: s.full_description || s.description || '',
            duration: s.duration_hours ? `${s.duration_hours}h` : '',
            difficulty: getLocalizedDifficulty(s.difficulty),
            price: {
                adult: s.price_min || 0,
                child: s.child_price || null,
                private: s.price_max || null,
            },
            capacity: {
                min: s.min_guests,
                max: s.max_guests,
            },
            images: s.images || (s.cover_image ? [s.cover_image] : []),
            highlights: s.highlights || [],
            includes: s.included || [],
            notIncludes: s.not_included || [],
            meetingPoint: s.meeting_point || '',
            whatToBring: s.what_to_bring || [],
            itinerary: s.itinerary || [],
            faqs: s.faqs || [],
            puebloSlug: s.pueblo_slug,
            isMock: false,
            rating: s.rating || 5,
            isPopular: s.is_featured || false,
            availableDays,
            startTimes: s.start_times || [],
        };
    }
};
