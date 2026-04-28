'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabase/client';

type LoginState = 'idle' | 'loading' | 'error';

function getErrorMessage(code: string | null) {
    if (code === 'not-allowed') {
        return 'Tu cuenta existe, pero no tiene permisos para operar este panel.';
    }
    if (code === 'auth-required') {
        return 'Inicia sesión con una cuenta autorizada para continuar.';
    }
    return '';
}

export default function InternalLoginClient({ locale }: { locale: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState<LoginState>('idle');
    const [error, setError] = useState('');

    const nextPath = useMemo(() => {
        const next = searchParams.get('next');
        if (!next || !next.startsWith('/')) {
            return `/${locale}/internal/recepcion`;
        }
        return next;
    }, [locale, searchParams]);

    const incomingError = getErrorMessage(searchParams.get('error'));

    useEffect(() => {
        if (searchParams.get('error') === 'not-allowed') {
            void supabase.auth.signOut();
        }
    }, [searchParams]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');
        setError('');

        const { error: authError } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

        if (authError) {
            setStatus('error');
            setError(authError.message || 'No se pudo iniciar sesión.');
            return;
        }

        router.replace(nextPath);
        router.refresh();
    };

    return (
        <div className="min-h-[calc(100vh-6rem)] bg-background px-4 pb-10 nf-page-safe-loose">
            <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-card/70 p-6 shadow-2xl backdrop-blur">
                <div className="mb-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Nómada Fantasma Ops</p>
                    <h1 className="mt-2 text-2xl font-semibold text-foreground">Acceso interno</h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Usa tu cuenta autorizada de Supabase Auth para entrar al panel operativo.
                    </p>
                </div>

                {incomingError ? (
                    <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                        {incomingError}
                    </div>
                ) : null}

                {error ? (
                    <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
                        {error}
                    </div>
                ) : null}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block text-sm">
                        <span className="mb-1 block text-muted-foreground">Correo</span>
                        <input
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
                            placeholder="operaciones@tu-dominio.com"
                        />
                    </label>

                    <label className="block text-sm">
                        <span className="mb-1 block text-muted-foreground">Contraseña</span>
                        <input
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground outline-none transition focus:border-cyan-400/40"
                            placeholder="Tu contraseña"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {status === 'loading' ? 'Ingresando...' : 'Entrar al panel'}
                    </button>
                </form>
            </div>
        </div>
    );
}
