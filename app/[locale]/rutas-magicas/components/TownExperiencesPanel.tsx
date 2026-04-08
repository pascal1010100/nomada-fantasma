import type { Guide } from '../lago-atitlan/data';
import type { Tour } from '@/app/lib/types';
import { Users } from 'lucide-react';
import ToursSection from './ToursSection';
import GuideCard from './GuideCard';

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

function toGuideCardModel(guide: RawGuide, index: number, bio: string): Guide {
  return {
    id: `guide-${index}`,
    name: guide.name,
    photo: '/images/guides/default-avatar.svg',
    bio,
    specialties: guide.tours,
    languages: guide.languages,
    contact: guide.contact,
    rating: 5.0,
    reviews: 10,
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

      {guides.length > 0 && (
        <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-900/30">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Users className="w-6 h-6 mr-2 text-purple-500" />
            {guidesTitle}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {guidesSubtitle}
          </p>
          <div className="grid grid-cols-1 gap-6">
            {guides.map((guide, index) => (
              <GuideCard
                key={`${townName}-${guide.name}-${index}`}
                guide={toGuideCardModel(guide, index, guideBio)}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
