import { describe, expect, it } from 'vitest';
import { getCanonicalTownSlug, isCanonicalTownSlug } from './townSlugs';

describe('town slug aliases', () => {
  it('keeps canonical town slugs unchanged', () => {
    expect(getCanonicalTownSlug('san-pedro')).toBe('san-pedro');
    expect(getCanonicalTownSlug('panajachel')).toBe('panajachel');
    expect(isCanonicalTownSlug('san-pedro')).toBe(true);
  });

  it('normalizes common human-readable Atitlan town aliases', () => {
    expect(getCanonicalTownSlug('san-pedro-la-laguna')).toBe('san-pedro');
    expect(getCanonicalTownSlug('san-marcos-la-laguna')).toBe('san-marcos');
    expect(getCanonicalTownSlug('san-juan-la-laguna')).toBe('san-juan');
    expect(getCanonicalTownSlug('santiago-atitlan')).toBe('santiago');
    expect(getCanonicalTownSlug('santa-cruz-la-laguna')).toBe('santa-cruz');
    expect(getCanonicalTownSlug('pana')).toBe('panajachel');
    expect(isCanonicalTownSlug('san-pedro-la-laguna')).toBe(false);
  });
});
