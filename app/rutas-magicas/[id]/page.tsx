import { notFound } from 'next/navigation';
import { mockRoutes } from '../mocks/routes';
import { ArrowLeft, ArrowRight, MapPin, Calendar, Users, Wifi, Star, Zap, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RouteDetailPage({ params }: { params: { id: string } }) {
  const route = mockRoutes.find(r => r.id === params.id);
  
  if (!route) {
    notFound();
  }

  // Función para renderizar estrellas de rating
  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-5 h-5 ${star <= Math.round(route.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
          {route.rating.toFixed(1)} ({Math.floor(Math.random() * 100) + 20} reseñas)
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Header con imagen de fondo */}
      <div className="relative h-96 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${route.coverImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col">
          {/* Botón de volver */}
          <div className="pt-8">
            <Link 
              href="/rutas-magicas" 
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver a rutas
            </Link>
          </div>
          
          {/* Título y metadatos */}
          <div className="mt-auto pb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white">{route.title}</h1>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-1.5" />
                <span>{route.region.charAt(0).toUpperCase() + route.region.slice(1)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-1.5" />
                <span>{route.durationDays} {route.durationDays === 1 ? 'día' : 'días'}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-1.5" />
                <span>Grupo de {route.groupSize.min}-{route.groupSize.max} personas</span>
              </div>
              <div className="flex items-center">
                <Wifi className="w-5 h-5 mr-1.5" />
                <span>WiFi: {'★'.repeat(route.wifiRating) + '☆'.repeat(5 - route.wifiRating)}</span>
              </div>
            </div>
            
            <div className="mt-4">
              {renderRatingStars(route.rating)}
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12 -mt-16 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda - Contenido principal */}
          <div className="lg:col-span-2">
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
          
          {/* Columna derecha - Precio y CTA */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
              <div className="p-6">
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
                
                <Link 
                  href="/reservar"
                  className="mt-8 w-full bg-gradient-to-r from-electricBlue to-cyberPurple hover:from-electricBlue/90 hover:to-cyberPurple/90 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl hover:shadow-electricBlue/20"
                >
                  Reservar ahora
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                
                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  Cancelación gratuita hasta 24 horas antes
                </p>
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
    </div>
  );
}
