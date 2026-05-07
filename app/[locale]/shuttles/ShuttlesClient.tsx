'use client';

import { useState } from 'react';
import { ShuttleRoute } from '@/types/shuttle';
import ShuttleCard from './components/ShuttleCard';
import ShuttleBookingModal from './components/ShuttleBookingModal';
import { ArrowRight, Bus, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';

type ShuttlesClientProps = {
    initialShuttles: ShuttleRoute[];
};

export default function ShuttlesClient({
    initialShuttles,
}: ShuttlesClientProps) {
    const t = useTranslations('Shuttles');
    const locale = useLocale();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShuttle, setSelectedShuttle] = useState<ShuttleRoute | null>(null);

    const isEnglish = locale.startsWith('en');
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
            <section className="nf-page-safe-loose px-4 sm:px-6">
                <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-border bg-card shadow-2xl shadow-black/10 dark:border-white/10 dark:shadow-black/30">
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

                    <div className="relative z-20 px-4 py-12 text-center sm:px-8 sm:py-16 md:px-12 md:py-20">
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
                                className="text-4xl font-bold tracking-tight leading-[1.04] text-foreground sm:text-6xl md:text-7xl lg:text-[5.2rem]"
                            >
                                <span className="block">{t('title')}</span>
                                <span className="mt-2 block bg-gradient-to-r from-[#37EAFF] via-[#7AB8FF] to-[#C86CFF] bg-clip-text text-transparent">
                                    {t('subtitle')}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mx-auto max-w-2xl text-lg leading-relaxed text-foreground/75 md:text-xl"
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
                                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75 backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                                    >
                                        <Icon className="h-3.5 w-3.5 text-primary" />
                                        {label}
                                    </span>
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative z-20 border-t border-border bg-muted/45 px-4 py-4 backdrop-blur-sm sm:px-6 md:px-8 dark:border-white/8 dark:bg-black/10">
                        <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                            <select
                                className="w-full rounded-2xl border border-border bg-background px-6 py-4 text-[11px] font-black uppercase tracking-widest text-foreground outline-none transition-all focus:border-primary/40 dark:border-white/8 dark:bg-white/5"
                                value={selectedOrigin}
                                onChange={(e) => setSelectedOrigin(e.target.value)}
                            >
                                <option value="" className="bg-background text-foreground">{t('originPlaceholder')}</option>
                                {origins.map(o => <option key={o} value={o} className="bg-background text-foreground">{o}</option>)}
                            </select>

                            <select
                                className="w-full rounded-2xl border border-border bg-background px-6 py-4 text-[11px] font-black uppercase tracking-widest text-foreground outline-none transition-all focus:border-primary/40 dark:border-white/8 dark:bg-white/5"
                                value={selectedDestination}
                                onChange={(e) => setSelectedDestination(e.target.value)}
                            >
                                <option value="" className="bg-background text-foreground">{t('destinationPlaceholder')}</option>
                                {destinations.map(d => <option key={d} value={d} className="bg-background text-foreground">{d}</option>)}
                            </select>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={t('searchPlaceholder')}
                                    className="w-full rounded-2xl border border-border bg-background px-6 py-4 pr-12 text-[11px] font-black uppercase tracking-widest text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary/40 dark:border-white/8 dark:bg-white/5"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Routes Grid */}
            <div className="max-w-6xl mx-auto px-4 mt-14 md:mt-16">
                <div className="flex flex-col gap-4 border-b border-border pb-8 md:mb-16 md:flex-row md:items-end md:justify-between md:pb-10">
                    <div className="space-y-4">
                        <h2 className="mb-2 text-3xl font-black tracking-tight text-foreground sm:text-5xl">{t('sectionTitle')}</h2>
                        <p className="max-w-xl text-base font-medium text-muted-foreground md:text-lg">
                            {t('sectionDesc')}
                        </p>
                    </div>
                    <div className="w-fit rounded-full border border-border bg-card px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
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
                    <div className="rounded-[3rem] border border-dashed border-border bg-card px-6 py-36 text-center shadow-xl shadow-black/5 md:py-48">
                        <p className="mb-6 text-2xl font-black uppercase tracking-widest text-muted-foreground">{t('noRoutesTitle')}</p>
                        <button
                            onClick={() => { setSelectedOrigin(''); setSelectedDestination(''); setSearchTerm('') }}
                            className="text-[10px] font-black uppercase tracking-[0.4em] text-primary transition-colors hover:text-foreground"
                        >
                            {t('noRoutesAction')}
                        </button>
                    </div>
                )}
            </div>

            {/* Private Section */}
            <div className="max-w-6xl mx-auto px-4 mt-32 md:mt-48 mb-32">
                <div className="relative overflow-hidden rounded-[3rem] border border-border bg-card/90 px-8 py-12 shadow-2xl shadow-black/10 transition-all duration-700 hover:border-primary/30 md:px-16 md:py-16 dark:border-white/8 dark:shadow-black/40">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,232,255,0.12),transparent_28%),radial-gradient(circle_at_85%_15%,rgba(182,102,255,0.12),transparent_24%)]" />
                    <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 42px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 42px)' }} />

                    <div className="relative z-10 text-center">
                        <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.38em] text-primary">
                            {t('conciergeService') || 'Concierge Service'}
                        </div>

                        <h3 className="mx-auto max-w-4xl text-4xl font-black leading-[1.06] tracking-tight text-foreground md:text-6xl">
                            {t('privateTransferTitle')}
                        </h3>

                        <p className="mx-auto max-w-2xl pt-4 text-lg font-medium leading-relaxed text-muted-foreground">
                            {t('privateTransferDesc')}
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                                {t('privateTransferChip1')}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                                <Bus className="h-3.5 w-3.5 text-primary" />
                                {t('privateTransferChip2')}
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-foreground/75 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
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
