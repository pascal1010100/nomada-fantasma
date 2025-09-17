'use client';

import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Buscar rutas...',
  className = '' 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  
  // Usar debounce para evitar múltiples búsquedas mientras el usuario escribe
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <motion.div 
      className={`relative max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={`relative flex items-center h-12 px-4 rounded-xl border transition-all duration-200 ${
        isFocused 
          ? 'border-cyberPurple dark:border-cyberPurple/80 bg-white dark:bg-gray-800 shadow-md shadow-cyberPurple/10 dark:shadow-cyberPurple/5' 
          : 'border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:border-gray-300 dark:hover:border-gray-600'
      }`}>
        <Search className={`h-4 w-4 mr-3 transition-colors ${
          isFocused ? 'text-cyberPurple' : 'text-gray-400'
        }`} />
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full h-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 text-sm sm:text-base"
          aria-label="Buscar rutas"
        />
        
        {searchQuery && (
          <button
            onClick={handleClear}
            className="p-1 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {searchQuery && (
        <motion.div 
          className="absolute left-0 right-0 mt-1 text-xs text-gray-500 dark:text-gray-400 text-center"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Buscando: <span className="font-medium text-cyberPurple dark:text-cyberPurple-300">{searchQuery}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
