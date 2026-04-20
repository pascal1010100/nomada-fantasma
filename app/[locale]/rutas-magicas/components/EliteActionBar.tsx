'use client';

import Link from 'next/link';
import { Map, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

interface EliteActionBarProps {
    title: string;
    slug: string;
}

export default function EliteActionBar({ title, slug }: EliteActionBarProps) {
    const t = useTranslations('Town');
    const locale = useLocale();
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('actionTitle', { name: title })}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('actionSubtitle')}</p>
            </div>

            <div className="flex flex-wrap gap-3 relative z-10 w-full sm:w-auto">
                <Link
                    href={`/${locale}/mapa?town=${slug}`}
                    className="btn-ghost btn-ghost-map group flex-1 sm:flex-none justify-center rounded-full px-6 py-3 text-sm font-semibold"
                >
                    <Map className="w-5 h-5 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
                    <span>{t('actionMap')}</span>
                </Link>
                <button
                    onClick={scrollToExperiences}
                    className="btn-cta shimmer group flex-1 sm:flex-none rounded-full px-8 py-3 text-sm font-semibold transition-all duration-300 hover:scale-[1.02]"
                >
                    <span>{t('actionExperiences')}</span>
                    <Sparkles className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
                </button>
            </div>
        </div>
    );
}
