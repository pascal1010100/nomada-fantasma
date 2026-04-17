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
    isLoading = false
}: TransitionModalProps) {
    const [note, setNote] = React.useState(initialNote);

    // Reset note when modal opens/changes
    React.useEffect(() => {
        if (isOpen) {
            setNote(initialNote);
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
                        className={`relative w-full max-w-lg bg-gray-900/90 border-t ${config.border} border-x border-x-white/5 border-b border-b-white/5 rounded-3xl shadow-2xl ${config.glow} overflow-hidden`}
                    >
                        {/* Status Header with subtle glass vibe */}
                        <div className="p-8 pb-4 text-center space-y-4">
                            <div className={`inline-flex p-3 rounded-2xl ${config.bg} border ${config.border} mb-2`}>
                                {config.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-white tracking-tight">{title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed px-4">
                                {description}
                            </p>
                        </div>

                        {/* Refined Form Body */}
                        <form onSubmit={handleConfirm} className="p-8 pt-4 space-y-6">
                            {showNoteInput && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                            Bitácora Operativa
                                        </label>
                                        <span className="text-[10px] text-gray-600 font-medium">Opcional</span>
                                    </div>
                                    <div className="group relative">
                                        <textarea
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            disabled={isLoading}
                                            rows={4}
                                            className="w-full bg-black/40 border border-white/5 group-hover:border-white/10 focus:border-cyan-500/40 rounded-2xl px-5 py-4 text-sm text-gray-200 transition-all outline-none resize-none placeholder:text-gray-700 shadow-inner"
                                            placeholder="Detalla cualquier ajuste operativo aquí..."
                                        />
                                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-full" />
                                    </div>
                                </div>
                            )}

                            {/* Premium Actions */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="flex-1 px-6 py-4 rounded-2xl border border-white/5 text-gray-400 text-sm font-semibold hover:bg-white/5 transition-all disabled:opacity-50 active:scale-95"
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
