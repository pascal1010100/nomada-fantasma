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
  CheckCircle2,
  AlertCircle
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
    className={`relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${className}`}
  >
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${color} ${iconColor} bg-opacity-20`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
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
  const [isHovered, setIsHovered] = useState<number | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-cyberPurple-50 via-white to-electricBlue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div 
            className="inline-block mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="bg-gradient-to-r from-cyberPurple to-electricBlue p-1 rounded-full">
              <div className="bg-white dark:bg-gray-900 px-6 py-2 rounded-full">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyberPurple to-electricBlue font-bold">
                  Contacto
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Hablemos sobre tu próximo viaje
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Nuestro equipo está listo para ayudarte a planificar tu aventura nómada digital
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
              <button className="inline-flex items-center text-sm font-medium text-cyberPurple hover:text-cyberPurple/80 dark:text-electricBlue dark:hover:text-electricBlue/80 transition-all group">
                Iniciar chat 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            }
            color="from-cyberPurple/10 to-cyberPurple/5"
            iconColor="text-cyberPurple"
          />

          <ContactCard
            icon={Mail}
            title="Envíanos un correo"
            description="Escríbenos a nuestro correo electrónico y te responderemos lo antes posible."
            action={
              <a 
                href="mailto:hola@nomadafantasma.com" 
                className="inline-flex items-center text-sm font-medium text-cyberPurple hover:text-cyberPurple/80 dark:text-electricBlue dark:hover:text-electricBlue/80 transition-all group"
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
                className="inline-flex items-center text-sm font-medium text-cyberPurple hover:text-cyberPurple/80 dark:text-electricBlue dark:hover:text-electricBlue/80 transition-all group"
              >
                Ver en el mapa
                <MapPin className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            }
            color="from-emerald-500/10 to-emerald-500/5"
            iconColor="text-emerald-500"
          />
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Form */}
            <div className="p-8 sm:p-10 relative overflow-hidden">
              <div className="relative z-10">
                <motion.div 
                  className="inline-block mb-6"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="bg-gradient-to-r from-cyberPurple to-electricBlue p-0.5 rounded-lg">
                    <div className="bg-white dark:bg-gray-900 px-4 py-1 rounded-md">
                      <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-cyberPurple to-electricBlue">
                        Formulario de contacto
                      </span>
                    </div>
                  </div>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Envíanos un mensaje
                </motion.h2>
                <motion.p 
                  className="text-gray-600 dark:text-gray-300 mb-8"
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-cyberPurple focus:border-transparent focus:outline-none transition-all duration-200"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-cyberPurple focus:border-transparent focus:outline-none transition-all duration-200"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mensaje
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <MessageCircle className="h-5 w-5 text-gray-400" />
                      </div>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-cyberPurple focus:border-transparent focus:outline-none transition-all duration-200 resize-none"
                        placeholder="Cuéntanos sobre tu próximo viaje o consulta..."
                        required
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex-1 min-w-0">
                      {status === 'success' && (
                        <motion.div 
                          className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <span>¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.</span>
                        </motion.div>
                      )}
                      {status === 'error' && (
                        <motion.div 
                          className="flex items-start text-rose-600 dark:text-rose-400 text-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          <span>Error al enviar el mensaje. Por favor, inténtalo de nuevo más tarde.</span>
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={status === 'sending'}
                      whileHover={status !== 'sending' ? { scale: 1.02 } : {}}
                      whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                      className={`relative mt-4 sm:mt-0 inline-flex items-center justify-center px-8 py-3.5 text-base font-medium rounded-xl text-white bg-gradient-to-r from-cyberPurple to-electricBlue hover:from-cyberPurple/90 hover:to-electricBlue/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple transition-all shadow-lg shadow-cyberPurple/20 hover:shadow-xl hover:shadow-cyberPurple/30 ${
                        status === 'sending' ? 'opacity-80 cursor-not-allowed' : ''
                      }`}
                    >
                      {status === 'sending' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <span>Enviar mensaje</span>
                          <Send className="ml-2 h-5 w-5" />
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-8 sm:p-10 flex flex-col">
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Información de contacto</h3>
                <div className="space-y-6">
                  <div className="flex items-start p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-cyberPurple/10 dark:bg-cyberPurple/20 flex items-center justify-center text-cyberPurple dark:text-cyberPurple-300">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Ubicación</h4>
                      <p className="text-base text-gray-800 dark:text-gray-200">
                        Ciudad de Guatemala, Guatemala
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Correo</h4>
                      <a href="mailto:hola@nomadafantasma.com" className="text-base text-gray-800 dark:text-gray-200 hover:text-cyberPurple dark:hover:text-electricBlue transition-colors">
                        hola@nomadafantasma.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Horario</h4>
                      <p className="text-base text-gray-800 dark:text-gray-200">
                        Lunes a Viernes: 9:00 - 18:00
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Sábado: 10:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Síguenos en redes</h3>
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, href: "#", color: "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20" },
                    { icon: Twitter, href: "#", color: "bg-blue-400/10 text-blue-400 hover:bg-blue-400/20" },
                    { icon: Facebook, href: "#", color: "bg-blue-600/10 text-blue-600 hover:bg-blue-600/20" },
                    { icon: Linkedin, href: "#", color: "bg-blue-700/10 text-blue-700 hover:bg-blue-700/20" },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${social.color}`}
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
        <footer className="mt-16">
          <motion.div
            className="grid items-center gap-3 border-t border-gray-200/50 dark:border-gray-700/50 pt-8 sm:grid-cols-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Nómada Fantasma — Hecho con 💙 desde mar abierto.
            </p>
            <div className="flex items-center justify-start gap-4 sm:justify-end">
              <Link href="/privacidad" className="text-sm text-gray-500 hover:text-cyberPurple dark:text-gray-400 dark:hover:text-electricBlue transition-colors">
                Política de privacidad
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link href="/terminos" className="text-sm text-gray-500 hover:text-cyberPurple dark:text-gray-400 dark:hover:text-electricBlue transition-colors">
                Términos de uso
              </Link>
            </div>
          </motion.div>
        </footer>
      </motion.div>
    </div>
  );
}
