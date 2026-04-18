import type { TownContentRecord } from '@/app/lib/supabase/towns';

type RawTown = TownContentRecord;

type TranslatorLike = {
  (key: string, values?: Record<string, string | number | Date>): string;
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

export function buildLocalizedTownPageViewModel(
  town: RawTown,
  nearbyTownSource: RawTown[],
  tRoutes: TranslatorLike
): LocalizedTownPageViewModel {
  const localizedTitle = getValueOrFallback(() => tRoutes(`${town.slug}.title`), town.title);
  const localizedSummary = getValueOrFallback(() => tRoutes(`${town.slug}.summary`), town.summary);
  const localizedFull = getValueOrFallback(() => tRoutes(`${town.slug}.fullDescription`), town.full_description);
  const localizedVibe = getValueOrFallback(() => tRoutes(`${town.slug}.vibe`), town.vibe ?? 'Relax & Nature');
  const lakeTitle = getValueOrFallback(() => tRoutes('lago-atitlan.title'), 'Lago de Atitlán');
  const localizedHighlights = getValueOrFallback(
    () => tRoutes.raw(`${town.slug}.highlights`) as string[],
    town.highlights
  );
  const localizedActivities = getValueOrFallback(
    () => tRoutes.raw(`${town.slug}.activities`) as string[],
    town.activities
  );
  const localizedWeatherCondition = getValueOrFallback(
    () => tRoutes(`${town.slug}.weather.condition`),
    town.weather.condition
  );
  const localizedTransportSchedule = getValueOrFallback(
    () => tRoutes.raw(`${town.slug}.transportSchedule`) as RawTown['transport_schedule'],
    town.transport_schedule
  );
  const localizedServices = getValueOrFallback(
    () => tRoutes.raw(`${town.slug}.services`) as RawTown['services'],
    town.services
  );

  const nearbyTowns = nearbyTownSource
    .filter((candidate) => candidate.slug !== town.slug)
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      slug: candidate.slug,
      summary: candidate.summary,
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
