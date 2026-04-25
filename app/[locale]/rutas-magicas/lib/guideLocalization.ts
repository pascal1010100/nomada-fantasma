type LocalizedGuideContent = {
  bio?: string;
};

type LocalizedGuideServiceContent = {
  title?: string;
  description?: string;
};

const ENGLISH_LANGUAGE_LABELS: Record<string, string> = {
  espanol: 'Spanish',
  español: 'Spanish',
  ingles: 'English',
  inglés: 'English',
  kaqchikel: 'Kaqchikel',
  tzutujil: "Tz'utujil",
  "tz'utujil": "Tz'utujil",
};

const ENGLISH_GUIDE_CONTENT: Record<string, LocalizedGuideContent> = {
  'juan-perez-san-pedro': {
    bio: 'Independent local guide in San Pedro for cultural experiences, coffee tours and walks around the lake.',
  },
};

const ENGLISH_GUIDE_SERVICE_CONTENT: Record<string, LocalizedGuideServiceContent> = {
  'tour-volcan-san-pedro': {
    title: 'San Pedro Volcano Tour',
    description: 'Guided ascent with a flexible pace, lake views and pre-coordinated logistics.',
  },
  'tour-cafe-fincas-locales': {
    title: 'Local Coffee Farm Tour',
    description: 'Visit local farms, learn the artisanal coffee process and enjoy a guided tasting with local context.',
  },
  'tour-cultural-por-el-pueblo': {
    title: 'Cultural Town Tour',
    description: 'Guided walk through the town, local history, everyday life and cultural landmarks in San Pedro.',
  },
};

function normalizeLookupKey(value: string): string {
  return value.trim().toLowerCase();
}

export function localizeGuideLanguage(locale: string, language: string): string {
  if (!locale.startsWith('en')) {
    return language;
  }

  return ENGLISH_LANGUAGE_LABELS[normalizeLookupKey(language)] ?? language;
}

export function localizeGuideBio(locale: string, guideSlug: string | null | undefined, fallback: string): string {
  if (!locale.startsWith('en') || !guideSlug) {
    return fallback;
  }

  return ENGLISH_GUIDE_CONTENT[guideSlug]?.bio ?? fallback;
}

export function localizeGuideService(
  locale: string,
  serviceSlug: string | null | undefined,
  fallback: LocalizedGuideServiceContent
): LocalizedGuideServiceContent {
  if (!locale.startsWith('en') || !serviceSlug) {
    return fallback;
  }

  const localized = ENGLISH_GUIDE_SERVICE_CONTENT[serviceSlug];
  if (!localized) {
    return fallback;
  }

  return {
    title: localized.title ?? fallback.title,
    description: localized.description ?? fallback.description,
  };
}
