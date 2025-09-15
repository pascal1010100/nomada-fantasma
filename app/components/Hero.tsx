"use client";

import { motion, type MotionProps, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { Compass, MapPin, Anchor, Wifi, Coffee, Home, Map, MessageCircle } from "lucide-react";
import { useId, useMemo, useState } from "react";
import ChatModal from "./ChatModal";

export default function Hero(): JSX.Element {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const reduce = useReducedMotion();

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
        animate: { scale: [1.02, 1, 1.02], x: [-4, 0, -4], y: [0, -2, 0] },
        transition: { duration: 16, repeat: Infinity, ease: "easeInOut" },
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
        <div className="theme--sonar sonar-hud absolute inset-0 z-20" aria-hidden="true" />

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
              {/* glows */}
              <motion.circle r={160} fill={`url(#${ids.glow})`} filter={`url(#${ids.soft})`} {...glow(0.1)} />
              <motion.circle r={235} fill={`url(#${ids.glow})`} filter={`url(#${ids.soft})`} {...glow(1.0)} />
              <motion.circle r={320} fill={`url(#${ids.glow})`} filter={`url(#${ids.soft})`} {...glow(2.1)} />

              {/* anillos */}
              <motion.circle r={160} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.8} {...ring(0.0)} />
              <motion.circle r={235} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.6} {...ring(0.9)} />
              <motion.circle r={320} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.5} {...ring(1.8)} />
              <motion.circle r={410} fill="none" stroke={`url(#${ids.stroke})`} strokeWidth={1.3} {...ring(2.7)} />
            </g>
          </svg>
        </div>

        {/* CONTENIDO */}
        <div className="relative z-40 mx-auto grid max-w-3xl gap-6 px-6 py-16 text-center sm:py-24">
          <motion.h1 className="text-neon-gradient text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl" {...base}>
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
              <Compass className="h-4 w-4" />
              <span>Explorar mapa</span>
            </Link>
            <button 
              onClick={() => setIsChatOpen(true)}
              className="btn-ghost inline-flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Hablar con la IA</span>
            </button>
          </motion.div>

          <motion.ul
            className="mx-auto mt-8 w-full max-w-md space-y-2 text-sm"
            {...base}
            transition={{ ...base.transition, delay: 0.14 }}
          >
            {[
              { 
                icon: <Compass className="h-5 w-5 text-cyan-400" />, 
                text: "Explora destinos únicos" 
              },
              { 
                icon: <MapPin className="h-5 w-5 text-purple-400" />, 
                text: "Descubre rutas secretas" 
              },
              { 
                icon: <Anchor className="h-5 w-5 text-amber-400" />, 
                text: "Navegar sin límites" 
              },
              { 
                icon: <Wifi className="h-5 w-5 text-emerald-400" />, 
                text: "Conexiones confiables" 
              },
              { 
                icon: <Coffee className="h-5 w-5 text-rose-400" />, 
                text: "Lugares con encanto" 
              },
            ].map((item, i) => (
              <motion.li 
                key={i} 
                className="group flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-card/50"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + (i * 0.05) }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card p-1.5 group-hover:scale-110 transition-transform">
                  {item.icon}
                </span>
                <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                  {item.text}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </div>
      
      {/* Chat Modal */}
      <ChatModal 
        open={isChatOpen} 
        onClose={() => setIsChatOpen(false)}
        variant="ghost"
      />
    </section>
  );
}
