// app/components/ui/RippleButton.tsx
'use client';

import { motion } from 'framer-motion';
import { useState, useRef, MouseEvent, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { buttonClassNames, type ButtonVariant } from './Button';
import { cn } from '@/app/lib/utils';

interface RippleButtonProps {
    children: ReactNode;
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: ButtonVariant;
    isLoading?: boolean;
    loadingText?: string;
}

interface Ripple {
    x: number;
    y: number;
    size: number;
    id: number;
}

export default function RippleButton({
    children,
    onClick,
    className = '',
    type = 'button',
    disabled = false,
    variant = 'primary',
    isLoading = false,
    loadingText
}: RippleButtonProps) {
    const t = useTranslations('Common');
    const [ripples, setRipples] = useState<Ripple[]>();
    const buttonRef = useRef<HTMLButtonElement>(null);

    const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
        const button = buttonRef.current;
        if (!button) return;

        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple: Ripple = {
            x,
            y,
            size,
            id: Date.now()
        };

        setRipples((prev) => [...(prev || []), newRipple]);

        // Remove ripple after animation
        setTimeout(() => {
            setRipples((prev) => prev?.filter((r) => r.id !== newRipple.id));
        }, 600);
    };

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled && !isLoading) {
            createRipple(e);
            onClick?.(e);
        }
    };

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={handleClick}
            disabled={disabled || isLoading}
            className={cn(
                buttonClassNames(variant, 'md'),
                'relative overflow-hidden hover:scale-105 active:scale-95',
                className
            )}
        >
            {/* Ripple effects */}
            {ripples?.map((ripple) => (
                <motion.span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                    initial={{ scale: 0, opacity: 0.6 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                />
            ))}

            {/* Button content */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                    <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{loadingText || t('loading')}</span>
                    </>
                ) : (
                    children
                )}
            </span>
        </button>
    );
}
