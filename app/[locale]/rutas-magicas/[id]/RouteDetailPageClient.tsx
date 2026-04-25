'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, Calendar, CheckCircle, Map, MapPin, Mountain, Star, Users, Wifi, Zap } from 'lucide-react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import type { Route } from '../lib/types';
import RouteCard from '../components/RouteCard';
import RouteActionButtons from '../components/RouteActionButtons';
import BookingModal from '../components/BookingModal';
import IndependentGuidesSection from '../components/IndependentGuidesSection';

type RouteDetailPageClientProps = {
  route: Route;
  isAtitlanPage: boolean;
  pueblos: Route[];
  guides: Array<{
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
  }>;
  relatedRoutes: Route[];
  mapHref: string;
};

export default function RouteDetailPageClient({
  route,
  isAtitlanPage,
  pueblos,
  guides,
  relatedRoutes,
  mapHref,
}: RouteDetailPageClientProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const tData = useTranslations('Data.routes');
  const tRoute = useTranslations('RouteDetail');
  const tRoutes = useTranslations('Routes');
  const tLake = useTranslations('LakeInfo');
  const tTown = useTranslations('Town');
  const locale = useLocale();

  const i18nSlug = isAtitlanPage ? 'lago-atitlan' : route.slug;
  const localizedTitle = tData.has(`${i18nSlug}.title`) ? tData(`${i18nSlug}.title`) : route.title;
  const localizedSummary = tData.has(`${i18nSlug}.summary`) ? tData(`${i18nSlug}.summary`) : route.summary;
  const localizedFull = tData.has(`${i18nSlug}.fullDescription`) ? tData(`${i18nSlug}.fullDescription`) : route.fullDescription;
  const localizedHighlights = tData.has(`${i18nSlug}.highlights`)
    ? ((() => {
        const rawHighlights = tData.raw(`${i18nSlug}.highlights`);
        return Array.isArray(rawHighlights) ? (rawHighlights as string[]) : route.highlights;
      })())
    : route.highlights;

  const renderRatingStars = (rating: number, small = false) => {
    const size = small ? 'w-4 h-4' : 'w-5 h-5';
    const reviewCount = Math.floor(rating * 50) + 20;

    return (
      <div className={`flex items-center ${small ? 'space-x-0.5' : 'space-x-1'}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
          />
        ))}
        {!small && (
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
            {rating.toFixed(1)} {tRoute('reviews', { count: reviewCount })}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${route.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900/70 to-cyan-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col">
          <div className="pt-20 md:pt-24">
            <Link
              href={`/${locale}/rutas-magicas`}
              className="inline-flex items-center text-white/90 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              {tRoute('backToRoutes')}
            </Link>
          </div>

          <div className="mt-auto pb-12">
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              <span className="tracking-wider">{tRoute('badge')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {localizedTitle}
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm">{tRoutes(`regions.${route.region}`)}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm">{tRoute('durationDescription', { days: route.durationDays })}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm">{tRoute('groupDescription', { min: route.groupSize.min, max: route.groupSize.max })}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Wifi className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm">{'⭐'.repeat(route.wifiRating)} WiFi</span>
              </div>
            </div>

            <div className="mb-6">{renderRatingStars(route.rating)}</div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30 flex flex-col sm:flex-row gap-4 items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{tRoute('readyTitle')}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{tRoute('readySubtitle')}</p>
              </div>

              <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                <Link
                  href={mapHref}
                  className="btn-ghost btn-ghost-map group flex-1 sm:flex-none justify-center rounded-full px-6 py-3 text-sm font-semibold"
                >
                  <Map className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                  <span>{tRoute('map')}</span>
                </Link>
                {!isAtitlanPage ? (
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="btn-cta shimmer group flex-1 sm:flex-none rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span>{tRoute('reserveNow')}</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const section = document.getElementById('pueblos-section');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="btn-cta shimmer group flex-1 sm:flex-none rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <span>{tRoute('exploreTowns')}</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{tRoute('descriptionTitle')}</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{localizedSummary}</p>
                  <p className="text-gray-700 dark:text-gray-300">{localizedFull}</p>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{tRoute('highlightsTitle')}</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {localizedHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
              <div className="p-6">
                {isAtitlanPage ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{tLake('title')}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">{tLake('locationLabel')}</span>
                          <span className="text-xs">{tLake('locationValue')}</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Mountain className="w-4 h-4 mr-2 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">{tLake('depthLabel')}</span>
                          <span className="text-xs">{tLake('depthValue')}</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Zap className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">{tLake('elevationLabel')}</span>
                          <span className="text-xs">{tLake('elevationValue')}</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">{tLake('bestSeasonLabel')}</span>
                          <span className="text-xs">{tLake('bestSeasonValue')}</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Wifi className="w-4 h-4 mr-2 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">{tLake('connectivityLabel')}</span>
                          <span className="text-xs">{tLake('connectivityValue')}</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">Q{route.price.toLocaleString()}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">{tRoute('perPerson')}</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{tRoute('durationLabel')}: {tRoute('durationDescription', { days: route.durationDays })}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{tRoute('groupSizeLabel')}: {tRoute('groupDescription', { min: route.groupSize.min, max: route.groupSize.max })}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Wifi className="w-4 h-4 mr-2 text-gray-400" />
                        <span>WiFi: {route.wifiRating}/5</span>
                      </div>
                    </div>
                  </>
                )}

                <RouteActionButtons isAtitlanPage={isAtitlanPage} onBookingClick={() => setIsBookingModalOpen(true)} />
              </div>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">{tRoute('helpCardTitle')}</h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">{tRoute('helpCardText')}</p>
                  <a href="#" className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    {tRoute('supportLink')}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAtitlanPage && pueblos.length > 0 && (
        <div id="pueblos-section" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{tRoute('townsAroundLake')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pueblos.map((pueblo) => (
                <div key={pueblo.id} className="group">
                  <RouteCard route={pueblo} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {isAtitlanPage && guides.length > 0 && (
        <div className="bg-gray-50 py-16 dark:bg-gray-950/60">
          <div className="container mx-auto px-4">
            <IndependentGuidesSection
              title={tTown('guidesTitle')}
              subtitle={tTown('guidesSubtitle')}
              guides={guides}
            />
          </div>
        </div>
      )}

      {!isAtitlanPage && relatedRoutes.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">{tRoute('othersTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRoutes.map((relatedRoute) => (
                <div key={relatedRoute.id} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-40 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                      style={{ backgroundImage: `url(${relatedRoute.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                    </div>
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 text-xs font-medium rounded-full">
                        {relatedRoute.region.charAt(0).toUpperCase() + relatedRoute.region.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">{relatedRoute.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">{relatedRoute.summary}</p>
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        Q{relatedRoute.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/${locale}/rutas-magicas/${relatedRoute.slug}`}
                        className="text-sm font-medium text-electricBlue hover:text-cyberPurple dark:text-cyberPurple dark:hover:text-electricBlue transition-colors flex items-center"
                      >
                        {tRoute('viewDetails')}
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guideId={route.id}
        guideName={route.title}
        guidePhone="50255555555"
        services={[
          {
            id: `legacy-route-${route.id}`,
            title: route.title,
            priceLabel: `Q${route.price.toLocaleString()}`,
          },
        ]}
      />
    </div>
  );
}
