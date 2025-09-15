"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ghost, Ship } from "lucide-react";
import { createPortal } from "react-dom";
import ChatModal from "./ChatModal";

type ChatBottonProps = {
  variant?: "ghost" | "ship";
  label?: string;
};

export default function ChatBotton({
  variant = "ghost",
  label = "Hablar con la IA",
}: ChatBottonProps): JSX.Element | null {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);

  // bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // cerrar con ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const Icon = useMemo(() => (variant === "ship" ? Ship : Ghost), [variant]);

  if (!mounted) return null;

  // ► Portal al <body> para que SIEMPRE quede fijo al viewport (aunque el ancestro tenga transform/overflow)
  return createPortal(
    <>
      {/* FAB — fijo, abajo-derecha, sigue al viewport */}
      <motion.button
        type="button"
        aria-label={label}
        onClick={() => setOpen(true)}
        className="
          fixed right-6 bottom-6 z-50
          h-14 w-14 md:h-16 md:w-16
          rounded-full shadow-xl border-0 relative
          flex items-center justify-center
          text-[hsl(var(--primary-foreground))]
          bg-[linear-gradient(180deg,hsl(var(--primary)),hsl(187_92%_44%))]
          outline-none transition-transform hover:scale-[1.03] active:scale-[0.98]
          focus-visible:ring-4 focus-visible:ring-[hsl(var(--primary)/0.35)]
          glow-aqua
        "
        style={{
          position: "fixed",
          // inset: top | right | bottom | left  → forzamos derecha/abajo y cancelamos cualquier left/top heredado
          inset: `auto max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) auto`,
        }}
        whileTap={reduce ? {} : { scale: 0.98 }}
      >
        {/* Neón sutil */}
        {!reduce && (
          <>
            <motion.span
              className="absolute inset-0 rounded-full blur-md pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, hsl(var(--primary)/.50) 0%, hsl(var(--accent)/.30) 45%, transparent 70%)",
              }}
              animate={{ opacity: [0.35, 0.7, 0.35], scale: [0.96, 1.05, 0.96] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              className="absolute -inset-[2px] rounded-full blur-[2px] pointer-events-none"
              style={{
                background:
                  "conic-gradient(from 0deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 25%, transparent 35%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 6px))",
                maskImage:
                  "radial-gradient(farthest-side, transparent calc(100% - 6px), black calc(100% - 6px))",
                opacity: 0.5,
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}

        {/* Icono centrado */}
        <Icon className="relative z-10 h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />

        {/* Borde interno sutil */}
        <span className="absolute inset-0 rounded-full ring-1 ring-black/5 dark:ring-white/10 pointer-events-none" />
      </motion.button>

      {/* Modal separado */}
      <ChatModal open={open} onClose={() => setOpen(false)} variant={variant} />
    </>,
    document.body
  );
}
