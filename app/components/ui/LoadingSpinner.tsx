// app/components/ui/LoadingSpinner.tsx
'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'glow' | 'dots';
    text?: string;
}

export default function LoadingSpinner({
    size = 'md',
    variant = 'glow',
    text
}: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16'
    };

    if (variant === 'dots') {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent"
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: 'easeInOut'
                            }}
                        />
                    ))}
                </div>
                {text && (
                    <motion.p
                        className="text-sm text-muted-foreground"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        {text}
                    </motion.p>
                )}
            </div>
        );
    }

    if (variant === 'glow') {
        return (
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    {/* Outer glow */}
                    <motion.div
                        className={`${sizeClasses[size]} rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-md absolute inset-0`}
                        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Spinner */}
                    <motion.div
                        className={`${sizeClasses[size]} rounded-full border-4 border-muted/30 border-t-primary relative`}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        style={{
                            boxShadow: '0 0 20px hsl(var(--primary) / 0.3)'
                        }}
                    />
                </div>
                {text && (
                    <p className="text-sm text-muted-foreground">{text}</p>
                )}
            </div>
        );
    }

    // Default variant
    return (
        <div className="flex flex-col items-center gap-4">
            <motion.div
                className={`${sizeClasses[size]} rounded-full border-4 border-muted/30 border-t-primary`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            {text && (
                <p className="text-sm text-muted-foreground">{text}</p>
            )}
        </div>
    );
}
