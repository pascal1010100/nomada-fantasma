'use client';

import { useState, useEffect, FormEvent } from 'react';
import { ShuttleRoute } from '@/types/shuttle';
import { X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { trackEvent } from '../../../lib/analytics';

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
    const [showBank, setShowBank] = useState(false);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (shuttle) {
                trackEvent('view_general_booking_form', {
                    route: `${shuttle.origin} -> ${shuttle.destination}`,
                    type: shuttle.type
                });
            }
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (shuttle && (name || email || date || time || pickup)) {
            trackEvent('start_general_booking_form', {
                route: `${shuttle.origin} -> ${shuttle.destination}`,
                type: shuttle.type
            });
        }
    }, [name, email, date, time, pickup, shuttle]);

    const isCustom = shuttle?.id === 'custom-private';

    if (!isOpen || !shuttle) return null;

    

    const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const validateForm = (): string | null => {
        if (!name.trim() || name.trim().length < 2) return t('validationErrors.nameRequired');
        if (!email || !validateEmail(email)) return t('validationErrors.emailInvalid');
        if (!date) return t('validationErrors.dateRequired');
        const selected = new Date(date);
        const boundary = new Date(minDate);
        if (selected < boundary) return t('validationErrors.dateFuture');
        if (!time) return t('validationErrors.timeRequired');
        if (!pickup || pickup.trim().length < 5) return t('validationErrors.pickupRequired');
        if (passengers < 1) return t('validationErrors.passengersMin');
        if (isCustom) {
            if (!customOrigin.trim()) return t('validationErrors.originRequired');
            if (!customDestination.trim()) return t('validationErrors.destinationRequired');
        }
        return null;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const validationError = validateForm();
            if (validationError) {
                setError(validationError);
                trackEvent('general_booking_error', {
                    route: `${shuttle.origin} -> ${shuttle.destination}`,
                    type: shuttle.type,
                    error: validationError
                });
                setIsSubmitting(false);
                return;
            }

            trackEvent('submit_general_booking', {
                route: `${isCustom ? customOrigin : shuttle.origin} -> ${isCustom ? customDestination : shuttle.destination}`,
                passengers,
                type: shuttle.type,
                date,
                time
            });
            // First, save to database
            const reserveResponse = await fetch('/api/shuttles/reserve', {
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

            const reserveData = await reserveResponse.json();

            if (!reserveResponse.ok) throw new Error(reserveData.error || t('errorGeneric'));

            const emailStatus =
                reserveData?.email && typeof reserveData.email.sent === 'boolean'
                    ? String(reserveData.email.sent)
                    : 'unknown';
            console.warn('Shuttle email status:', emailStatus);

            setIsSuccess(true);
            trackEvent('complete_booking', {
                route: `${isCustom ? customOrigin : shuttle.origin} -> ${isCustom ? customDestination : shuttle.destination}`,
                passengers,
                type: shuttle.type
            });
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Unknown error';
            setError(msg);
            trackEvent('general_booking_error', {
                route: `${shuttle.origin} -> ${shuttle.destination}`,
                type: shuttle.type,
                error: msg
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const routeLabel = `${isCustom ? customOrigin : shuttle.origin} -> ${isCustom ? customDestination : shuttle.destination}`;
    const paymentLink =
        shuttle.type === 'shared'
            ? process.env.NEXT_PUBLIC_PAYMENT_LINK_SHARED
            : process.env.NEXT_PUBLIC_PAYMENT_LINK_PRIVATE;
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const whatsappUrl = whatsappNumber
        ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
              `Hola, quiero confirmar shuttle ${routeLabel} para ${date} a las ${time}, ${passengers} pasajeros. Mi correo es ${email}.`
          )}`
        : '';
    const bankName = process.env.NEXT_PUBLIC_BANK_BANK_NAME || '';
    const bankAccountName = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NAME || '';
    const bankAccountNumber = process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || '';
    const bankCurrency = process.env.NEXT_PUBLIC_BANK_CURRENCY || 'GTQ';
    const bankSwift = process.env.NEXT_PUBLIC_BANK_SWIFT || '';
    const bankQrUrl = process.env.NEXT_PUBLIC_BANK_QR_URL || '';
    const hasBankTransfer = Boolean(bankName && bankAccountNumber);

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
                                {paymentLink && (
                                    <a
                                        href={paymentLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-5 rounded-2xl font-bold bg-primary text-white hover:bg-primary/90 transition-all text-lg shadow-xl"
                                    >
                                        Pagar depósito ahora
                                    </a>
                                )}
                                {hasBankTransfer && (
                                    <button
                                        onClick={() => {
                                            setShowBank((v) => !v);
                                        }}
                                        className="w-full py-4 rounded-2xl font-bold bg-white text-black hover:opacity-90 transition-all text-base shadow-xl border border-white/20"
                                    >
                                        {showBank ? 'Ocultar instrucciones de transferencia' : 'Pagar por transferencia bancaria'}
                                    </button>
                                )}
                                {showBank && (
                                    <div className="w-full bg-muted/50 p-6 rounded-2xl border border-border text-left space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black">Banco</p>
                                                <p className="font-bold">{bankName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black">Moneda</p>
                                                <p className="font-bold">{bankCurrency}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black">Titular</p>
                                                <p className="font-bold">{bankAccountName}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black">Cuenta</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold">{bankAccountNumber}</span>
                                                    <button
                                                        onClick={async () => {
                                                            await navigator.clipboard.writeText(bankAccountNumber);
                                                        }}
                                                        className="text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
                                                    >
                                                        Copiar
                                                    </button>
                                                </div>
                                            </div>
                                            {bankSwift && (
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black">SWIFT</p>
                                                    <p className="font-bold">{bankSwift}</p>
                                                </div>
                                            )}
                                        </div>
                                        {bankQrUrl && (
                                            <div className="mt-2">
                                                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 font-black mb-2">QR para pago</p>
                                                <Image
                                                    src={bankQrUrl}
                                                    alt="QR de pago"
                                                    width={800}
                                                    height={800}
                                                    unoptimized
                                                    className="w-full rounded-xl border border-white/10"
                                                />
                                            </div>
                                        )}
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Envía el comprobante a {email} o responde al correo de confirmación para acelerar la validación.
                                        </p>
                                    </div>
                                )}
                                {whatsappUrl && (
                                    <a
                                        href={whatsappUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full py-4 rounded-2xl font-bold bg-white text-black hover:opacity-90 transition-all text-base shadow-xl border border-white/20"
                                    >
                                        Confirmar por WhatsApp
                                    </a>
                                )}
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
                                                min={minDate}
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
