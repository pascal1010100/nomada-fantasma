// app/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Map, MessageCircle, Home, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/contacto", label: "Contacto", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const prevFocus = useRef<Element | null>(null);

  // blur/borde al scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // accesibilidad: Esc + bloqueo scroll + foco
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement;
      document.body.style.overflow = "hidden";
      // enfocar el drawer al abrir
      setTimeout(() => drawerRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      if (prevFocus.current instanceof HTMLElement) prevFocus.current.focus();
    }
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled ? "backdrop-blur-xs bg-background/80 border-b border-border" : "bg-background/60"
      }`}
    >
      <nav className="container flex items-center justify-between py-3">
        {/* Marca */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl border border-border bg-card/60">
            👻
          </span>
          <span className="font-semibold">Nómada Fantasma</span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-2">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`pill inline-flex items-center gap-2 ${active ? "neon-border" : ""}`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            );
          })}
          <li className="pl-1">
            <ThemeToggle />
          </li>
        </ul>

        {/* Mobile */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
            className="pill inline-flex items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Overlay + Drawer derecho (50% ancho) */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.button
              key="overlay"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="md:hidden fixed inset-0 bg-black"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              tabIndex={-1}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.22 }}
              className="md:hidden fixed right-0 top-0 h-dvh w-[50vw] max-w-[480px] min-w-[300px] bg-background/95 backdrop-blur-xs border-l border-border shadow-2xl"
            >
              <nav className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span className="font-semibold">Menú</span>
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Cerrar menú"
                    className="pill"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <ul className="p-3 grid gap-2">
                  {LINKS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`card-glass surface-hover flex items-center justify-between p-3 ${active ? "neon-border" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 opacity-90" />
                            <span className="text-sm">{label}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 opacity-70" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-auto p-4 text-xs text-muted-foreground">
                  © {new Date().getFullYear()} Nómada Fantasma
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
