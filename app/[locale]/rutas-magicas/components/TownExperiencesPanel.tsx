import type { Guide } from '../lago-atitlan/data';
import { atitlanTowns } from '../lago-atitlan/data';
import type { Tour } from '@/app/lib/types';
import type { GuideWithServices } from '@/app/lib/supabase/guides';
import ToursSection from './ToursSection';
import IndependentGuidesSection from './IndependentGuidesSection';
import {
  localizeGuideBio,
  localizeGuideLanguage,
  localizeGuideService,
} from '../lib/guideLocalization';

interface RawGuide {
  name: string;
  contact: string;
  languages: string[];
  tours: string[];
}

interface TownExperiencesPanelProps {
  locale: string;
  townName: string;
  townSlug: string;
  tours: Tour[];
  guides: RawGuide[];
  relationalGuides?: GuideWithServices[];
  experiencesTitle: string;
  experiencesSubtitle: string;
  guidesTitle: string;
  guidesSubtitle: string;
  guideBio: string;
}

function toGuideCardModel(
  guide: RawGuide,
  index: number,
  bio: string,
  townSlug: string
): Guide {
  const fallbackTown = atitlanTowns.find((town) => town.slug === townSlug);
  const legacyGuide =
    fallbackTown?.guides.find(
      (candidate) =>
        candidate.name.toLowerCase() === guide.name.toLowerCase() ||
        candidate.contact === guide.contact
    ) ?? null;

  return {
    id: legacyGuide?.id ?? `guide-${index}`,
    name: guide.name,
    photo: legacyGuide?.photo ?? '/images/guides/default-avatar.svg',
    bio: legacyGuide?.bio ?? bio,
    specialties: guide.tours,
    languages: guide.languages,
    contact: guide.contact,
    rating: legacyGuide?.rating ?? 5.0,
    reviews: legacyGuide?.reviews ?? 10,
  };
}

export default function TownExperiencesPanel({
  locale,
  townName,
  townSlug,
  tours,
  guides,
  relationalGuides = [],
  experiencesTitle,
  experiencesSubtitle,
  guidesTitle,
  guidesSubtitle,
  guideBio,
}: TownExperiencesPanelProps) {
  const guideEntries = relationalGuides.length > 0
    ? relationalGuides.map((guide) => ({
        id: guide.id,
        name: guide.name,
        photo: guide.photo_url || '/images/guides/default-avatar.svg',
        bio: localizeGuideBio(locale, guide.slug, guide.bio || guideBio),
        specialties: guide.services.map((service) =>
          localizeGuideService(locale, service.slug, {
            title: service.title,
          }).title || service.title
        ),
        languages: guide.languages.map((language) => localizeGuideLanguage(locale, language)),
        contact: guide.whatsapp || guide.email || '',
        rating: 5,
        reviews: 10,
        tours: guide.services.map((service) =>
          localizeGuideService(locale, service.slug, {
            title: service.title,
          }).title || service.title
        ),
        townName,
        services: guide.services.map((service) => ({
          id: service.id,
          title:
            localizeGuideService(locale, service.slug, {
              title: service.title,
              description: service.description ?? undefined,
            }).title || service.title,
          description:
            localizeGuideService(locale, service.slug, {
              title: service.title,
              description: service.description ?? undefined,
            }).description || service.description || undefined,
          priceLabel:
            typeof service.price_from === 'number' && typeof service.price_to === 'number'
              ? `Q${service.price_from}-${service.price_to}`
              : typeof service.price_from === 'number'
                ? `Q${service.price_from}`
                : null,
        })),
      }))
    : guides.map((guide, index) => ({
        ...toGuideCardModel(guide, index, guideBio, townSlug),
        tours: guide.tours,
        townName,
      }));

  return (
    <div className="space-y-8">
      <section id="experiencias-section">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
              {experiencesTitle}
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {experiencesSubtitle}
          </p>
        </div>
        <ToursSection puebloSlug={townSlug} tours={tours} className="mb-12" />
      </section>

      <IndependentGuidesSection
        title={guidesTitle}
        subtitle={guidesSubtitle}
        guides={guideEntries}
      />
    </div>
  );
}
