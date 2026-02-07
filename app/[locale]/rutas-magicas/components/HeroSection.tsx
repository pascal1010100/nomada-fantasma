'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';

export default function HeroSection({ onSearch, defaultQuery = '' }: { onSearch?: (query: string) => void; defaultQuery?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const handleSearch = (query: string) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start']
  });

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section
      ref={ref}
      style={{ opacity }}
      className="relative min-h-[80vh] flex items-center justify-center"
    >
      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto text-center sm:px-8">
        <div className="space-y-8">
          <motion.div
            className="inline-flex items-center px-4 py-2 text-sm font-medium glass-enhanced rounded-full border border-primary/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-primary font-semibold tracking-wide uppercase text-xs">Explora el mundo</span>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="block text-foreground">Descubre</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Rutas Mágicas
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experiencias únicas en los destinos más asombrosos del mundo, curadas para nómadas digitales.
          </motion.p>

          <motion.div
            className="max-w-2xl mx-auto my-8 w-full px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <SearchBar
              onSearch={handleSearch}
              defaultValue={defaultQuery}
              placeholder="Busca destinos, actividades o experiencias..."
              className="w-full"
            />
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Link
              href="/rutas-magicas"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-white bg-gradient-to-r from-primary to-accent rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explorar rutas
                <Sparkles className="w-4 h-4" />
              </span>
            </Link>
            <Link
              href="/sobre-nosotros"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-medium text-foreground bg-card/50 hover:bg-card/80 border border-border/50 rounded-xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              <span>¿Cómo funciona?</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-primary rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>

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
    </motion.section>
  );
}
