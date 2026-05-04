const TOWN_SLUG_ALIASES: Record<string, string> = {
  'san-pedro-la-laguna': 'san-pedro',
  'san-marcos-la-laguna': 'san-marcos',
  'san-juan-la-laguna': 'san-juan',
  'santiago-atitlan': 'santiago',
  'santa-cruz-la-laguna': 'santa-cruz',
  pana: 'panajachel',
};

export function getCanonicalTownSlug(slug: string): string {
  const normalized = slug.trim().toLowerCase();
  return TOWN_SLUG_ALIASES[normalized] ?? normalized;
}

export function isCanonicalTownSlug(slug: string): boolean {
  return getCanonicalTownSlug(slug) === slug;
}
