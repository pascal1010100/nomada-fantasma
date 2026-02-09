'use client';

import { useState, useEffect } from 'react';
import { ShuttleRoute } from '@/types/shuttle';
import { X, Calendar, User, MapPin, Mail, Send, CheckCircle2, Loader2, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ShuttleBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    shuttle: ShuttleRoute | null;
}

export default function ShuttleBookingModal({ isOpen, onClose, shuttle }: ShuttleBookingModalProps) {
    const t = useTranslations('Shuttles.modal');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [passengers, setPassengers] = useState(1);
    const [pickup, setPickup] = useState('');
    const [customOrigin, setCustomOrigin] = useState('');
    const [customDestination, setCustomDestination] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const isCustom = shuttle?.id === 'custom-private';

    if (!isOpen || !shuttle) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch('/api/shuttles/reserve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerName: name,
                    customerEmail: email,
                    routeOrigin: isCustom ? customOrigin : shuttle.origin,
                    routeDestination: isCustom ? customDestination : shuttle.destination,
                    date,
                    time,
                    passengers,
                    pickupLocation: pickup,
                    type: shuttle.type,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || t('errorGeneric'));

            setIsSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        setIsSuccess(false);
        setName('');
        setEmail('');
        setDate('');
        setTime('');
        setPickup('');
        setCustomOrigin('');
        setCustomDestination('');
        setError('');
        onClose();
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 backdrop-blur-md">
                <div className="flex min-h-full items-start justify-center p-4 md:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-card border border-white/10 w-full max-w-lg rounded-[2.5rem] shadow-2xl relative my-auto"
                    >
                        {isSuccess ? (
                            <div className="p-8 md:p-16 text-center space-y-8 flex flex-col items-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', damping: 12 }}
                                    className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center"
                                >
                                    <CheckCircle2 className="w-12 h-12 text-primary" />
                                </motion.div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-black text-foreground">{t('successTitle')}</h3>
                                    <p className="text-muted-foreground text-lg">
                                        {t('successDesc', { origin: shuttle.origin, destination: shuttle.destination })}
                                    </p>
                                    <p className="text-sm bg-muted/50 p-4 rounded-2xl border border-border mt-4">
                                        {t('successSubDesc', { email: email })}
                                    </p>
                                </div>
                                <button
                                    onClick={resetAndClose}
                                    className="w-full py-5 rounded-2xl font-bold bg-foreground text-background hover:opacity-90 transition-all text-lg shadow-xl"
                                >
                                    {t('successBtn')}
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="p-8 pb-4 flex items-center justify-between border-b border-white/5">
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-black tracking-tighter">{isCustom ? t('titlePrivate') : t('title')}</h3>
                                        <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                                            {isCustom ? (
                                                <span className="text-muted-foreground opacity-50">{t('customRoute')}</span>
                                            ) : (
                                                <>
                                                    <span>{shuttle.origin}</span>
                                                    <ArrowRight className="w-3 h-3" />
                                                    <span>{shuttle.destination}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2.5 transition-all text-muted-foreground hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="p-10 md:p-16 pt-8 md:pt-12 space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                {t('nameLabel')}
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John Doe"
                                                className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-sm"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                {t('emailLabel')}
                                            </label>
                                            <input
                                                required
                                                type="email"
                                                placeholder="john@example.com"
                                                className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-sm"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {isCustom && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 pt-10">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                    {t('originLabel')}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Ej: Panajachel"
                                                    className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-sm"
                                                    value={customOrigin}
                                                    onChange={(e) => setCustomOrigin(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                    {t('destinationLabel')}
                                                </label>
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="Ej: El Paredón"
                                                    className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-sm"
                                                    value={customDestination}
                                                    onChange={(e) => setCustomDestination(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                {t('dateLabel')}
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all font-bold text-sm"
                                                value={date}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                    {t('timeLabel')}
                                                </label>
                                                {isCustom ? (
                                                    <input
                                                        required
                                                        type="time"
                                                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all font-bold text-sm"
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                    />
                                                ) : (
                                                    <select
                                                        required
                                                        className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none appearance-none cursor-pointer font-bold text-sm"
                                                        value={time}
                                                        onChange={(e) => setTime(e.target.value)}
                                                    >
                                                        <option value="" className="bg-card">{t('timePlaceholder')}</option>
                                                        {shuttle.schedule.map((t) => (
                                                            <option key={t} value={t} className="bg-card">{t}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                                    {t('passengersLabel')}
                                                </label>
                                                <select
                                                    className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none appearance-none cursor-pointer font-bold text-sm"
                                                    value={passengers}
                                                    onChange={(e) => setPassengers(Number(e.target.value))}
                                                >
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                                        <option key={n} value={n} className="bg-card">{n} Pax</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 pl-1">
                                            {t('pickupLabel')}
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            placeholder={t('pickupPlaceholder')}
                                            className="w-full p-5 rounded-2xl bg-white/[0.03] border border-white/5 focus:border-white/10 outline-none transition-all placeholder:text-muted-foreground/20 font-bold text-sm"
                                            value={pickup}
                                            onChange={(e) => setPickup(e.target.value)}
                                        />
                                    </div>

                                    {error && (
                                        <p className="text-red-500 text-[10px] font-black bg-red-500/5 p-6 rounded-2xl border border-red-500/10 text-center uppercase tracking-[0.3em]">
                                            {error}
                                        </p>
                                    )}

                                    <div className="pt-10">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full py-6 rounded-2xl font-black text-[12px] uppercase tracking-[0.4em] bg-white text-black hover:bg-primary hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-black/40"
                                        >
                                            {isSubmitting ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    {t('submitBtn')}
                                                    <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </motion.button>
                                        <p className="text-center text-[9px] text-muted-foreground/20 mt-8 uppercase tracking-[0.4em] font-black">
                                            {t('footerInfo')}
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                </div>
            </div>
        </AnimatePresence>
    );
}
