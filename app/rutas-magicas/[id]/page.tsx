'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { mockRoutes } from '../mocks/routes';
import { atitlanInfo, pueblosAtitlan } from '../mocks/atitlanData';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, Wifi, Star, Zap, CheckCircle, Map, Mountain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import RouteCard from '../components/RouteCard';
import RouteActionButtons from '../components/RouteActionButtons';
import BookingModal from '../components/BookingModal';
import { useState } from 'react';

export default function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  // Unwrap params Promise using React.use()
  const { id } = use(params);

  // Verificar si es la página del Lago de Atitlán
  const isAtitlanPage = id === 'lago-atitlan' || id === '1';

  // Si es la página del Lago de Atitlán, usar los datos específicos con valores por defecto
  // Si no, buscar en las rutas generales
  const route = isAtitlanPage
    ? {
      ...atitlanInfo,
      id: '1',
      slug: 'lago-atitlan',
      region: 'america' as const,
      durationDays: 3,
      groupSize: { min: 1, max: 12 },
      wifiRating: 4,
      priceTier: 'standard' as const,
      price: 0,
      rating: 4.9,
      highlights: atitlanInfo.highlights || []
    }
    : mockRoutes.find(r => r.slug === id) ||
    mockRoutes.find(r => r.id === id);

  if (!route) {
    notFound();
  }

  // Obtener los pueblos solo si es la página de Atitlán
  const pueblos = isAtitlanPage ? pueblosAtitlan : [];

  // Función para renderizar estrellas de rating
  const renderRatingStars = (rating: number, small = false) => {
    const size = small ? 'w-4 h-4' : 'w-5 h-5';
    // Generar número de reseñas de forma determinista basado en el rating
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
            {rating.toFixed(1)} ({reviewCount} reseñas)
          </span>
        )}
      </div>
    );
  };

  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Enhanced Header with Cyberpunk Gradient */}
      <div className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${route.coverImage})` }}
        >
          {/* Gradient overlay with purple/cyan tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-gray-900/70 to-cyan-900/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col">
          {/* Botón de volver */}
          <div className="pt-20 md:pt-24">
            <Link
              href="/rutas-magicas"
              className="inline-flex items-center text-white/90 hover:text-white transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
              Volver a rutas
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
              <span className="tracking-wider">RUTA MÁGICA</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  {route.title}
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-white/90 mb-6">
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <MapPin className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm">{route.region.charAt(0).toUpperCase() + route.region.slice(1)}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Calendar className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm">{route.durationDays} {route.durationDays === 1 ? 'día' : 'días'}</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Users className="w-4 h-4 mr-1.5 text-cyan-400" />
                <span className="text-sm">Grupo de {route.groupSize.min}-{route.groupSize.max} personas</span>
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <Wifi className="w-4 h-4 mr-1.5 text-purple-400" />
                <span className="text-sm">{'⭐'.repeat(route.wifiRating)} WiFi</span>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              {renderRatingStars(route.rating)}
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2 space-y-8">

            {/* Elite Action Bar - Moved here to avoid overlap */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30 flex flex-col sm:flex-row gap-4 items-center justify-between relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">¿Listo para la aventura?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Reserva tu lugar ahora o explora el mapa.</p>
              </div>

              <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                <Link
                  href={`/mapa?route=${route.slug}`}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                >
                  <Map className="w-5 h-5 text-cyan-500" />
                  <span>Mapa</span>
                </Link>
                {!isAtitlanPage ? (
                  <button
                    onClick={handleBookingClick}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span>Reservar Ahora</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const section = document.getElementById('pueblos-section');
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span>Explorar Pueblos</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Descripción de la ruta</h2>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">{route.summary}</p>
                  <p className="text-gray-700 dark:text-gray-300">{route.fullDescription}</p>
                </div>

                {/* Puntos destacados */}
                <div className="mt-10">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lo más destacado</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {route.highlights.map((highlight, index) => (
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

          {/* Columna derecha - Información relevante */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
              <div className="p-6">
                {isAtitlanPage ? (
                  // Lake Facts for Atitlan
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Datos del Lago</h3>
                    <div className="space-y-4">
                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Ubicación</span>
                          <span className="text-xs">Sierra Madre de Guatemala</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Mountain className="w-4 h-4 mr-2 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Profundidad</span>
                          <span className="text-xs">340m (más profundo de Centroamérica)</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Zap className="w-4 h-4 mr-2 text-yellow-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Elevación</span>
                          <span className="text-xs">1,560 metros sobre el nivel del mar</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-purple-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Mejor época</span>
                          <span className="text-xs">Noviembre a abril (temporada seca)</span>
                        </div>
                      </div>

                      <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                        <Wifi className="w-4 h-4 mr-2 text-cyan-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium block">Conectividad</span>
                          <span className="text-xs">WiFi excelente en la mayoría de pueblos</span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  // Tour pricing for other routes
                  <>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">${route.price.toLocaleString()}</span>
                      <span className="ml-2 text-gray-500 dark:text-gray-400">por persona</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Duración: {route.durationDays} {route.durationDays === 1 ? 'día' : 'días'}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        <span>Tamaño del grupo: {route.groupSize.min}-{route.groupSize.max} personas</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Wifi className="w-4 h-4 mr-2 text-gray-400" />
                        <span>WiFi: {route.wifiRating}/5</span>
                      </div>
                    </div>
                  </>
                )}


                <RouteActionButtons isAtitlanPage={isAtitlanPage} onBookingClick={handleBookingClick} />
              </div>
            </div>

            {/* Tarjeta de asistencia */}
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-2xl p-5">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                  <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">¿Necesitas ayuda?</h4>
                  <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Nuestro equipo está disponible 24/7 para responder tus preguntas.
                  </p>
                  <a href="#" className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Contactar con soporte
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de pueblos alrededor del lago */}
      {isAtitlanPage && (
        <div id="pueblos-section" className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Pueblos alrededor del lago</h2>
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

      {/* Sección de recomendaciones */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Otras rutas que te pueden interesar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockRoutes
              .filter(r => r.id !== route.id)
              .slice(0, 3)
              .map(relatedRoute => (
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
                    <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                      {relatedRoute.summary}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ${relatedRoute.price.toLocaleString()}
                      </span>
                      <Link
                        href={`/rutas-magicas/${relatedRoute.id}`}
                        className="text-sm font-medium text-electricBlue hover:text-cyberPurple dark:text-cyberPurple dark:hover:text-electricBlue transition-colors flex items-center"
                      >
                        Ver detalles
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        guideName={route.title}
        guidePhone="50255555555" // Placeholder phone
      />
    </div>
  );
}
