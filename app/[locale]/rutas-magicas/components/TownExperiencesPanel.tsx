import type { Guide } from '../lago-atitlan/data';
import { atitlanTowns } from '../lago-atitlan/data';
import type { Tour } from '@/app/lib/types';
import ToursSection from './ToursSection';
import IndependentGuidesSection from './IndependentGuidesSection';

interface RawGuide {
  name: string;
  contact: string;
  languages: string[];
  tours: string[];
}

interface TownExperiencesPanelProps {
  townName: string;
  townSlug: string;
  tours: Tour[];
  guides: RawGuide[];
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
  townName,
  townSlug,
  tours,
  guides,
  experiencesTitle,
  experiencesSubtitle,
  guidesTitle,
  guidesSubtitle,
  guideBio,
}: TownExperiencesPanelProps) {
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
        guides={guides.map((guide, index) => ({
          ...toGuideCardModel(guide, index, guideBio, townSlug),
          tours: guide.tours,
          townName,
        }))}
      />
    </div>
  );
}
