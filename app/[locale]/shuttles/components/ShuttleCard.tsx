'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, ArrowRight } from 'lucide-react';
import { ShuttleRoute } from '@/types/shuttle';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { getDestinationImage } from '../utils/destinationImages';

interface ShuttleCardProps {
    shuttle: ShuttleRoute;
    onBook: (shuttle: ShuttleRoute) => void;
}

export default function ShuttleCard({ shuttle, onBook }: ShuttleCardProps) {
    const t = useTranslations('Shuttles.card');
    const locale = useLocale();
    const [imageError, setImageError] = useState(false);
    const scheduleText = shuttle.schedule.join(' ').toLowerCase();
    const hasScale = (shuttle.description || '').toLowerCase().includes('escala') || scheduleText.includes('escala') || scheduleText.includes('cambio') || scheduleText.includes('opción') || scheduleText.includes('stopover') || scheduleText.includes('transfer');
    const isDirect = scheduleText.includes('directo');
    const isOvernight = scheduleText.includes('pernocta') || scheduleText.includes('día siguiente') || scheduleText.includes('night') || scheduleText.includes('overnight') || scheduleText.includes('noche');
    const isLimitedDays = scheduleText.includes('jueves') || scheduleText.includes('domingos') || scheduleText.includes('thursday') || scheduleText.includes('sunday') || scheduleText.includes('thu') || scheduleText.includes('sun');
    const translateSchedule = (value: string) => {
        if (!locale.startsWith('en')) return value;
        return value
            .replace(/^Opción\s*([A-Z])/i, 'Option $1')
            .replace(/^Opción\s*(\d+)/i, 'Option $1')
            .replace(/^Directo:/i, 'Direct:')
            .replace(/\bpernocta en antigua\b/gi, 'overnight in Antigua')
            .replace(/\bdía siguiente\b/gi, 'next day')
            .replace(/\bsolo jueves y domingos\b/gi, 'Only Thu & Sun')
            .replace(/\bcambio\b/gi, 'transfer')
            .replace(/\bescala\b/gi, 'stopover');
    };
    const translateDuration = (value: string) => {
        if (!locale.startsWith('en')) return value;
        return value
            .replace(/\bnoche\b/gi, 'Night')
            .replace(/\bdía completo\b/gi, 'Full day')
            .replace(/\bhoras\b/gi, 'hours')
            .replace(/\baprox\.\b/gi, 'approx.')
            .replace(/\bpernocta\b/gi, 'overnight');
    };
    const summarizeSchedule = (value: string) => {
        const firstChunk = value.split('|')[0].trim();
        const trimmed = firstChunk.length > 58 ? `${firstChunk.slice(0, 55).trim()}…` : firstChunk;
        return translateSchedule(trimmed);
    };
    const extraOptions = shuttle.schedule.length > 1 ? shuttle.schedule.length - 1 : 0;

    // Usar imagen del destino específico
    const remote = (shuttle.image || '').trim();
    const isLocal = remote.startsWith('/');
    const candidate = isLocal && remote ? remote : getDestinationImage(shuttle.destination);
    const destinationImage = imageError ? '/images/shuttles/default-shuttle.svg' : candidate;
    const isFallback = imageError || destinationImage.endsWith('/default-shuttle.svg');
    const isSVG = destinationImage.endsWith('.svg');

    const handleImageError = () => {
        setImageError(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-card border border-white/5 hover:border-primary/40 transition-all duration-500 shadow-2xl hover:shadow-primary/5 flex flex-col h-full"
        >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={imageError ? '/images/shuttles/default-shuttle.svg' : destinationImage}
                    alt={`${shuttle.origin} a ${shuttle.destination}`}
                    fill
                    className={`transition-transform duration-700 group-hover:scale-105 object-cover ${isFallback && !isSVG ? 'filter brightness-[1.25] contrast-[1.1]' : ''}`}
                    style={{ filter: 'saturate(1.05) contrast(1.08)' }}
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent ${isFallback ? 'opacity-50' : isSVG ? 'opacity-68' : 'opacity-80'}`} />
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/40 mix-blend-soft-light" />

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md text-white px-2.5 py-1 rounded-md w-fit mb-2 border border-white/5">
                        <Users className="w-3 h-3 text-primary/80" />
                        {shuttle.type === 'shared' ? t('sharedType') : t('privateType')}
                    </div>
                    <div className="flex items-end justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                            <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                                {shuttle.price ? `Q${shuttle.price}` : 'Q 0'}
                            </h3>
                            <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest leading-tight">
                                {t('from')} / {t('perPerson')}
                            </p>
                            <p className="text-base text-white/95 font-semibold leading-tight break-words" title={shuttle.destination}>
                                {shuttle.destination}
                            </p>
                        </div>
                        <span className="text-[9px] text-white uppercase font-bold tracking-widest pb-1 border-b border-white/20 leading-none hidden">{t('perPerson')}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 space-y-7 flex-1 flex flex-col justify-between bg-card">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <span className="text-[10px] font-black uppercase tracking-[0.24em] text-primary/70">
                            {locale.startsWith('en') ? 'Route' : 'Ruta'}
                        </span>
                        <div className="flex items-start justify-start gap-3 text-left">
                            <p className="min-w-0 flex-1 font-semibold text-sm text-muted-foreground/85 leading-snug break-words">
                            {shuttle.origin}
                            </p>
                            <ArrowRight className="mt-0.5 w-4 h-4 text-primary/60 flex-shrink-0" />
                            <p className="min-w-0 flex-1 font-semibold text-sm text-white leading-snug break-words">
                            {shuttle.destination}
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        {(hasScale || isDirect) && (
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-yellow-300/90 bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-1 rounded-full">
                                {isDirect
                                    ? (locale.startsWith('en') ? 'Direct' : 'Directo')
                                    : (locale.startsWith('en') ? 'Stopover' : 'Con escala')}
                            </span>
                        )}
                        {isLimitedDays && (
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-200/90 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-full">
                                {locale.startsWith('en') ? 'Thu & Sun' : 'Jue & Dom'}
                            </span>
                        )}
                        {isOvernight && (
                            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-200/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                {locale.startsWith('en') ? 'Overnight' : 'Pernocta'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-6 text-left">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t('durationLabel')}</span>
                        <p className="font-bold text-sm text-muted-foreground/80">{translateDuration(shuttle.duration)}</p>
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t('scheduleLabel')}</span>
                        <p className="font-bold text-sm text-muted-foreground/80 leading-snug">
                            {summarizeSchedule(shuttle.schedule[0] || '')}
                            {extraOptions > 0 && (
                                <span className="text-[10px] opacity-50 ml-1">
                                    {locale.startsWith('en') ? `+${extraOptions} options` : `+${extraOptions} opciones`}
                                </span>
                            )}
                        </p>
                    </div>
                </div>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onBook(shuttle)}
                    className="w-full mt-4 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] bg-white text-black hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl shadow-black/20"
                >
                    {t('bookNow')}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-500 group-hover/btn:translate-x-1.5" />
                </motion.button>
            </div>
        </motion.div>
    );
}
