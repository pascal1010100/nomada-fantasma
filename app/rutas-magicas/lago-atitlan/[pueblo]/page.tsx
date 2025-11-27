import { notFound } from 'next/navigation';
import { pueblosAtitlan } from '../../../../app/rutas-magicas/mocks/atitlanData';
import { samplePoints } from '../../../../app/mapa/points';
import {
  ArrowLeft, ArrowRight, MapPin, Wifi, Coffee, Bus, Map, Clock, Landmark,
  Mountain, Sunset, BookOpen, Wifi as WifiIcon, MapPin as MapPinIcon,
  Footprints, Star, Users, Calendar, Compass, Sun, Moon, Sunrise, Zap,
  Wind, Thermometer, CloudRain, Droplets, Globe, CheckCircle2, CloudSun
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ToursSection from '../../components/ToursSection';
import TownMap from '../../components/TownMap';

// Definición de tipos para los componentes
interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

interface IconListProps {
  items: string[];
  className?: string;
}

// Componente de tarjeta con estilo cyberpunk
const CyberCard: React.FC<CyberCardProps> = ({ children, className = '' }) => (
  <div className={`bg-white/5 backdrop-blur-sm border border-cyan-400/20 rounded-xl p-6 shadow-lg shadow-cyan-500/10 ${className}`}>
    {children}
  </div>
);

// Componente de sección
const Section: React.FC<SectionProps> = ({ title, icon, children, className = '' }) => (
  <section className={`mb-12 ${className}`}>
    <h2 className="text-2xl font-bold mb-6 flex items-center text-cyan-400">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h2>
    {children}
  </section>
);

// Componente de lista con iconos
const IconList: React.FC<IconListProps> = ({ items, className = '' }) => (
  <ul className={`space-y-3 ${className}`}>
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        <span className="text-cyan-400 mr-2 mt-0.5">
          <Zap className="w-4 h-4" />
        </span>
        <span className="text-gray-300">{item}</span>
      </li>
    ))}
  </ul>
);

// Definición de tipos para TypeScript
type Highlight = {
  icon: React.ReactNode;
  text: string;
};

type TransportSchedule = {
  route: string;
  times: string[];
};

type Services = {
  atms: string[];
  essentials: string[];
};

interface Guide {
  name: string;
  contact: string;
  languages: string[];
  tours: string[];
}

interface WifiSpot {
  name: string;
  description: string;
  speed: 'slow' | 'medium' | 'fast';
  hours: string;
  hasOutlets: boolean;
}

interface NearbyTown {
  id: string;
  name: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  distance: string;
  highlights: string[];
  coverImage: string;
}

interface PageProps {
  params: {
    pueblo: string;
  };
}

