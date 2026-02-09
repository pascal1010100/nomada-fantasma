"use client";

import { useEffect, useMemo, useRef, useState, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Ghost, Ship } from "lucide-react";
import { createPortal } from "react-dom";
import ChatModal from "./ChatModal";
import Tooltip from "./ui/Tooltip";
import { useTranslations } from "next-intl";

type ChatButtonProps = {
  variant?: "ghost" | "ship";
  label?: string;
};

export default function ChatButton({
  variant = "ghost",
  label,
}: ChatButtonProps): JSX.Element | null {
  const t = useTranslations("Chat");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelId = useId();

  useEffect(() => setMounted(true), []);

  // bloquear scroll cuando el modal está abierto
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // cerrar con ESC y devolver foco al botón
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      btnRef.current?.focus();
    };
  }, [open]);

  const Icon = useMemo(() => (variant === "ship" ? Ship : Ghost), [variant]);
  const buttonLabel = label || t("buttonLabel");

  if (!mounted) return null;

  return createPortal(
    <>
      <Tooltip content={t("tooltip")} position="left">
        <motion.button
          ref={btnRef}
          type="button"
          aria-label={buttonLabel}
          aria-controls={panelId}
          aria-expanded={open}
          onClick={() => setOpen(true)}
          className="
            fixed z-[70] h-14 w-14 md:h-16 md:w-16
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
            inset: `auto max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) auto`,
          }}
          whileTap={reduce ? {} : { scale: 0.98 }}
        >
          {/* Pulse effect ring */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={reduce ? {} : {
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Icono con animación de rotación suave */}
          <motion.div
            className="relative z-10"
            animate={reduce ? {} : { rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} />
          </motion.div>
        </motion.button>
      </Tooltip>

      <ChatModal
        open={open}
        onClose={() => setOpen(false)}
        panelId={panelId}
      />
    </>,
    document.body
  );
}
