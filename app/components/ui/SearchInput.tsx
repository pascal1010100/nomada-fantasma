'use client';

import { cn } from '@/lib/utils';
import { Search, X } from 'lucide-react';
import { forwardRef, InputHTMLAttributes, useState, ChangeEvent } from 'react';
import { Input } from './input';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onClear?: () => void;
  showClear?: boolean;
  iconClassName?: string;
  onChange?: (value: string) => void;
  value?: string;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({
    className,
    value = '',
    onClear,
    onChange,
    showClear = true,
    iconClassName,
    ...props
  }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onChange) onChange('');
      if (onClear) onClear();
    };

    return (
      <div 
        className={cn(
          'group relative flex w-full items-center',
          className
        )}
      >
        <Search 
          className={cn(
            'absolute left-3 h-4 w-4 text-muted-foreground',
            iconClassName
          )} 
          aria-hidden="true" 
        />
        <Input
          ref={ref}
          type="text"
          className={cn(
            'w-full pl-9 pr-8',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'transition-all duration-200',
            'bg-background/80 backdrop-blur-sm',
            'border-cyberPurple/30 hover:border-cyberPurple/50',
            isFocused && 'ring-2 ring-electricBlue/50 border-electricBlue/70',
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {showClear && value && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute right-2 rounded-full p-1 transition-colors',
              'text-muted-foreground/60 hover:text-foreground hover:bg-cyberPurple/10',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyberPurple/50',
              'dark:focus:ring-offset-cyberPurple/20'
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';

export { SearchInput };