export default async function PuebloDetailPage({ params }: PageProps) {
  // Obtener el slug del pueblo de los parámetros
  const { pueblo: puebloSlug } = params;

  // Buscar el pueblo por slug
  const pueblo = pueblosAtitlan.find(p => p.slug === puebloSlug);

  // Si no se encuentra el pueblo, mostrar 404
  if (!pueblo) {
    notFound();
    return null; // Asegurar que el componente no continúe
  }

  // Obtener puntos del pueblo
  const townPoints = samplePoints.filter(p => p.townSlug === puebloSlug);

  // Calcular centro del pueblo basado en sus puntos
  const townCenter: [number, number] = townPoints.length > 0
    ? [
      townPoints.reduce((sum, p) => sum + p.lat, 0) / townPoints.length,
      townPoints.reduce((sum, p) => sum + p.lng, 0) / townPoints.length
    ]
    : [14.6907, -91.2025]; // Default: centro del lago

  // Mapear los íconos del clima
  const getWeatherIcon = (iconName: string) => {
    switch (iconName) {
      case 'sun':
        return <Sun className="w-6 h-6" />;
      case 'cloud-rain':
        return <CloudRain className="w-6 h-6" />;
      case 'cloud-sun':
        return <CloudSun className="w-6 h-6" />;
      case 'sunset':
        return <Sunset className="w-6 h-6" />;
      default:
        return <Sun className="w-6 h-6" />;
    }
  };

  // Datos del pueblo
  const puebloData = {
    ...pueblo,
    // Usar la descripción completa del pueblo
    description: pueblo.fullDescription,

    // Clima actual
    weather: {
      ...pueblo.weather,
      forecast: pueblo.weather.forecast.map(day => ({
        ...day,
        icon: getWeatherIcon(day.icon)
      }))
    },

    // Puntos destacados
    highlights: [
      { icon: <Mountain className="w-5 h-5 text-cyan-400" />, text: pueblo.highlights[0] },
      { icon: <Coffee className="w-5 h-5 text-amber-400" />, text: pueblo.highlights[1] || 'Café local' },
      { icon: <Moon className="w-5 h-5 text-purple-400" />, text: pueblo.highlights[2] || 'Vida local' },
      { icon: <BookOpen className="w-5 h-5 text-green-400" />, text: pueblo.highlights[3] || 'Cultura' },
      { icon: <Sunrise className="w-5 h-5 text-yellow-400" />, text: 'Amaneceres espectaculares' },
      { icon: <Compass className="w-5 h-5 text-red-400" />, text: 'Cultura local' },
    ] as Highlight[],

    // Actividades
    activities: pueblo.activities,

    // Horario de transporte
    transportSchedule: pueblo.transportSchedule,

    // Servicios
    services: pueblo.services,

    // Guías turísticos
    guides: pueblo.guides,

    // Puntos WiFi (datos de ejemplo)
    wifiSpots: [
      {
        name: 'Café Central',
        description: 'Buena conexión, ambiente relajado',
        speed: 'fast',
        hours: '7:00 - 21:00',
        hasOutlets: true
      },
      {
        name: 'Hostal Principal',
        description: 'Zona de coworking con vista al lago',
        speed: 'medium',
        hours: '7:00 - 22:00',
        hasOutlets: true
      }
    ],

    // Pueblos cercanos (excluyendo el actual)
    nearbyTowns: pueblosAtitlan
      .filter(p => p.slug !== pueblo.slug)
      .map(p => ({
        id: p.id,
        name: p.title.split(' ')[0], // Tomar solo el primer nombre
        title: p.title,
        slug: p.slug,
        summary: p.summary,
        description: p.summary,
        distance: p.slug.includes('san-juan') ? '10 min en tuk-tuk' :
          p.slug.includes('santiago') ? '45 min en lancha' :
            p.slug.includes('san-marcos') ? '15 min en lancha' :
              p.slug.includes('panajachel') ? '1 hora en lancha' :
                'Cerca',
        highlights: p.highlights,
        coverImage: p.coverImage || `/images/${p.slug}.jpg`
      }))
  };

  // Si no hay datos del pueblo, no renderizar nada
  if (!pueblo) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <div className="relative h-[28rem] md:h-[32rem] w-full">
          <div className="absolute inset-0">
            <Image
              src={pueblo.coverImage}
              alt={pueblo.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent" />
          </div>

          {/* Contenedor del contenido */}
          <div className="relative h-full flex flex-col">
            {/* Breadcrumb */}
            <div className="z-10 pt-6 px-4 sm:px-6">
              <nav className="max-w-7xl mx-auto">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90">
                  <li>
                    <Link href="/rutas-magicas" className="hover:text-cyan-300 transition-colors text-xs sm:text-sm md:text-base">
                      Rutas Mágicas
                    </Link>
                  </li>
                  <li className="text-white/60 text-xs sm:text-sm">/</li>
                  <li>
                    <Link href="/rutas-magicas/lago-atitlan" className="hover:text-cyan-300 transition-colors text-xs sm:text-sm md:text-base">
                      Lago de Atitlán
                    </Link>
                  </li>
                  <li className="text-white/60 text-xs sm:text-sm">/</li>
                  <li className="font-medium text-white text-xs sm:text-sm md:text-base">
                    {pueblo.title}
                  </li>
                </ol>
              </nav>
            </div>

            {/* Contenido del héroe */}
            <div className="flex-1 flex items-end pb-8 sm:pb-12 px-4 sm:px-6">
              <div className="w-full max-w-7xl mx-auto">
                <div className="max-w-3xl">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                    {pueblo.title}
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl">
                    {pueblo.summary}
                  </p>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {pueblo.region && (
                      <span className="inline-flex items-center bg-black/30 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/20">
                        <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {pueblo.region}
                      </span>
                    )}
                    <span className="inline-flex items-center bg-black/30 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/20">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {pueblo.durationDays} día{pueblo.durationDays > 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center bg-black/30 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm border border-white/20">
                      <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      {pueblo.groupSize.min}-{pueblo.groupSize.max} personas
                    </span>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={`/mapa?town=${puebloSlug}`}
                      className="inline-flex items-center gap-2 bg-cyan-500/90 hover:bg-cyan-400 text-white font-medium px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg shadow-cyan-500/30"
                    >
                      <Map className="w-5 h-5" />
                      Ver en el Mapa
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-12">
            {/* Por qué visitar */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Por qué visitar {pueblo?.title || 'este pueblo'}
              </h2>
              <div className="prose dark:prose-invert max-w-none text-sm sm:text-base">
                <p className="text-gray-700 dark:text-gray-300">
                  {puebloData.description}
                </p>
              </div>
            </section>

            {/* Qué hacer */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center">
                <Footprints className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Qué hacer en {pueblo?.title || 'este pueblo'}
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {puebloData.activities.map((activity, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-electricBlue dark:text-cyberPurple mr-2 mt-1">•</span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{activity}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Sección de Tours */}
            <ToursSection puebloSlug={puebloSlug} />

            {/* Horarios de transporte */}
            <section className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Bus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                Transporte desde/hacia {pueblo?.title || 'este pueblo'}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ruta</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Horarios</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {puebloData.transportSchedule.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.route}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                            {Array.isArray(item.times) ? item.times.join(', ') : item.times}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-xs text-gray-500 dark:text-gray-300">
                  * Los horarios son aproximados y pueden variar. Se recomienda confirmar con los locales.
                </div>
              </div>
            </section>

            {/* Guías turísticos - Sección condicional */}
            {Array.isArray(pueblo.guides) && pueblo.guides.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Landmark className="w-6 h-6 mr-2 text-electricBlue dark:text-cyberPurple" />
                  Guías y Tours Locales
                </h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    {pueblo.title} cuenta con una variedad de guías locales que ofrecen experiencias auténticas. Aquí tienes algunas opciones:
                  </p>
                  <div className="space-y-4">
                    {pueblo.guides.map((guide, index) => (
                      <div key={index} className="p-5 bg-gray-800/50 rounded-xl border border-cyan-400/20 hover:border-cyan-400/40 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <div className="bg-cyan-500/10 p-3 rounded-lg w-12 h-12 flex items-center justify-center flex-shrink-0">
                            <Users className="w-6 h-6 text-cyan-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-cyan-300 mb-1">{guide.name}</h3>
                            <p className="text-sm text-cyan-100/80 mb-3">
                              <span className="font-medium">Contacto:</span> {guide.contact}
                            </p>

                            {guide.languages && guide.languages.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="text-xs px-3 py-1 bg-cyan-900/50 text-cyan-300 rounded-full flex items-center">
                                  <Globe className="w-3 h-3 mr-1" />
                                  {Array.isArray(guide.languages) ? guide.languages.join(' • ') : ''}
                                </span>
                              </div>
                            )}

                            <div className="mt-4">
                              <h4 className="text-sm font-semibold text-cyan-200 mb-2 flex items-center">
                                <Zap className="w-4 h-4 mr-2 text-cyan-400" />
                                {guide.tours && guide.tours.length > 0 ? 'Tours Disponibles' : 'Servicios de Guía'}
                              </h4>
                              {guide.tours && guide.tours.length > 0 ? (
                                <ul className="space-y-2">
                                  {guide.tours.map((tour, tourIndex) => (
                                    <li key={tourIndex} className="flex items-start">
                                      <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-1 mr-2 flex-shrink-0" />
                                      <span className="text-sm text-gray-300">{tour}</span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-cyan-100/80">Servicio personalizado de guía turístico</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cajeros y servicios */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <MapPinIcon className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                Cajeros y Servicios
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Cajeros Automáticos:</h4>
                  <ul className="space-y-1">
                    {puebloData.services.atms.map((atm, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">• {atm}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Servicios Esenciales:</h4>
                  <ul className="space-y-1">
                    {puebloData.services.essentials.map((service, index) => (
                      <li key={index} className="text-sm text-gray-600 dark:text-gray-300">• {service}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Lugares con buen WiFi */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <WifiIcon className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                Lugares con buen WiFi
              </h3>
              <div className="space-y-3">
                {puebloData.wifiSpots.map((spot, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white">{spot.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{spot.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mapa */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-electricBlue dark:text-cyberPurple" />
                  Ubicación
                </h3>
                <div className="rounded-lg overflow-hidden">
                  <TownMap
                    townPoints={townPoints}
                    townCenter={townCenter}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Otros pueblos cercanos */}
        {puebloData.nearbyTowns.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Otros pueblos cercanos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {puebloData.nearbyTowns.map((town) => (
                <Link
                  key={town.id}
                  href={`/rutas-magicas/lago-atitlan/${town.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="h-40 relative">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url(${town.coverImage})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-transparent to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <h3 className="text-xl font-bold text-white">{town.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{town.summary}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span>Ver más</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
