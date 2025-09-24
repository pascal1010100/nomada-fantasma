import { notFound } from 'next/navigation';
import { getTourBySlug, getToursByPueblo } from '@/app/rutas-magicas/mocks/tours';
import { Clock, Users, MapPin, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReservationFormWrapper from '@/app/rutas-magicas/components/ReservationFormWrapper';

// Type for the route params
type RouteParams = {
  params: {
    pueblo: string;
    tour: string;
  };
};

export default async function TourDetailPage({ params }: RouteParams) {
  const { pueblo, tour: tourSlug } = params;
  const tour = await getTourBySlug(pueblo, tourSlug);

  if (!tour) {
    notFound();
  }
  
  // Función auxiliar para capitalizar palabras
  const capitalize = (word: string): string => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  // Obtener otros tours del mismo pueblo para recomendaciones
  const otherTours = getToursByPueblo(pueblo).filter(t => t.slug !== tourSlug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con imagen */}
      <div className="relative h-64 md:h-96 bg-gray-800">
        <Image
          src={tour.images[0] || '/images/tours/default-tour.jpg'}
          alt={tour.title}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
        
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-8 relative z-10">
          <Link 
            href={`/rutas-magicas/lago-atitlan/${pueblo}`}
            className="inline-flex items-center text-white hover:text-cyan-300 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver a {pueblo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Link>
          
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{tour.title}</h1>
          <p className="text-lg text-gray-200 max-w-3xl">{tour.summary}</p>
          
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center text-white">
              <Clock className="w-5 h-5 mr-1 text-cyan-300" />
              <span>{tour.duration}</span>
            </div>
            <div className="flex items-center text-white">
              <Users className="w-5 h-5 mr-1 text-cyan-300" />
              <span>Grupo: {tour.capacity.min}-{tour.capacity.max} personas</span>
            </div>
            <div className="flex items-center text-white">
              <MapPin className="w-5 h-5 mr-1 text-cyan-300" />
              <span>{tour.meetingPoint}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre esta experiencia</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">{tour.description}</p>
              </div>
            </section>

            {/* Itinerario */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Itinerario</h2>
                <div className="space-y-6">
                  {tour.itinerary.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{index + 1}</span>
                        </div>
                        {index < tour.itinerary.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-600 my-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">{item.time}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{item.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Lo que incluye */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Lo que incluye</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tour.includes.map((item, index) => (
                  <div key={`inc-${index}`} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
                {tour.notIncludes && tour.notIncludes.map((item, index) => (
                  <div key={`not-inc-${index}`} className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Preguntas frecuentes */}
            {tour.faqs && tour.faqs.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Preguntas frecuentes</h2>
                <div className="space-y-4">
                  {tour.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{faq.question}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Tarjeta de reserva */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6">
              <ReservationFormWrapper 
                tourId={tour.id}
                price={tour.price.adult}
                childPrice={tour.price.child}
                maxCapacity={tour.capacity.max}
                availableDays={tour.availableDays}
                startTimes={tour.startTimes}
              />
            </div>

            {/* Información adicional */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Información importante</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Punto de encuentro</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tour.meetingPoint}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Clock className="w-5 h-5 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Duración</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{tour.duration}</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Users className="w-5 h-5 text-cyan-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-900 dark:text-white">Tamaño del grupo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {tour.capacity.min}-{tour.capacity.max} personas
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Qué llevar */}
            {tour.whatToBring && tour.whatToBring.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Qué llevar</h3>
                <ul className="space-y-2">
                  {tour.whatToBring.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Otros tours */}
        {otherTours.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">También te puede interesar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTours.slice(0, 3).map((tour) => (
                <div key={tour.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={tour.images[0] || '/images/tours/default-tour.jpg'}
                      alt={tour.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{tour.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{tour.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-cyan-600 dark:text-cyan-400 font-medium">
                        ${tour.price.adult} / persona
                      </span>
                      <Link 
                        href={`/rutas-magicas/lago-atitlan/${pueblo}/tours/${tour.slug}`}
                        className="text-sm font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                      >
                        Ver detalles →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
