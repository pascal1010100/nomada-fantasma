import { CheckCircle2, ArrowLeft, Calendar, Users, MapPin, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getTourById } from '@/app/[locale]/rutas-magicas/mocks/tours';

// Tipos para los parámetros de búsqueda
type SearchParams = {
  tourId: string;
  date: string;
  adults: string;
  children?: string;
  total: string;
};

export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // Obtener los parámetros de la URL
  const { tourId, date, adults, children, total } = await searchParams;

  // Obtener los datos reales del tour
  const tour = getTourById(tourId);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tour no encontrado</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">Lo sentimos, no pudimos encontrar los detalles de este tour.</p>
          <Link
            href="/rutas-magicas"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a los tours
          </Link>
        </div>
      </div>
    );
  }

  // Formatear los datos de la reserva
  const reservation = {
    date: date ? new Date(date).toLocaleDateString('es-GT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'Fecha no especificada',
    time: tour.startTimes?.[0] || 'Por confirmar',
    adults: parseInt(adults || '1'),
    children: children ? parseInt(children) : 0,
    total: total ? parseFloat(total) : 0,
  };

  // Calcular precios
  const adultPrice = tour.price.adult;
  const childPrice = tour.price.child || 0;
  const totalAdults = reservation.adults * adultPrice;
  const totalChildren = reservation.children * childPrice;

  // Obtener el nombre del mes en español
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  // Formatear la fecha de manera más amigable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${dayName} ${day} de ${month} de ${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-cyan-400/30 dark:bg-cyan-700/30 rounded-full blur-sm"></div>
              <div className="relative rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 p-1">
                <div className="rounded-full bg-white dark:bg-gray-900 p-3">
                  <CheckCircle2 className="h-14 w-14 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-emerald-600">
            ¡Tu aventura está confirmada!
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            ¡Hola! Estamos emocionados de que nos acompañes en esta experiencia única.
          </p>
          <div className="mt-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg inline-block">
            <p className="text-sm font-medium text-cyan-800 dark:text-cyan-200">
              📧 Hemos enviado los detalles de tu reserva a tu correo electrónico
            </p>
          </div>
        </div>

        {/* Tarjeta de resumen */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden mb-8 border border-gray-100 dark:border-gray-700/50">
          {/* Imagen del tour */}
          <div className="relative h-56 bg-gradient-to-r from-cyan-500 to-blue-500">
            <Image
              src={tour.images?.[0] || '/images/tours/default-tour.jpg'}
              alt={tour.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center space-x-2 mb-1">
                <span className="px-2.5 py-0.5 text-xs font-medium bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200 rounded-full">
                  {tour.difficulty}
                </span>
                <span className="text-sm text-cyan-100">•</span>
                <span className="text-sm text-cyan-100">{tour.duration}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tour.title}</h2>
            </div>
          </div>

          {/* Detalles de la reserva */}
          <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Detalles de tu experiencia
              </h3>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                Confirmado
              </span>
            </div>

            <div className="space-y-6">
              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Fecha y hora</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {formatDate(date)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                    {reservation.time} • {tour.duration}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Participantes</p>
                  <div className="mt-1 space-y-1">
                    <p className="text-base font-medium text-gray-900 dark:text-white">
                      {reservation.adults} {reservation.adults === 1 ? 'Adulto' : 'Adultos'} • ${adultPrice.toFixed(2)} c/u
                    </p>
                    {reservation.children > 0 && childPrice > 0 && (
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {reservation.children} {reservation.children === 1 ? 'Niño' : 'Niños'} • ${childPrice.toFixed(2)} c/u
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Punto de encuentro</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white">
                    {tour.meetingPoint || 'Ubicación por confirmar'}
                  </p>
                  {tour.meetingPoint && (
                    <button className="mt-2 text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center">
                      Ver en mapa
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-300">Duración</p>
                  <p className="text-sm text-gray-900 dark:text-white">{tour.duration} • Dificultad: {tour.difficulty}</p>
                </div>
              </div>
            </div>

            {/* Resumen de pago */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Resumen de pago</h4>
              <div className="space-y-3 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {reservation.adults} {reservation.adults === 1 ? 'Adulto' : 'Adultos'}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    ${totalAdults.toFixed(2)}
                  </span>
                </div>
                {reservation.children > 0 && childPrice > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {reservation.children} {reservation.children === 1 ? 'Niño' : 'Niños'}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      ${totalChildren.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700 mt-3">
                  <span className="text-base font-semibold text-gray-900 dark:text-white">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-emerald-600">
                      ${reservation.total.toFixed(2)}
                    </span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Impuestos incluidos</p>
                  </div>
                </div>
              </div>

              {/* Información de pago */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200">Método de pago</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Pagarás directamente al guía el día del tour en efectivo o con tarjeta.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de consejos */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700/50">
          <div className="p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Consejos para tu aventura
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/30 hover:border-cyan-100 dark:hover:border-cyan-900/50 transition-colors duration-200">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Llega con tiempo</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Te recomendamos llegar 15 minutos antes de la hora programada para el check-in.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/30 hover:border-cyan-100 dark:hover:border-cyan-900/50 transition-colors duration-200">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Qué llevar</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Ropa cómoda, bloqueador solar, agua y cámara fotográfica. ¡No olvides tu espíritu aventurero!</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/30 hover:border-cyan-100 dark:hover:border-cyan-900/50 transition-colors duration-200">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Política de cancelación</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Puedes cancelar hasta 24 horas antes sin cargo. Después de este período, se cobrará el 50% del valor total.</p>
                </div>
              </div>

              <div className="flex items-start p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-600/30 hover:border-cyan-100 dark:hover:border-cyan-900/50 transition-colors duration-200">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center">
                  <svg className="h-5 w-5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Métodos de pago</h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Aceptamos efectivo (GTQ/USD) y las principales tarjetas de crédito y débito.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">¿Listo para tu aventura?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al inicio
            </Link>
            <Link
              href="/rutas-magicas"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ver más tours
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Tienes alguna pregunta? Estamos aquí para ayudarte.
            </p>
            <div className="mt-2 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <a href="mailto:hola@nomadafantasma.com" className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                hola@nomadafantasma.com
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a href="tel:+50212345678" className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                +502 1234 5678
              </a>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">¿Tienes alguna pregunta?</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Estamos aquí para ayudarte. Contáctanos en{' '}
            <a href="mailto:hola@nomadafantasma.com" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              hola@nomadafantasma.com
            </a>{' '}
            o al{' '}
            <a href="tel:+50212345678" className="text-cyan-600 dark:text-cyan-400 hover:underline">
              +502 1234 5678
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
