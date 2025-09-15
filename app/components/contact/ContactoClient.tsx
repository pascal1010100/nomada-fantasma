// components/contact/ContactoClient.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  MessageCircle,
  Mail,
  Phone as PhoneIcon,
  Clock as ClockIcon,
  Globe as GlobeIcon,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Navigation,
  Map as MapIcon,
  Github,
  Twitter,
  Instagram,
} from "lucide-react";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ContactCard = ({ 
  icon: Icon, 
  title, 
  description, 
  action, 
  className = "" 
}: { 
  icon: React.ComponentType<{ className?: string }>,
  title: string,
  description: string,
  action: React.ReactNode,
  className?: string 
}) => (
  <motion.div 
    variants={item}
    className={`group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 transition-all hover:bg-card/70 hover:shadow-md ${className}`}
  >
    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    <div className="relative z-10">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="mb-4 text-sm text-muted-foreground">{description}</p>
      <div className="mt-auto">
        {action}
      </div>
    </div>
  </motion.div>
);

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
  const [formStatus, setFormStatus] = useState<null | 'sending' | 'success' | 'error'>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('sending');
    // Simulate form submission
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <section className="container py-12 md:py-16">
      {/* Hero Section */}
      <motion.header 
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Contacto</span>
        </motion.div>

        <motion.h1
          className="mt-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          Conecta con Nuestro Equipo
        </motion.h1>

        <motion.p
          className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          ¿Tienes preguntas, sugerencias o necesitas asistencia? Estamos aquí para ayudarte en tu viaje nómada digital.
        </motion.p>
      </motion.header>

      {/* Contact Methods Grid */}
      <motion.div 
        className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ContactCard
          icon={MessageCircle}
          title="Chatea con Nosotros"
          description="Obtén respuestas rápidas de nuestro equipo de soporte en tiempo real."
          action={
            <Link href="/chat" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              Abrir chat <Send className="ml-1 h-4 w-4" />
            </Link>
          }
          className="hover:border-primary/30"
        />

        <ContactCard
          icon={Mail}
          title="Correo Electrónico"
          description="Escríbenos a nuestro equipo y te responderemos en menos de 24 horas."
          action={
            <a 
              href="mailto:hola@nomadafantasma.com" 
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              hola@nomadafantasma.com <Mail className="ml-1 h-4 w-4" />
            </a>
          }
          className="hover:border-amber-500/30"
        />

        <ContactCard
          icon={MapIcon}
          title="Visítanos"
          description="¿Eres nómada digital? Conoce nuestros espacios de trabajo recomendados."
          action={
            <Link 
              href="/mapa" 
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Ver en el mapa <Navigation className="ml-1 h-4 w-4" />
            </Link>
          }
          className="hover:border-emerald-500/30"
        />
      </motion.div>

      {/* Contact Form Section */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card/50 p-8 shadow-sm">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight">Envíanos un Mensaje</h2>
            <p className="mt-2 text-muted-foreground">
              Completa el formulario y nos pondremos en contacto contigo lo antes posible.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium">
                  Nombre Completo
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="block w-full rounded-lg border border-border bg-background/50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="Tu nombre"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="block w-full rounded-lg border border-border bg-background/50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium">
                Tu Mensaje
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute left-0 top-0 flex p-3">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                </div>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="block w-full rounded-lg border border-border bg-background/50 py-3 pl-10 pr-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="¿En qué podemos ayudarte?"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {formStatus === 'success' ? (
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    ¡Mensaje enviado con éxito!
                  </div>
                ) : formStatus === 'error' ? (
                  <div className="flex items-center text-rose-600 dark:text-rose-400">
                    <AlertCircle className="mr-2 h-5 w-5" />
                    Hubo un error al enviar el mensaje
                  </div>
                ) : null}
              </div>
              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? (
                  <>
                    <svg className="-ml-1 mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-4 w-4" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div 
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <NewsletterSubscribe />
      </motion.div>

      {/* Contact Info */}
      <motion.div 
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <ContactCard
          icon={PhoneIcon}
          title="Llámanos"
          description="Disponibles de lunes a viernes de 9:00 a 18:00 (GMT-6)"
          action={
            <a 
              href="tel:+50212345678" 
              className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              +502 1234 5678
            </a>
          }
          className="hover:border-blue-500/30"
        />

        <ContactCard
          icon={ClockIcon}
          title="Horario de Atención"
          description="Lunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00"
          action={
            <span className="text-sm text-muted-foreground">
              GMT-6 (Guatemala)
            </span>
          }
          className="hover:border-purple-500/30"
        />

        <ContactCard
          icon={GlobeIcon}
          title="Redes Sociales"
          description="Síguenos para estar al día con las últimas actualizaciones"
          action={
            <div className="mt-2 flex gap-3">
              <a href="https://twitter.com/nomadafantasma" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-twitter transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com/nomadafantasma" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-instagram transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="https://github.com/nomadafantasma" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          }
          className="hover:border-rose-500/30"
        />
      </motion.div>
      
      {/* Add any additional sections here if needed */}
      
      {/* Footer with additional links and social media */}
      <footer className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/55 p-6">
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
        </div>

        <div className="rounded-2xl border border-border bg-card/55 p-6">
          <h3 className="text-sm font-semibold">Síguenos</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://github.com/nomadafantasma"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="pill surface-hover inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm transition-colors hover:bg-card/80"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://twitter.com/nomadafantasma"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
              className="pill surface-hover inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm transition-colors hover:bg-card/80"
            >
              <Twitter className="h-4 w-4" />
              <span>Twitter</span>
            </a>
            <a
              href="https://instagram.com/nomadafantasma"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="pill surface-hover mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm transition-colors hover:bg-card/80"
            >
              <Instagram className="h-4 w-4" />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="mailto:hola@nomadafantasma.io"
              aria-label="Email"
              className="pill surface-hover mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm transition-colors hover:bg-card/80"
            >
              <Mail className="h-4 w-4" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </footer>

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
