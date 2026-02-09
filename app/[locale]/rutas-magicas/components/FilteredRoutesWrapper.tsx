'use client';

import dynamic from 'next/dynamic';
import { Region } from '../lib/types';

import { useTranslations } from 'next-intl';

// Dynamically import the FilteredRoutes component with no SSR
const FilteredRoutes = dynamic(
  () => import('./FilteredRoutes'),
  {
    ssr: false,
    loading: () => {
      const t = useTranslations('Routes');
      return (
        <div className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-electricBlue/20 to-cyberPurple/20 dark:from-electricBlue/10 dark:to-cyberPurple/10">
            <div className="w-8 h-8 rounded-full border-2 border-t-electricBlue border-r-cyberPurple border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">{t('loadingRoutes')}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('loadingDesc')}</p>
        </div>
      );
    }
  }
);

interface FilteredRoutesWrapperProps {
  region?: Region;
  searchQuery?: string;
}

export default function FilteredRoutesWrapper({ region, searchQuery = '' }: FilteredRoutesWrapperProps) {
  return <FilteredRoutes region={region} searchQuery={searchQuery} />;
}
