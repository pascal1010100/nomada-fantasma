'use client';

import { useState } from 'react';
import { ShuttleRoute } from '@/types/shuttle';
import ShuttleCard from './components/ShuttleCard';
import ShuttleBookingModal from './components/ShuttleBookingModal';
import { AlertTriangle, ArrowRight, Bus, DatabaseZap, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

type ShuttlesClientProps = {
    initialShuttles: ShuttleRoute[];
    dataSource?: 'live' | 'mock' | 'empty';
    fetchWarning?: string | null;
};

export default function ShuttlesClient({
    initialShuttles,
    dataSource = 'live',
    fetchWarning = null,
}: ShuttlesClientProps) {
    const t = useTranslations('Shuttles');
    const locale = useLocale();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShuttle, setSelectedShuttle] = useState<ShuttleRoute | null>(null);

    const isEnglish = locale.startsWith('en');
    const operationalMessage =
        dataSource === 'mock'
            ? isEnglish
                ? 'Showing development fallback routes because the live shuttle catalog is unavailable.'
                : 'Mostrando rutas temporales de desarrollo porque el catalogo real de shuttles no esta disponible.'
            : dataSource === 'empty'
                ? isEnglish
                    ? 'No live shuttle routes are published yet. Add records in Supabase to populate this page.'
                    : 'Aun no hay rutas de shuttle publicadas en la base real. Agrega registros en Supabase para poblar esta pagina.'
                : null;

    // Get unique origins and destinations for filters
    const origins = Array.from(new Set(initialShuttles.map(s => s.origin)));
    const destinations = Array.from(new Set(initialShuttles.map(s => s.destination)));

    const filteredShuttles = initialShuttles.filter(shuttle => {
        const matchesSearch =
            shuttle.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
            shuttle.destination.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesOrigin = selectedOrigin ? shuttle.origin === selectedOrigin : true;
        const matchesDestination = selectedDestination ? shuttle.destination === selectedDestination : true;

        return matchesSearch && matchesOrigin && matchesDestination;
    });

    const handleBook = (shuttle: ShuttleRoute) => {
        setSelectedShuttle(shuttle);
        setIsModalOpen(true);
    };

    const heroHighlights = isEnglish
        ? [
            { icon: Bus, label: 'Shared routes' },
            { icon: ShieldCheck, label: 'Private transfers' },
            { icon: Sparkles, label: 'Ghost-style logistics' },
        ]
        : [
            { icon: Bus, label: 'Rutas compartidas' },
            { icon: ShieldCheck, label: 'Traslados privados' },
            { icon: Sparkles, label: 'Logistica estilo fantasma' },
        ];

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Hero Section */}
            <section className="px-4 pt-6 sm:px-6">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-white/10 bg-card/70 shadow-2xl shadow-black/30">
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(53,237,255,0.24),transparent_28%),radial-gradient(circle_at_50%_28%,rgba(170,109,255,0.18),transparent_24%)]" />
                        <div
                            className="absolute inset-0 opacity-[0.14]"
                            style={{
                                backgroundImage:
                                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 44px)',
                            }}
                        />
                        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/25 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/80 to-transparent" />
                    </div>

                    <div className="relative z-20 px-4 py-14 text-center sm:px-8 sm:py-16 md:px-12 md:py-20">
                        <div className="mx-auto max-w-4xl space-y-7">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary backdrop-blur-sm"
                            >
                                <span className="relative mr-3 flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                </span>
                                {t('badge')}
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-5xl font-bold tracking-tight leading-[1.04] text-white sm:text-6xl md:text-7xl lg:text-[5.2rem]"
                            >
                                <span className="block">{t('title')}</span>
                                <span className="mt-2 block bg-gradient-to-r from-[#37EAFF] via-[#7AB8FF] to-[#C86CFF] bg-clip-text text-transparent">
                                    {t('subtitle')}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-auto max-w-2xl text-lg leading-relaxed text-white/72 md:text-xl"
                            >
                                {t('description')}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-wrap items-center justify-center gap-3 pt-2"
                            >
                                {heroHighlights.map(({ icon: Icon, label }) => (
                                    <span
                                        key={label}
                                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-white/80 backdrop-blur-sm uppercase"
                                    >
                                        <Icon className="h-3.5 w-3.5 text-primary" />
                                        {label}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative z-20 border-t border-white/8 bg-black/10 px-4 py-4 backdrop-blur-sm sm:px-6 md:px-8">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <select
                                className="w-full rounded-2xl border border-white/8 bg-white/5 px-8 py-5 font-black text-[10px] uppercase tracking-widest outline-none transition-all focus:border-primary/30"
                                value={selectedOrigin}
                                onChange={(e) => setSelectedOrigin(e.target.value)}
                            >
                                <option value="" className="bg-card">{t('originPlaceholder')}</option>
                                {origins.map(o => <option key={o} value={o} className="bg-card">{o}</option>)}
                            </select>

                            <select
                                className="w-full rounded-2xl border border-white/8 bg-white/5 px-8 py-5 font-black text-[10px] uppercase tracking-widest outline-none transition-all focus:border-primary/30"
                                value={selectedDestination}
                                onChange={(e) => setSelectedDestination(e.target.value)}
                            >
                                <option value="" className="bg-card">{t('destinationPlaceholder')}</option>
                                {destinations.map(d => <option key={d} value={d} className="bg-card">{d}</option>)}
                            </select>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full rounded-2xl border border-white/8 bg-white/5 px-8 py-5 pr-14 font-black text-[10px] uppercase tracking-widest outline-none transition-all focus:border-primary/30"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-6 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search status */}
            <div className="max-w-6xl mx-auto px-4 mt-6 md:mt-8 relative z-30">
                {(operationalMessage || fetchWarning) && (
                    <div className={`mb-6 rounded-2xl border px-5 py-4 ${dataSource === 'mock'
                            ? 'border-amber-500/30 bg-amber-500/10'
                            : 'border-cyan-500/30 bg-cyan-500/10'
                        }`}>
                        <div className="flex items-start gap-3">
                            {dataSource === 'mock' ? (
                                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
                            ) : (
                                <DatabaseZap className="mt-0.5 h-5 w-5 text-cyan-300" />
                            )}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-white">
                                    {operationalMessage}
                                </p>
                                {fetchWarning === 'db_error' && (
                                    <p className="text-xs text-white/70">
                                        {isEnglish
                                            ? 'The server could not read shuttle_routes from Supabase during SSR.'
                                            : 'El servidor no pudo leer shuttle_routes desde Supabase durante el SSR.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Routes Grid */}
            <div className="max-w-6xl mx-auto px-4 mt-14 md:mt-16">
                <div className="flex items-end justify-between mb-14 md:mb-16 border-b border-white/5 pb-10">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black tracking-tight text-white mb-2">{t('sectionTitle')}</h2>
                        <p className="text-muted-foreground/40 text-lg font-medium max-w-xl">
                            {t('sectionDesc')}
                        </p>
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 bg-white/[0.02] px-6 py-3 rounded-full border border-white/5">
                        {filteredShuttles.length} {t('availableRoutes')}
                    </div>
                </div>

                {filteredShuttles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {filteredShuttles.map((shuttle) => (
                            <ShuttleCard
                                key={shuttle.id}
                                shuttle={shuttle}
                                onBook={handleBook}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-48 rounded-[3rem] border border-dashed border-white/5 bg-white/[0.01]">
                        <p className="text-2xl font-black text-muted-foreground/20 mb-6 uppercase tracking-widest">{t('noRoutesTitle')}</p>
                        <button
                            onClick={() => { setSelectedOrigin(''); setSelectedDestination(''); setSearchTerm('') }}
                            className="text-primary text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
                        >
                            {t('noRoutesAction')}
                        </button>
                    </div>
                )}
            </div>

            {/* Private Section */}
            <div className="max-w-6xl mx-auto px-4 mt-32 md:mt-48 mb-32">
                <div className="relative overflow-hidden rounded-[3rem] border border-white/8 bg-card/90 px-8 py-12 shadow-3xl shadow-black/40 transition-all duration-700 hover:border-primary/20 md:px-16 md:py-16">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,232,255,0.12),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(182,102,255,0.12),transparent_24%)]" />
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 42px)' }} />

                    <div className="relative z-10 text-center">
                        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.38em] text-primary">
                            {t('conciergeService') || 'Concierge Service'}
                        </div>

                        <h3 className="mx-auto max-w-4xl text-4xl font-black leading-[1.06] tracking-tight text-white md:text-6xl">
                            {t('privateTransferTitle')}
                        </h3>

                        <p className="mx-auto max-w-2xl pt-4 text-lg font-medium leading-relaxed text-white/65">
                            {t('privateTransferDesc')}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                {t('privateTransferChip1')}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                                <Bus className="h-3.5 w-3.5 text-primary" />
                                {t('privateTransferChip2')}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                                <Sparkles className="h-3.5 w-3.5 text-primary" />
                                {t('privateTransferChip3')}
                            </span>
                        </div>

                        <div className="pt-10">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleBook({
                                    id: 'custom-private',
                                    origin: '',
                                    destination: '',
                                    price: 0,
                                    schedule: ['Custom'],
                                    duration: 'On request',
                                    image: '',
                                    type: 'private',
                                    description: 'Solicitud de traslado privado personalizado.'
                                })}
                                className="btn-cta shimmer group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-10 py-4 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                            >
                                {t('privateTransferBtn')}
                                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            <ShuttleBookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                shuttle={selectedShuttle}
            />
        </div>
    );
}
