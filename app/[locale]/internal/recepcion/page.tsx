'use client';

import { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';

type InternalRequestItem = {
    id: string;
    kind: 'tour' | 'shuttle';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    date: string;
    details: string;
    status: string | null;
    emailStatus: string | null;
    emailAttempts: number;
    emailLastError: string | null;
    adminNotes: string | null;
    confirmedAt: string | null;
    cancelledAt: string | null;
};
type RequestStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'completed';

type InternalResponse = {
    success: boolean;
    summary: {
        total: number;
        tours: number;
        shuttles: number;
        emailFailed: number;
    };
    items: InternalRequestItem[];
};
type NoteQuality = 'strong' | 'weak' | 'risk';
type ToastKind = 'success' | 'error' | 'info';
type ToastMessage = {
    id: number;
    kind: ToastKind;
    title: string;
    message?: string;
};

const STORAGE_KEY = 'nomada_admin_token';
const PROCESSING_STALE_HOURS = 8;

function toStartOfDay(date: Date) {
    const clone = new Date(date);
    clone.setHours(0, 0, 0, 0);
    return clone;
}

function parseRequestDate(item: InternalRequestItem): Date | null {
    if (!item.date) return null;
    const parsed = new Date(item.date);
    if (!Number.isNaN(parsed.getTime())) return parsed;

    // fallback for YYYY-MM-DD values
    const fallback = new Date(`${item.date}T00:00:00`);
    if (!Number.isNaN(fallback.getTime())) return fallback;
    return null;
}

function getStatusBadgeClasses(status: RequestStatus): string {
    if (status === 'pending') return 'bg-amber-500/15 text-amber-300 border-amber-400/30';
    if (status === 'processing') return 'bg-sky-500/15 text-sky-300 border-sky-400/30';
    if (status === 'confirmed') return 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30';
    if (status === 'cancelled') return 'bg-rose-500/15 text-rose-300 border-rose-400/30';
    return 'bg-slate-500/15 text-slate-300 border-slate-400/30';
}

function getStatusLabel(status: RequestStatus): string {
    if (status === 'pending') return 'Nueva solicitud';
    if (status === 'processing') return 'En gestion';
    if (status === 'confirmed') return 'Confirmada';
    if (status === 'cancelled') return 'Cancelada';
    return 'Completada';
}

function getKindLabel(kind: InternalRequestItem['kind']): string {
    return kind === 'tour' ? 'Tour' : 'Shuttle';
}

function getEmailStatusLabel(status: string | null): string {
    if (status === 'sent') return 'Enviado';
    if (status === 'failed') return 'Fallido';
    if (status === 'pending') return 'Pendiente';
    if (status === 'not_requested') return 'No solicitado';
    return 'Sin dato';
}

function getEmailStatusClasses(status: string | null): string {
    if (status === 'sent') return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-300';
    if (status === 'failed') return 'border-rose-400/30 bg-rose-500/10 text-rose-300';
    if (status === 'pending') return 'border-amber-400/30 bg-amber-500/10 text-amber-300';
    return 'border-white/10 bg-white/5 text-muted-foreground';
}

function getChecklist(status: RequestStatus): string {
    if (status === 'pending') return 'Validar datos e iniciar gestion con agencia.';
    if (status === 'processing') return 'Esperando respuesta de agencia y resolver confirmacion/cancelacion.';
    if (status === 'confirmed') return 'Confirmar logistica final y cerrar al completar servicio.';
    if (status === 'cancelled') return 'Caso cancelado. Verificar motivo en nota.';
    return 'Caso finalizado. Sin acciones pendientes.';
}

function formatTimestamp(value: string | null): string {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleString();
}

function getNotePreview(note: string, limit = 110): string {
    if (note.length <= limit) return note;
    return `${note.slice(0, limit)}...`;
}

function noteHasAgencyEvidence(note: string): boolean {
    return /\bagencia\b/i.test(note);
}

function noteHasConfirmationEvidence(note: string): boolean {
    return /\bconfirm\w*\b/i.test(note);
}

function noteHasServiceExecutionEvidence(note: string): boolean {
    return /\b(servicio|tour|shuttle|traslado|realiz\w*|ejecut\w*|complet\w*)\b/i.test(note);
}

function noteHasReasonEvidence(note: string): boolean {
    return /\b(motivo|raz[oó]n|cancel\w*|cliente|agencia|no\s+disponible)\b/i.test(note);
}

function noteHasTemporalEvidence(note: string): boolean {
    return /\b(fecha|hora|hoy|ayer)\b/i.test(note) || /\b\d{1,2}:\d{2}\b/.test(note) || /\b\d{4}-\d{2}-\d{2}\b/.test(note);
}

function getTransitionHelper(fromStatus: RequestStatus, toStatus: RequestStatus): string {
    if (fromStatus === 'processing' && toStatus === 'confirmed') {
        return 'Debes confirmar que la agencia respondió. Incluye agencia, confirmación y fecha/hora.';
    }
    if (fromStatus === 'processing' && toStatus === 'cancelled') {
        return 'Debes registrar motivo de cancelación y contexto (cliente/agencia).';
    }
    if (fromStatus === 'confirmed' && toStatus === 'completed') {
        return 'Confirma que el servicio YA ocurrió. No usar para cierre administrativo.';
    }
    if (fromStatus === 'confirmed' && toStatus === 'cancelled') {
        return 'Registra por qué se cayó un caso ya confirmado.';
    }
    return `Debes documentar el cambio a ${toStatus} con contexto claro.`;
}

function validateTransitionNoteClient(fromStatus: RequestStatus, toStatus: RequestStatus, note: string): string | null {
    if (note.length < 18) {
        return 'La nota debe tener al menos 18 caracteres.';
    }
    if (fromStatus === 'processing' && toStatus === 'confirmed') {
        if (!noteHasAgencyEvidence(note)) return 'Incluye la agencia en la nota.';
        if (!noteHasConfirmationEvidence(note)) return 'Incluye evidencia de confirmación en la nota.';
        if (!noteHasTemporalEvidence(note)) return 'Incluye fecha u hora de confirmación en la nota.';
    }
    if (toStatus === 'cancelled' && !noteHasReasonEvidence(note)) {
        return 'Incluye motivo o contexto claro de cancelación en la nota.';
    }
    if (fromStatus === 'confirmed' && toStatus === 'completed') {
        if (!noteHasServiceExecutionEvidence(note)) return 'Incluye evidencia de ejecución del servicio en la nota.';
        if (!noteHasTemporalEvidence(note)) return 'Incluye fecha u hora de ejecución en la nota.';
    }
    return null;
}

function getNoteQuality(status: RequestStatus, note: string | null): NoteQuality {
    if (!(status === 'confirmed' || status === 'cancelled' || status === 'completed')) return 'strong';
    if (!note || note.trim().length < 18) return 'risk';

    const normalized = note.trim();
    const hasTime = noteHasTemporalEvidence(normalized);
    if (status === 'confirmed') {
        if (noteHasAgencyEvidence(normalized) && noteHasConfirmationEvidence(normalized) && hasTime) return 'strong';
        if (noteHasAgencyEvidence(normalized) || noteHasConfirmationEvidence(normalized)) return 'weak';
        return 'risk';
    }
    if (status === 'cancelled') {
        if (noteHasReasonEvidence(normalized) && hasTime) return 'strong';
        if (noteHasReasonEvidence(normalized)) return 'weak';
        return 'risk';
    }
    if (status === 'completed') {
        if (noteHasServiceExecutionEvidence(normalized) && hasTime) return 'strong';
        if (noteHasServiceExecutionEvidence(normalized)) return 'weak';
        return 'risk';
    }
    return 'weak';
}

function renderQualityBadge(status: RequestStatus, note: string | null) {
    const quality = getNoteQuality(status, note);
    if (quality === 'strong') {
        return <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">Confiable</span>;
    }
    if (quality === 'weak') {
        return <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">Debil</span>;
    }
    return <span className="inline-flex items-center rounded-full border border-rose-400/30 bg-rose-500/15 px-2 py-0.5 text-xs text-rose-300">Riesgo</span>;
}

export default function RecepcionRequestsPage() {
    const locale = useLocale();
    const [token, setToken] = useState('');
    const [tempToken, setTempToken] = useState('');
    const [actor, setActor] = useState('recepcion');
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
    const [error, setError] = useState('');
    const [data, setData] = useState<InternalResponse | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | RequestStatus>('all');
    const [kindFilter, setKindFilter] = useState<'all' | InternalRequestItem['kind']>('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);

    const pushToast = (kind: ToastKind, title: string, message?: string) => {
        const toast: ToastMessage = {
            id: Date.now() + Math.floor(Math.random() * 1000),
            kind,
            title,
            message,
        };
        setToasts((prev) => [...prev, toast]);
        window.setTimeout(() => {
            setToasts((prev) => prev.filter((entry) => entry.id !== toast.id));
        }, 3600);
    };

    useEffect(() => {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            setToken(stored);
            setTempToken(stored);
        }
    }, []);

    const canFetch = token.trim().length > 0;

    const normalizeStatus = (status: string | null): RequestStatus => {
        if (status === 'processing' || status === 'confirmed' || status === 'cancelled' || status === 'completed') {
            return status;
        }
        return 'pending';
    };

    const filteredItems = useMemo(() => {
        const items = data?.items ?? [];
        return items.filter((item) => {
            const normalizedStatus = normalizeStatus(item.status);
            if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false;
            if (kindFilter !== 'all' && item.kind !== kindFilter) return false;

            const createdAt = new Date(item.createdAt);
            if (Number.isNaN(createdAt.getTime())) return false;

            if (dateFrom) {
                const fromStart = new Date(`${dateFrom}T00:00:00`);
                if (!Number.isNaN(fromStart.getTime()) && createdAt < fromStart) return false;
            }

            if (dateTo) {
                const toEnd = new Date(`${dateTo}T23:59:59.999`);
                if (!Number.isNaN(toEnd.getTime()) && createdAt > toEnd) return false;
            }

            return true;
        });
    }, [data, statusFilter, kindFilter, dateFrom, dateTo]);

    const summary = useMemo(
        () => ({
            total: filteredItems.length,
            tours: filteredItems.filter((item) => item.kind === 'tour').length,
            shuttles: filteredItems.filter((item) => item.kind === 'shuttle').length,
            emailFailed: filteredItems.filter((item) => item.emailStatus === 'failed').length,
        }),
        [filteredItems]
    );

    const queueSummary = useMemo(() => ({
        pending: filteredItems.filter((item) => normalizeStatus(item.status) === 'pending').length,
        processing: filteredItems.filter((item) => normalizeStatus(item.status) === 'processing').length,
        confirmed: filteredItems.filter((item) => normalizeStatus(item.status) === 'confirmed').length,
        closed: filteredItems.filter((item) => {
            const status = normalizeStatus(item.status);
            return status === 'completed' || status === 'cancelled';
        }).length,
    }), [filteredItems]);

    const operations = useMemo(() => {
        const now = new Date();
        const todayStart = toStartOfDay(now);
        const staleThreshold = new Date(now.getTime() - PROCESSING_STALE_HOURS * 60 * 60 * 1000);

        let pendingToday = 0;
        let processingStale = 0;
        let confirmedOverdue = 0;

        for (const item of filteredItems) {
            const status = normalizeStatus(item.status);
            const createdAt = new Date(item.createdAt);
            const requestDate = parseRequestDate(item);

            if (status === 'pending' && !Number.isNaN(createdAt.getTime()) && createdAt >= todayStart) {
                pendingToday += 1;
            }

            if (status === 'processing' && !Number.isNaN(createdAt.getTime()) && createdAt < staleThreshold) {
                processingStale += 1;
            }

            if (status === 'confirmed' && requestDate && requestDate < todayStart) {
                confirmedOverdue += 1;
            }
        }

        return {
            pendingToday,
            processingStale,
            confirmedOverdue,
        };
    }, [filteredItems]);

    const fetchRequests = async () => {
        if (!canFetch) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/internal/requests?limit=100', {
                headers: {
                    'x-admin-token': token.trim(),
                },
            });

            const payload = (await response.json()) as InternalResponse | { error?: string };
            if (!response.ok) {
                setData(null);
                const message = payload && typeof payload === 'object' && 'error' in payload ? payload.error || 'Error' : 'Error';
                setError(message);
                pushToast('error', 'No se pudo cargar el panel', message);
                return;
            }

            setData(payload as InternalResponse);
            setLastSyncAt(new Date().toLocaleString());
            pushToast('success', 'Panel actualizado', 'Solicitudes sincronizadas correctamente.');
        } catch (requestError) {
            setData(null);
            const message = requestError instanceof Error ? requestError.message : 'Error de red';
            setError(message);
            pushToast('error', 'Error de red', message);
        } finally {
            setLoading(false);
        }
    };

    const saveToken = () => {
        const normalized = tempToken.trim();
        setToken(normalized);
        sessionStorage.setItem(STORAGE_KEY, normalized);
        setData(null);
        setError('');
        pushToast('success', 'Token guardado', 'Ya puedes actualizar solicitudes.');
    };

    const clearToken = () => {
        setToken('');
        setTempToken('');
        setData(null);
        setError('');
        sessionStorage.removeItem(STORAGE_KEY);
        pushToast('info', 'Token limpiado', 'La sesión operativa fue cerrada.');
    };

    const getActions = (status: RequestStatus): Array<{ label: string; to: RequestStatus }> => {
        if (status === 'pending') return [{ label: 'Iniciar gestión', to: 'processing' }, { label: 'Cancelar', to: 'cancelled' }];
        if (status === 'processing') return [{ label: 'Confirmar', to: 'confirmed' }, { label: 'Cancelar', to: 'cancelled' }];
        if (status === 'confirmed') return [{ label: 'Completar', to: 'completed' }, { label: 'Cancelar', to: 'cancelled' }];
        return [];
    };

    const toggleNote = (item: InternalRequestItem) => {
        const key = `${item.kind}-${item.id}`;
        setExpandedNotes((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const updateStatus = async (item: InternalRequestItem, nextStatus: RequestStatus) => {
        if (!token.trim()) return;
        const currentStatus = normalizeStatus(item.status);
        if (currentStatus === nextStatus) return;

        const requiresNote = nextStatus === 'confirmed' || nextStatus === 'cancelled' || nextStatus === 'completed';
        let note = '';
            if (requiresNote) {
            const helper = getTransitionHelper(currentStatus, nextStatus);
            const prompted = window.prompt(`Nota obligatoria para cambiar a ${nextStatus}:\n${helper}`, '');
            if (prompted === null) return;
            note = prompted.trim();
            if (!note) {
                setError(`Debes agregar una nota para cambiar a ${nextStatus}.`);
                return;
            }
            const noteValidationError = validateTransitionNoteClient(currentStatus, nextStatus, note);
            if (noteValidationError) {
                setError(noteValidationError);
                return;
            }
        }

        setActionLoadingId(`${item.kind}-${item.id}-${nextStatus}`);
        setError('');
        try {
            const response = await fetch('/api/internal/requests/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-token': token.trim(),
                    'x-admin-actor': actor.trim() || 'recepcion',
                },
                body: JSON.stringify({
                    kind: item.kind,
                    id: item.id,
                    currentStatus,
                    nextStatus,
                    note: note || undefined,
                }),
            });

            const payload = await response.json();
            if (!response.ok) {
                if (response.status === 409) {
                    setError('Este caso fue actualizado por otro operador. Actualiza solicitudes.');
                    pushToast('error', 'Conflicto de actualización', 'Otro operador ya cambió este caso.');
                    return;
                }
                const message = payload?.error || 'No se pudo actualizar estado.';
                setError(message);
                pushToast('error', 'No se pudo actualizar el estado', message);
                return;
            }

            pushToast('success', `Estado actualizado a ${nextStatus}`, 'Cambio guardado correctamente.');
            await fetchRequests();
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Error de red';
            setError(message);
            pushToast('error', 'Error de red', message);
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="relative max-w-6xl mx-auto px-4 py-8">
            <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur-sm transition-all ${
                            toast.kind === 'success'
                                ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-100'
                                : toast.kind === 'error'
                                    ? 'border-rose-400/40 bg-rose-500/15 text-rose-100'
                                    : 'border-sky-400/40 bg-sky-500/15 text-sky-100'
                        }`}
                    >
                        <p className="font-medium">{toast.title}</p>
                        {toast.message ? <p className="text-xs opacity-90 mt-0.5">{toast.message}</p> : null}
                    </div>
                ))}
            </div>
            <h1 className="text-2xl font-bold mb-2">Panel Operativo San Pedro</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Vista interna para operar solicitudes de tours y shuttles sin salir del flujo.
            </p>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                <span>
                    {lastSyncAt ? `Última actualización: ${lastSyncAt}` : 'Sincronización pendiente'}
                </span>
            </div>

            <div className="rounded-xl border p-4 mb-6 bg-card/50">
                <label htmlFor="admin-token" className="text-sm font-medium block mb-2">
                    Token de Admin
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                    <input
                        id="admin-token"
                        type="password"
                        value={tempToken}
                        onChange={(event) => setTempToken(event.target.value)}
                        placeholder="Pega ADMIN_API_TOKEN"
                        className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                    />
                    <button
                        type="button"
                        onClick={saveToken}
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground text-sm"
                    >
                        Guardar token
                    </button>
                    <button
                        type="button"
                        onClick={clearToken}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Limpiar
                    </button>
                </div>
                <div className="mt-3">
                    <label htmlFor="admin-actor" className="text-sm font-medium block mb-2">
                        Operador
                    </label>
                    <input
                        id="admin-actor"
                        type="text"
                        value={actor}
                        onChange={(event) => setActor(event.target.value)}
                        placeholder="Nombre de quien opera"
                        className="w-full sm:max-w-xs rounded-md border bg-background px-3 py-2 text-sm"
                    />
                </div>
                <div className="mt-3 flex gap-2">
                    <button
                        type="button"
                        onClick={fetchRequests}
                        disabled={!canFetch || loading}
                        className="rounded-md border px-4 py-2 text-sm transition hover:border-cyan-400/40 hover:text-cyan-100 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Actualizar solicitudes'}
                    </button>
                    <a
                        href={`/${locale}`}
                        className="rounded-md border px-4 py-2 text-sm"
                    >
                        Volver
                    </a>
                </div>
                {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}
            </div>

            <div className="rounded-xl border p-4 mb-6 bg-card/50">
                <p className="text-sm font-medium mb-3">Filtros operativos</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <label className="text-sm">
                        <span className="block text-xs text-muted-foreground mb-1">Estado</span>
                        <select
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value as 'all' | RequestStatus)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="pending">pending</option>
                            <option value="processing">processing</option>
                            <option value="confirmed">confirmed</option>
                            <option value="completed">completed</option>
                            <option value="cancelled">cancelled</option>
                        </select>
                    </label>
                    <label className="text-sm">
                        <span className="block text-xs text-muted-foreground mb-1">Tipo</span>
                        <select
                            value={kindFilter}
                            onChange={(event) => setKindFilter(event.target.value as 'all' | InternalRequestItem['kind'])}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        >
                            <option value="all">Todos</option>
                            <option value="tour">Tours</option>
                            <option value="shuttle">Shuttles</option>
                        </select>
                    </label>
                    <label className="text-sm">
                        <span className="block text-xs text-muted-foreground mb-1">Desde</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(event) => setDateFrom(event.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </label>
                    <label className="text-sm">
                        <span className="block text-xs text-muted-foreground mb-1">Hasta</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(event) => setDateTo(event.target.value)}
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </label>
                </div>
                <div className="mt-3">
                    <button
                        type="button"
                        onClick={() => {
                            setStatusFilter('all');
                            setKindFilter('all');
                            setDateFrom('');
                            setDateTo('');
                        }}
                        className="rounded-md border px-3 py-1.5 text-xs"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-lg border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10">
                    <p className="text-xs text-muted-foreground">Solicitudes visibles</p>
                    <p className="text-xl font-semibold">{summary.total}</p>
                </div>
                <div className="rounded-lg border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10">
                    <p className="text-xs text-muted-foreground">Tours</p>
                    <p className="text-xl font-semibold">{summary.tours}</p>
                </div>
                <div className="rounded-lg border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10">
                    <p className="text-xs text-muted-foreground">Shuttles</p>
                    <p className="text-xl font-semibold">{summary.shuttles}</p>
                </div>
                <div className="rounded-lg border p-3 transition duration-200 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-md hover:shadow-cyan-500/10">
                    <p className="text-xs text-muted-foreground">Emails fallidos</p>
                    <p className="text-xl font-semibold">{summary.emailFailed}</p>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
                Estas métricas se calculan sobre la vista filtrada actual.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-lg border p-3 bg-amber-500/5">
                    <p className="text-xs text-muted-foreground">Nuevas</p>
                    <p className="text-xl font-semibold">{queueSummary.pending}</p>
                </div>
                <div className="rounded-lg border p-3 bg-sky-500/5">
                    <p className="text-xs text-muted-foreground">En gestion</p>
                    <p className="text-xl font-semibold">{queueSummary.processing}</p>
                </div>
                <div className="rounded-lg border p-3 bg-emerald-500/5">
                    <p className="text-xs text-muted-foreground">Confirmadas</p>
                    <p className="text-xl font-semibold">{queueSummary.confirmed}</p>
                </div>
                <div className="rounded-lg border p-3 bg-slate-500/5">
                    <p className="text-xs text-muted-foreground">Cerradas</p>
                    <p className="text-xl font-semibold">{queueSummary.closed}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Nuevas hoy</p>
                    <p className="text-xl font-semibold">{operations.pendingToday}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">En gestion &gt; {PROCESSING_STALE_HOURS}h</p>
                    <p className="text-xl font-semibold">{operations.processingStale}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Confirmadas vencidas</p>
                    <p className="text-xl font-semibold">{operations.confirmedOverdue}</p>
                </div>
            </div>

            <div className="space-y-4">
                {filteredItems.map((item) => {
                    const normalizedStatus = normalizeStatus(item.status);
                    const itemKey = `${item.kind}-${item.id}`;

                    return (
                        <article key={itemKey} className="rounded-2xl border bg-card/40 p-4 shadow-sm transition hover:border-cyan-400/30 hover:shadow-cyan-500/5">
                            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                                <div className="min-w-0 flex-1 space-y-4">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 space-y-3">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                                                    {getKindLabel(item.kind)}
                                                </span>
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusBadgeClasses(normalizedStatus)}`}>
                                                    {getStatusLabel(normalizedStatus)}
                                                </span>
                                                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground">
                                                    {new Date(item.createdAt).toLocaleString()}
                                                </span>
                                            </div>

                                            <div>
                                                <h2 className="text-lg font-semibold">{item.customerName}</h2>
                                                <p className="text-sm text-muted-foreground break-all">{item.customerEmail}</p>
                                            </div>
                                        </div>

                                        <aside className="w-full rounded-2xl border border-white/10 bg-background/50 p-4 lg:max-w-sm xl:w-72">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Acciones</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">Siguiente movimiento del caso</p>
                                                </div>
                                                <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${getEmailStatusClasses(item.emailStatus)}`}>
                                                    {getEmailStatusLabel(item.emailStatus)}
                                                </span>
                                            </div>

                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {getActions(normalizedStatus).map((action) => {
                                                    const actionKey = `${item.kind}-${item.id}-${action.to}`;
                                                    return (
                                                        <button
                                                            key={actionKey}
                                                            type="button"
                                                            onClick={() => updateStatus(item, action.to)}
                                                            disabled={Boolean(actionLoadingId) || !token.trim()}
                                                            className="rounded-lg border px-3 py-2 text-sm transition hover:border-cyan-400/40 hover:text-cyan-100 disabled:opacity-50"
                                                        >
                                                            {actionLoadingId === actionKey ? 'Procesando...' : action.label}
                                                        </button>
                                                    );
                                                })}
                                                {getActions(normalizedStatus).length === 0 ? (
                                                    <span className="text-sm text-muted-foreground">Sin acciones disponibles.</span>
                                                ) : null}
                                            </div>

                                            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                                                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                                    <p className="text-muted-foreground">Intentos email</p>
                                                    <p className="mt-1 font-medium text-foreground">{item.emailAttempts}</p>
                                                </div>
                                                <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                                                    <p className="text-muted-foreground">Tipo</p>
                                                    <p className="mt-1 font-medium text-foreground">{getKindLabel(item.kind)}</p>
                                                </div>
                                            </div>

                                            {item.emailLastError ? (
                                                <p className="mt-3 text-xs text-rose-400">{item.emailLastError}</p>
                                            ) : null}
                                        </aside>
                                    </div>

                                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.7fr)]">
                                        <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Solicitud</p>
                                            <p className="mt-1 text-sm font-medium">{item.details}</p>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fecha del servicio</p>
                                            <p className="mt-1 text-sm font-medium">{item.date || 'Sin fecha'}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(220px,0.8fr)]">
                                        <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Siguiente paso</p>
                                            <p className="mt-1 text-sm text-muted-foreground">{getChecklist(normalizedStatus)}</p>
                                        </div>
                                        <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Registro operativo</p>
                                            <div className="mt-2">{renderQualityBadge(normalizedStatus, item.adminNotes)}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                        {normalizedStatus === 'confirmed' ? (
                                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                Confirmado: {item.confirmedAt ? formatTimestamp(item.confirmedAt) : 'Pendiente'}
                                            </span>
                                        ) : null}
                                        {normalizedStatus === 'cancelled' ? (
                                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                Cancelado: {item.cancelledAt ? formatTimestamp(item.cancelledAt) : 'Pendiente'}
                                            </span>
                                        ) : null}
                                        {normalizedStatus === 'completed' ? (
                                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                Servicio cerrado: {item.confirmedAt ? formatTimestamp(item.confirmedAt) : 'Sin registro'}
                                            </span>
                                        ) : null}
                                        {!['confirmed', 'cancelled', 'completed'].includes(normalizedStatus) ? (
                                            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                Sin hitos finales registrados
                                            </span>
                                        ) : null}
                                    </div>

                                    {(normalizedStatus === 'confirmed' ||
                                        normalizedStatus === 'cancelled' ||
                                        normalizedStatus === 'completed') ? (
                                        <div className="rounded-xl border border-white/10 bg-background/40 p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Nota operativa</p>
                                                {item.adminNotes && item.adminNotes.length > 110 ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleNote(item)}
                                                        className="text-xs text-cyan-300 transition hover:text-cyan-200"
                                                    >
                                                        {expandedNotes[itemKey] ? 'Ver menos' : 'Ver mas'}
                                                    </button>
                                                ) : null}
                                            </div>
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {item.adminNotes
                                                    ? (expandedNotes[itemKey] ? item.adminNotes : getNotePreview(item.adminNotes))
                                                    : 'Sin nota operativa registrada.'}
                                            </p>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </article>
                    );
                })}

                {!loading && filteredItems.length === 0 ? (
                    <div className="rounded-2xl border p-8 text-center text-muted-foreground">
                        Sin solicitudes para mostrar.
                    </div>
                ) : null}
            </div>
        </div>
    );
}
