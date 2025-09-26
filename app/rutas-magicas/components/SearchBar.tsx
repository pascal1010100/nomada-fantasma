'use client';

import { motion } from 'framer-motion';
import { SearchInput } from '@/components/ui/SearchInput';
import { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
  delay?: number;
}

export default function SearchBar({ 
  onSearch, 
  placeholder = 'Buscar rutas...',
  className = '',
  value = '',
  delay = 300
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  
  // Update internal state when value prop changes
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);
  
  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(searchQuery);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch, delay]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    onSearch('');
  }, [onSearch]);
  return (
    <motion.div 
      className={`w-full max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <SearchInput
        value={searchQuery}
        onChange={(value: string) => setSearchQuery(value)}
        placeholder={placeholder}
        onClear={handleClear}
        showClear={!!searchQuery}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Escape') {
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="w-full shadow-lg shadow-cyberPurple/10 hover:shadow-cyberPurple/20 transition-shadow"
        iconClassName="group-hover:text-electricBlue transition-colors"
      />
      
      {searchQuery && (
        <motion.div 
          className="mt-1 text-xs text-foreground/70"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Buscando: <span className="font-medium text-cyberPurple">{searchQuery}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
