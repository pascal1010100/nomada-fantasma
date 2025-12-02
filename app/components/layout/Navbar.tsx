// app/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, Map, MessageCircle, Home, ChevronRight, Ghost, Compass, Info } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle";

type LinkItem = { href: string; label: string; icon: React.ComponentType<any> };

const LINKS: LinkItem[] = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/rutas-magicas", label: "Rutas Mágicas", icon: Compass },
  { href: "/sobre-nosotros", label: "Cómo funciona", icon: Info },
  { href: "/contacto", label: "Contacto", icon: MessageCircle },
];

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function Navbar() {
  const pathname = usePathname() || "/";
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const prevFocus = useRef<Element | null>(null);
  const rafId = useRef<number | null>(null);

  // Detectar si estamos en una página con Hero (Home, Rutas, Pueblos)
  const hasHero = pathname === "/" || pathname.includes("/rutas-magicas");

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setScrolled(window.scrollY > 10);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onScroll = () => {
      if (rafId.current) return;
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null;
        setScrolled(window.scrollY > 10);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("scroll", onScroll);
    };
  }, [mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) {
      prevFocus.current = document.activeElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => { drawerRef.current?.focus(); trapFocusInit(); }, 0);
    } else {
      document.body.style.overflow = "";
      if (prevFocus.current instanceof HTMLElement) prevFocus.current.focus();
    }
  }, [open]);

  const trapFocusInit = () => {
    const drawer = drawerRef.current;
    if (!drawer) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = Array.from(
        drawer.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden"));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); }
    };
    drawer.addEventListener("keydown", onKeyDown);
    const cleanup = () => drawer.removeEventListener("keydown", onKeyDown);
    const obs = new MutationObserver(() => { if (!document.body.contains(drawer)) cleanup(); });
    obs.observe(document.body, { childList: true, subtree: true });
  };

  return (
    <header className="sticky top-0 z-[90] w-full">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-lg focus:bg-white/90 focus:px-3 focus:py-2 focus:text-slate-900 dark:focus:bg-slate-900/90 dark:focus:text-white"
      >
        Saltar al contenido
      </a>

      <div
        suppressHydrationWarning
        className={`fixed left-0 right-0 top-0 z-[90] transition-all duration-300 ${scrolled || !hasHero
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent border-transparent"
          }`}
      >
        <nav aria-label="Principal" className="flex items-center justify-between px-6 py-4">
          <Link href="/" className="group inline-flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card/70">
              <Ghost className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Nómada Fantasma</span>
          </Link>

          <ul className="hidden items-center gap-2 md:flex">
            {LINKS.map(({ href, label, icon: Icon }) => {
              const active = isActive(href);
              return (
                <li key={href} className="relative">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`pill surface-hover relative inline-flex items-center gap-2 ${active ? "neon-border bg-card/60" : ""
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                  </Link>
                </li>
              );
            })}
            <li className="pl-1"><ThemeToggle /></li>
          </ul>

          <div className="flex items-center gap-2 md:hidden">
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
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="overlay"
              aria-label="Cerrar menú"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: prefersReduced ? 0 : 0.18 }}
              className="md:hidden fixed inset-0 z-40 bg-black/50"
            />
            <motion.div
              key="drawer"
              ref={drawerRef}
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
              tabIndex={-1}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: prefersReduced ? 0 : 0.22 }}
              className="md:hidden fixed right-0 top-0 z-50 h-dvh w-[80vw] max-w-[420px] min-w-[280px] glass-enhanced border-l border-border shadow-2xl"
            >
              <nav className="flex h-full flex-col">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <span id="mobile-menu-title" className="font-semibold">Menú</span>
                  <button onClick={() => setOpen(false)} aria-label="Cerrar menú" className="pill">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <ul className="grid gap-2 p-3">
                  {LINKS.map(({ href, label, icon: Icon }) => {
                    const active = isActive(href);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className={`glass-enhanced flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${active ? "border-primary/50 bg-primary/5" : "hover:border-primary/30"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${active ? 'text-primary' : 'opacity-70'}`} />
                            <span className={`text-sm font-medium ${active ? 'text-primary' : ''}`}>{label}</span>
                          </div>
                          <ChevronRight className={`h-4 w-4 transition-transform ${active ? 'text-primary translate-x-1' : 'opacity-50'}`} />
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
