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
        return <span className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-300">🟢 Confiable</span>;
    }
    if (quality === 'weak') {
        return <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-500/15 px-2 py-0.5 text-xs text-amber-300">🟡 Débil</span>;
    }
    return <span className="inline-flex items-center rounded-full border border-rose-400/30 bg-rose-500/15 px-2 py-0.5 text-xs text-rose-300">🔴 Riesgo</span>;
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

    useEffect(() => {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) {
            setToken(stored);
            setTempToken(stored);
        }
    }, []);

    const canFetch = token.trim().length > 0;

    const summary = useMemo(
        () =>
            data?.summary ?? {
                total: 0,
                tours: 0,
                shuttles: 0,
                emailFailed: 0,
            },
        [data]
    );

    const normalizeStatus = (status: string | null): RequestStatus => {
        if (status === 'processing' || status === 'confirmed' || status === 'cancelled' || status === 'completed') {
            return status;
        }
        return 'pending';
    };

    const operations = useMemo(() => {
        const items = data?.items ?? [];
        const now = new Date();
        const todayStart = toStartOfDay(now);
        const staleThreshold = new Date(now.getTime() - PROCESSING_STALE_HOURS * 60 * 60 * 1000);

        let pendingToday = 0;
        let processingStale = 0;
        let confirmedOverdue = 0;

        for (const item of items) {
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
    }, [data]);

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
                setError(payload && typeof payload === 'object' && 'error' in payload ? payload.error || 'Error' : 'Error');
                return;
            }

            setData(payload as InternalResponse);
        } catch (requestError) {
            setData(null);
            setError(requestError instanceof Error ? requestError.message : 'Error de red');
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
    };

    const clearToken = () => {
        setToken('');
        setTempToken('');
        setData(null);
        setError('');
        sessionStorage.removeItem(STORAGE_KEY);
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
                    return;
                }
                setError(payload?.error || 'No se pudo actualizar estado.');
                return;
            }

            await fetchRequests();
        } catch (requestError) {
            setError(requestError instanceof Error ? requestError.message : 'Error de red');
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-2">Panel Recepción San Pedro</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Solicitudes recientes de tours y shuttles con estado de envío de email.
            </p>

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
                        className="rounded-md border px-4 py-2 text-sm disabled:opacity-50"
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Total operativas</p>
                    <p className="text-xl font-semibold">{summary.total}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Tours operativos</p>
                    <p className="text-xl font-semibold">{summary.tours}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Shuttles operativos</p>
                    <p className="text-xl font-semibold">{summary.shuttles}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Email fallido (operativo)</p>
                    <p className="text-xl font-semibold">{summary.emailFailed}</p>
                </div>
            </div>

            <p className="text-xs text-muted-foreground mb-6">
                Estas métricas corresponden a solicitudes operativas de San Pedro (no son totales globales históricos).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Pending hoy</p>
                    <p className="text-xl font-semibold">{operations.pendingToday}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Processing &gt; {PROCESSING_STALE_HOURS}h</p>
                    <p className="text-xl font-semibold">{operations.processingStale}</p>
                </div>
                <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Confirmed vencidas</p>
                    <p className="text-xl font-semibold">{operations.confirmedOverdue}</p>
                </div>
            </div>

            <div className="rounded-xl border overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-muted/40">
                        <tr>
                            <th className="text-left px-3 py-2">Fecha</th>
                            <th className="text-left px-3 py-2">Tipo</th>
                            <th className="text-left px-3 py-2">Cliente</th>
                            <th className="text-left px-3 py-2">Detalle</th>
                            <th className="text-left px-3 py-2">Estado</th>
                            <th className="text-left px-3 py-2">Checklist</th>
                            <th className="text-left px-3 py-2">Calidad</th>
                            <th className="text-left px-3 py-2">Email</th>
                            <th className="text-left px-3 py-2">Intentos</th>
                            <th className="text-left px-3 py-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(data?.items ?? []).map((item) => (
                            <tr key={`${item.kind}-${item.id}`} className="border-t">
                                <td className="px-3 py-2 whitespace-nowrap">
                                    {new Date(item.createdAt).toLocaleString()}
                                </td>
                                <td className="px-3 py-2">{item.kind}</td>
                                <td className="px-3 py-2">
                                    <div>{item.customerName}</div>
                                    <div className="text-xs text-muted-foreground">{item.customerEmail}</div>
                                </td>
                                <td className="px-3 py-2">{item.details}</td>
                                <td className="px-3 py-2">
                                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getStatusBadgeClasses(normalizeStatus(item.status))}`}>
                                        {normalizeStatus(item.status)}
                                    </span>
                                    <div className="mt-1 text-xs text-muted-foreground space-y-1">
                                        {normalizeStatus(item.status) === 'confirmed' ? (
                                            <div>
                                                Confirmado: {item.confirmedAt ? formatTimestamp(item.confirmedAt) : (
                                                    <span className="text-amber-400">Pendiente de fecha</span>
                                                )}
                                            </div>
                                        ) : null}
                                        {normalizeStatus(item.status) === 'cancelled' ? (
                                            <div>
                                                Cancelado: {item.cancelledAt ? formatTimestamp(item.cancelledAt) : (
                                                    <span className="text-amber-400">Pendiente de fecha</span>
                                                )}
                                            </div>
                                        ) : null}
                                        {normalizeStatus(item.status) === 'completed' ? (
                                            <div>
                                                Confirmado: {item.confirmedAt ? formatTimestamp(item.confirmedAt) : (
                                                    <span className="text-amber-400">Sin fecha de confirmación</span>
                                                )}
                                            </div>
                                        ) : null}
                                        {(normalizeStatus(item.status) === 'confirmed' ||
                                            normalizeStatus(item.status) === 'cancelled' ||
                                            normalizeStatus(item.status) === 'completed') ? (
                                            <div>
                                                Nota:{' '}
                                                {item.adminNotes ? (
                                                    <>
                                                        <span>
                                                            {expandedNotes[`${item.kind}-${item.id}`]
                                                                ? item.adminNotes
                                                                : getNotePreview(item.adminNotes)}
                                                        </span>{' '}
                                                        {item.adminNotes.length > 110 ? (
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleNote(item)}
                                                                className="underline text-cyan-300 hover:text-cyan-200"
                                                            >
                                                                {expandedNotes[`${item.kind}-${item.id}`] ? 'ver menos' : 'ver más'}
                                                            </button>
                                                        ) : null}
                                                    </>
                                                ) : (
                                                    <span className="text-amber-400">Sin nota</span>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </td>
                                <td className="px-3 py-2 text-xs text-muted-foreground">
                                    {getChecklist(normalizeStatus(item.status))}
                                </td>
                                <td className="px-3 py-2">
                                    {renderQualityBadge(normalizeStatus(item.status), item.adminNotes)}
                                </td>
                                <td className="px-3 py-2">
                                    <div>{item.emailStatus ?? '-'}</div>
                                    {item.emailLastError ? (
                                        <div className="text-xs text-red-500">{item.emailLastError}</div>
                                    ) : null}
                                </td>
                                <td className="px-3 py-2">{item.emailAttempts}</td>
                                <td className="px-3 py-2">
                                    <div className="flex flex-wrap gap-2">
                                        {getActions(normalizeStatus(item.status)).map((action) => {
                                            const actionKey = `${item.kind}-${item.id}-${action.to}`;
                                            return (
                                                <button
                                                    key={actionKey}
                                                    type="button"
                                                    onClick={() => updateStatus(item, action.to)}
                                                    disabled={Boolean(actionLoadingId) || !token.trim()}
                                                    className="rounded border px-2 py-1 text-xs disabled:opacity-50"
                                                >
                                                    {actionLoadingId === actionKey ? '...' : action.label}
                                                </button>
                                            );
                                        })}
                                        {getActions(normalizeStatus(item.status)).length === 0 ? (
                                            <span className="text-xs text-muted-foreground">Sin acciones</span>
                                        ) : null}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {!loading && (data?.items ?? []).length === 0 ? (
                            <tr>
                                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={10}>
                                    Sin solicitudes para mostrar.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
