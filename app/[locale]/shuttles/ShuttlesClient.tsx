'use client';

import { useState, useEffect } from 'react';
import { ShuttleRoute } from '@/types/shuttle';
import { supabase } from '@/app/lib/supabase/client';
import ShuttleCard from './components/ShuttleCard';
import ShuttleBookingModal from './components/ShuttleBookingModal';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ShuttlesClient() {
    const t = useTranslations('Shuttles');
    const [shuttleList, setShuttleList] = useState<ShuttleRoute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrigin, setSelectedOrigin] = useState('');
    const [selectedDestination, setSelectedDestination] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedShuttle, setSelectedShuttle] = useState<ShuttleRoute | null>(null);

    useEffect(() => {
        async function fetchRoutes() {
            try {
                const { data, error } = await supabase
                    .from('shuttle_routes')
                    .select('*')
                    .eq('origin', 'San Pedro La Laguna')
                    .order('origin', { ascending: true });

                if (error) {
                    const message = (() => {
                        if (typeof error === 'string') return error;
                        if (error && typeof error === 'object' && 'message' in error) {
                            const m = (error as { message?: unknown }).message;
                            return typeof m === 'string' ? m : 'Supabase fetch error';
                        }
                        return 'Supabase fetch error';
                    })();
                    throw new Error(message);
                }
                if (!data || data.length === 0) throw new Error('No data found');
                setShuttleList(data as ShuttleRoute[]);
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                if (process.env.NODE_ENV === 'development') {
                    console.warn('Error fetching shuttles, using mocks:', msg);
                }
                // Fallback to mock data if DB is inaccessible
                const { shuttles } = await import('./mocks/shuttles');
                setShuttleList(shuttles.filter((shuttle) => shuttle.origin === 'San Pedro La Laguna'));
            } finally {
                setLoading(false);
            }
        }
        fetchRoutes();
    }, []);

    // Get unique origins and destinations for filters
    const origins = Array.from(new Set(shuttleList.map(s => s.origin)));
    const destinations = Array.from(new Set(shuttleList.map(s => s.destination)));

    const filteredShuttles = shuttleList.filter(shuttle => {
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

    return (
        <div className="min-h-screen bg-background pb-32">
            {/* Hero Section */}
            <div className="relative h-[65vh] flex items-center justify-center border-b border-white/5">
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-background z-10" />
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <div className="absolute inset-0 opacity-70"
                         style={{
                             backgroundImage: 'radial-gradient(1200px 600px at 50% 20%, hsla(187, 92%, 44%, 0.15), transparent 60%)'
                         }}
                    />
                    <div
                        className="absolute inset-0 opacity-15"
                        style={{
                            backgroundImage:
                                'repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px), ' +
                                'repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 40px)'
                        }}
                    />
                    <svg
                        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] opacity-[0.05] text-primary"
                        viewBox="0 0 256 256"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M128 16c-39.2 0-72 30.6-72 68.4v66.7c0 8.3 8.7 13.6 16.2 10.2l11.6-5.3a8 8 0 0 1 10.6 4.1l5.9 13.6a8 8 0 0 0 12.7 3l12.7-10.7a8 8 0 0 1 10 0l12.7 10.7a8 8 0 0 0 12.7-3l5.9-13.6a8 8 0 0 1 10.6-4.1l11.6 5.3c7.5 3.4 16.2-2 16.2-10.2V84.4C200 46.6 167.2 16 128 16Zm-34 64a14 14 0 1 1 28 0 14 14 0 1 1-28 0Zm68 0a14 14 0 1 1 28 0 14 14 0 1 1-28 0Z"
                            fill="currentColor"
                        />
                    </svg>
                </div>

                <div className="relative z-20 text-center px-4 max-w-4xl mx-auto space-y-6 py-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4"
                    >
                        {t('badge')}
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1.1] pb-2"
                        style={{ textShadow: '0 2px 8px rgba(0,0,0,0.35)' }}
                    >
                        {t('title')} <br />
                        <span className="text-white/90">{t('subtitle')}</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-lg text-gray-200 font-medium max-w-2xl mx-auto leading-relaxed"
                        style={{ textShadow: '0 1px 6px rgba(0,0,0,0.25)' }}
                    >
                        {t('description')}
                    </motion.p>
                </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-6xl mx-auto px-4 mt-12 relative z-30">
                <div className="bg-card border border-white/10 p-3 rounded-2xl shadow-3xl shadow-black/20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <select
                            className="w-full px-8 py-6 rounded-xl bg-white/5 border border-transparent focus:border-white/10 outline-none appearance-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
                            value={selectedOrigin}
                            onChange={(e) => setSelectedOrigin(e.target.value)}
                        >
                            <option value="" className="bg-card">{t('originPlaceholder')}</option>
                            {origins.map(o => <option key={o} value={o} className="bg-card">{o}</option>)}
                        </select>

                        <select
                            className="w-full px-8 py-6 rounded-xl bg-white/5 border border-transparent focus:border-white/10 outline-none appearance-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
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
                                className="w-full px-8 py-6 rounded-xl bg-white/5 border border-transparent focus:border-white/10 outline-none transition-all font-black text-[10px] uppercase tracking-widest"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/20" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Routes Grid */}
            <div className="max-w-6xl mx-auto px-4 mt-48">
                <div className="flex items-end justify-between mb-20 border-b border-white/5 pb-12">
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

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-48 space-y-4">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-muted-foreground font-medium animate-pulse uppercase tracking-[0.3em] text-[10px]">Establishing Ghost Link...</p>
                    </div>
                ) : filteredShuttles.length > 0 ? (
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

            {/* Private Section (Concierge Style) */}
            <div className="max-w-6xl mx-auto px-4 mt-32 md:mt-48 mb-32">
                <div className="bg-card border border-white/5 rounded-[3rem] p-12 md:p-24 text-center space-y-10 relative group hover:border-primary/20 transition-all duration-700 shadow-3xl shadow-black/40">
                    <div className="relative z-10 space-y-6">
                        <div className="flex flex-col items-center space-y-4 mb-4">
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/60 border-b border-primary/20 pb-2">
                                {t('conciergeService') || 'Concierge Service'}
                            </span>
                        </div>
                        <h3 className="text-4xl md:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-[1.1] text-white">
                            {t('privateTransferTitle')}
                        </h3>
                        <p className="text-lg text-muted-foreground/50 max-w-2xl mx-auto font-medium leading-relaxed pt-2">
                            {t('privateTransferDesc')}
                        </p>
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
                                className="px-12 py-5.5 rounded-2xl bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-primary hover:text-white transition-all duration-500 shadow-2xl shadow-black/50"
                            >
                                {t('privateTransferBtn')}
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
