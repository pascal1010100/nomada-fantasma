// app/mapa/_HeaderHero.tsx
"use client";

import { motion } from "framer-motion";
import {
  Wifi,
  Bed,
  Coffee,
  CreditCard,
  Anchor,
  Filter,
  Compass,
} from "lucide-react";
import React from "react";

const pills = [
  { icon: Wifi, label: "Wi-Fi" },
  { icon: Bed, label: "Hospedaje" },
  { icon: Coffee, label: "Cowork/Café" },
  { icon: CreditCard, label: "Banco/ATM" },
  { icon: Anchor, label: "Puertos" },
];

export default function HeaderHero() {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.48, ease: "easeOut" }}
      className="
        relative overflow-hidden rounded-2xl border border-border/60
        bg-background/80 backdrop-blur mb-8 md:mb-10
        mt-6 md:mt-8   /* ← separación del navbar */
      "
    >
      {/* === Fondo: cuadrícula + halo neon === */}
      <style>{`
        @keyframes glowPulse { 0%{opacity:.25} 50%{opacity:.55} 100%{opacity:.25} }
      `}</style>

      {/* Grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] dark:opacity-[0.14]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0 1px, transparent 1px 28px)",
        }}
      />

      {/* Halo neon respirando */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(56,189,248,0.16) 0%, transparent 55%)",
          mixBlendMode: "screen",
          animation: "glowPulse 5s ease-in-out infinite",
        }}
      />

      {/* Bruma inferior para legibilidad */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 65%, rgba(0,0,0,0.22) 100%)",
          mixBlendMode: "multiply",
        }}
      />

      <div className="relative z-10 px-6 py-8 md:px-10 md:py-10 text-center">
        {/* Brújula con glow */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="
            mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full
            ring-1 ring-border/60 bg-background/60
          "
          style={{
            boxShadow:
              "0 0 0 1px hsla(189,100%,58%,.30), 0 10px 26px hsla(189,100%,58%,.20)",
          }}
        >
          <Compass className="h-5 w-5 opacity-85" />
        </motion.div>

        {/* Título NEON — compatible con Safari */}
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
          className="text-3xl md:text-5xl font-bold tracking-tight"
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0 0 16px rgba(56,189,248,.35), 0 0 28px rgba(168,85,247,.22)",
          }}
        >
          Carta Fantasma · Mapa Nómada
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="mt-2 text-sm md:text-base text-muted-foreground"
        >
          Un mapa con estética <em>barco fantasma digital</em>: cuadrícula náutica,
          neón y controles modernos.
        </motion.p>

        {/* Línea neon decorativa */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mx-auto mt-4 h-[2px] w-40 origin-left rounded-full
                     bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--accent))] opacity-70"
        />

        {/* Pills con micro-animación y glow */}
        <motion.div
          className="mt-5 flex flex-wrap items-center justify-center gap-2 md:gap-3"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.06, delayChildren: 0.24 } },
          }}
        >
          {pills.map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              variants={{
                hidden: { opacity: 0, y: 6 },
                show: { opacity: 1, y: 0 },
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              title={label}
              aria-label={`Filtrar ${label}`}
              className="pill inline-flex items-center gap-2 bg-card/55 border"
              style={{
                boxShadow:
                  "0 0 0 1px hsla(189,100%,58%,.28), 0 10px 26px hsla(189,100%,58%,.18)",
              }}
            >
              <Icon className="h-4 w-4 md:h-5 md:w-5" />
              {label}
            </motion.button>
          ))}

          <motion.span
            variants={{
              hidden: { opacity: 0, y: 6 },
              show: { opacity: 1, y: 0 },
            }}
            className="ml-2 hidden items-center gap-2 text-xs text-muted-foreground sm:inline-flex"
          >
            <Filter className="h-4 w-4" />
            (Interactividad en el siguiente paso)
          </motion.span>
        </motion.div>
      </div>
    </motion.header>
  );
}
