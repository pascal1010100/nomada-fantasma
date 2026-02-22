// app/components/ui/FloatingInput.tsx
'use client';

import { useState, useId, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BaseProps {
    label: string;
    error?: string;
    helperText?: string;
    required?: boolean;
    icon?: ReactNode;
}

type InputProps = BaseProps & InputHTMLAttributes<HTMLInputElement> & {
    as?: 'input';
};

type TextareaProps = BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement> & {
    as: 'textarea';
};

type FloatingInputProps = InputProps | TextareaProps;

export default function FloatingInput({
    label,
    error,
    helperText,
    required = false,
    icon,
    className = '',
    as = 'input',
    ...props
}: FloatingInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    const value = 'value' in props ? props.value : '';
    const hasValue = value !== '' && value !== undefined && value !== null;
    const isFloating = isFocused || hasValue;

    return (
        <div className="relative">
            {/* Input container with liquid effect */}
            <div className={`input-liquid rounded-xl ${error ? 'border-red-500' : ''}`}>
                <div className="relative">
                    {/* Icon */}
                    {icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10">
                            {icon}
                        </div>
                    )}

                    {/* Input/Textarea */}
                    {as === 'textarea' ? (
                        <textarea
                            id={id}
                            {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                            className={`
              w-full
              ${icon ? 'pl-12' : 'pl-4'} pr-4
              pt-6 pb-3 min-h-[100px] resize-none
              rounded-xl
              border border-border
              bg-card/50 backdrop-blur-sm
              text-foreground
              placeholder-transparent
              focus:outline-none focus:ring-2 focus:ring-primary/50
              transition-all duration-300
              ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
              ${className}
            `}
                            placeholder={label}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    ) : (
                        <input
                            id={id}
                            {...(props as InputHTMLAttributes<HTMLInputElement>)}
                            className={`
              w-full
              ${icon ? 'pl-12' : 'pl-4'} pr-4
              pt-6 pb-2
              rounded-xl
              border border-border
              bg-card/50 backdrop-blur-sm
              text-foreground
              placeholder-transparent
              focus:outline-none focus:ring-2 focus:ring-primary/50
              transition-all duration-300
              ${error ? 'border-red-500 focus:ring-red-500/50' : ''}
              ${className}
            `}
                            placeholder={label}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                        />
                    )}

                    {/* Floating Label */}
                    <motion.label
                        htmlFor={id}
                        className={`
              absolute left-4 pointer-events-none
              transition-all duration-300 ease-out
              ${icon ? 'left-12' : 'left-4'}
              ${error ? 'text-red-500' : isFloating ? 'text-primary' : 'text-muted-foreground'}
            `}
                        animate={{
                            top: isFloating ? '0.5rem' : '50%',
                            fontSize: isFloating ? '0.75rem' : '0.875rem',
                            y: isFloating ? 0 : '-50%',
                            fontWeight: isFloating ? 600 : 400,
                        }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                    >
                        {label}
                        {required && <span className="text-primary ml-1">*</span>}
                    </motion.label>
                </div>
            </div>

            {/* Helper text or error */}
            <AnimatePresence mode="wait">
                {(error || helperText) && (
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className={`mt-1.5 text-xs ${error ? 'text-red-500' : 'text-muted-foreground'}`}
                    >
                        {error || helperText}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
