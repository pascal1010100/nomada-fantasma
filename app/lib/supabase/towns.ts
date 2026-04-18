import { supabaseAdmin } from '@/app/lib/supabase/server';

export type TownGuide = {
    name: string;
    contact: string;
    languages: string[];
    tours: string[];
};

export type TownTransportScheduleItem = {
    route: string;
    times: string[] | string;
};

export type TownServices = {
    atms: string[];
    essentials: string[];
};

export type TownWeather = {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    feelsLike: number;
};

export type TownContentRecord = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    cover_image: string;
    wifi_rating: number;
    rating: number;
    vibe: string;
    highlights: string[];
    full_description: string;
    weather: TownWeather;
    activities: string[];
    transport_schedule: TownTransportScheduleItem[];
    services: TownServices;
    guides: TownGuide[];
    is_active: boolean;
    sort_order: number;
};

type TownRow = {
    id: string;
    slug: string;
    title: string;
    summary: string;
    cover_image: string;
    wifi_rating: number | null;
    rating: number | null;
    vibe: string | null;
    highlights: unknown;
    full_description: string | null;
    weather: unknown;
    activities: unknown;
    transport_schedule: unknown;
    services: unknown;
    guides: unknown;
    is_active: boolean | null;
    sort_order: number | null;
};

function ensureStringArray(value: unknown): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function ensureTransportSchedule(value: unknown): TownTransportScheduleItem[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const typed = item as { route?: unknown; times?: unknown };
            if (typeof typed.route !== 'string') return null;
            if (!(typeof typed.times === 'string' || Array.isArray(typed.times))) return null;
            return {
                route: typed.route,
                times: Array.isArray(typed.times)
                    ? typed.times.filter((entry): entry is string => typeof entry === 'string')
                    : typed.times,
            };
        })
        .filter((item): item is TownTransportScheduleItem => Boolean(item));
}

function ensureServices(value: unknown): TownServices {
    if (!value || typeof value !== 'object') {
        return { atms: [], essentials: [] };
    }

    const typed = value as { atms?: unknown; essentials?: unknown };
    return {
        atms: ensureStringArray(typed.atms),
        essentials: ensureStringArray(typed.essentials),
    };
}

function ensureGuides(value: unknown): TownGuide[] {
    if (!Array.isArray(value)) return [];
    return value
        .map((item) => {
            if (!item || typeof item !== 'object') return null;
            const typed = item as {
                name?: unknown;
                contact?: unknown;
                languages?: unknown;
                tours?: unknown;
            };
            if (typeof typed.name !== 'string' || typeof typed.contact !== 'string') return null;
            return {
                name: typed.name,
                contact: typed.contact,
                languages: ensureStringArray(typed.languages),
                tours: ensureStringArray(typed.tours),
            };
        })
        .filter((item): item is TownGuide => Boolean(item));
}

function ensureWeather(value: unknown): TownWeather {
    if (!value || typeof value !== 'object') {
        return { temp: 0, condition: '', humidity: 0, wind: 0, feelsLike: 0 };
    }

    const typed = value as Record<string, unknown>;
    return {
        temp: typeof typed.temp === 'number' ? typed.temp : 0,
        condition: typeof typed.condition === 'string' ? typed.condition : '',
        humidity: typeof typed.humidity === 'number' ? typed.humidity : 0,
        wind: typeof typed.wind === 'number' ? typed.wind : 0,
        feelsLike: typeof typed.feelsLike === 'number' ? typed.feelsLike : 0,
    };
}

function mapTownRow(row: TownRow): TownContentRecord {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        summary: row.summary,
        cover_image: row.cover_image,
        wifi_rating: row.wifi_rating ?? 0,
        rating: typeof row.rating === 'number' ? row.rating : 0,
        vibe: row.vibe ?? '',
        highlights: ensureStringArray(row.highlights),
        full_description: row.full_description ?? '',
        weather: ensureWeather(row.weather),
        activities: ensureStringArray(row.activities),
        transport_schedule: ensureTransportSchedule(row.transport_schedule),
        services: ensureServices(row.services),
        guides: ensureGuides(row.guides),
        is_active: row.is_active ?? true,
        sort_order: row.sort_order ?? 0,
    };
}

export async function getTownBySlugFromDB(slug: string): Promise<TownContentRecord | null> {
    const result = await supabaseAdmin
        .from('towns' as never)
        .select('id, slug, title, summary, cover_image, wifi_rating, rating, vibe, highlights, full_description, weather, activities, transport_schedule, services, guides, is_active, sort_order')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle<TownRow>();

    if (result.error) {
        console.error(`Error fetching town by slug '${slug}':`, result.error);
        return null;
    }

    return result.data ? mapTownRow(result.data) : null;
}

export async function getNearbyTownsFromDB(currentSlug: string): Promise<TownContentRecord[]> {
    const result = await supabaseAdmin
        .from('towns' as never)
        .select('id, slug, title, summary, cover_image, wifi_rating, rating, vibe, highlights, full_description, weather, activities, transport_schedule, services, guides, is_active, sort_order')
        .neq('slug', currentSlug)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .returns<TownRow[]>();

    if (result.error) {
        console.error(`Error fetching nearby towns for '${currentSlug}':`, result.error);
        return [];
    }

    return (result.data ?? []).map(mapTownRow);
}

export async function getActiveTownsFromDB(): Promise<TownContentRecord[]> {
    const result = await supabaseAdmin
        .from('towns' as never)
        .select('id, slug, title, summary, cover_image, wifi_rating, rating, vibe, highlights, full_description, weather, activities, transport_schedule, services, guides, is_active, sort_order')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .returns<TownRow[]>();

    if (result.error) {
        console.error('Error fetching active towns:', result.error);
        return [];
    }

    return (result.data ?? []).map(mapTownRow);
}
