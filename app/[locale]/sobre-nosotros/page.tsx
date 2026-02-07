'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Users, Calendar, MessageCircle, ArrowRight, Sparkles, Compass, Wifi, Home, Coffee, DollarSign, Map, CheckCircle, Search, BrainCircuit, Cpu, Wand2 } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import RippleButton from '../../components/ui/RippleButton';

const ParticlesBackground = dynamic(
  () => import('../mapa/components/ParticlesBackground'),
  { ssr: false }
);

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    className="glass-enhanced p-6 rounded-xl border border-white/10 dark:border-white/5 hover-lift group relative overflow-hidden"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </motion.div>
);

const HowItWorksStep = ({ number, title, description, icon, delay }: { number: number; title: string; description: string; icon: React.ReactNode; delay: number }) => (
  <motion.div
    className="flex gap-6 group"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
        {number}
      </div>
      <div className="w-0.5 flex-grow bg-gradient-to-b from-primary to-accent opacity-30 my-2 group-hover:opacity-60 transition-opacity"></div>
    </div>
    <div className="flex-1 pb-10">
      <div className="glass-enhanced p-6 rounded-xl border border-white/10 dark:border-white/5 hover:border-primary/30 transition-colors">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default function AboutPage() {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Cartografía Viva",
      description: "Datos en tiempo real sobre el ecosistema urbano: WiFi de alta velocidad, hubs de innovación y refugios creativos."
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Travesías Ocultas",
      description: "Caminos no marcados en los mapas convencionales. Experiencias diseñadas por curadores locales."
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "Cortex AI",
      description: "Algoritmos predictivos que curan tu viaje en tiempo real. Tu copiloto digital que anticipa tus necesidades."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "El Sindicato Nómada",
      description: "Conecta con una red global de visionarios, creadores y exploradores."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Sincronización Flexible",
      description: "Reserva cuando quieras. Personaliza tu experiencia. Sin ataduras."
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Oráculo Virtual",
      description: "Respuestas instantáneas a tus dudas sobre el terreno. Asistencia 24/7."
    }
  ];

  const howItWorks = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Escanea el Terreno",
      description: "Navega por nuestra cartografía interactiva y detecta las Travesías Ocultas."
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Identifica tu Misión",
      description: "Elige experiencias que resuenen con tu frecuencia. Desde free tours hasta inmersiones exclusivas."
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Inicia Protocolo",
      description: "Solicita tu reserva. Establece conexión directa con el guía local."
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Sincronización Confirmada",
      description: "Recibe confirmación de disponibilidad, coordenadas exactas y hora de encuentro."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Inmersión Total",
      description: "Vive la experiencia. Descubre la realidad oculta de cada destino."
    }
  ];

  const usefulSpots = [
    { icon: <Wifi className="w-5 h-5" />, name: "WiFi Alta Velocidad" },
    { icon: <Home className="w-5 h-5" />, name: "Refugios" },
    { icon: <Coffee className="w-5 h-5" />, name: "Estaciones de Recarga" },
    { icon: <DollarSign className="w-5 h-5" />, name: "Cajeros" },
    { icon: <Map className="w-5 h-5" />, name: "Nodos de Interés" },
    { icon: <Users className="w-5 h-5" />, name: "Hubs Creativos" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 nf-grid opacity-20" />
        <div className="absolute inset-0 nf-vignette" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="relative pt-20">
        <ParticlesBackground />

        {/* Hero Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <motion.div
                className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20 mb-8"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-primary font-semibold tracking-wide uppercase text-xs">Protocolo de Viaje V2.0</span>
              </motion.div>

              <motion.h1
                className="text-4xl md:text-7xl font-bold text-foreground mb-6 tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <span className="block">El Nexo del</span>
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Nómada Moderno
                </span>
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Tu portal a un mundo sin fronteras. Fusionamos tecnología de vanguardia con experiencias locales auténticas para el viajero de élite.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link href="/rutas-magicas">
                  <RippleButton className="w-full sm:w-auto">
                    Iniciar Exploración <ArrowRight className="w-5 h-5 ml-2" />
                  </RippleButton>
                </Link>
                <Link href="#como-funciona">
                  <button className="w-full sm:w-auto px-8 py-3 rounded-xl glass-enhanced border border-white/10 hover:bg-white/5 transition-colors text-foreground font-medium">
                    Ver Protocolo
                  </button>
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What is Nómada Fantasma */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex items-center gap-16">
              <motion.div
                className="lg:w-1/2 mb-12 lg:mb-0"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Decodificando el <span className="text-primary">Caos Urbano</span>
                </h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Más que una plataforma, somos una red de inteligencia colectiva. Nómada Fantasma decodifica el caos urbano para revelarte rutas secretas, conexiones vitales y el pulso real de cada destino.
                </p>

                <div className="glass-enhanced p-6 rounded-xl border border-primary/20 mb-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full filter blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h3 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2 relative z-10">
                    <Cpu className="text-primary w-5 h-5" />
                    Potenciado por Cortex AI
                  </h3>
                  <p className="text-muted-foreground mb-4 relative z-10">
                    Algoritmos predictivos que te ofrecen:
                  </p>
                  <ul className="space-y-3 text-muted-foreground relative z-10">
                    {[
                      "Curaduría de rutas basada en tu perfil psicográfico",
                      "Asistente táctico 24/7 para logística en terreno",
                      "Análisis de flujo para evitar saturación turística",
                      "Enlace lingüístico en tiempo real"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-enhanced p-6 rounded-xl border border-white/10 dark:border-white/5">
                  <h3 className="text-xl font-bold text-foreground mb-4">Radar de Recursos:</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {usefulSpots.map((spot, index) => (
                      <div key={index} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-default">
                        <span className="text-primary">{spot.icon}</span>
                        <span className="text-sm font-medium">{spot.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {features.map((feature, index) => (
                  <FeatureCard
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    delay={index}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="como-funciona" className="py-20 relative">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left scale-110 -z-10"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Ejecutando el Protocolo
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Accede a experiencias exclusivas en 5 pasos
              </p>
            </motion.div>

            <div className="space-y-2 relative">
              {/* Vertical line connector */}
              <div className="absolute left-[19px] top-10 bottom-10 w-0.5 bg-gradient-to-b from-primary/50 via-accent/50 to-transparent hidden md:block"></div>

              {howItWorks.map((step, index) => (
                <HowItWorksStep
                  key={index}
                  number={index + 1}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  delay={index}
                />
              ))}
            </div>

            <motion.div
              className="mt-16 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-foreground mb-8">
                ¿Listo para la inmersión?
              </h3>
              <Link href="/rutas-magicas">
                <RippleButton className="px-10 py-6 text-lg">
                  Iniciar Misión <ArrowRight className="ml-2 w-6 h-6" />
                </RippleButton>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 relative overflow-hidden">
          {/* Darker, more sophisticated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background"></div>
          {/* Stronger overlay for light mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/50 via-accent/50 to-primary/50 dark:hidden"></div>
          {/* Subtle overlay for dark mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 hidden dark:block"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1)_0%,transparent_70%)]"></div>
          <div className="absolute inset-0 nf-grid opacity-20"></div>
          <div className="absolute inset-0 nf-vignette"></div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Únete a la comunidad de nómadas digitales
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Descubre destinos increíbles, conecta con guías locales y vive experiencias que recordarás para siempre.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/registro">
                  <RippleButton className="px-8 py-4 text-lg font-bold">
                    Crear cuenta gratuita
                  </RippleButton>
                </Link>
                <Link href="/contacto">
                  <button className="px-8 py-4 glass-enhanced border border-primary/30 text-foreground font-bold rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover-lift">
                    Contáctanos
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
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
