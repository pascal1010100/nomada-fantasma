"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Ghost, Mail, MessageCircle, Ship } from "lucide-react";
import { createPortal } from "react-dom";
import Tooltip from "./ui/Tooltip";
import { useLocale, useTranslations } from "next-intl";
import { CONTACT_INFO } from "@/app/lib/constants";

type ChatButtonProps = {
  variant?: "ghost" | "ship";
  label?: string;
};

export default function ChatButton({
  variant = "ghost",
  label,
}: ChatButtonProps): JSX.Element | null {
  const t = useTranslations("Chat");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduce = useReducedMotion();
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (btnRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      btnRef.current?.focus();
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const Icon = useMemo(() => (variant === "ship" ? Ship : Ghost), [variant]);
  const buttonLabel = label || t("buttonLabel");
  const whatsappHref = useMemo(() => {
    const message = locale === "en"
      ? "Hi Nomada Fantasma, I need help planning or booking my trip."
      : "Hola Nómada Fantasma, necesito ayuda para planificar o reservar mi viaje.";

    return `${CONTACT_INFO.whatsappLink}?text=${encodeURIComponent(message)}`;
  }, [locale]);

  const emailHref = useMemo(() => {
    const subject = locale === "en"
      ? "Trip planning help"
      : "Ayuda para planificar mi viaje";
    const body = locale === "en"
      ? "Hi Nomada Fantasma,\n\nI need help planning or booking my trip.\n\n"
      : "Hola Nómada Fantasma,\n\nNecesito ayuda para planificar o reservar mi viaje.\n\n";

    return `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [locale]);

  const closeAfterAction = () => {
    setOpen(false);
    btnRef.current?.focus();
  };

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            id="quick-contact-panel"
            role="menu"
            aria-label={t("quickMenuLabel")}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.16 }}
            className="
              fixed right-4 bottom-[5.25rem] z-40 w-[min(92vw,22rem)]
              rounded-2xl border border-border bg-card/95 p-2 shadow-2xl backdrop-blur-xl
              md:right-6 md:bottom-[6rem]
            "
          >
            <div className="px-3 pb-2 pt-2">
              <p className="text-sm font-semibold text-foreground">{t("quickTitle")}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{t("quickDescription")}</p>
            </div>

            <a
              role="menuitem"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAfterAction}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{t("whatsappAction")}</span>
                <span className="block text-xs text-muted-foreground">{t("whatsappHint")}</span>
              </span>
            </a>

            <a
              role="menuitem"
              href={emailHref}
              onClick={closeAfterAction}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sky-600 dark:text-sky-300">
                <Mail className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-foreground">{t("emailAction")}</span>
                <span className="block text-xs text-muted-foreground">{CONTACT_INFO.email}</span>
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Tooltip content={t("tooltip")} position="left">
        <motion.button
          ref={btnRef}
          type="button"
          aria-label={buttonLabel}
          aria-controls="quick-contact-panel"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="
            fixed z-30 h-14 w-14 md:h-16 md:w-16
            rounded-full shadow-xl border-0 relative
            flex items-center justify-center
            text-white
            bg-[linear-gradient(180deg,hsl(var(--chat-btn-top)),hsl(var(--chat-btn-bot)))]
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

    </>,
    document.body
  );
}
