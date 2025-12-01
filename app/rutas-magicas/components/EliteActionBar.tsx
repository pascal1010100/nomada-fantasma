'use client';

import Link from 'next/link';
import { Map, Sparkles, ArrowRight } from 'lucide-react';

interface EliteActionBarProps {
    title: string;
    slug: string;
}

export default function EliteActionBar({ title, slug }: EliteActionBarProps) {
    const scrollToExperiences = () => {
        const section = document.getElementById('experiencias-section');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-purple-100 dark:border-purple-900/30 flex flex-col sm:flex-row gap-4 items-center justify-between relative overflow-hidden group mb-12">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Explora {title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Descubre los rincones secretos o vive una experiencia local.</p>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                <Link
                    href={`/mapa?town=${slug}`}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-400 text-gray-700 dark:text-gray-200 font-semibold transition-all duration-300 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                >
                    <Map className="w-5 h-5 text-cyan-500" />
                    <span>Ver Mapa</span>
                </Link>
                <button
                    onClick={scrollToExperiences}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <span>Ver Experiencias</span>
                    <Sparkles className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
