'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import SearchBar from './SearchBar';

type Variants = {
  hidden: { opacity: number; y: number };
  visible: (i?: number) => { opacity: number; y: number; transition: any };
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1 * i,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    }
  })
};

interface HeroSectionProps {
  onSearch?: (query: string) => void;
  defaultQuery?: string;
}

export default function HeroSection({ onSearch, defaultQuery = '' }: HeroSectionProps) {
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

  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.section 
      ref={ref}
      style={{ opacity }}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white dark:bg-gray-950"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          style={{ y: yBg }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05)_0%,transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.05)_0%,transparent_50%)]" />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl px-6 mx-auto text-center sm:px-8">
        <div className="space-y-8">
          <motion.div 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-cyberPurple dark:text-cyberPurple-300 bg-cyberPurple/5 dark:bg-cyberPurple/10 rounded-full border border-cyberPurple/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyberPurple opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyberPurple"></span>
            </span>
            Explora el mundo
          </motion.div>

          <motion.h1 
            className="text-4xl font-medium tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="block text-gray-900 dark:text-white">Descubre</span>
            <span className="block mt-2 bg-gradient-to-r from-cyberPurple to-electricBlue bg-clip-text text-transparent">
              Rutas Mágicas
            </span>
          </motion.h1>
          
          <motion.p 
            className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300 text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Experiencias únicas en los destinos más asombrosos del mundo
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
              className="px-8 py-3.5 text-base font-medium text-white bg-cyberPurple hover:bg-cyberPurple/90 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Explorar rutas
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/sobre-nosotros" 
              className="px-8 py-3.5 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>¿Cómo funciona?</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle floating elements */}
      {isMounted && (
        <>
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-cyberPurple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30"></div>
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-electricBlue-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 dark:opacity-30"></div>
        </>
      )}
      
      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="w-5 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full flex justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-gray-400 dark:bg-gray-300 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </motion.section>
  );
}
