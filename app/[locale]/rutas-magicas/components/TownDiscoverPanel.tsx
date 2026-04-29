import {
  Beer,
  Coffee,
  Compass,
  Footprints,
  GraduationCap,
  MapPin,
  Mountain,
  ShipWheel,
  Sparkles,
  Store,
  Utensils,
  Waves,
} from 'lucide-react';

interface TownDiscoverPanelProps {
  aboutTitle: string;
  fullDescription: string;
  highlightsTitle: string;
  highlights: string[];
  activitiesTitle: string;
  activities: string[];
}

function getActivityIcon(activity: string) {
  const normalized = activity
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (normalized.includes('volcan') || normalized.includes('hike') || normalized.includes('sender')) {
    return Mountain;
  }

  if (normalized.includes('cafe') || normalized.includes('coffee')) {
    return Coffee;
  }

  if (
    normalized.includes('muelle') ||
    normalized.includes('dock') ||
    normalized.includes('panajachel') ||
    normalized.includes('santiago') ||
    normalized.includes('san juan') ||
    normalized.includes('pueblos') ||
    normalized.includes('towns')
  ) {
    return ShipWheel;
  }

  if (
    normalized.includes('kayak') ||
    normalized.includes('lancha') ||
    normalized.includes('boat') ||
    normalized.includes('playa') ||
    normalized.includes('beach') ||
    normalized.includes('finca') ||
    normalized.includes('lago') ||
    normalized.includes('lake')
  ) {
    return Waves;
  }

  if (
    normalized.includes('comer') ||
    normalized.includes('eat') ||
    normalized.includes('pita') ||
    normalized.includes('pizza') ||
    normalized.includes('tempo')
  ) {
    return Utensils;
  }

  if (normalized.includes('noche') || normalized.includes('night') || normalized.includes('sublime') || normalized.includes('bar')) {
    return Beer;
  }

  if (normalized.includes('espanol') || normalized.includes('spanish') || normalized.includes('escuela') || normalized.includes('school')) {
    return GraduationCap;
  }

  if (normalized.includes('mercado') || normalized.includes('market') || normalized.includes('servicios') || normalized.includes('services')) {
    return Store;
  }

  if (normalized.includes('tour')) {
    return Footprints;
  }

  return Compass;
}

function getHighlightIcon(highlight: string) {
  return getActivityIcon(highlight);
}

function splitHighlight(highlight: string) {
  const separatorIndex = highlight.indexOf(':');

  if (separatorIndex === -1) {
    return {
      title: highlight,
      description: '',
    };
  }

  return {
    title: highlight.slice(0, separatorIndex).trim(),
    description: highlight.slice(separatorIndex + 1).trim(),
  };
}

export default function TownDiscoverPanel({
  aboutTitle,
  fullDescription,
  highlightsTitle,
  highlights,
  activitiesTitle,
  activities,
}: TownDiscoverPanelProps) {
  const primaryHighlights = highlights.slice(0, 3);
  const secondaryHighlights = highlights.slice(3);
  const [leadSentence, ...restSentences] = fullDescription
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  const supportingCopy = restSentences.join(' ');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/70 sm:p-6">
          <h2 className="mb-4 flex items-center text-xl font-bold text-gray-900 dark:text-white">
            <MapPin className="mr-2 h-5 w-5 text-cyan-500" />
            {aboutTitle}
          </h2>
          <p className="max-w-4xl text-lg font-semibold leading-8 text-gray-900 dark:text-white sm:text-xl">
            {leadSentence ?? fullDescription}
          </p>
          {supportingCopy && (
            <p className="mt-4 max-w-4xl text-base leading-8 text-gray-600 dark:text-gray-300">
              {supportingCopy}
            </p>
          )}

          {secondaryHighlights.length > 0 && (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {secondaryHighlights.map((highlight, index) => {
                const HighlightIcon = getHighlightIcon(highlight);
                const { title, description } = splitHighlight(highlight);

                return (
                  <div
                    key={`${highlight}-${index}`}
                    className="group flex items-start gap-3 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white px-4 py-3 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-md dark:border-white/10 dark:from-gray-900/65 dark:to-gray-900/35 dark:hover:border-cyan-400/35"
                  >
                    <span className="mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 shadow-inner transition group-hover:bg-cyan-500/15">
                      <HighlightIcon className="h-4 w-4 text-cyan-500 transition group-hover:scale-110" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">{title}</span>
                      {description && (
                        <span className="mt-0.5 block text-sm leading-6 text-gray-600 dark:text-gray-300">
                          {description}
                        </span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {primaryHighlights.length > 0 && (
          <aside className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-50/90 to-white p-5 shadow-sm dark:from-cyan-950/25 dark:to-gray-900/35">
            <h3 className="mb-4 flex items-center text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-200">
              <Sparkles className="mr-2 h-4 w-4" />
              {highlightsTitle}
            </h3>
            <div className="grid gap-3">
              {primaryHighlights.map((highlight, index) => {
                const HighlightIcon = getHighlightIcon(highlight);
                const { title, description } = splitHighlight(highlight);

                return (
                  <div
                    key={`${highlight}-${index}`}
                    className="group flex items-start gap-3 rounded-xl border border-cyan-500/20 bg-white/80 p-4 text-sm leading-6 text-gray-700 shadow-[0_1px_0_rgba(8,145,178,0.06)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:bg-white hover:shadow-md dark:bg-gray-900/55 dark:text-gray-300 dark:hover:bg-gray-900/80"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-cyan-500/15 bg-cyan-500/10 shadow-inner transition group-hover:bg-cyan-500/15">
                      <HighlightIcon className="h-5 w-5 text-cyan-500 transition group-hover:scale-110" />
                    </span>
                    <span>
                      <span className="block font-semibold text-gray-900 dark:text-white">{title}</span>
                      {description && <span className="block text-gray-600 dark:text-gray-300">{description}</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </aside>
        )}
      </div>

      {activities.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-gray-800/70 sm:p-6">
          <h3 className="mb-5 flex items-center text-xl font-bold text-gray-900 dark:text-white">
            <Footprints className="mr-2 h-5 w-5 text-purple-500" />
            {activitiesTitle}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {activities.map((activity, index) => {
              const ActivityIcon = getActivityIcon(activity);

              return (
                <div
                  key={`${activity}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-purple-300 hover:shadow-md dark:border-white/10 dark:from-gray-900/65 dark:to-gray-900/35 dark:hover:border-purple-400/35"
                >
                  <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent opacity-0 transition group-hover:opacity-100" />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-purple-500/15 bg-purple-500/10 shadow-inner transition group-hover:bg-purple-500/15">
                      <ActivityIcon className="h-5 w-5 text-purple-500 transition group-hover:scale-110" />
                    </div>
                    <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">{activity}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
