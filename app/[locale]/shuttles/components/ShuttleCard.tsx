'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Users, ArrowRight, Star } from 'lucide-react';
import { ShuttleRoute } from '@/types/shuttle';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { getDestinationImage } from '../utils/destinationImages';

interface ShuttleCardProps {
    shuttle: ShuttleRoute;
    onBook: (shuttle: ShuttleRoute) => void;
}

export default function ShuttleCard({ shuttle, onBook }: ShuttleCardProps) {
    const t = useTranslations('Shuttles.card');
    const [imageError, setImageError] = useState(false);

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
                    className={`transition-transform duration-700 group-hover:scale-105 ${isSVG ? 'object-contain p-2' : 'object-cover'} ${isFallback && !isSVG ? 'filter brightness-[1.25] contrast-[1.1]' : ''}`}
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent ${isFallback ? 'opacity-50' : isSVG ? 'opacity-40' : 'opacity-80'}`} />

                {/* Badge Elite */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[9px] font-black uppercase tracking-widest">
                    <Star className="w-2.5 h-2.5 fill-primary text-primary" />
                    {t('eliteService')}
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest bg-white/10 backdrop-blur-md text-white px-2.5 py-1 rounded-md w-fit mb-2 border border-white/5">
                        <Users className="w-3 h-3 text-primary/80" />
                        {shuttle.type === 'shared' ? t('sharedType') : t('privateType')}
                    </div>
                    <div className="flex items-end justify-between">
                        <div className="space-y-1">
                            <h3 className="text-4xl font-black text-white tracking-tighter leading-none">
                                {shuttle.price ? `Q${shuttle.price}` : 'Q 0'}
                            </h3>
                            <p className="text-[10px] text-gray-300 uppercase font-bold tracking-widest leading-tight">
                                {t('from')} / {t('perPerson')}
                            </p>
                        </div>
                        <span className="text-[9px] text-white uppercase font-bold tracking-widest pb-1 border-b border-white/20 leading-none hidden">{t('perPerson')}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 space-y-10 flex-1 flex flex-col justify-between bg-card">
                <div className="space-y-8">
                    <div className="relative flex flex-col gap-6">
                        {/* Route representation - Minimalist Elite Style */}
                        <div className="flex items-center justify-center text-center gap-3">
                            <p className="font-extrabold text-lg text-foreground tracking-tight truncate">{shuttle.origin}</p>
                            <ArrowRight className="w-4 h-4 text-primary/50 flex-shrink-0" />
                            <p className="font-extrabold text-lg text-foreground tracking-tight truncate">{shuttle.destination}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-center text-center gap-4">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t('durationLabel')}</span>
                        <p className="font-bold text-sm text-muted-foreground/80">{shuttle.duration}</p>
                    </div>
                    <div className="text-muted-foreground/30 text-xl font-thin">•</div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t('scheduleLabel')}</span>
                        <p className="font-bold text-sm text-muted-foreground/80">
                            {shuttle.schedule[0]} <span className="text-[10px] opacity-40">...</span>
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
