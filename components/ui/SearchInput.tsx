'use client';

import { Search } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/app/lib/utils';
import type { ChangeEvent, KeyboardEvent, InputHTMLAttributes } from 'react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onClear?: () => void;
  showClear?: boolean;
  iconClassName?: string;
}

export function SearchInput({
  placeholder = 'Buscar...',
  className,
  value,
  onChange,
  onSearch,
  onClear,
  showClear,
  iconClassName,
  ...props
}: SearchInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className={cn('h-4 w-4 text-gray-400', iconClassName)} />
      </div>
      <div className="relative w-full">
        <Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            'pl-10 pr-10 w-full bg-background/80 backdrop-blur-sm',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'transition-all duration-200',
            'border border-border hover:border-foreground/20',
            'dark:bg-gray-800/80 dark:border-gray-700 dark:hover:border-gray-600',
            'dark:focus-visible:ring-cyan-500/50 dark:focus-visible:ring-offset-gray-950',
            'h-10 sm:h-11 text-sm sm:text-base',
            className
          )}
          {...props}
        />
        {showClear && value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
