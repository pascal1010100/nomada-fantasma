import { notFound } from 'next/navigation';
import { pueblosAtitlan as atitlanTowns } from '../../mocks/atitlanData';
import {
  ArrowLeft, MapPin, Wifi, Coffee, Bus, Clock, Landmark,
  Sunset, Footprints, Star, Users, Compass, Sun, Moon, Zap,
  Wind, Thermometer, CloudRain, Droplets, CheckCircle2, CloudSun
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ToursSection from '../../components/ToursSection';
import GuideCard from '../../components/GuideCard';
import TownTabs from '../../components/TownTabs';
import AccommodationSection from '../../components/AccommodationSection';
import NearbyTownCard from '../../components/NearbyTownCard';
import EliteActionBar from '../../components/EliteActionBar';
import React from 'react';
import { getTranslations, getLocale } from 'next-intl/server';

// Helper para obtener el icono del clima
const getWeatherIcon = (iconName: string) => {
  switch (iconName) {
    case 'sun': return <Sun className="w-8 h-8 text-yellow-400" />;
    case 'cloud-sun': return <CloudSun className="w-8 h-8 text-yellow-400" />;
    case 'cloud-rain': return <CloudRain className="w-8 h-8 text-blue-400" />;
    case 'moon': return <Moon className="w-8 h-8 text-gray-400" />;
    case 'sunset': return <Sunset className="w-8 h-8 text-orange-400" />;
    default: return <Sun className="w-8 h-8 text-yellow-400" />;
  }
};

export default async function TownPage({ params }: { params: Promise<{ pueblo: string }> }) {
  const { pueblo: slug } = await params;
  console.log('TownPage params:', slug);
  const town = atitlanTowns.find(t => t.slug === slug);
  console.log('Town found:', town?.title);

  if (!town) {
    notFound();
  }

  // Adaptar datos para la UI si faltan propiedades
  const vibe = 'vibe' in town ? (town as unknown as Record<string, unknown>).vibe as string : 'Relax & Nature';

  // Calcular pueblos cercanos dinámicamente
  const nearbyTowns = atitlanTowns
    .filter(t => t.slug !== slug)
    .map(t => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      summary: t.summary,
      coverImage: t.coverImage
    }));

  const tRoutes = await getTranslations('Data.routes');
  const tTown = await getTranslations('Town');
  const locale = await getLocale();
  let localizedTitle = town.title;
  let localizedSummary = town.summary;
  let localizedFull = town.fullDescription;
  let lakeTitle = 'Lago de Atitlán';
  try { localizedTitle = tRoutes(`${slug}.title`); } catch { localizedTitle = town.title; }
  try { localizedSummary = tRoutes(`${slug}.summary`); } catch { localizedSummary = town.summary; }
  try { localizedFull = tRoutes(`${slug}.fullDescription`); } catch { localizedFull = town.fullDescription; }
  try { lakeTitle = tRoutes(`lago-atitlan.title`); } catch { lakeTitle = 'Lago de Atitlán'; }
  let localizedHighlights: string[] = town.highlights;
  try { localizedHighlights = tRoutes.raw(`${slug}.highlights`) as string[]; } catch { localizedHighlights = town.highlights; }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 pb-20">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden group">
        <div className="absolute inset-0 transition-transform duration-[3000ms] ease-in-out group-hover:scale-105">
          <Image
            src={town.coverImage}
            alt={town.title}
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
              Volver al {lakeTitle}
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
              <span className="tracking-wider">PUEBLO MÁGICO</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {localizedTitle}
                </span>
              </h1>
            </div>

            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light leading-relaxed drop-shadow-md mb-6">
              {localizedSummary}
            </p>

            {/* Quick Stats - Integrated into Hero */}
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm font-medium text-white">{lakeTitle}</span>
              </div>
              <div className="flex items-center bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 hover:bg-black/30 transition-colors shadow-lg">
                <Zap className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm font-medium text-white">{vibe}</span>
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
        <EliteActionBar title={town.title} slug={slug} />

        <TownTabs>
          {/* Tab 1: Hospedaje (NEW PRIMARY TAB) */}
          <div className="space-y-8">
            <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-900/30">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                    {tTown('accommodationIn', { name: town.title })}
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {tTown('accommodationSubtitle')}
                </p>
              </div>

              {/* Placeholder content - to be populated with real accommodation data */}
              <AccommodationSection
                accommodations={town.accommodations}
                townName={town.title}
                townSlug={slug}
              />

              <div className="mt-8 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800/30">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  {tTown('accommodationTip')}
                </p>
              </div>
            </section>
          </div>

          {/* Tab 2: Experiencias */}
          <div className="space-y-8">
            {/* Tours Profesionales */}
            <section id="experiencias-section">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  <span className="bg-gradient-to-r from-purple-600 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
                    {tTown('experiencesIn', { name: town.title })}
                  </span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  {tTown('experiencesSubtitle', { name: town.title })}
                </p>
              </div>
              <ToursSection puebloSlug={slug} className="mb-12" />
            </section>

            {/* Guías Locales */}
            {town.guides && town.guides.length > 0 && (
              <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-900/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Users className="w-6 h-6 mr-2 text-purple-500" />
                  {tTown('guidesTitle')}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {tTown('guidesSubtitle')}
                </p>
                <div className="grid grid-cols-1 gap-6">
                  {town.guides.map((guide, index) => (
                    <GuideCard
                      key={index}
                      guide={{
                        id: `guide-${index}`,
                        name: guide.name,
                        photo: '/images/guides/default-avatar.svg',
                        bio: 'Guía local experto en la región.',
                        specialties: guide.tours,
                        languages: guide.languages,
                        contact: guide.contact,
                        rating: 5.0,
                        reviews: 10
                      }}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Tab 2: Descubre */}
          <div className="space-y-8">
            {/* Sobre el Pueblo */}
            <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-cyan-200 dark:border-cyan-900/30">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-cyan-500" />
                {tTown('about', { name: town.title })}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {localizedFull}
              </p>

              {/* Highlights Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                {localizedHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gradient-to-r from-cyan-50 to-purple-50 dark:from-cyan-900/10 dark:to-purple-900/10 rounded-lg border border-cyan-200 dark:border-cyan-800/30">
                    <CheckCircle2 className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{highlight}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Actividades */}
            {town.activities && town.activities.length > 0 && (
              <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-purple-200 dark:border-purple-900/30">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Footprints className="w-5 h-5 mr-2 text-purple-500" />
                  {tTown('activitiesTitle')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {town.activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors border border-transparent hover:border-purple-200 dark:hover:border-purple-800/30">
                      <Compass className="w-4 h-4 text-purple-500 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{activity}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Tab 3: Info Práctica */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Clima */}
            <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Sun className="w-5 h-5 mr-2 text-yellow-500" />
                {tTown('weatherTitle')}
              </h3>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  {getWeatherIcon(town.weather.condition)}
                  <span className="text-4xl font-bold ml-3 text-gray-900 dark:text-white">{town.weather.temp}°C</span>
                </div>
                <span className="text-gray-600 dark:text-gray-300">{town.weather.condition}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                  <Droplets className="w-5 h-5 mx-auto text-blue-400 mb-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{tTown('humidity')}</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{town.weather.humidity}%</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                  <Wind className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{tTown('wind')}</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{town.weather.wind} km/h</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg text-center">
                  <Thermometer className="w-5 h-5 mx-auto text-red-400 mb-1" />
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{tTown('feelsLike')}</span>
                  <p className="font-semibold text-gray-900 dark:text-white">{town.weather.feelsLike}°C</p>
                </div>
              </div>
            </section>

            {/* Cómo llegar */}
            <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Bus className="w-5 h-5 mr-2 text-cyan-500" />
                {tTown('howToGetTitle')}
              </h3>
              <div className="space-y-4">
                {town.transportSchedule.map((schedule, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{schedule.route}</span>
                      <Clock className="w-4 h-4 text-cyan-500" />
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {Array.isArray(schedule.times) ? (
                        schedule.times.map((time, tIndex) => (
                          <div key={tIndex}>{time}</div>
                        ))
                      ) : (
                        <div>{schedule.times}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Servicios */}
            <section className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-600 lg:col-span-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Landmark className="w-5 h-5 mr-2 text-green-500" />
                {tTown('servicesTitle')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Landmark className="w-4 h-4 mr-2 text-green-500" />
                    {tTown('atmsTitle')}
                  </h4>
                  {town.services.atms.length > 0 ? (
                    <ul className="space-y-2">
                      {town.services.atms.map((atm, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0" />
                          {atm}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">{tTown('noAtms')}</p>
                  )}
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                    <Coffee className="w-4 h-4 mr-2 text-orange-500" />
                    {tTown('essentialsTitle')}
                  </h4>
                  <ul className="space-y-2">
                    {town.services.essentials.map((item, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300 flex items-start">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </TownTabs>
      </div>

      {/* Otros pueblos cercanos */}
      {
        nearbyTowns.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{tTown('nearbyTitle')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nearbyTowns.map((nearbyTown) => (
                <NearbyTownCard key={nearbyTown.id} town={nearbyTown} locale={locale} />
              ))}
            </div>
          </section>
        )
      }
    </div>

  );
}
