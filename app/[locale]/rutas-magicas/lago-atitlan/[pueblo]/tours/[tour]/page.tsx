import { notFound } from 'next/navigation';
import { getTourBySlugFromDB } from '@/app/lib/supabase/tours';
import { Clock, Users, MapPin, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ReservationFormWrapper from '@/app/[locale]/rutas-magicas/components/ReservationFormWrapper';
import type { BookingOptionConfig as BookingOption } from '@/app/lib/tour-booking-options';
import type { Database } from '@/types/database.types';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getTourCoverImage } from '@/app/lib/tours';

type Tour = Database['public']['Tables']['tours']['Row'];
type ItineraryItem = { time: string; title: string; description: string };
type FaqItem = { question: string; answer: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pueblo: string; tour: string; locale: string }>;
}): Promise<Metadata> {
  const { pueblo, tour: tourSlug, locale } = await params;
  const tour = (await getTourBySlugFromDB(tourSlug, pueblo)) as Tour | null;

  if (!tour) {
    return {
      title: 'Nómada Fantasma',
    };
  }

  const title = locale === 'en' ? (tour.title_en ?? tour.title) : tour.title;
  const description =
    locale === 'en'
      ? (tour.description_en ?? tour.description ?? '')
      : (tour.description ?? tour.description_en ?? '');
  const image = getTourCoverImage(tour);
  const url = `/${locale}/rutas-magicas/lago-atitlan/${pueblo}/tours/${tourSlug}`;

  return {
    title: `${title} | Nómada Fantasma`,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      siteName: 'Nómada Fantasma',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ pueblo: string; tour: string; locale: string }>;
}) {
  const { pueblo, tour: tourSlug, locale } = await params;
  const t = await getTranslations({ locale, namespace: 'TourDetail' });
  const tTours = await getTranslations({ locale, namespace: 'Data.tours' });
  if (!tourSlug || tourSlug === 'undefined') {
    notFound();
  }

  const tour = (await getTourBySlugFromDB(tourSlug, pueblo)) as Tour | null;

  if (!tour) {
    notFound();
  }

  const coverImage = getTourCoverImage(tour);
  const description = tour.description ?? '';
  const fullDescription = tour.full_description ?? tour.description ?? '';
  const durationHours = tour.duration_hours ?? 0;
  const minGuests = tour.min_guests ?? 1;
  const maxGuests = tour.max_guests ?? minGuests;
  const meetingPoint = (tour as { meeting_point?: string | null }).meeting_point ?? '';
  const pickupTime = (tour as { pickup_time?: string | null }).pickup_time ?? '';
  const included = (tour.included ?? []) as string[];
  const notIncluded = (tour.not_included ?? []) as string[];
  const itinerary = ((tour as { itinerary?: ItineraryItem[] | null }).itinerary ?? []) as ItineraryItem[];
  const faqs = ((tour as { faqs?: FaqItem[] | null }).faqs ?? []) as FaqItem[];
  const whatToBring = ((tour as { what_to_bring?: string[] | null }).what_to_bring ?? []) as string[];
  const availableDays = (tour as { available_days?: string[] | null }).available_days ?? undefined;
  const startTimes = (tour as { start_times?: string[] | null }).start_times ?? undefined;
  const safeAvailableDays = (availableDays ?? []).map(String);
  const safeStartTimes = (startTimes ?? []).map(String);
  const townName = pueblo.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  const tourKeyRaw = tour.slug ?? tourSlug;
  const tourKey = tourKeyRaw.toLowerCase();
  const localizedTitle = tTours.has(`${tourKey}.title`) ? tTours(`${tourKey}.title`) : tour.title;
  const localizedSummary = tTours.has(`${tourKey}.summary`) ? tTours(`${tourKey}.summary`) : description;
  const localizedDescription = tTours.has(`${tourKey}.description`) ? tTours(`${tourKey}.description`) : fullDescription;
  const localizedMeetingPoint = tTours.has(`${tourKey}.meetingPoint`) ? tTours(`${tourKey}.meetingPoint`) : meetingPoint;
  const localizedDurationLabel = tTours.has(`${tourKey}.durationLabel`)
    ? tTours(`${tourKey}.durationLabel`)
    : t('durationHours', { hours: durationHours });
  const localizedGroupLabel = tTours.has(`${tourKey}.groupLabel`)
    ? tTours(`${tourKey}.groupLabel`)
    : t('groupRange', { min: minGuests, max: maxGuests });
  const readRaw = <T,>(key: string, fallback: T) => {
    if (!tTours.has(key)) {
      return fallback;
    }

    try {
      return tTours.raw(key) as T;
    } catch {
      return fallback;
    }
  };
  const localizedIncluded = readRaw<string[]>(`${tourKey}.includes`, included);
  const localizedNotIncluded = readRaw<string[]>(`${tourKey}.notIncludes`, notIncluded);
  const localizedItinerary = readRaw<ItineraryItem[]>(`${tourKey}.itinerary`, itinerary);
  const localizedWhatToBring = readRaw<string[]>(`${tourKey}.whatToBring`, whatToBring);
  const localizedFaqs = readRaw<FaqItem[]>(`${tourKey}.faqs`, faqs);
  const bookingOptions = readRaw<BookingOption[]>(`${tourKey}.bookingOptions`, []);

  // Obtener otros tours del mismo pueblo para recomendaciones
  // const otherTours = getToursByPueblo(pueblo).filter(t => t.slug !== tourSlug);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con imagen */}
      <div className="relative min-h-[340px] bg-gray-800 md:min-h-[420px]">
        <Image
          src={coverImage}
          alt={localizedTitle}
          fill
          className="object-cover opacity-70"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />

        <div className="container mx-auto flex h-full flex-col justify-end px-4 pb-6 nf-page-safe-loose relative z-10 sm:pb-8">
          <Link
            href={`/${locale}/rutas-magicas/lago-atitlan/${pueblo}`}
            className="mb-4 inline-flex items-center text-sm text-white hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {t('backToTown', { town: townName })}
          </Link>

          <div className="max-w-3xl">
            <h1 className="mb-2 text-2xl font-bold leading-tight text-white sm:text-3xl md:text-5xl">{localizedTitle}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-gray-200 sm:text-base md:text-lg">
              {localizedSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
        <section className="mb-6 rounded-2xl bg-white p-4 shadow-md dark:bg-gray-800 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/40">
              <Clock className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('durationLabel')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{localizedDurationLabel}</p>
              </div>
            </div>
            <div className="flex items-start rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/40">
              <Users className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('groupSizeLabel')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{localizedGroupLabel}</p>
              </div>
            </div>
            <div className="flex items-start rounded-xl border border-gray-100 bg-gray-50/80 p-3 dark:border-gray-700 dark:bg-gray-900/40 sm:col-span-2 lg:col-span-1">
              <MapPin className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-cyan-500" />
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{t('meetingPointLabel')}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{localizedMeetingPoint}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-8">
            {/* Descripción */}
            <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('descriptionTitle')}</h2>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-700 dark:text-gray-300">{localizedDescription}</p>
              </div>
            </section>

            {/* Itinerario */}
            {localizedItinerary.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('itineraryTitle')}</h2>
                <div className="space-y-6">
                  {localizedItinerary.map((item, index) => (
                    <div key={index} className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center">
                          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{index + 1}</span>
                        </div>
                        {index < localizedItinerary.length - 1 && (
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
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('includesTitle')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {localizedIncluded.map((item, index) => (
                  <div key={`inc-${index}`} className="flex items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
                {localizedNotIncluded.map((item, index) => (
                  <div key={`not-inc-${index}`} className="flex items-start">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Preguntas frecuentes */}
            {localizedFaqs.length > 0 && (
              <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('faqTitle')}</h2>
                <div className="space-y-4">
                  {localizedFaqs.map((faq, index) => (
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
            <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800 lg:sticky lg:top-24">
              <ReservationFormWrapper
                tourId={tour.id}
                tourName={localizedTitle}
                price={tour.price_min ?? 0}
                minCapacity={minGuests}
                maxCapacity={maxGuests ?? 10}
                availableDays={safeAvailableDays}
                startTimes={safeStartTimes}
                pickupTime={pickupTime}
                bookingOptions={bookingOptions}
              />
            </div>

            {/* Qué llevar */}
            {localizedWhatToBring.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('whatToBringTitle')}</h3>
                <ul className="space-y-2">
                  {localizedWhatToBring.map((item, index) => (
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
        {/* {otherTours.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">También te puede interesar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTours.slice(0, 3).map((tour) => (
                <div key={tour.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <Image
                      src={tour.images[0] || '/images/tours/default-tour.svg'}
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
        )} */}
      </div>
    </div>
  );
}
