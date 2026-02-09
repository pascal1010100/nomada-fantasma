'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Clock, MapPin, Users, ArrowRight, Star } from 'lucide-react';
import { ShuttleRoute } from '@/types/shuttle';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ShuttleCardProps {
    shuttle: ShuttleRoute;
    onBook: (shuttle: ShuttleRoute) => void;
}

export default function ShuttleCard({ shuttle, onBook }: ShuttleCardProps) {
    const t = useTranslations('Shuttles.card');
    const [imageError, setImageError] = useState(false);

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
                    src={imageError ? '/images/shuttles/default-shuttle.svg' : shuttle.image}
                    alt={`${shuttle.origin} a ${shuttle.destination}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={handleImageError}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

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
                        <div className="space-y-0">
                            <h3 className="text-3xl font-black text-white tracking-tighter">
                                Q{shuttle.price}
                            </h3>
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{t('from')}</p>
                        </div>
                        <span className="text-[9px] text-gray-500 uppercase font-bold tracking-widest pb-1 border-b border-white/10">{t('perPerson')}</span>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-10 space-y-10 flex-1 flex flex-col justify-between bg-card">
                <div className="space-y-8">
                    <div className="relative flex flex-col gap-6">
                        {/* Route representation - Minimalist Elite Style */}
                        <div className="flex items-center gap-6">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                            <p className="font-extrabold text-lg text-foreground tracking-tight">{shuttle.origin}</p>
                        </div>

                        {/* Elegant Connector */}
                        <div className="ml-[2px] w-[2px] h-8 bg-gradient-to-b from-primary/20 to-transparent" />

                        <div className="flex items-center gap-6">
                            <MapPin className="w-5 h-5 text-muted-foreground/40" />
                            <p className="font-extrabold text-lg text-foreground tracking-tight">{shuttle.destination}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t('durationLabel')}</span>
                        <p className="font-bold text-sm text-muted-foreground/80">{shuttle.duration}</p>
                    </div>
                    <div className="space-y-1 text-right">
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
