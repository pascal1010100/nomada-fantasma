'use client';

import { Search } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  [key: string]: any; // Allow additional props
}

export function SearchInput({
  placeholder = 'Buscar...',
  className,
  value,
  onChange,
  onSearch,
  ...props
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-4 w-4 text-gray-400" />
      </div>
      <Input
        type="search"
        placeholder={placeholder}
        className={cn(
          'pl-10 w-full bg-background/80 backdrop-blur-sm',
          'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'transition-all duration-200',
          'border border-border hover:border-foreground/20',
          'dark:bg-gray-800/80 dark:border-gray-700 dark:hover:border-gray-600',
          'dark:focus-visible:ring-cyan-500/50 dark:focus-visible:ring-offset-gray-950',
          'h-10 sm:h-11 text-sm sm:text-base'
        )}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}
