"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ghost, Ship, X, Send } from "lucide-react";
import { useMemo } from "react";

type ChatModalProps = {
  open: boolean;
  onClose: () => void;
  variant?: "ghost" | "ship";
};

export default function ChatModal({
  open,
  onClose,
  variant = "ghost",
}: ChatModalProps): JSX.Element {
  const reduce = useReducedMotion();
  const Icon = useMemo(() => (variant === "ship" ? Ship : Ghost), [variant]);

  const overlayAnim = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: reduce ? 0 : 0.18 },
  } as const;

  const panelAnim = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: 12, scale: 0.98 },
    transition: { duration: reduce ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] as any },
  } as const;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            className="fixed inset-0 z-[70] bg-black/35 backdrop-blur-[2px]"
            onClick={onClose}
            {...overlayAnim}
          />
          <motion.div
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-label="Chat Nómada IA"
            className="
              fixed z-[75]
              right-5 bottom-24 md:right-6 md:bottom-28
              w-[min(92vw,420px)]
            "
            onClick={(e) => e.stopPropagation()}
            {...panelAnim}
          >
            <div className="card-glass border rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-card/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-sm font-medium">Nómada IA</div>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar chat"
                  onClick={onClose}
                  className="rounded-lg p-1.5 hover:bg-card/70 focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary)/0.35)]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Mensajes (placeholder) */}
              <div className="bg-background/70 px-4 py-3">
                <div className="text-xs text-slate-600 dark:text-slate-300 opacity-80">
                  Bienvenido al puerto. Pronto conectaremos la IA.
                </div>
              </div>

              <div className="px-4 py-3 space-y-2 max-h-[48vh] overflow-auto">
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="opacity-70">💬</span>{" "}
                  ¿En qué ruta te ayudo hoy?
                </div>
              </div>

              {/* Input */}
              <form
                className="flex items-center gap-2 px-3 pb-3 pt-2 bg-card/60 border-t border-border/60"
                onSubmit={(e) => {
                  e.preventDefault();
                  // Aquí conectaremos la IA en la siguiente fase
                }}
              >
                <input
                  type="text"
                  placeholder="Escribe un mensaje…"
                  className="
                    flex-1 rounded-xl border bg-background/70 px-3 py-2 text-sm outline-none
                    focus:ring-2 focus:ring-[hsl(var(--primary)/0.35)]
                  "
                />
                <button
                  type="submit"
                  className="
                    inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm
                    text-[hsl(var(--primary-foreground))] border-0
                    bg-[linear-gradient(180deg,hsl(var(--primary)),hsl(187_92%_44%))]
                    shadow-md hover:opacity-95 active:translate-y-px
                  "
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
