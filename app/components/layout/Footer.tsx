// app/components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Ghost,
  Map,
  Compass,
  MessageCircle,
  Github,
  Twitter,
  Instagram,
  Mail,
} from "lucide-react";

export default function Footer() {
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    if (!email || !email.includes("@")) {
      setSubmitted("error");
      return;
    }
    setSubmitted("ok");
    e.currentTarget.reset();
  }

  const LINKS_1 = [
    { href: "/", label: "Inicio", icon: Compass },
    { href: "/mapa", label: "Mapa", icon: Map },
    { href: "/contacto", label: "Contacto", icon: MessageCircle },
  ];

  const LINKS_2 = [
    { href: "/privacidad", label: "Privacidad" },
    { href: "/terminos", label: "Términos" },
    { href: "/acerca", label: "Acerca" },
  ];

  return (
    <footer className="mt-16">
      <div className="relative mx-auto w-[min(1200px,96%)] overflow-hidden rounded-3xl card-glass px-6 py-10 sm:px-8 sm:py-12">
        <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-80" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-25"
          style={{ background: "radial-gradient(circle at center, var(--nf-wave-glow-1), transparent 65%)" }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle at center, var(--nf-wave-glow-2), transparent 65%)" }}
        />

        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70">
              <Ghost className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-neon-gradient text-2xl font-semibold tracking-tight">Nómada Fantasma</h3>
              <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                Cartógrafo de lo imposible. Señal, refugio y rutas con estética náutica y guía inteligente.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/chat" className="btn-cta">
                  <MessageCircle className="h-4 w-4" />
                  Hablar con la IA
                </Link>
                <Link href="/mapa" className="btn-ghost">
                  <Map className="h-4 w-4" />
                  Explorar mapa
                </Link>
              </div>
            </div>
          </div>

          <div className="ms:justify-self-end">
            <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card/55 p-3 sm:p-4">
              <label htmlFor="newsletter" className="text-sm font-medium">Recibe rutas y novedades</label>
              <div className="mt-2 flex gap-2">
                <input
                  id="newsletter"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="tu@email.com"
                  className="w-full rounded-xl border border-border bg-card/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--primary)/0.35)]"
                  aria-describedby="newsletter-help"
                />
                <button type="submit" className="btn-primary px-4">Suscribirme</button>
              </div>
              <p id="newsletter-help" className="mt-2 text-xs text-muted-foreground">
                Sin spam. Podrás darte de baja cuando quieras.
              </p>
              <p
                role="status"
                className={`mt-2 text-xs ${
                  submitted === "ok"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : submitted === "error"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-transparent"
                }`}
              >
                {submitted === "ok" ? "¡Listo! Te escribiremos pronto."
                  : submitted === "error" ? "Escribe un correo válido." : "•"}
              </p>
            </form>
          </div>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h4 className="text-sm font-semibold">Navegación</h4>
            <ul className="mt-3 space-y-2">
              {LINKS_1.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="surface-hover inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-card/50">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Proyecto</h4>
            <ul className="mt-3 space-y-2">
              {[
                { href: "/privacidad", label: "Privacidad" },
                { href: "/terminos", label: "Términos" },
                { href: "/acerca", label: "Acerca" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="surface-hover inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-card/50">
                    <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                    <span className="text-sm">{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-sm font-semibold">Síguenos</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="pill surface-hover inline-flex items-center gap-2">
                <Github className="h-4 w-4" /><span className="text-sm">GitHub</span>
              </a>
              <a href="https://twitter.com/" target="_blank" rel="noreferrer" aria-label="Twitter" className="pill surface-hover inline-flex items-center gap-2">
                <Twitter className="h-4 w-4" /><span className="text-sm">Twitter</span>
              </a>
              <a href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="pill surface-hover inline-flex items-center gap-2">
                <Instagram className="h-4 w-4" /><span className="text-sm">Instagram</span>
              </a>
              <a href="mailto:hola@nomadafantasma.io" aria-label="Email" className="pill surface-hover inline-flex items-center gap-2">
                <Mail className="h-4 w-4" /><span className="text-sm">Contacto</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid items-center gap-3 border-t border-border pt-5 sm:grid-cols-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Nómada Fantasma — Hecho con 💙 desde mar abierto.
          </p>
          <div className="flex items-center justify-start gap-3 sm:justify-end">
            <Link href="/privacidad" className="text-xs hover:underline">Política de privacidad</Link>
            <span className="opacity-50">•</span>
            <Link href="/terminos" className="text-xs hover:underline">Términos de uso</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
