"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Map, MessageCircle, Home } from "lucide-react";
import ThemeToggle from "../../components/ui/ThemeToggle";

const LINKS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/mapa", label: "Mapa", icon: Map },
  { href: "/contacto", label: "Contacto", icon: MessageCircle },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all ${
        scrolled
          ? "backdrop-blur-xs bg-background/80 border-b border-border"
          : "bg-background/60"
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
                  className={`pill inline-flex items-center gap-2 hover:opacity-90 ${
                    active ? "bg-muted" : ""
                  }`}
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
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="pill inline-flex items-center justify-center"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        id="mobile-menu"
        className={`md:hidden transition-[max-height] overflow-hidden border-t border-border ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <div className="container py-2">
          <ul className="grid gap-2">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="card-glass flex items-center justify-between p-3 hover:opacity-95"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 opacity-90" />
                    <span className="text-sm">{label}</span>
                  </div>
                  <span className="pill text-xs">Ir</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
