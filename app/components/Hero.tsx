// app/components/hero.tsx
"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import CTA from "./ui/CTA";
import { Compass } from "lucide-react";
import { useCallback } from "react";

const listVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08, delayChildren: 0.06 } },
};
const item = { hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } };

export default function Hero() {
  // Parallax highlight
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 20 });
  const sy = useSpring(my, { stiffness: 120, damping: 20 });
  const tx = useTransform(sx, (v) => `${v}px`);
  const ty = useTransform(sy, (v) => `${v}px`);

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left - r.width / 2) / r.width;
    const py = (e.clientY - r.top - r.height / 2) / r.height;
    mx.set(px * 14);
    my.set(py * 12);
  }, [mx, my]);
  const handleLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);

  return (
    <section className="container py-24">
      <div
        className="relative map-surface hero-halo rounded-3xl fade-border px-6 py-14 sm:py-20 text-center overflow-hidden"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {/* Coordenadas + ping */}
        <div className="absolute left-4 top-4 pill hidden sm:inline-flex items-center gap-2 z-10">
          <div className="relative">
            <Compass className="h-4 w-4 opacity-90" />
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / .35), transparent 80%)" }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs opacity-80">N 19.43° · W 99.13°</span>
        </div>

        {/* Highlight parallax */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-32 z-[1] opacity-25 dark:opacity-30"
          style={{
            translateX: tx,
            translateY: ty,
            background: "radial-gradient(600px 300px at 50% 30%, hsl(var(--primary) / .25), transparent 60%)",
          }}
        />

        {/* Contenido */}
        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="text-5xl sm:text-6xl font-bold tracking-tight text-neon-gradient"
          >
            Nómada Fantasma
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: 0.1, ease: "easeOut" }}
            className="mt-4 text-lg text-muted-foreground"
          >
            Cartógrafo de lo imposible
          </motion.p>

          <CTA />

          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="mt-12 space-y-3 text-muted-foreground"
          >
            <motion.li variants={item}>🪐 Explora destinos únicos</motion.li>
            <motion.li variants={item}>🕯️ Descubre rutas secretas</motion.li>
            <motion.li variants={item}>⚓ Navegar sin límites</motion.li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
