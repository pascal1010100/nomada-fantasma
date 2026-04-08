import { MapPin, Footprints, Compass, CheckCircle2 } from 'lucide-react';

interface TownDiscoverPanelProps {
  aboutTitle: string;
  fullDescription: string;
  highlights: string[];
  activitiesTitle: string;
  activities: string[];
}

export default function TownDiscoverPanel({
  aboutTitle,
  fullDescription,
  highlights,
  activitiesTitle,
  activities,
}: TownDiscoverPanelProps) {
  return (
    <div className="space-y-8">
      <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-cyan-200 dark:border-cyan-900/30">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <MapPin className="w-6 h-6 mr-2 text-cyan-500" />
          {aboutTitle}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {fullDescription}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
          {highlights.map((highlight, index) => (
            <div
              key={`${highlight}-${index}`}
              className="flex items-start gap-3 p-3 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/10 dark:to-purple-900/10 rounded-lg border border-cyan-200 dark:border-cyan-800/30"
            >
              <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
            </div>
          ))}
        </div>
      </section>

      {activities.length > 0 && (
        <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-900/30">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Footprints className="w-5 h-5 mr-2 text-purple-500" />
            {activitiesTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activities.map((activity, index) => (
              <div
                key={`${activity}-${index}`}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800/30"
              >
                <Compass className="w-4 h-4 text-purple-500 flex-shrink-0 mt-1" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
