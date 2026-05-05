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
            className="group relative flex shrink-0 items-center gap-2 rounded-xl border border-border bg-card/80 px-3 py-1.5 text-foreground transition-all duration-300 hover:border-primary/50 hover:bg-muted active:scale-95 max-[430px]:gap-0 max-[430px]:px-2 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
            title={t('switch')}
        >
            {/* The "文" symbol - represents language/literature across many cultures */}
            <span
                className="text-lg font-bold transition-colors text-primary/90 group-hover:text-primary"
                aria-hidden="true"
            >
                文
            </span>

            <div className="flex flex-col items-start leading-none max-[430px]:sr-only">
                <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/65">
                    {locale.toUpperCase()}
                </span>
                <span className="text-[8px] font-medium uppercase text-muted-foreground transition-colors group-hover:text-foreground/70">
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
