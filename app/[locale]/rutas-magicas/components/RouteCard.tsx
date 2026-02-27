'use client';

import { useRef, type MouseEvent, type KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Route } from '../lib/types';
import { motion, useInView } from 'framer-motion';
import { Star, MapPin, Calendar, ArrowRight, Zap, Heart } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { RippleButton } from '@/app/components/ui';
import { useLocale } from 'next-intl';

interface RouteCardProps {
  route: Route;
}

const getRegionFlag = (region: string) => {
  switch (region) {
    case 'europe':
      return '🇪🇺';
    case 'asia':
      return '🌏';
    case 'america':
      return '🌎';
    default:
      return '📍';
  }
};

import type { Variants } from 'framer-motion';

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      staggerChildren: 0.1
    }
  }
};

import { useTranslations } from 'next-intl';

export default function RouteCard({ route }: RouteCardProps) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Routes');
  // Localized data for the specific route
  const td = useTranslations(`Data.routes.${route.slug}`);

  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const title = td('title');
  const summary = td('summary');
  const vibe = route.vibe ? td('vibe') : undefined;

  // We need to handle highlights carefully as it's an array
  // next-intl supports getting arrays if configured, but let's assume we can map keys
  const highlights = route.highlights ? (td.raw('highlights') as string[]) : [];

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    const isAtitlanTown = route.region === 'america' &&
      (route.slug.includes('san-') || route.slug === 'santiago' || route.slug === 'panajachel' || route.slug === 'santa-cruz');

    const path = isAtitlanTown
      ? `/${locale}/rutas-magicas/lago-atitlan/${route.slug}`
      : `/${locale}/rutas-magicas/${route.slug}`;

    router.push(path);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isAtitlanTown = route.region === 'america' &&
        (route.slug.includes('san-') || route.slug === 'santiago' || route.slug === 'panajachel' || route.slug === 'santa-cruz');

      const path = isAtitlanTown
        ? `/${locale}/rutas-magicas/lago-atitlan/${route.slug}`
        : `/${locale}/rutas-magicas/${route.slug}`;

      router.push(path);
    }
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative overflow-hidden rounded-2xl glass-enhanced",
        "h-full flex flex-col cursor-pointer",
        "hover-lift",
        "border border-white/10 dark:border-white/5",
        route.isRecommended && "ring-2 ring-primary/50 shadow-lg shadow-primary/10",
      )}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeIn}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t('viewDetailsOf', { title })}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Image with overlay */}
      <div className="relative h-52 overflow-hidden group">
        <motion.div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-110"
          style={{
            backgroundImage: `url(${route.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </motion.div>

        {/* Top badges */}
        <motion.div
          className="absolute top-4 left-4 right-4 flex justify-between z-10"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {route.slug === 'lago-atitlan' && (
            <motion.div
              className="absolute -top-3 left-1/2 -translate-x-1/2 z-20"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-500/30 animate-pulse-glow">
                🌟 {t('recommended')}
              </span>
            </motion.div>
          )}
          <motion.div
            className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-xs font-medium border border-white/10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getRegionFlag(route.region)} {t(`regions.${route.region}`)}
          </motion.div>

          {/* Conditional Badge */}
          {vibe ? (
            <motion.div
              className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-500/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {vibe}
            </motion.div>
          ) : (
            <motion.div
              className="px-3 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05, rotate: [0, -2, 2, -2, 0] }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              Q{route.price.toLocaleString()}
            </motion.div>
          )}
        </motion.div>

        {/* Rating and Favorite */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <motion.div
            className="flex items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-xs font-medium text-white">
              {route.rating.toFixed(1)}
            </span>
          </motion.div>
          <motion.button
            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t('addToFavorites')}
          >
            <Heart className="h-4 w-4 text-white hover:text-pink-500 hover:fill-pink-500 transition-colors" />
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-2">
            {summary}
          </p>

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <div className="mt-3 space-y-1">
              {highlights.slice(0, 3).map((highlight, i) => (
                <div key={i} className="flex items-start">
                  <Zap className="h-3.5 w-3.5 text-primary mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-xs text-muted-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Meta info */}
        <motion.div
          className="flex items-center text-xs text-muted-foreground space-x-4 mb-4 pt-4 border-t border-border/50"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.2 }
            }
          }}
        >
          {vibe ? (
            // Town Mode Meta
            <>
              <div className="flex items-center">
                <Zap className="w-3.5 h-3.5 mr-1.5 text-accent" />
                <span>{vibe}</span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-1.5">
                  {'⭐'.repeat(route.wifiRating || 3).split('').map((_, i) => (
                    <span key={i} className="text-[10px]">⚡</span>
                  ))}
                </div>
                <span>WiFi</span>
              </div>
            </>
          ) : (
            // Route Mode Meta
            <>
              <div className="flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary" />
                <span>{t(`regions.${route.region}`)}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-primary" />
                <span>{route.durationDays} {route.durationDays === 1 ? t('day') : t('days')}</span>
              </div>
            </>
          )}
        </motion.div>

        {/* Action button */}
        <motion.div
          className="relative mt-auto"
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { delay: 0.3 }
            }
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col">
              {vibe ? (
                <span className="text-xs text-muted-foreground">{t('viewFullGuide')}</span>
              ) : (
                <>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t('from')}</span>
                  <span className="text-lg font-bold text-primary">
                    Q{route.price.toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div onClick={(e) => {
              e.stopPropagation();
              handleClick(e);
            }}>
              <RippleButton
                variant="primary"
                className="!py-2 !px-4 !text-sm !rounded-lg"
              >
                {vibe ? t('discover') : t('explore')} <ArrowRight className="w-4 h-4 ml-1" />
              </RippleButton>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
