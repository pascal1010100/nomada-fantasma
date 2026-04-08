import { pueblosAtitlan } from '../mocks/atitlanData';

type RawTown = (typeof pueblosAtitlan)[number];

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
  localizedTransportSchedule: RawTown['transportSchedule'];
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
  tRoutes: TranslatorLike
): LocalizedTownPageViewModel {
  const localizedTitle = getValueOrFallback(() => tRoutes(`${town.slug}.title`), town.title);
  const localizedSummary = getValueOrFallback(() => tRoutes(`${town.slug}.summary`), town.summary);
  const localizedFull = getValueOrFallback(() => tRoutes(`${town.slug}.fullDescription`), town.fullDescription);
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
    () => tRoutes.raw(`${town.slug}.transportSchedule`) as RawTown['transportSchedule'],
    town.transportSchedule
  );
  const localizedServices = getValueOrFallback(
    () => tRoutes.raw(`${town.slug}.services`) as RawTown['services'],
    town.services
  );

  const nearbyTowns = pueblosAtitlan
    .filter((candidate) => candidate.slug !== town.slug)
    .map((candidate) => ({
      id: candidate.id,
      title: candidate.title,
      slug: candidate.slug,
      summary: candidate.summary,
      coverImage: candidate.coverImage,
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
