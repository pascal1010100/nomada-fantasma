'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface NearbyTownCardProps {
  town: {
    id: string;
    title: string;
    slug: string;
    summary: string;
    coverImage: string;
  };
  locale: string;
}

export default function NearbyTownCard({ town, locale }: NearbyTownCardProps) {
  const t = useTranslations('Data.routes');

  let title = town.title;
  let summary = town.summary;

  try {
    title = t(`${town.slug}.title`);
  } catch (e) {
    // Si no se encuentra la traducción, se usa el valor original
  }

  try {
    summary = t(`${town.slug}.summary`);
  } catch (e) {
    // Si no se encuentra la traducción, se usa el valor original
  }

  return (
    <Link
      href={`/${locale}/rutas-magicas/lago-atitlan/${town.slug}`}
      className="group block bg-white dark:bg-gray-700 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-40 relative">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${town.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">{summary}</p>
        <div className="mt-3 text-sm font-medium text-cyan-600 dark:text-cyan-400 group-hover:underline">
          Ver más →
        </div>
      </div>
    </Link>
  );
}
