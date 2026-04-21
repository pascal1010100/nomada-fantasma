import { Compass, Users } from 'lucide-react';
import GuideCard from './GuideCard';

type GuideEntry = {
  id: string;
  name: string;
  photo: string;
  rating: number;
  reviews: number;
  contact: string;
  languages: string[];
  tours: string[];
  townName?: string;
  bio: string;
};

type IndependentGuidesSectionProps = {
  title: string;
  subtitle: string;
  guides: GuideEntry[];
};

export default function IndependentGuidesSection({
  title,
  subtitle,
  guides,
}: IndependentGuidesSectionProps) {
  if (guides.length === 0) return null;

  return (
    <section className="rounded-3xl border border-purple-200/60 bg-white/95 p-6 shadow-xl shadow-slate-950/5 dark:border-purple-900/30 dark:bg-gray-800/95 md:p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">
            <Compass className="h-3.5 w-3.5" />
            Conexion local
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-400 md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="inline-flex items-center gap-2 self-start rounded-full border border-purple-200 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-700 dark:border-purple-900/40 dark:bg-purple-500/10 dark:text-purple-300">
          <Users className="h-3.5 w-3.5" />
          {guides.length} guias disponibles
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {guides.map((guide) => (
          <GuideCard
            key={guide.id}
            guide={{
              id: guide.id,
              name: guide.name,
              photo: guide.photo,
              bio: guide.bio,
              specialties: guide.tours,
              languages: guide.languages,
              contact: guide.contact,
              rating: guide.rating,
              reviews: guide.reviews,
              townName: guide.townName,
            }}
          />
        ))}
      </div>
    </section>
  );
}
