'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Send } from 'lucide-react';

export type ModalStatus = 'confirmed' | 'completed' | 'cancelled' | 'processing';

interface TransitionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
    title: string;
    description: string;
    confirmLabel: string;
    status: ModalStatus;
    showNoteInput?: boolean;
    initialNote?: string;
    isLoading?: boolean;
    noteRequired?: boolean;
    noteMinLength?: number;
    noteHelper?: string;
}

export default function TransitionModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel,
    status,
    showNoteInput = true,
    initialNote = '',
    isLoading = false,
    noteRequired = false,
    noteMinLength = 0,
    noteHelper
}: TransitionModalProps) {
    const [note, setNote] = React.useState(initialNote);
    const [validationError, setValidationError] = React.useState('');

    // Reset note when modal opens/changes
    React.useEffect(() => {
        if (isOpen) {
            setNote(initialNote);
            setValidationError('');
        }
    }, [isOpen, initialNote]);

    const getStatusConfig = () => {
        switch (status) {
            case 'confirmed':
                return {
                    icon: <CheckCircle2 className="w-6 h-6 text-emerald-400" />,
                    bg: 'bg-emerald-500/10',
                    border: 'border-emerald-500/30',
                    glow: 'shadow-emerald-500/10',
                    button: 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500'
                };
            case 'completed':
                return {
                    icon: <CheckCircle2 className="w-6 h-6 text-sky-400" />,
                    bg: 'bg-sky-500/10',
                    border: 'border-sky-500/30',
                    glow: 'shadow-sky-500/10',
                    button: 'bg-gradient-to-br from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500'
                };
            case 'cancelled':
                return {
                    icon: <XCircle className="w-6 h-6 text-rose-400" />,
                    bg: 'bg-rose-500/10',
                    border: 'border-rose-500/30',
                    glow: 'shadow-rose-500/10',
                    button: 'bg-gradient-to-br from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500'
                };
            default:
                return {
                    icon: <AlertCircle className="w-6 h-6 text-amber-400" />,
                    bg: 'bg-amber-500/10',
                    border: 'border-amber-500/30',
                    glow: 'shadow-amber-500/10',
                    button: 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                };
        }
    };

    const config = getStatusConfig();

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedNote = note.trim();

        if (showNoteInput && noteRequired && trimmedNote.length < noteMinLength) {
            setValidationError(`La nota debe tener al menos ${noteMinLength} caracteres.`);
            return;
        }

        setValidationError('');
        onConfirm(note);
    };

    if (!isOpen && !isLoading) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Balanced Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Balanced Elite Design */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card shadow-2xl ${config.glow} dark:border-x-white/5 dark:border-b-white/5 dark:bg-gray-900/90 ${config.border}`}
                    >
                        {/* Status Header with subtle glass vibe */}
                        <div className="p-8 pb-4 text-center space-y-4">
                            <div className={`inline-flex p-3 rounded-2xl ${config.bg} border ${config.border} mb-2`}>
                                {config.icon}
                            </div>
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">{title}</h3>
                            <p className="px-4 text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>

                        {/* Refined Form Body */}
                        <form onSubmit={handleConfirm} className="p-8 pt-4 space-y-6">
                            {showNoteInput && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                                            Nota operativa
                                        </label>
                                        <span className="text-[10px] font-medium text-muted-foreground">
                                            {noteRequired ? 'Obligatoria' : 'Opcional'}
                                        </span>
                                    </div>
                                    {noteHelper ? (
                                        <p className="px-1 text-xs text-muted-foreground">{noteHelper}</p>
                                    ) : null}
                                    <div className="group relative">
                                        <textarea
                                            value={note}
                                            onChange={(e) => {
                                                setNote(e.target.value);
                                                if (validationError) {
                                                    setValidationError('');
                                                }
                                            }}
                                            disabled={isLoading}
                                            rows={4}
                                            className="w-full resize-none rounded-2xl border border-border bg-background px-5 py-4 text-sm text-foreground shadow-inner outline-none transition-all placeholder:text-muted-foreground group-hover:border-primary/30 focus:border-cyan-500/40 dark:border-white/5 dark:bg-black/40 dark:group-hover:border-white/10"
                                            placeholder="Detalla cualquier ajuste operativo aquí..."
                                        />
                                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
                                    </div>
                                    {validationError ? (
                                        <p className="px-1 text-xs text-rose-300">{validationError}</p>
                                    ) : null}
                                </div>
                            )}

                            {/* Premium Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 rounded-2xl border border-border px-6 py-4 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted hover:text-foreground disabled:opacity-50 active:scale-95 dark:border-white/5 dark:hover:bg-white/5"
                                >
                                    Volver
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`flex-[1.5] flex items-center justify-center gap-3 px-6 py-4 rounded-2xl text-white text-sm font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 ${config.button}`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            {confirmLabel}
                                            <Send className="w-4 h-4 opacity-50" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        {/* Subtle Edge Glow for that Elite feel */}
                        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-${status === 'confirmed' ? 'emerald' : status === 'completed' ? 'sky' : 'rose'}-500/50 to-transparent`} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
