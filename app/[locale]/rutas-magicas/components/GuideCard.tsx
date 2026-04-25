'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MessageCircle, Globe, Award, Compass } from 'lucide-react';
import { Guide } from '../lago-atitlan/data';
import BookingModal from './BookingModal';
import { trackEvent } from '../../../lib/analytics';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface GuideCardProps {
    guide: Guide & { townName?: string };
}

function buildGuideServiceOptions(guide: Guide): Array<{
    id: string;
    title: string;
    priceLabel?: string | null;
    description?: string | null;
}> {
    if (guide.services && guide.services.length > 0) {
        return guide.services;
    }

    return guide.specialties.map((specialty, index) => {
        const match = specialty.match(/^(.*?)\s*\((Q[^)]+)\)\s*$/i);
        if (!match) {
            return {
                id: `legacy-${guide.id}-${index}`,
                title: specialty,
                priceLabel: null,
                description: null,
            };
        }

        return {
            id: `legacy-${guide.id}-${index}`,
            title: match[1].trim(),
            priceLabel: match[2].trim(),
            description: null,
        };
    });
}

const GuideCard: React.FC<GuideCardProps> = ({ guide }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const t = useTranslations('GuideCard');
    const requestBookingLabel = t.has('requestBooking') ? t('requestBooking') : 'Request booking';
    const bookingNoteLabel = t.has('bookingNoteLabel') ? t('bookingNoteLabel') : 'How it works';
    const bookingNote = t.has('bookingNote')
        ? t('bookingNote')
        : 'We review availability with the guide and then confirm payment and final logistics by email.';
    const tailoredTripsLabel = t.has('tailoredTrips') ? t('tailoredTrips') : 'Tailored local routes';

    const handleOpenBooking = (e: React.MouseEvent) => {
        e.preventDefault();
        trackEvent('open_booking_modal', { guide: guide.name });
        setIsModalOpen(true);
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3 }}
                className="group relative overflow-hidden rounded-3xl border border-cyan-500/10 bg-gradient-to-br from-slate-900/95 via-slate-900/92 to-slate-800/95 shadow-xl shadow-slate-950/20"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_28%)] opacity-80" />

                <div className="relative p-6 sm:p-7">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)_240px] xl:items-start">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-start xl:gap-4">
                            <div className="relative mx-auto h-24 w-24 flex-shrink-0 sm:mx-0 sm:h-28 sm:w-28">
                                <div className="absolute -inset-3 rounded-[36px] bg-cyan-400/10 blur-2xl opacity-80" />
                                <div className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-cyan-400/30 via-sky-400/15 to-fuchsia-400/25 blur-md opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                                <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                    {guide.photo && guide.photo !== '/images/guides/default-avatar.svg' ? (
                                        <Image
                                            src={guide.photo}
                                            alt={guide.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(103,232,249,0.35),transparent_35%),linear-gradient(135deg,rgba(56,189,248,0.18),rgba(168,85,247,0.18))]">
                                            <span className="text-3xl font-bold text-cyan-200">{guide.name.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 text-center sm:text-left">
                                {guide.townName && (
                                    <div className="inline-flex items-center rounded-full border border-cyan-400/15 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300">
                                        {guide.townName}
                                    </div>
                                )}
                                <div>
                                    <h3 className="text-2xl font-bold tracking-tight text-white sm:text-[2rem]">
                                        {guide.name}
                                    </h3>
                                    <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                                        {guide.bio}
                                    </p>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300">
                                    <Compass className="h-3.5 w-3.5" />
                                    {tailoredTripsLabel}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/6 bg-white/[0.035] p-5">
                            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                                <Award className="h-3.5 w-3.5 text-cyan-300" />
                                {t('specialties')}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {guide.specialties.map((spec, idx) => (
                                    <span
                                        key={idx}
                                        className="rounded-full border border-cyan-400/12 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-100"
                                    >
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 xl:items-start">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleOpenBooking}
                                className="btn-cta shimmer inline-flex items-center justify-center gap-2 self-start rounded-full px-5 py-3 text-sm font-semibold xl:min-w-[190px]"
                            >
                                <MessageCircle className="h-4 w-4" />
                                {requestBookingLabel}
                            </motion.button>
                        </div>
                    </div>

                    <div className="mt-5 grid gap-4 rounded-[28px] border border-white/6 bg-white/[0.03] px-4 py-4 md:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] md:items-start">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                            <Globe className="h-4 w-4 text-fuchsia-300" />
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {t('languages')}
                            </span>
                            <span className="text-slate-200">{guide.languages.join(', ')}</span>
                        </div>

                        <div className="text-sm leading-6 text-slate-300 md:text-right">
                            <span className="mr-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                {bookingNoteLabel}
                            </span>
                            <span>{bookingNote}</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                guideId={guide.id}
                guideName={guide.name}
                guidePhone={guide.contact}
                guideTown={guide.townName}
                services={buildGuideServiceOptions(guide)}
            />
        </>
    );
};

export default GuideCard;
