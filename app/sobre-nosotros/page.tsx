'use client';

import { motion } from 'framer-motion';
import { MapPin, Globe, Users, Calendar, MessageCircle, ArrowRight, Sparkles, Compass, Wifi, Home, Coffee, DollarSign, Map, CheckCircle, Search, BrainCircuit, Cpu, Wand2 } from 'lucide-react';
import Link from 'next/link';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyberPurple to-electricBlue flex items-center justify-center text-white mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

const HowItWorksStep = ({ number, title, description, icon, delay }: { number: number; title: string; description: string; icon: React.ReactNode; delay: number }) => (
  <motion.div
    className="flex gap-6"
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    <div className="flex flex-col items-center">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyberPurple to-electricBlue flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div className="w-0.5 flex-grow bg-gradient-to-b from-cyberPurple to-electricBlue opacity-30 my-2"></div>
    </div>
    <div className="flex-1 pb-10">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-cyberPurple dark:text-electricBlue">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <p className="text-gray-600 dark:text-gray-300 pl-9">{description}</p>
    </div>
  </motion.div>
);

export default function AboutPage() {
  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Mapa Interactivo",
      description: "Encuentra cajeros, hospedaje, coworking y más en tiempo real."
    },
    {
      icon: <Compass className="w-6 h-6" />,
      title: "Rutas Mágicas",
      description: "Experiencias únicas creadas por guías locales expertos."
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: "IA Avanzada",
      description: "Recomendaciones personalizadas basadas en tus intereses."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Comunidad",
      description: "Conecta con otros nómadas digitales y comparte experiencias."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexibilidad",
      description: "Reserva cuando quieras y personaliza tu experiencia."
    },
    {
      icon: <Wand2 className="w-6 h-6" />,
      title: "Asistente Virtual",
      description: "Obtén respuestas instantáneas a tus preguntas sobre viajes."
    }
  ];

  const howItWorks = [
    {
      icon: <Search className="w-5 h-5" />,
      title: "Explora",
      description: "Navega por nuestro mapa interactivo y descubre Rutas Mágicas creadas por guías locales."
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Selecciona",
      description: "Elige entre free tours o experiencias de pago que se ajusten a tus intereses y presupuesto."
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Solicita Reserva",
      description: "Indica tu fecha preferida y detalles de tu grupo. ¡Es rápido y sin compromiso!"
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Confirma",
      description: "El guía local confirma disponibilidad, hora exacta y punto de encuentro."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Vive la Experiencia",
      description: "Disfruta de una experiencia auténtica. En free tours, se sugiere una propina al final."
    }
  ];

  const usefulSpots = [
    { icon: <Wifi className="w-5 h-5" />, name: "WiFi Gratis" },
    { icon: <Home className="w-5 h-5" />, name: "Hospedaje" },
    { icon: <Coffee className="w-5 h-5" />, name: "Cafeterías" },
    { icon: <DollarSign className="w-5 h-5" />, name: "Cajeros" },
    { icon: <Map className="w-5 h-5" />, name: "Puntos de Interés" },
    { icon: <Users className="w-5 h-5" />, name: "Coworking" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyberPurple/5 to-electricBlue/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="block">Conoce</span>
              <span className="bg-gradient-to-r from-cyberPurple to-electricBlue bg-clip-text text-transparent">
                Nómada Fantasma
              </span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              La plataforma que conecta a nómadas digitales con experiencias auténticas y recursos útiles alrededor del mundo.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link 
                href="/rutas-magicas" 
                className="px-8 py-4 bg-gradient-to-r from-cyberPurple to-electricBlue text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyberPurple/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explorar Rutas Mágicas
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                href="#como-funciona" 
                className="px-8 py-4 border-2 border-cyberPurple/20 text-cyberPurple dark:text-white font-medium rounded-full hover:bg-cyberPurple/10 transition-all duration-300"
              >
                ¿Cómo funciona?
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is Nómada Fantasma */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex items-center gap-16">
            <motion.div 
              className="lg:w-1/2 mb-12 lg:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ¿Qué es <span className="text-cyberPurple">Nómada Fantasma</span>?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Somos una plataforma diseñada para nómadas digitales que buscan explorar el mundo mientras trabajan. 
                Centralizamos destinos, ofrecemos un mapa interactivo con puntos útiles y conectamos viajeros con 
                experiencias auténticas a través de nuestras <span className="font-semibold text-cyberPurple">Rutas Mágicas</span>.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                Nuestro objetivo es ofrecerte menos tours "enlatados" y más conexión con la cultura local, 
                caminos únicos y recomendaciones auténticas que solo los locales conocen.
              </p>
              <div className="bg-gradient-to-r from-cyberPurple/5 to-electricBlue/5 p-6 rounded-xl border border-cyberPurple/10 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Cpu className="text-cyberPurple dark:text-electricBlue w-5 h-5" />
                  Potenciado por IA
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Nuestra plataforma utiliza inteligencia artificial para ofrecerte:
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Recomendaciones personalizadas basadas en tus intereses y preferencias</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Asistente virtual 24/7 para responder tus preguntas sobre destinos y rutas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Análisis predictivo para evitar multitudes y encontrar los mejores momentos para visitar lugares</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Traducción en tiempo real para una comunicación fluida con locales</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-cyberPurple/5 dark:bg-cyberPurple/10 p-6 rounded-xl border border-cyberPurple/10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Encuentra en nuestro mapa:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {usefulSpots.map((spot, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                      <span className="text-cyberPurple">{spot.icon}</span>
                      <span>{spot.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 grid grid-cols-2 gap-6"
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
      <section id="como-funciona" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Cómo funciona
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Descubre experiencias únicas en simples pasos
            </p>
          </motion.div>

          <div className="space-y-2">
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
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              ¿Listo para tu próxima aventura?
            </h3>
            <Link 
              href="/rutas-magicas" 
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyberPurple to-electricBlue text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyberPurple/30 transition-all duration-300"
            >
              Explorar Rutas Mágicas
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyberPurple to-electricBlue">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Únete a la comunidad de nómadas digitales
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Descubre destinos increíbles, conecta con guías locales y vive experiencias que recordarás para siempre.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/registro" 
              className="px-8 py-4 bg-white text-cyberPurple font-medium rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              Crear cuenta gratuita
            </Link>
            <Link 
              href="/contacto" 
              className="px-8 py-4 border-2 border-white text-white font-medium rounded-full hover:bg-white/10 transition-colors duration-300"
            >
              Contáctanos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
