"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Compass, Bus } from "lucide-react";
import { useId, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";

export default function Hero() {
  const reduce = useReducedMotion();
  const t = useTranslations('Hero');
  const locale = useLocale();

  // IDs únicos para gradientes/filtros del SVG
  const uid = useId();
  const ids = useMemo(() => {
    const safe = uid.replace(/[^a-zA-Z0-9_-]/g, "");
    return {
      stroke: `nf-stroke-${safe}`,
      glow: `nf-glow-${safe}`,
      soft: `nf-soft-${safe}`,
    };
  }, [uid]);

  // Fade base
  const base = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  } as const;

  const easeOutBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

  // Ondas (sonar)
  const ring = (delay = 0): MotionProps => ({
    initial: { opacity: 0.42, scale: 0.58 },
    animate: reduce
      ? { opacity: 0.28, scale: 1 }
      : { opacity: [0.42, 0.22, 0], scale: [0.58, 1.18, 1.9] },
    transition: {
      duration: reduce ? 0 : 7.4,
      ease: easeOutBezier,
      repeat: reduce ? 0 : Infinity,
      repeatDelay: 0.8,
      delay,
    },
  });

  const glow = (delay = 0.6): MotionProps => ({
    initial: { opacity: 0.3, scale: 0.52 },
    animate: reduce
      ? { opacity: 0.18, scale: 1 }
      : { opacity: [0.3, 0.16, 0], scale: [0.52, 1.08, 1.85] },
    transition: {
      duration: reduce ? 0 : 7.8,
      ease: easeOutBezier,
      repeat: reduce ? 0 : Infinity,
      repeatDelay: 1.0,
      delay,
    },
  });

  // Cartografía sutil
  const mapAnimProps: MotionProps = reduce
    ? {}
    : {
      animate: { scale: [1.01, 1, 1.01], x: [-2, 0, -2], y: [0, -1, 0] },
      transition: { duration: 22, repeat: Infinity, ease: "easeInOut" },
    };

  // Rosa náutica (rotación lenta)
  const compassAnim: MotionProps = reduce
    ? {}
    : { animate: { rotate: [0, 10, 0] }, transition: { duration: 80, repeat: Infinity, ease: "linear" } };

  return (
    <section className="px-4 sm:px-6">
      <div
        className="
          relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[28px]
          border bg-card/70 hero-halo min-h-[540px]
        "
      >
        {/* GRID y VIÑETA */}
        <div className="nf-grid pointer-events-none absolute inset-0 z-0" />
        <div className="nf-vignette pointer-events-none absolute inset-0 z-10" />

        {/* CARTOGRAFÍA */}
        <motion.div
          className="theme--carto map-surface absolute inset-0 z-[18] will-change-transform"
          aria-hidden="true"
          {...mapAnimProps}
        />

        {/* HUD SONAR */}
        <div className="theme--sonar sonar-hud absolute inset-0 z-20 opacity-70" aria-hidden="true" />

        {/* ➕ Rosa náutica (debajo de las ondas, integrada) */}
        <motion.div
          className="compass-rose rose-tr absolute z-[24] pointer-events-none"
          aria-hidden="true"
          {...compassAnim}
        />

        {/* ONDAS */}
        <div className="theme--sonar pointer-events-none absolute inset-0 z-30" aria-hidden="true">
          <svg className="h-full w-full" viewBox="0 0 1400 700" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id={ids.stroke} cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="var(--nf-wave-stroke-1)" />
                <stop offset="68%" stopColor="var(--nf-wave-stroke-2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <radialGradient id={ids.glow} cx="50%" cy="45%" r="70%">
                <stop offset="0%" stopColor="var(--nf-wave-glow-1)" />
                <stop offset="72%" stopColor="var(--nf-wave-glow-2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <filter id={ids.soft}><feGaussianBlur stdDeviation="7" /></filter>
            </defs>

            <g transform="translate(520 270)">
              {/* glows (reduced for readability) */}
              <motion.circle r={160} fill={`url(#${ids.glow})`} filter={`url(#${ids.soft})`} {...glow(0.1)} />
              <motion.circle r={260} fill={`url(#${ids.glow})`} filter={`url(#${ids.soft})`} {...glow(1.2)} />

              {/* rings (reduced for readability) */}
              <motion.circle r={160} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.8} {...ring(0.0)} />
              <motion.circle r={235} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.6} {...ring(0.9)} />
              <motion.circle r={320} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.4} {...ring(1.8)} />
            </g>
          </svg>
        </div>

        {/* Enhanced Hero Content */}
        <div className="relative z-40 mx-auto w-full max-w-5xl px-6 py-16 text-center sm:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Badge */}
            <motion.div
              className="mb-6 inline-flex items-center rounded-full border border-cyberPurple/30 bg-cyberPurple/10 px-4 py-1.5 text-sm font-medium text-cyberPurple backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-electricBlue opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-electricBlue"></span>
              </span>
              <span className="tracking-wider">{t('badge')}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl md:text-7xl lg:text-8xl"
              {...base}
            >
              <span className="block font-display bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t('title1')}
              </span>
              <span className="mt-2 block bg-gradient-to-r from-[#BC13FE] via-[#8A2BE2] to-[#05D9E8] bg-clip-text text-transparent">
                {t('title2')}
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-gray-600 dark:text-gray-300 sm:text-xl"
              {...base}
              transition={{ ...base.transition, delay: 0.06 }}
            >
              {t('description')}
            </motion.p>



            {/* CTA Buttons */}
            <motion.div
              className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href={`/${locale}/rutas-magicas`}
                className="btn-cta shimmer group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-sm font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 sm:w-auto"
              >
                <Compass className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <span>{t('magicalRoutes')}</span>
                <span className="absolute right-4 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>

              <Link
                href={`/${locale}/shuttles`}
                className="btn-ghost group flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-medium transition-all duration-300 hover:border-primary/50 hover:scale-105 sm:w-auto"
              >
                <Bus className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>{t('shuttles')}</span>
              </Link>
            </motion.div>


          </div>
        </div>
      </div>

    </section>
  );
}
