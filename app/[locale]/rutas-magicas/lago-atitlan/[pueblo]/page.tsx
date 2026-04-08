import { getToursByPuebloFromDB } from '@/app/lib/supabase/tours';
import { notFound } from 'next/navigation';
import { pueblosAtitlan as atitlanTowns } from '../../mocks/atitlanData';
import { ArrowLeft, MapPin, Wifi, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import TownTabs from '../../components/TownTabs';
import NearbyTownCard from '../../components/NearbyTownCard';
import EliteActionBar from '../../components/EliteActionBar';
import { getTranslations } from 'next-intl/server';
import TownExperiencesPanel from '../../components/TownExperiencesPanel';
import TownDiscoverPanel from '../../components/TownDiscoverPanel';
import TownPracticalInfoPanel from '../../components/TownPracticalInfoPanel';
import { buildLocalizedTownPageViewModel } from '../../lib/townPageViewModel';

export default async function TownPage({ params }: { params: Promise<{ pueblo: string; locale: string }> }) {
  const { pueblo: slug, locale } = await params;
  const town = atitlanTowns.find(t => t.slug === slug);

  if (!town) {
    notFound();
  }

  const tours = await getToursByPuebloFromDB(slug);

  const tRoutes = await getTranslations({ locale, namespace: 'Data.routes' });
  const tTown = await getTranslations({ locale, namespace: 'Town' });
  const viewModel = buildLocalizedTownPageViewModel(town, tRoutes);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden group">
        <div className="absolute inset-0 transition-transform duration-[3000ms] ease-in-out group-hover:scale-105">
          <Image
            src={town.coverImage}
            alt={viewModel.localizedTitle}
            fill
            className="object-cover object-center"
            priority
          />
        </div>
        {/* Elite Gradient Overlay - Exact match from Route Page */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900/70 to-cyan-900/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col">
          {/* Botón de volver */}
          <div className="pt-20 md:pt-24">
            <Link
              href={`/${locale}/rutas-magicas/lago-atitlan`}
              className="inline-flex items-center text-white/90 hover:text-white transition-colors duration-200 group/back"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover/back:-translate-x-1" />
              {tTown('backToLake', { lake: viewModel.lakeTitle })}
            </Link>
          </div>

          {/* Título y metadatos con gradientes */}
          <div className="mt-auto pb-12">
            {/* Badge */}
            <div className="mb-4 inline-flex items-center rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300 backdrop-blur-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
              </span>
              <span className="tracking-wider">{tTown('badge')}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {viewModel.localizedTitle}
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed drop-shadow-md mb-6">
              {viewModel.localizedSummary}
            </p>

            {/* Quick Stats - Integrated into Hero */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm font-medium text-white">{viewModel.lakeTitle}</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <Wifi className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm font-medium text-white">{viewModel.localizedVibe}</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <Star className="w-4 h-4 mr-1.5 text-yellow-400" />
                <span className="text-sm font-medium text-white">{town.rating}/5</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <Wifi className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm font-medium text-white">{'⭐'.repeat(town.wifiRating)} WiFi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="container mx-auto px-4 sm:px-6 py-12">

        {/* Elite Action Bar */}
        <EliteActionBar title={viewModel.localizedTitle} slug={slug} />

        <TownTabs
          panels={{
            experiences: (
              <TownExperiencesPanel
                townName={viewModel.localizedTitle}
                townSlug={slug}
                tours={tours}
                guides={town.guides}
                experiencesTitle={tTown('experiencesIn', { name: viewModel.localizedTitle })}
                experiencesSubtitle={tTown('experiencesSubtitle', { name: viewModel.localizedTitle })}
                guidesTitle={tTown('guidesTitle')}
                guidesSubtitle={tTown('guidesSubtitle')}
                guideBio={tTown('guideBio')}
              />
            ),
            discover: (
              <TownDiscoverPanel
                aboutTitle={tTown('about', { name: viewModel.localizedTitle })}
                fullDescription={viewModel.localizedFull}
                highlights={viewModel.localizedHighlights}
                activitiesTitle={tTown('activitiesTitle')}
                activities={viewModel.localizedActivities}
              />
            ),
            info: (
              <TownPracticalInfoPanel
                weather={{
                  temp: town.weather.temp,
                  condition: viewModel.localizedWeatherCondition,
                  humidity: town.weather.humidity,
                  wind: town.weather.wind,
                  feelsLike: town.weather.feelsLike,
                }}
                weatherTitle={tTown('weatherTitle')}
                humidityLabel={tTown('humidity')}
                windLabel={tTown('wind')}
                feelsLikeLabel={tTown('feelsLike')}
                howToGetTitle={tTown('howToGetTitle')}
                servicesTitle={tTown('servicesTitle')}
                atmsTitle={tTown('atmsTitle')}
                noAtmsLabel={tTown('noAtms')}
                essentialsTitle={tTown('essentialsTitle')}
                transportSchedule={viewModel.localizedTransportSchedule}
                services={viewModel.localizedServices}
              />
            ),
          }}
        />
      </div>

      {/* Otros pueblos cercanos */}
      {
        viewModel.nearbyTowns.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{tTown('nearbyTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {viewModel.nearbyTowns.map((nearbyTown) => (
                <NearbyTownCard key={nearbyTown.id} town={nearbyTown} locale={locale} />
              ))}
            </div>
          </section>
        )
      }
    </div>

  );
}
