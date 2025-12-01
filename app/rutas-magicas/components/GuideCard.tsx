'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Star, MessageCircle, Globe, Award, Coffee, Sparkles } from 'lucide-react';
import { Guide } from '../lago-atitlan/data';
import BookingModal from './BookingModal';
import { trackEvent } from '../../lib/analytics';
import { motion } from 'framer-motion';

interface GuideCardProps {
    guide: Guide;
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        trackEvent('open_booking_modal', { guide: guide.name });
        setIsModalOpen(true);
    };

    const handleTip = (e: React.MouseEvent) => {
        e.preventDefault();
        trackEvent('click_tip', { guide: guide.name });
        window.open('https://www.paypal.com/paypalme/nomadafantasma', '_blank');
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="card-lift glass-enhanced rounded-2xl overflow-hidden border border-border/50 group relative"
            >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-primary/5 transition-all duration-500 pointer-events-none" />

                <div className="relative p-6 flex flex-col sm:flex-row gap-6">
                    {/* Avatar */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 mx-auto sm:mx-0">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border">
                            {/* Fallback with initial */}
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-3xl font-bold text-primary">{guide.name.charAt(0)}</span>
                            </div>
                            {/* Uncomment when real images are available
                            <Image 
                              src={guide.photo} 
                              alt={guide.name} 
                              fill 
                              className="object-cover"
                            />
                            */}
                        </div>
                        {/* Rating badge */}
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            className="absolute -bottom-2 -right-2 bg-card rounded-full p-1.5 border border-border shadow-lg"
                        >
                            <div className="bg-gradient-to-br from-yellow-400/20 to-amber-500/20 p-1.5 rounded-full">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                    {guide.name}
                                </h3>
                                <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-muted-foreground mt-1">
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-3 h-3 fill-yellow-400" />
                                        {guide.rating}
                                    </span>
                                    <span>•</span>
                                    <span>{guide.reviews} reseñas</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleOpenBooking}
                                    className="shimmer inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 border border-green-500/30 rounded-xl text-sm font-medium transition-all shadow-lg shadow-green-500/10"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Reservar
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleTip}
                                    className="inline-flex items-center justify-center px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-amber-400 border border-amber-500/20 rounded-lg text-xs font-medium transition-all"
                                >
                                    <Coffee className="w-3 h-3 mr-1.5" />
                                    Invítame un café
                                </motion.button>
                            </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2">
                            {guide.bio}
                        </p>

                        <div className="space-y-3">
                            {/* Specialties */}
                            <div className="flex items-start gap-2 text-xs">
                                <Award className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <span className="font-semibold text-foreground">Especialidades:</span>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {guide.specialties.map((spec, idx) => (
                                            <motion.span
                                                key={idx}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className="badge-pulse px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 text-xs font-medium"
                                            >
                                                {spec}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Globe className="w-4 h-4 text-accent" />
                                <span className="font-semibold text-foreground">Idiomas:</span>
                                <span>{guide.languages.join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scan line effect */}
                <div className="scan-line absolute inset-0 pointer-events-none opacity-20" />
            </motion.div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                guideName={guide.name}
                guidePhone={guide.contact}
            />
        </>
    );
};

export default GuideCard;
