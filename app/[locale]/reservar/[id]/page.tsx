import { notFound } from 'next/navigation';
import { mockRoutes } from '../../rutas-magicas/mocks/routes';
import { pueblosAtitlan } from '../../rutas-magicas/mocks/atitlanData';
import ReservationForm from '../../rutas-magicas/components/ReservationForm';
import { ArrowLeft, Star, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { getTourById, getPuebloSlugByTourId } from '../../rutas-magicas/mocks/tours';
import { getTourBySlugFromDB } from '@/app/lib/supabase/tours';
import { getTranslations } from 'next-intl/server';

// Helper to find a tour by ID across all data sources
const findTourById = (id: string) => {
    // Check main routes
    const route = mockRoutes.find(r => r.id === id);
    if (route) return { data: route, type: 'route' as const };

    // Check pueblos
    const pueblo = pueblosAtitlan.find(p => p.id === id);
    if (pueblo) return { data: pueblo, type: 'pueblo' as const };

    // Check specific tours inside pueblos
    const specificTour = getTourById(id);
    if (specificTour) return { data: specificTour, type: 'tour' as const };

    return null;
};

const findSupabaseTour = async (idOrSlug: string) => {
    const supabaseTour = await getTourBySlugFromDB(idOrSlug);
    if (!supabaseTour) {
        return null;
    }
    const images = supabaseTour.images ?? (supabaseTour.cover_image ? [supabaseTour.cover_image] : []);
    return {
        data: {
            id: supabaseTour.id,
            title: supabaseTour.title,
            slug: supabaseTour.slug,
            images,
            price: supabaseTour.price_min ?? 0,
            capacity: {
                max: supabaseTour.max_guests ?? 10,
            },
            summary: supabaseTour.description ?? '',
            rating: 5,
        },
        type: 'tour' as const,
        puebloSlug: supabaseTour.pueblo_slug,
    };
};

export default async function TourReservationPage({
    params,
}: {
    params: Promise<{ id: string; locale: string }>;
}) {
    const { id, locale } = await params;
    const t = await getTranslations({ locale, namespace: 'ReservationPage' });
    const localResult = findTourById(id);
    const result = localResult ?? await findSupabaseTour(id);

    if (!result) {
        notFound();
    }

    const { data: tour, type } = result;

    // Normalize data for rendering
    const title = tour.title;
    const coverImage = 'coverImage' in tour ? tour.coverImage : (tour.images?.[0] || '/images/placeholder.svg');
    const price = typeof tour.price === 'number' ? tour.price : tour.price.adult;
    const maxCapacity = 'groupSize' in tour ? tour.groupSize.max : (tour.capacity?.max || 10);
    const summary = 'summary' in tour ? tour.summary : '';

    // Determine back link
    let backLink = '/rutas-magicas';
    let backLabel = t('backToRoutes');

    if (type === 'route') {
        backLink = `/rutas-magicas/${tour.slug}`;
        backLabel = t('backToDetails');
    } else if (type === 'pueblo') {
        backLink = `/rutas-magicas/lago-atitlan/${tour.slug}`; // Assuming it's always Atitlan for now
        backLabel = t('backToTown', { town: tour.title });
    } else if (type === 'tour') {
        const puebloSlug = ('puebloSlug' in result ? result.puebloSlug : undefined) ?? getPuebloSlugByTourId(tour.id);
        if (puebloSlug) {
            backLink = `/rutas-magicas/lago-atitlan/${puebloSlug}/tours/${tour.slug}`;
            backLabel = t('backToTour');
        }
    }
    const localizedBackLink = `/${locale}${backLink}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white relative overflow-hidden transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-10 dark:opacity-30 blur-sm scale-105"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/90 to-white dark:from-gray-900/80 dark:via-gray-900/90 dark:to-gray-900" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 sm:py-12">
                {/* Header Navigation */}
                <div className="mb-8">
                    <Link
                        href={localizedBackLink}
                        className="inline-flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        {backLabel}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Left Column: Info & Context */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 group bg-white dark:bg-gray-800">
                            <div className="aspect-[4/3] relative">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${coverImage})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30 backdrop-blur-md">
                                            {t('premiumBadge')}
                                        </span>
                                        {'rating' in tour && (
                                            <span className="flex items-center text-yellow-400 text-sm font-bold">
                                                <Star className="w-4 h-4 fill-current mr-1" />
                                                {tour.rating}
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 leading-tight">{title}</h1>
                                    <p className="text-gray-200 text-sm md:text-base line-clamp-3">{summary}</p>
                                </div>
                            </div>
                        </div>

                        {/* Value Props */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                <ShieldCheck className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-2" />
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('secureTitle')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('secureDesc')}</p>
                            </div>
                            <div className="bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm dark:shadow-none">
                                <Zap className="w-8 h-8 text-amber-500 dark:text-amber-400 mb-2" />
                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{t('fastTitle')}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('fastDesc')}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Reservation Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white/80 dark:bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-gray-200 dark:border-white/20 shadow-2xl relative overflow-hidden">
                            {/* Decorative elements */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200 dark:border-white/10">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('formTitle')}</h2>
                                        <p className="text-sm text-cyan-600 dark:text-cyan-300">{t('formSubtitle')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('pricePerPerson')}</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">Q{price}</p>
                                    </div>
                                </div>

                                <ReservationForm
                                    tourId={tour.id}
                                    price={price}
                                    maxCapacity={maxCapacity}
                                    availableDays={['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
