// components/contact/ContactoClient.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Ghost,
  Map,
  MessageCircle,
  Github,
  Twitter,
  Instagram,
  Mail,
  Compass,
} from "lucide-react";

// Newsletter (extraída del footer, mejorada)
function NewsletterSubscribe() {
  const [submitted, setSubmitted] = useState<null | "ok" | "error">(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    if (!email || !email.includes("@")) {
      setSubmitted("error");
      return;
    }
    setSubmitted("ok");
    e.currentTarget.reset();
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
      className="relative overflow-hidden rounded-3xl fade-border bg-background/60 p-6 md:p-8"
    >
      {/* glow sutil de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-32 opacity-20 dark:opacity-25"
        style={{
          background:
            "radial-gradient(800px 400px at 45% 35%, hsl(var(--primary) / .18), transparent 60%)",
        }}
      />
      <div className="relative z-10">
        <h2 className="text-lg font-semibold">Recibe rutas y novedades</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Sin spam. Podrás darte de baja cuando quieras.
        </p>

        <form onSubmit={onSubmit} className="mt-3 flex gap-2">
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
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="btn-primary px-4"
          >
            Suscribirme
          </motion.button>
        </form>

        <p id="newsletter-help" className="mt-2 text-xs text-muted-foreground">
          Te enviaremos novedades muy de vez en cuando.
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
          {submitted === "ok"
            ? "¡Listo! Te escribiremos pronto."
            : submitted === "error"
            ? "Escribe un correo válido."
            : "•"}
        </p>
      </div>
    </motion.section>
  );
}

export default function ContactoClient() {
  return (
    <section className="container py-12 md:py-16">
      {/* Header */}
      <header className="mb-8 text-center">
        <motion.div
          className="inline-flex items-center gap-2 pill"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <Compass className="h-4 w-4" />
          <span>Sección</span> · <strong>Contacto</strong>
        </motion.div>

        <motion.h1
          className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-neon-gradient"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
        >
          Hablemos
        </motion.h1>

        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
        >
          Aquí tienes todo: suscripción, enlaces rápidos, navegación y redes.
        </motion.p>
      </header>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Marca + CTAs (antes estaba en el footer) */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl card-glass p-6 md:p-8"
        >
          <div aria-hidden className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent opacity-80" />
          <div
            aria-hidden
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-25"
            style={{
              background:
                "radial-gradient(circle at center, var(--nf-wave-glow-1), transparent 65%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-20"
            style={{
              background:
                "radial-gradient(circle at center, var(--nf-wave-glow-2), transparent 65%)",
            }}
          />

          <div className="relative z-10 flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card/70">
              <Ghost className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neon-gradient">
                Nómada Fantasma
              </h2>
              <p className="mt-1 max-w-prose text-sm text-muted-foreground">
                Cartógrafo de lo imposible. Señal, refugio y rutas con estética
                náutica y guía inteligente.
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
        </motion.section>

        {/* Newsletter (movida desde footer) */}
        <NewsletterSubscribe />
      </div>

      {/* Navegación / Proyecto / Redes (todo lo que estaba abajo en el footer) */}
      <motion.div
        className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <section className="rounded-2xl border border-border bg-card/55 p-4">
          <h3 className="text-sm font-semibold">Navegación</h3>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/", label: "Inicio", icon: Compass },
              { href: "/mapa", label: "Mapa", icon: Map },
              { href: "/contacto", label: "Contacto", icon: MessageCircle },
            ].map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="surface-hover inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-card/50"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card/55 p-4">
          <h3 className="text-sm font-semibold">Proyecto</h3>
          <ul className="mt-3 space-y-2">
            {[
              { href: "/privacidad", label: "Privacidad" },
              { href: "/terminos", label: "Términos" },
              { href: "/acerca", label: "Acerca" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="surface-hover inline-flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-card/50"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--primary))]" />
                  <span className="text-sm">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card/55 p-4">
          <h3 className="text-sm font-semibold">Síguenos</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://github.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="pill surface-hover inline-flex items-center gap-2"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="pill surface-hover inline-flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              <span className="text-sm">Twitter</span>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="pill surface-hover inline-flex items-center gap-2"
            >
              <Instagram className="h-4 w-4" />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="mailto:hola@nomadafantasma.io"
              aria-label="Email"
              className="pill surface-hover inline-flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">Contacto</span>
            </a>
          </div>
        </section>
      </motion.div>

      {/* Barra inferior (opcional, mantiene coherencia) */}
      <motion.div
        className="mt-8 grid items-center gap-3 border-t border-border pt-5 sm:grid-cols-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Nómada Fantasma — Hecho con 💙 desde mar abierto.
        </p>
        <div className="flex items-center justify-start gap-3 sm:justify-end">
          <Link href="/privacidad" className="text-xs hover:underline">
            Política de privacidad
          </Link>
          <span className="opacity-50">•</span>
          <Link href="/terminos" className="text-xs hover:underline">
            Términos de uso
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
