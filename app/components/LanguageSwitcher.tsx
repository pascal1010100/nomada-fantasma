'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { motion } from 'framer-motion';

/**
 * LanguageSwitcher component that allows users to toggle between Spanish and English.
 * Features a "文" symbol as requested, representing language/translation.
 */
export default function LanguageSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const toggleLanguage = () => {
        const nextLocale = locale === 'es' ? 'en' : 'es';

        startTransition(() => {
            // Robust pathname manipulation for next-intl
            // split('/') for /[locale]/path... results in ['', 'locale', 'path', ...]
            const segments = pathname.split('/');

            // If the first segment is not empty, it might not be a standard /[locale] path
            // but given the middleware config, it should be.
            if (segments[1] === 'en' || segments[1] === 'es') {
                segments[1] = nextLocale;
            } else {
                // Fallback: prepend locale if it's missing (though middleware should handle this)
                segments.splice(1, 0, nextLocale);
            }

            const newPath = segments.join('/') || '/';
            const queryString = searchParams.toString();
            const nextUrl = queryString ? `${newPath}?${queryString}` : newPath;
            router.replace(nextUrl);
        });
    };

    const t = useTranslations('LanguageSwitcher');

    return (
        <button
            onClick={toggleLanguage}
            disabled={isPending}
            className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-primary/50 hover:bg-white/10 transition-all duration-300 active:scale-95 disabled:opacity-50"
            title={t('switch')}
        >
            {/* The "文" symbol - represents language/literature across many cultures */}
            <span
                className={`text-lg font-bold transition-colors ${isPending ? 'text-primary animate-pulse' : 'text-primary/90 group-hover:text-primary'}`}
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
                layoutId="activeLocale"
                className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]"
                initial={false}
                animate={{ scale: isPending ? [1, 1.5, 1] : 1 }}
                transition={{ repeat: isPending ? Infinity : 0, duration: 0.5 }}
            />
        </button>
    );
}
