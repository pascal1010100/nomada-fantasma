// app/components/ui/Tooltip.tsx
'use client';

import { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
}

export default function Tooltip({
    content,
    children,
    position = 'top',
    delay = 200
}: TooltipProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

    const handleMouseEnter = () => {
        const id = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        setTimeoutId(id);
    };

    const handleMouseLeave = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        setIsVisible(false);
    };

    const positionClasses = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    };

    const arrowClasses = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
    };

    const animationVariants = {
        top: { initial: { opacity: 0, y: 5 }, animate: { opacity: 1, y: 0 } },
        bottom: { initial: { opacity: 0, y: -5 }, animate: { opacity: 1, y: 0 } },
        left: { initial: { opacity: 0, x: 5 }, animate: { opacity: 1, x: 0 } },
        right: { initial: { opacity: 0, x: -5 }, animate: { opacity: 1, x: 0 } }
    };

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        className={`absolute z-[100] ${positionClasses[position]}`}
                        initial={animationVariants[position].initial}
                        animate={animationVariants[position].animate}
                        exit={animationVariants[position].initial}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                    >
                        {/* Tooltip content */}
                        <div className="glass-enhanced px-3 py-2 rounded-lg shadow-lg border border-border/50 backdrop-blur-md">
                            <p className="text-xs font-medium text-foreground whitespace-nowrap">
                                {content}
                            </p>
                        </div>

                        {/* Arrow */}
                        <div
                            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
                            style={{
                                borderTopColor: position === 'bottom' ? 'transparent' : 'hsl(var(--border) / 0.5)',
                                borderBottomColor: position === 'top' ? 'transparent' : 'hsl(var(--border) / 0.5)',
                                borderLeftColor: position === 'right' ? 'transparent' : 'hsl(var(--border) / 0.5)',
                                borderRightColor: position === 'left' ? 'transparent' : 'hsl(var(--border) / 0.5)',
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
