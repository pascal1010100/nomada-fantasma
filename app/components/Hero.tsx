"use client";

import {
  motion,
  type MotionProps,
  useReducedMotion,
} from "framer-motion";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export default function Hero(): JSX.Element {
  const reduce = useReducedMotion();

  // Fade base para el contenido
  const base = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  } as const;

  // Easing seguro para TS (equiv. a easeOut, pero con bezier)
  const easeOutBezier: [number, number, number, number] = [0.16, 1, 0.3, 1];

  /** Ondas sonar — mismas curvas, tipadas como MotionProps */
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

  /** Animación sutil del mapa (cartografía) */
  const mapAnimProps: MotionProps = reduce
    ? {}
    : {
        animate: { scale: [1.02, 1, 1.02], x: [-4, 0, -4], y: [0, -2, 0] },
        transition: { duration: 16, repeat: Infinity, ease: "easeInOut" },
      };

  return (
    <section className="px-4 sm:px-6">
      <div
        className="
          relative mx-auto mt-10 max-w-6xl overflow-hidden rounded-[28px]
          border bg-card/70 hero-halo min-h-[540px]
        "
      >
        {/* GRID y VIÑETA (base) */}
        <div className="nf-grid pointer-events-none absolute inset-0 z-0" />
        <div className="nf-vignette pointer-events-none absolute inset-0 z-10" />

        {/* CARTOGRAFÍA (light + visible en dark) — debajo del HUD */}
        <motion.div
          className="theme--carto map-surface absolute inset-0 z-[18] will-change-transform"
          aria-hidden="true"
          {...mapAnimProps}
        />

        {/* HUD SONAR (dark) */}
        <div className="theme--sonar sonar-hud absolute inset-0 z-20" aria-hidden="true" />

        {/* ONDAS — visibles en ambos temas */}
        <div className="theme--sonar pointer-events-none absolute inset-0 z-30" aria-hidden="true">
          <svg
            className="h-full w-full"
            viewBox="0 0 1400 700"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="nf-stroke" cx="50%" cy="45%" r="65%">
                <stop offset="0%" stopColor="var(--nf-wave-stroke-1)" />
                <stop offset="68%" stopColor="var(--nf-wave-stroke-2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <radialGradient id="nf-glow" cx="50%" cy="45%" r="70%">
                <stop offset="0%" stopColor="var(--nf-wave-glow-1)" />
                <stop offset="72%" stopColor="var(--nf-wave-glow-2)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <filter id="nf-soft">
                <feGaussianBlur stdDeviation="7" />
              </filter>
            </defs>

            {/* Emisor levemente a la izquierda para dramatismo */}
            <g transform="translate(520 270)">
              {/* glows grandes */}
              <motion.circle r={160} fill="url(#nf-glow)" filter="url(#nf-soft)" {...glow(0.1)} />
              <motion.circle r={235} fill="url(#nf-glow)" filter="url(#nf-soft)" {...glow(1.0)} />
              <motion.circle r={320} fill="url(#nf-glow)" filter="url(#nf-soft)" {...glow(2.1)} />

              {/* anillos (más y más lejos) */}
              <motion.circle r={160} fill="none" stroke="url(#nf-stroke)" strokeWidth={1.8} {...ring(0.0)} />
              <motion.circle r={235} fill="none" stroke="url(#nf-stroke)" strokeWidth={1.6} {...ring(0.9)} />
              <motion.circle r={320} fill="none" stroke="url(#nf-stroke)" strokeWidth={1.5} {...ring(1.8)} />
              <motion.circle r={410} fill="none" stroke="url(#nf-stroke)" strokeWidth={1.3} {...ring(2.7)} />
            </g>
          </svg>
        </div>

        {/* CONTENIDO */}
        <div className="relative z-40 mx-auto grid max-w-3xl gap-6 px-6 py-16 text-center sm:py-24">
          <motion.h1
            className="text-neon-gradient text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl"
            {...base}
          >
            Nómada Fantasma
          </motion.h1>

          <motion.p
            className="mx-auto max-w-xl text-pretty text-sm text-slate-700 dark:text-slate-300 sm:text-base"
            {...base}
            transition={{ ...base.transition, delay: 0.06 }}
          >
            Cartógrafo de lo imposible
          </motion.p>

          <motion.div
            className="mx-auto mt-2 flex flex-wrap items-center justify-center gap-3"
            {...base}
            transition={{ ...base.transition, delay: 0.1 }}
          >
            <Link href="/mapa" className="btn-cta">
              🧭 Explorar mapa
            </Link>
            <Link href="/chat" className="btn-ghost">
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Hablar con la IA
              </span>
            </Link>
          </motion.div>

          <motion.ul
            className="mx-auto mt-6 w-full max-w-md space-y-2 text-sm text-slate-600 dark:text-slate-300"
            {...base}
            transition={{ ...base.transition, delay: 0.14 }}
          >
            {[
              { icon: "🕯️", text: "Explora destinos únicos" },
              { icon: "🗺️", text: "Descubre rutas secretas" },
              { icon: "⚓", text: "Navegar sin límites" },
            ].map((item, i) => (
              <li key={i} className="grid grid-cols-[1.25rem_1fr] items-center gap-2 opacity-95">
                <span className="text-base leading-none">{item.icon}</span>
                <span className="leading-6">{item.text}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
