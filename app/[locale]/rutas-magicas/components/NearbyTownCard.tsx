'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight, MapPin } from 'lucide-react';

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
  const tTown = useTranslations('Town');

  const title = t.has(`${town.slug}.title`) ? t(`${town.slug}.title`) : town.title;
  const summary = t.has(`${town.slug}.summary`) ? t(`${town.slug}.summary`) : town.summary;
  const viewMoreLabel = tTown('viewMore').replace(/\s*→\s*$/, '');

  return (
    <Link
      href={`/${locale}/rutas-magicas/lago-atitlan/${town.slug}`}
      className="group relative flex min-h-[280px] overflow-hidden rounded-2xl border border-white/10 bg-gray-950 shadow-[0_18px_45px_rgba(2,8,23,0.16)] outline-none transition duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_24px_60px_rgba(8,145,178,0.18)] focus-visible:ring-2 focus-visible:ring-cyan-300/70 sm:min-h-[320px]"
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition duration-700 ease-out group-hover:scale-105"
        style={{ backgroundImage: `url(${town.coverImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/45 to-gray-950/5" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-950/95 to-transparent" aria-hidden="true" />

      <div className="relative z-10 flex min-h-full w-full flex-col justify-end p-5 sm:p-6">
        <div className="mb-3 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-md">
          <MapPin className="mr-1.5 h-3.5 w-3.5 text-cyan-300" />
          Lago Atitlán
        </div>

        <h3 className="max-w-[18rem] text-2xl font-semibold leading-tight text-white drop-shadow-sm">
          {title}
        </h3>

        <p className="mt-3 max-w-[28rem] text-sm leading-6 text-white/80 line-clamp-2">
          {summary}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm font-semibold text-cyan-200">
            {viewMoreLabel}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-cyan-100 backdrop-blur-md transition duration-300 group-hover:translate-x-1 group-hover:border-cyan-200/50 group-hover:bg-cyan-300/15">
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
