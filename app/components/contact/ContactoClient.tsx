'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  MessageCircle,
  Mail,
  MapPin,
  ArrowRight,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Map as MapIcon,
  User,
  Clock,
  Send,
  Sparkles
} from "lucide-react";
import dynamic from 'next/dynamic';
import FloatingInput from "../ui/FloatingInput";
import RippleButton from "../ui/RippleButton";

// Dynamic import for Particles to avoid SSR issues
const ParticlesBackground = dynamic(
  () => import('../../[locale]/mapa/components/ParticlesBackground'),
  { ssr: false }
);

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
} as const;

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const
    }
  },
} as const;

interface ContactCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action: React.ReactNode;
  className?: string;
  color: string;
  iconColor: string;
}

const ContactCard = ({
  icon: Icon,
  title,
  description,
  action,
  className = "",
  color,
  iconColor
}: ContactCardProps) => (
  <motion.div
    variants={item}
    className={`relative overflow-hidden rounded-2xl glass-enhanced p-6 transition-all duration-300 hover-lift group ${className}`}
  >
    {/* Decorative scan line */}
    <div className="scan-line absolute inset-0 opacity-0 group-hover:opacity-20 pointer-events-none transition-opacity duration-500" />

    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color} ${iconColor} bg-opacity-20 ring-1 ring-white/10`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-3">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>
      <div className="mt-auto">
        {action}
      </div>
    </div>
  </motion.div>
);

export default function ContactoClient() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        message: ""
      });

      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 nf-grid opacity-20" />
        <div className="absolute inset-0 nf-vignette" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative">
        <ParticlesBackground />

        <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="text-center mb-16">
              <motion.div
                className="inline-block mb-6"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <div className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20">
                  <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-primary font-semibold tracking-wide uppercase text-xs">Contacto</span>
                </div>
              </motion.div>

              <motion.h1
                className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="block text-foreground">Hablemos sobre tu</span>
                <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Próximo Viaje
                </span>
              </motion.h1>

              <motion.p
                className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Nuestro equipo está listo para ayudarte a planificar tu aventura nómada digital.
                Conecta con nosotros y empieza tu travesía.
              </motion.p>
            </div>

            {/* Contact Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
              variants={container}
              initial="hidden"
              animate="show"
            >
              <ContactCard
                icon={MessageCircle}
                title="Chatea con nosotros"
                description="Nuestro equipo está listo para responder tus preguntas en tiempo real."
                action={
                  <button className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all group">
                    Iniciar chat
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                }
                color="from-primary/10 to-primary/5"
                iconColor="text-primary"
              />

              <ContactCard
                icon={Mail}
                title="Envíanos un correo"
                description="Escríbenos a nuestro correo electrónico y te responderemos lo antes posible."
                action={
                  <a
                    href="mailto:hola@nomadafantasma.com"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all group"
                  >
                    hola@nomadafantasma.com
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                }
                color="from-blue-500/10 to-blue-500/5"
                iconColor="text-blue-500"
              />

              <ContactCard
                icon={MapIcon}
                title="Visítanos"
                description="¿Eres nómada digital? Conoce nuestros espacios de trabajo recomendados."
                action={
                  <Link
                    href="/mapa"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-all group"
                  >
                    Ver en el mapa
                    <MapPin className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                }
                color="from-emerald-500/10 to-emerald-500/5"
                iconColor="text-emerald-500"
              />
            </motion.div>

            {/* Contact Form Section */}
            <motion.div
              className="glass-enhanced rounded-3xl overflow-hidden border border-border/60 shadow-2xl mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Form */}
                <div className="p-8 sm:p-12 relative">
                  <div className="relative z-10">
                    <motion.div
                      className="inline-block mb-6"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        <Sparkles className="w-3 h-3" />
                        Formulario de contacto
                      </div>
                    </motion.div>

                    <motion.h2
                      className="text-3xl font-bold text-foreground mb-3"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Envíanos un mensaje
                    </motion.h2>
                    <motion.p
                      className="text-muted-foreground mb-8"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas.
                    </motion.p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <FloatingInput
                          label="Nombre completo"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          icon={<User className="h-5 w-5" />}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <FloatingInput
                          label="Correo electrónico"
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          icon={<Mail className="h-5 w-5" />}
                        />
                      </motion.div>

                      <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <FloatingInput
                          as="textarea"
                          label="Mensaje"
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          icon={<MessageCircle className="h-5 w-5" />}
                        />
                      </motion.div>

                      <motion.div
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-4 gap-4"
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <div className="flex-1 min-w-0 order-2 sm:order-1">
                          {status === 'success' && (
                            <motion.div
                              className="flex items-center text-emerald-500 text-sm font-medium"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <span>¡Mensaje enviado con éxito!</span>
                            </motion.div>
                          )}
                          {status === 'error' && (
                            <motion.div
                              className="flex items-start text-rose-500 text-sm font-medium"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                            >
                              <span>Error al enviar. Inténtalo de nuevo.</span>
                            </motion.div>
                          )}
                        </div>

                        <div className="order-1 sm:order-2 w-full sm:w-auto">
                          <RippleButton
                            type="submit"
                            variant="primary"
                            isLoading={status === 'sending'}
                            className="w-full sm:w-auto"
                          >
                            <span>Enviar mensaje</span>
                            <Send className="ml-2 h-4 w-4" />
                          </RippleButton>
                        </div>
                      </motion.div>
                    </form>
                  </div>
                </div>

                {/* Contact Info Side */}
                <div className="bg-muted/30 backdrop-blur-md p-8 sm:p-12 flex flex-col border-t lg:border-t-0 lg:border-l border-border/50">
                  <div className="mb-10">
                    <h3 className="text-2xl font-bold text-foreground mb-8">Información de contacto</h3>
                    <div className="space-y-8">
                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                          <MapPin className="h-6 w-6" />
                        </div>
                        <div className="ml-5">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Ubicación</h4>
                          <p className="text-lg text-foreground font-medium">
                            Ciudad de Guatemala, Guatemala
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
                          <Mail className="h-6 w-6" />
                        </div>
                        <div className="ml-5">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Correo</h4>
                          <a href="mailto:hola@nomadafantasma.com" className="text-lg text-foreground font-medium hover:text-primary transition-colors">
                            hola@nomadafantasma.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start group">
                        <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform duration-300">
                          <Clock className="h-6 w-6" />
                        </div>
                        <div className="ml-5">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Horario</h4>
                          <p className="text-lg text-foreground font-medium">
                            Lunes a Viernes: 9:00 - 18:00
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Sábado: 10:00 - 14:00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Síguenos en redes</h3>
                    <div className="flex gap-4">
                      {[
                        { icon: Instagram, href: "#", color: "hover:text-pink-500 hover:bg-pink-500/10" },
                        { icon: Twitter, href: "#", color: "hover:text-blue-400 hover:bg-blue-400/10" },
                        { icon: Facebook, href: "#", color: "hover:text-blue-600 hover:bg-blue-600/10" },
                        { icon: Linkedin, href: "#", color: "hover:text-blue-700 hover:bg-blue-700/10" },
                      ].map((social, i) => (
                        <a
                          key={i}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-110 ${social.color}`}
                        >
                          <span className="sr-only">{social.icon.name}</span>
                          <social.icon className="h-5 w-5" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Footer */}
            <footer className="mt-16 pb-8">
              <motion.div
                className="grid items-center gap-4 border-t border-border/40 pt-8 sm:grid-cols-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-sm text-muted-foreground text-center sm:text-left">
                  © {new Date().getFullYear()} Nómada Fantasma — Hecho con 💙 desde mar abierto.
                </p>
                <div className="flex items-center justify-center gap-6 sm:justify-end">
                  <Link href="/privacidad" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Política de privacidad
                  </Link>
                  <span className="text-muted-foreground/30">•</span>
                  <Link href="/terminos" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Términos de uso
                  </Link>
                </div>
              </motion.div>
            </footer>
          </motion.div>
        </div>
      </div>

      {/* Gradient animation CSS */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}
