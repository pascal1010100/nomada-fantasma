'use client';

import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

/**
 * LanguageSwitcher component that allows users to toggle between Spanish and English.
 * Features a "文" symbol as requested, representing language/translation.
 */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations('LanguageSwitcher');

    const nextLocale = locale === 'es' ? 'en' : 'es';

    // pathname from next/navigation includes locale, so remove it
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';
    const queryString = searchParams.toString();
    const href = `/${nextLocale}${pathWithoutLocale}${queryString ? `?${queryString}` : ''}`;

    return (
        <Link
            href={href}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 active:scale-95"
            title={t('switch')}
        >
            {/* The "文" symbol - represents language/literature across many cultures */}
            <span
                className="text-lg font-bold transition-colors text-primary/90 group-hover:text-primary"
                aria-hidden="true"
            >
                文
            </span>

            <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">
                    {locale.toUpperCase()}
                </span>
                <span className="text-[8px] uppercase font-medium opacity-30 group-hover:opacity-60 transition-opacity">
                    {t('other')}
                </span>
            </div>

            {/* Subtle indicator dot */}
            <motion.div
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"
                initial={false}
                animate={{ scale: 1 }}
            />
        </Link>
    );
}
