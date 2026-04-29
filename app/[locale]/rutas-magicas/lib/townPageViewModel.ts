import type { TownContentRecord } from '@/app/lib/supabase/towns';

type RawTown = TownContentRecord;

type TranslatorLike = {
  (key: string, values?: Record<string, string | number | Date>): string;
  has?: (key: string) => boolean;
  raw: (key: string) => unknown;
};

export interface NearbyTownSummary {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
}

export interface LocalizedTownPageViewModel {
  localizedTitle: string;
  localizedSummary: string;
  localizedFull: string;
  localizedVibe: string;
  lakeTitle: string;
  localizedHighlights: string[];
  localizedActivities: string[];
  localizedWeatherCondition: string;
  localizedTransportSchedule: RawTown['transport_schedule'];
  localizedServices: RawTown['services'];
  nearbyTowns: NearbyTownSummary[];
}

function getValueOrFallback<T>(resolver: () => T, fallback: T): T {
  try {
    return resolver();
  } catch {
    return fallback;
  }
}

function getTranslatedValue(t: TranslatorLike, key: string, fallback: string): string {
  if (t.has && !t.has(key)) {
    return fallback;
  }

  return getValueOrFallback(() => t(key), fallback);
}

function getTranslatedRaw<T>(t: TranslatorLike, key: string, fallback: T): T {
  if (t.has && !t.has(key)) {
    return fallback;
  }

  return getValueOrFallback(() => t.raw(key) as T, fallback);
}

export function buildLocalizedTownPageViewModel(
  town: RawTown,
  nearbyTownSource: RawTown[],
  tRoutes: TranslatorLike
): LocalizedTownPageViewModel {
  const localizedTitle = getTranslatedValue(tRoutes, `${town.slug}.title`, town.title);
  const localizedSummary = getTranslatedValue(tRoutes, `${town.slug}.summary`, town.summary);
  const localizedFull = getTranslatedValue(tRoutes, `${town.slug}.fullDescription`, town.full_description);
  const localizedVibe = getTranslatedValue(tRoutes, `${town.slug}.vibe`, town.vibe ?? 'Relax & Nature');
  const lakeTitle = getTranslatedValue(tRoutes, 'lago-atitlan.title', 'Lago de Atitlán');
  const localizedHighlights = getTranslatedRaw(tRoutes, `${town.slug}.highlights`, town.highlights);
  const localizedActivities = getTranslatedRaw(tRoutes, `${town.slug}.activities`, town.activities);
  const localizedWeatherCondition = getTranslatedValue(tRoutes, `${town.slug}.weather.condition`, town.weather.condition);
  const localizedTransportSchedule = getTranslatedRaw(
    tRoutes,
    `${town.slug}.transportSchedule`,
    town.transport_schedule
  );
  const localizedServices = getTranslatedRaw(tRoutes, `${town.slug}.services`, town.services);

  const nearbyTowns = nearbyTownSource
    .filter((candidate) => candidate.slug !== town.slug)
    .map((candidate) => ({
      id: candidate.id,
      title: getTranslatedValue(tRoutes, `${candidate.slug}.title`, candidate.title),
      slug: candidate.slug,
      summary: getTranslatedValue(tRoutes, `${candidate.slug}.summary`, candidate.summary),
      coverImage: candidate.cover_image,
    }));

  return {
    localizedTitle,
    localizedSummary,
    localizedFull,
    localizedVibe,
    lakeTitle,
    localizedHighlights,
    localizedActivities,
    localizedWeatherCondition,
    localizedTransportSchedule,
    localizedServices,
    nearbyTowns,
  };
}
