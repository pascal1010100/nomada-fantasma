'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { stripRequestMetadata } from '@/app/lib/request-metadata';
import { supabase } from '@/app/lib/supabase/client';
import TransitionModal, { ModalStatus } from './components/TransitionModal';

type InternalRequestItem = {
    id: string;
    kind: 'tour' | 'guide' | 'shuttle';
    createdAt: string;
    customerName: string;
    customerEmail: string;
    customerWhatsapp: string | null;
    date: string;
    serviceName: string;
    serviceSlug: string | null;
    requestedTime: string | null;
    partySize: number | null;
    locationLabel: string | null;
    totalPrice: number | null;
    details: string;
    status: string | null;
    emailStatus: string | null;
    emailAttempts: number;
    emailLastError: string | null;
    adminNotes: string | null;
    confirmedAt: string | null;
    cancelledAt: string | null;
    provider: {
        name: string | null;
        email: string | null;
        isActive: boolean;
    } | null;
    notifications: Array<{
        id: string;
        created_at: string;
        request_kind: 'tour' | 'guide' | 'shuttle';
        request_id: string;
        recipient_type: 'customer' | 'agency' | 'admin';
        recipient_email: string;
        channel: 'email';
        template: string;
        delivery_status: 'sent' | 'failed';
        subject: string | null;
        provider_message_id: string | null;
        error_message: string | null;
        triggered_by: string | null;
    }>;
};
type RequestStatus = 'pending' | 'processing' | 'confirmed' | 'cancelled' | 'completed';

type InternalResponse = {
    success: boolean;
    summary: {
        total: number;
        tours: number;
        guides: number;
        shuttles: number;
        emailFailed: number;
    };
    items: InternalRequestItem[];
};
type NoteQuality = 'strong' | 'weak' | 'risk';
type ToastKind = 'success' | 'error' | 'info';
type ManualEmailTemplate = 'payment_instructions' | 'not_available' | 'booking_confirmed';
type ProviderEmailTemplate = 'provider_confirmation';
type ToastMessage = {
    id: number;
    kind: ToastKind;
    title: string;
    message?: string;
};

type InternalSessionResponse = {
    success: boolean;
    user: {
        email: string;
        displayName: string;
        actor: string;
        role: 'admin' | 'ops';
        source: 'directory' | 'env_fallback';
    };
};

interface ModalState {
    isOpen: boolean;
    item: InternalRequestItem | null;
    nextStatus: RequestStatus | null;
    title: string;
    description: string;
    confirmLabel: string;
    modalStatus: ModalStatus;
    showNoteInput: boolean;
    initialNote: string;
    noteRequired: boolean;
    noteMinLength: number;
    noteHelper?: string;
}

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
    if (kind === 'tour') return 'Tour';
    if (kind === 'guide') return 'Guia';
    return 'Shuttle';
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

function getNotificationRecipientLabel(type: InternalRequestItem['notifications'][number]['recipient_type']): string {
    if (type === 'customer') return 'Cliente';
    if (type === 'agency') return 'Agencia';
    return 'Admin';
}

function getNotificationTemplateLabel(template: string): string {
    if (template === 'payment_instructions') return 'Pago';
    if (template === 'booking_confirmed') return 'Confirmación';
    if (template === 'booking_confirmed_provider') return 'Confirmación proveedor';
    if (template === 'provider_confirmation') return 'Confirmación proveedor';
    if (template === 'booking_cancelled') return 'Cancelación';
    if (template === 'not_available') return 'No disponible';
    return template;
}

function getNotificationStatusClasses(status: 'sent' | 'failed'): string {
    return status === 'sent'
        ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-200'
        : 'border-rose-400/20 bg-rose-500/10 text-rose-200';
}

function getChecklist(status: RequestStatus): string {
    if (status === 'pending') return 'Validar datos e iniciar gestion con agencia.';
    if (status === 'processing') return 'Esperando respuesta de agencia y resolver confirmacion/cancelacion.';
    if (status === 'confirmed') return 'Confirmar logistica final y cerrar al completar servicio.';
    if (status === 'cancelled') return 'Caso cancelado. Verificar motivo en nota.';
    return 'Caso finalizado. Sin acciones pendientes.';
}

function getLatestProviderNotification(item: InternalRequestItem) {
    return item.notifications.find((notification) => notification.recipient_type === 'agency') ?? null;
}

function getProviderStatusLabel(item: InternalRequestItem): string {
    const latest = getLatestProviderNotification(item);
    if (!item.provider?.email) return 'Sin correo';
    if (!item.provider.isActive) return 'Inactivo';
    if (!latest) return 'Sin envío';
    return latest.delivery_status === 'sent' ? 'Enviado' : 'Falló';
}

function getProviderStatusClasses(item: InternalRequestItem): string {
    const latest = getLatestProviderNotification(item);
    if (!item.provider?.email || !item.provider.isActive) {
        return 'border-amber-400/25 bg-amber-500/10 text-amber-200';
    }
    if (!latest) return 'border-white/10 bg-white/5 text-muted-foreground';
    return getNotificationStatusClasses(latest.delivery_status);
}

function formatTimestamp(value: string | null): string {
    if (!value) return '-';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '-';
    return parsed.toLocaleString();
}

function formatServiceDate(value: string): string {
    if (!value) return 'Sin fecha';
    const parsed = /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? new Date(`${value}T12:00:00`)
        : new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;
    return parsed.toLocaleDateString('es-GT', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function formatMoney(value: number | null): string | null {
    if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) return null;
    return `Q${value.toFixed(2)}`;
}

function getPartySizeLabel(kind: InternalRequestItem['kind'], value: number | null): string {
    if (!value || value < 1) return kind === 'shuttle' ? 'Sin pasajeros' : 'Sin viajeros';
    const label = kind === 'shuttle' ? (value === 1 ? 'pasajero' : 'pasajeros') : (value === 1 ? 'viajero' : 'viajeros');
    return `${value} ${label}`;
}

function getTimingLabel(item: InternalRequestItem): string {
    if (!item.requestedTime) return item.kind === 'shuttle' ? 'Sin hora' : 'Por confirmar';
    return item.requestedTime;
}

function shouldShowTiming(item: InternalRequestItem): boolean {
    return Boolean(item.requestedTime);
}

function getServiceWindowBadge(item: InternalRequestItem, status: RequestStatus) {
    const requestDate = parseRequestDate(item);
    if (!requestDate || status === 'cancelled' || status === 'completed') return null;

    const today = toStartOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (requestDate < today && status === 'confirmed') {
        return {
            label: 'Vencida',
            className: 'border-rose-400/30 bg-rose-500/15 text-rose-300',
        };
    }

    if (requestDate.getTime() === today.getTime()) {
        return {
            label: 'Hoy',
            className: 'border-amber-400/30 bg-amber-500/15 text-amber-300',
        };
    }

    if (requestDate.getTime() === tomorrow.getTime()) {
        return {
            label: 'Mañana',
            className: 'border-sky-400/30 bg-sky-500/15 text-sky-300',
        };
    }

    return null;
}

function getNotePreview(note: string, limit = 110): string {
    const cleanNote = getReadableAdminNote(note);
    if (cleanNote.length <= limit) return cleanNote;
    return `${cleanNote.slice(0, limit)}...`;
}

function getReadableAdminNote(note: string | null | undefined): string {
    const cleanNote = stripRequestMetadata(note);
    if (!cleanNote) return '';

    const normalizedLines = cleanNote
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) =>
            line
                .replace(/^\[[^\]]+\]\s*/, '')
                .replace(/^\([^)]+\)\s*/, '')
                .replace(/^(pending|processing|confirmed|cancelled|completed):\s*/i, '')
                .replace(/^email:booking_confirmed\s*$/i, 'Se envio la confirmacion final al cliente')
                .replace(/^email:payment_instructions\s*$/i, 'Se enviaron instrucciones de pago al cliente')
                .replace(/^email:not_available\s*$/i, 'Se notifico no disponibilidad al cliente')
                .replace(/^email:auto_booking_cancelled_customer:sent\s*$/i, 'Se notifico la cancelacion al cliente')
                .replace(/^email:auto_booking_cancelled_agency:sent\s*$/i, 'Se notifico la cancelacion a la agencia')
                .replace(/^email:auto_booking_cancelled_customer:failed\s*$/i, 'Fallo la notificacion de cancelacion al cliente')
                .replace(/^email:auto_booking_cancelled_agency:failed\s*$/i, 'Fallo la notificacion de cancelacion a la agencia')
                .replace(/^email:[^:]+:\w+\s*/i, '')
                .trim()
        )
        .filter(Boolean);

    if (normalizedLines.length === 0) return '';
    return normalizedLines[normalizedLines.length - 1];
}

function summarizeLocationLabel(value: string | null, kind: InternalRequestItem['kind']): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    if (kind === 'tour') {
        if (/por confirmar|to be confirmed/i.test(trimmed)) {
            return 'Meetup por confirmar';
        }
        if (trimmed.length > 72) {
            return `${trimmed.slice(0, 72)}...`;
        }
    }

    return trimmed;
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

function getNoteQuality(status: RequestStatus, note: string | null): NoteQuality {
    const cleanNote = stripRequestMetadata(note);
    if (!(status === 'confirmed' || status === 'cancelled' || status === 'completed')) return 'strong';
    if (!cleanNote || cleanNote.trim().length < 18) return 'risk';

    const normalized = cleanNote.trim();
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
    const params = useParams<{ locale?: string | string[] }>();
    const rawLocale = params?.locale;
    const locale = Array.isArray(rawLocale) ? rawLocale[0] : rawLocale || 'es';
    const router = useRouter();
    const [actor, setActor] = useState('recepcion');
    const [operatorEmail, setOperatorEmail] = useState('');
    const [operatorName, setOperatorName] = useState('');
    const [operatorRole, setOperatorRole] = useState<'admin' | 'ops' | null>(null);
    const [accessSource, setAccessSource] = useState<'directory' | 'env_fallback' | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [loading, setLoading] = useState(false);
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [emailActionLoadingId, setEmailActionLoadingId] = useState<string | null>(null);

    // Modern Modal State
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        item: null,
        nextStatus: null,
        title: '',
        description: '',
        confirmLabel: '',
        modalStatus: 'processing',
        showNoteInput: true,
        initialNote: '',
        noteRequired: false,
        noteMinLength: 0,
    });
    const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
    const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});
    const [error, setError] = useState('');
    const [data, setData] = useState<InternalResponse | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
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
        let active = true;

        const loadUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!active) return;

            if (!user?.email) {
                router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}`);
                return;
            }

            try {
                const sessionResponse = await fetch('/api/internal/session');
                const payload = (await sessionResponse.json()) as InternalSessionResponse | { error?: string };

                if (!active) return;

                if (!sessionResponse.ok || !('success' in payload)) {
                    await supabase.auth.signOut();
                    const errorCode = sessionResponse.status === 403 ? 'not-allowed' : 'auth-required';
                    router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=${errorCode}`);
                    return;
                }

                setOperatorEmail(payload.user.email);
                setOperatorName(payload.user.displayName);
                setOperatorRole(payload.user.role);
                setAccessSource(payload.user.source);
                setActor(payload.user.actor);
                setAuthLoading(false);
            } catch {
                if (!active) return;
                router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=auth-required`);
            }
        };

        void loadUser();

        return () => {
            active = false;
        };
    }, [locale, router]);

    useEffect(() => {
        if (!authLoading) {
            void fetchRequests();
        }
    }, [authLoading]);

    const canFetch = !authLoading;

    const normalizeStatus = (status: string | null): RequestStatus => {
        if (status === 'processing' || status === 'confirmed' || status === 'cancelled' || status === 'completed') {
            return status;
        }
        return 'pending';
    };

    const filteredItems = useMemo(() => {
        const items = data?.items ?? [];
        const normalizedQuery = searchQuery.trim().toLowerCase();
        return items.filter((item) => {
            const normalizedStatus = normalizeStatus(item.status);
            if (statusFilter !== 'all' && normalizedStatus !== statusFilter) return false;
            if (kindFilter !== 'all' && item.kind !== kindFilter) return false;

            if (normalizedQuery) {
                const searchableText = [
                    item.id,
                    item.serviceName,
                    item.customerName,
                    item.customerEmail,
                    item.customerWhatsapp,
                    item.locationLabel,
                    item.details,
                    item.adminNotes,
                    getKindLabel(item.kind),
                    getStatusLabel(normalizedStatus),
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();

                if (!searchableText.includes(normalizedQuery)) return false;
            }

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
    }, [data, searchQuery, statusFilter, kindFilter, dateFrom, dateTo]);

    const summary = useMemo(
        () => ({
            total: filteredItems.length,
            tours: filteredItems.filter((item) => item.kind === 'tour').length,
            guides: filteredItems.filter((item) => item.kind === 'guide').length,
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
                },
            });

            const payload = (await response.json()) as InternalResponse | { error?: string };
            if (!response.ok) {
                if (response.status === 401) {
                    await supabase.auth.signOut();
                    router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=auth-required`);
                    return;
                }
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

    const signOutOperator = async () => {
        await supabase.auth.signOut();
        setData(null);
        setError('');
        pushToast('info', 'Sesión cerrada', 'La sesión operativa fue cerrada.');
        router.replace(`/${locale}/internal/login`);
    };

    const getActions = (status: RequestStatus): Array<{ label: string; to: RequestStatus }> => {
        if (status === 'pending') return [{ label: 'Iniciar gestión', to: 'processing' }, { label: 'Cancelar', to: 'cancelled' }];
        if (status === 'processing') return [{ label: 'Confirmar', to: 'confirmed' }, { label: 'Cancelar', to: 'cancelled' }];
        if (status === 'confirmed') return [{ label: 'Completar', to: 'completed' }, { label: 'Cancelar', to: 'cancelled' }];
        return [];
    };

    const getEmailActions = (item: InternalRequestItem, status: RequestStatus): Array<{ label: string; template: ManualEmailTemplate }> => {
        if (status === 'processing') {
            return [
                { label: 'Enviar métodos de pago', template: 'payment_instructions' },
                { label: 'Enviar no disponibilidad', template: 'not_available' },
            ];
        }
        if (status === 'confirmed') {
            return [{ label: 'Enviar confirmación final', template: 'booking_confirmed' }];
        }
        return [];
    };

    const toggleNote = (item: InternalRequestItem) => {
        const key = `${item.kind}-${item.id}`;
        setExpandedNotes((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const toggleCard = (item: InternalRequestItem) => {
        const key = `${item.kind}-${item.id}`;
        setExpandedCards((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const updateStatus = async (item: InternalRequestItem, nextStatus: RequestStatus) => {
        const currentStatus = normalizeStatus(item.status);
        if (currentStatus === nextStatus) return;

        // NEW: Open modern modal instead of using browser native methods
        if (nextStatus === 'confirmed') {
            setModal({
                isOpen: true,
                item,
                nextStatus,
                title: 'Confirmar Pago',
                description: `Estás a punto de confirmar el pago de ${item.customerName}. Esto notificará al proveedor y enviará automáticamente el voucher de reserva al cliente.`,
                confirmLabel: 'Finalizar y Notificar',
                modalStatus: 'confirmed',
                showNoteInput: true,
                initialNote: 'Pago confirmado (Voucher enviado automáticamente)',
                noteRequired: false,
                noteMinLength: 0,
            });
            return;
        }

        if (nextStatus === 'completed') {
            setModal({
                isOpen: true,
                item,
                nextStatus,
                title: 'Servicio Completado',
                description: 'Confirma que el servicio se realizó con éxito para cerrar este caso operativamente.',
                confirmLabel: 'Cerrar Caso',
                modalStatus: 'completed',
                showNoteInput: true,
                initialNote: 'Servicio ejecutado y finalizado correctamente',
                noteRequired: false,
                noteMinLength: 0,
            });
            return;
        }

        if (nextStatus === 'cancelled') {
            const helper = getTransitionHelper(currentStatus, nextStatus);
            setModal({
                isOpen: true,
                item,
                nextStatus,
                title: 'Cancelar Solicitud',
                description: helper,
                confirmLabel: 'Confirmar Cancelación',
                modalStatus: 'cancelled',
                showNoteInput: true,
                initialNote: '',
                noteRequired: true,
                noteMinLength: 5,
                noteHelper: 'Explica el motivo de la cancelación para dejar rastro operativo claro.',
            });
            return;
        }

        // For other transitions (e.g. processing)
        executeStatusUpdate(item, nextStatus, '');
    };

    const executeStatusUpdate = async (item: InternalRequestItem, nextStatus: RequestStatus, note: string) => {
        const currentStatus = normalizeStatus(item.status);
        
        // Final client-side validation for cancellations
        if (nextStatus === 'cancelled' && note.trim().length < 5) {
            pushToast('error', 'Nota requerida', 'Por favor escribe el motivo de la cancelación.');
            return;
        }

        setActionLoadingId(`${item.kind}-${item.id}-${nextStatus}`);
        setError('');
        try {
            const response = await fetch('/api/internal/requests/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
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
                if (response.status === 401) {
                    await supabase.auth.signOut();
                    router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=auth-required`);
                    return;
                }
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
            if (typeof payload?.warning === 'string' && payload.warning.trim()) {
                pushToast('info', 'Notificación pendiente de revisión', payload.warning);
            }
            
            // Elite Automation: Send voucher if confirmed
            if (nextStatus === 'confirmed') {
                try {
                    pushToast('info', 'Generando Voucher...', 'Enviando confirmación al cliente.');
                    await sendCustomerEmail(item, 'booking_confirmed');
                } catch (emailErr) {
                    console.error('Failed to auto-send voucher:', emailErr);
                    pushToast('error', 'Error enviando Voucher', 'El estado se cambió pero el correo falló.');
                }
            }

            await fetchRequests();
            setModal(prev => ({ ...prev, isOpen: false }));
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Error de red';
            setError(message);
            pushToast('error', 'Error de red', message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const sendCustomerEmail = async (item: InternalRequestItem, template: ManualEmailTemplate) => {
        const loadingKey = `${item.kind}-${item.id}-${template}`;
        setEmailActionLoadingId(loadingKey);
        setError('');

        try {
            const response = await fetch('/api/internal/requests/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-actor': actor.trim() || 'recepcion',
                },
                body: JSON.stringify({
                    kind: item.kind,
                    id: item.id,
                    template,
                }),
            });

            const payload = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    await supabase.auth.signOut();
                    router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=auth-required`);
                    return;
                }
                const message = payload?.error || 'No se pudo enviar el correo.';
                setError(message);
                pushToast('error', 'No se pudo enviar el correo', message);
                return;
            }

            const successTitle =
                template === 'payment_instructions'
                    ? 'Correo de pago enviado'
                    : template === 'not_available'
                      ? 'Correo de no disponibilidad enviado'
                      : 'Correo de confirmación enviado';

            pushToast('success', successTitle, item.customerEmail);
            await fetchRequests();
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Error de red';
            setError(message);
            pushToast('error', 'Error de red', message);
        } finally {
            setEmailActionLoadingId(null);
        }
    };

    const sendProviderEmail = async (item: InternalRequestItem, template: ProviderEmailTemplate) => {
        const loadingKey = `${item.kind}-${item.id}-${template}`;
        setEmailActionLoadingId(loadingKey);
        setError('');

        try {
            const response = await fetch('/api/internal/requests/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-admin-actor': actor.trim() || 'recepcion',
                },
                body: JSON.stringify({
                    kind: item.kind,
                    id: item.id,
                    template,
                }),
            });

            const payload = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    await supabase.auth.signOut();
                    router.replace(`/${locale}/internal/login?next=${encodeURIComponent(`/${locale}/internal/recepcion`)}&error=auth-required`);
                    return;
                }
                const message = payload?.error || 'No se pudo enviar el correo al proveedor.';
                setError(message);
                pushToast('error', 'No se pudo notificar al proveedor', message);
                return;
            }

            pushToast('success', 'Proveedor notificado', payload?.recipientEmail || item.provider?.email || 'Correo enviado');
            await fetchRequests();
        } catch (requestError) {
            const message = requestError instanceof Error ? requestError.message : 'Error de red';
            setError(message);
            pushToast('error', 'Error de red', message);
        } finally {
            setEmailActionLoadingId(null);
        }
    };

    return (
        <div className="relative mx-auto max-w-7xl px-4 py-8">
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
                Vista interna para operar solicitudes de tours, guias y shuttles sin salir del flujo.
            </p>
            <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900/88 via-slate-900/72 to-cyan-950/30 shadow-[0_16px_50px_rgba(8,15,30,0.28)]">
                <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                                <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
                                <span>{lastSyncAt ? `Actualizado ${lastSyncAt}` : 'Sincronización pendiente'}</span>
                            </span>
                            {!authLoading ? (
                                <>
                                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                                        Opera: {operatorName || operatorEmail}
                                    </span>
                                    {operatorRole ? (
                                        <span className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">
                                            {operatorRole === 'admin' ? 'Admin' : 'Ops'}
                                        </span>
                                    ) : null}
                                    {accessSource ? (
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs ${
                                                accessSource === 'directory'
                                                    ? 'border border-emerald-400/20 bg-emerald-500/10 text-emerald-100'
                                                    : 'border border-amber-400/20 bg-amber-500/10 text-amber-100'
                                            }`}
                                        >
                                            {accessSource === 'directory' ? 'Directorio interno' : 'Allowlist temporal'}
                                        </span>
                                    ) : null}
                                </>
                            ) : null}
                        </div>

                        <div className="mt-3 flex flex-col gap-3 xl:flex-row xl:items-center">
                            <label htmlFor="admin-actor" className="flex items-center gap-2 text-sm text-slate-300">
                                <span className="text-xs uppercase tracking-wide text-slate-400">Operador visible</span>
                                <input
                                    id="admin-actor"
                                    type="text"
                                    value={actor}
                                    onChange={(event) => setActor(event.target.value)}
                                    placeholder="Nombre de quien opera"
                                    className="w-full min-w-0 rounded-xl border border-white/10 bg-slate-950/35 px-3 py-2 text-sm text-white shadow-inner sm:w-72"
                                />
                            </label>
                            {!authLoading ? (
                                <span className="truncate text-xs text-slate-400">{operatorEmail}</span>
                            ) : null}
                        </div>

                        {accessSource === 'env_fallback' ? (
                            <p className="mt-3 text-xs text-amber-200">
                                Este operador todavía depende del fallback por email. Conviene darlo de alta en `internal_admin_users`.
                            </p>
                        ) : null}
                        {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                        <button
                            type="button"
                            onClick={fetchRequests}
                            disabled={!canFetch || loading}
                            className="rounded-xl border border-cyan-400/30 bg-cyan-500/15 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-300/50 hover:bg-cyan-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Cargando...' : 'Actualizar solicitudes'}
                        </button>
                        <button
                            type="button"
                            onClick={signOutOperator}
                            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:text-white"
                        >
                            Cerrar sesión
                        </button>
                        <a
                            href={`/${locale}`}
                            className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm text-slate-400 transition hover:border-white/20 hover:text-slate-200"
                        >
                            Volver
                        </a>
                    </div>
                </div>
            </section>

            <section className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/55 shadow-[0_14px_42px_rgba(8,15,30,0.28)]">
                <div className="border-b border-white/10 px-4 py-3 sm:px-5">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.16em] text-cyan-200/75">Operación</p>
                            <h2 className="mt-0.5 text-base font-semibold text-white">Solicitudes y filtros</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-cyan-400/15 bg-cyan-500/10 px-3 py-1.5 text-cyan-100">
                                {summary.total} visibles
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
                                Tours {summary.tours}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
                                Guias {summary.guides}
                            </span>
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-slate-300">
                                Shuttles {summary.shuttles}
                            </span>
                        </div>
                    </div>

                    <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_160px_160px_170px_170px_auto] lg:items-end">
                        <label className="text-sm">
                            <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-400">Buscar</span>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Cliente, email, servicio o ID"
                                className="w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-white shadow-inner placeholder:text-slate-500"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-400">Estado</span>
                            <select
                                value={statusFilter}
                                onChange={(event) => setStatusFilter(event.target.value as 'all' | RequestStatus)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-white shadow-inner"
                            >
                                <option value="all">Todos</option>
                                <option value="pending">Nuevas</option>
                                <option value="processing">En gestión</option>
                                <option value="confirmed">Confirmadas</option>
                                <option value="completed">Completadas</option>
                                <option value="cancelled">Canceladas</option>
                            </select>
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-400">Tipo</span>
                            <select
                                value={kindFilter}
                                onChange={(event) => setKindFilter(event.target.value as 'all' | InternalRequestItem['kind'])}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-white shadow-inner"
                            >
                                <option value="all">Todos</option>
                                <option value="tour">Tours</option>
                                <option value="guide">Guias</option>
                                <option value="shuttle">Shuttles</option>
                            </select>
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-400">Desde</span>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(event) => setDateFrom(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-white shadow-inner"
                            />
                        </label>
                        <label className="text-sm">
                            <span className="mb-1 block text-[11px] uppercase tracking-wide text-slate-400">Hasta</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(event) => setDateTo(event.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-slate-950/45 px-3 py-2 text-sm text-white shadow-inner"
                            />
                        </label>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                setStatusFilter('all');
                                setKindFilter('all');
                                setDateFrom('');
                                setDateTo('');
                            }}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:border-cyan-400/30 hover:text-cyan-100"
                        >
                            Limpiar
                        </button>
                    </div>
                </div>

                <div className="grid gap-2 px-4 py-3 sm:px-5 sm:grid-cols-2 xl:grid-cols-5">
                    <div className="rounded-xl border border-amber-400/15 bg-amber-500/8 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-amber-200/80">Nuevas</p>
                            <p className="text-xl font-semibold text-white">{queueSummary.pending}</p>
                        </div>
                        <p className="mt-1 text-[11px] text-amber-100/70">Pendientes por iniciar</p>
                    </div>
                    <div className="rounded-xl border border-sky-400/15 bg-sky-500/8 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-sky-200/80">En gestión</p>
                            <p className="text-xl font-semibold text-white">{queueSummary.processing}</p>
                        </div>
                        <p className="mt-1 text-[11px] text-sky-100/70">{operations.processingStale} con más de {PROCESSING_STALE_HOURS}h</p>
                    </div>
                    <div className="rounded-xl border border-emerald-400/15 bg-emerald-500/8 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-emerald-200/80">Confirmadas</p>
                            <p className="text-xl font-semibold text-white">{queueSummary.confirmed}</p>
                        </div>
                        <p className="mt-1 text-[11px] text-emerald-100/70">{operations.pendingToday} nuevas hoy</p>
                    </div>
                    <div className="rounded-xl border border-rose-400/15 bg-rose-500/8 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-rose-200/85">Urgentes</p>
                            <p className="text-xl font-semibold text-white">{operations.confirmedOverdue}</p>
                        </div>
                        <p className="mt-1 text-[11px] text-rose-100/70">Confirmadas vencidas</p>
                    </div>
                    <div className="rounded-xl border border-fuchsia-400/15 bg-fuchsia-500/8 px-3 py-2.5">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-wide text-fuchsia-200/85">Email</p>
                            <p className="text-xl font-semibold text-white">{summary.emailFailed}</p>
                        </div>
                        <p className="mt-1 text-[11px] text-fuchsia-100/70">Fallidos</p>
                    </div>
                </div>
            </section>

            <div className="space-y-4">
                {filteredItems.map((item) => {
                    const normalizedStatus = normalizeStatus(item.status);
                    const itemKey = `${item.kind}-${item.id}`;
                    const isExpanded = Boolean(expandedCards[itemKey]);
                    const notifications = item.notifications ?? [];
                    const serviceWindowBadge = getServiceWindowBadge(item, normalizedStatus);
                    const priceLabel = formatMoney(item.totalPrice);
                    const timingLabel = getTimingLabel(item);
                    const showTiming = shouldShowTiming(item);
                    const locationSummary = summarizeLocationLabel(item.locationLabel, item.kind);
                    const primaryActions = getActions(normalizedStatus);
                    const manualEmailActions = getEmailActions(item, normalizedStatus);
                    const providerNotification = getLatestProviderNotification(item);
                    const providerEmailKey = `${item.kind}-${item.id}-provider_confirmation`;
                    const canSendProviderConfirmation =
                        (item.kind === 'tour' || item.kind === 'guide') &&
                        Boolean(item.provider?.email) &&
                        item.provider?.isActive !== false &&
                        (normalizedStatus === 'confirmed' || normalizedStatus === 'completed');

                    return (
                        <article key={itemKey} className="overflow-hidden rounded-2xl border border-white/10 bg-card/35 shadow-sm transition hover:border-cyan-400/30 hover:shadow-cyan-500/5">
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-5 p-4 sm:p-5 xl:grid-cols-[minmax(0,1fr)_390px] xl:items-start">
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-medium text-cyan-100">
                                                {getKindLabel(item.kind)}
                                            </span>
                                            <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${getStatusBadgeClasses(normalizedStatus)}`}>
                                                {getStatusLabel(normalizedStatus)}
                                            </span>
                                            {serviceWindowBadge ? (
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium ${serviceWindowBadge.className}`}>
                                                    {serviceWindowBadge.label}
                                                </span>
                                            ) : null}
                                            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] ${getEmailStatusClasses(item.emailStatus)}`}>
                                                {getEmailStatusLabel(item.emailStatus)}
                                            </span>
                                        </div>

                                        <div className="mt-3">
                                            <h2 className="text-xl font-semibold leading-tight text-foreground">
                                                {item.serviceName}
                                            </h2>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                                                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                                                    ID #{item.id.slice(0, 8)}
                                                </span>
                                                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                                                    {formatServiceDate(item.date)}
                                                </span>
                                                {item.partySize ? (
                                                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                                                        {getPartySizeLabel(item.kind, item.partySize)}
                                                    </span>
                                                ) : null}
                                                {showTiming ? (
                                                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
                                                        {timingLabel}
                                                    </span>
                                                ) : null}
                                                {priceLabel ? (
                                                    <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-emerald-200">
                                                        {priceLabel}
                                                    </span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                                            <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Cliente</p>
                                                <p className="mt-1 text-sm font-medium">{item.customerName}</p>
                                            </div>
                                            <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Contacto</p>
                                                <p className="mt-1 truncate text-sm text-muted-foreground">{item.customerEmail}</p>
                                                {item.customerWhatsapp ? (
                                                    <p className="mt-0.5 text-xs text-cyan-200">{item.customerWhatsapp}</p>
                                                ) : null}
                                            </div>
                                            {locationSummary ? (
                                                <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5 sm:col-span-2">
                                                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                                                        {item.kind === 'shuttle' ? 'Recogida' : 'Encuentro'}
                                                    </p>
                                                    <p className="mt-1 text-sm text-foreground/90">{locationSummary}</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>

                                    <aside className="space-y-3 rounded-2xl border border-white/10 bg-background/35 p-3.5">
                                        <div className="flex flex-wrap gap-2">
                                            {primaryActions.map((action) => {
                                                const actionKey = `${item.kind}-${item.id}-${action.to}`;
                                                return (
                                                    <button
                                                        key={actionKey}
                                                        type="button"
                                                        onClick={() => updateStatus(item, action.to)}
                                                        disabled={Boolean(actionLoadingId) || authLoading}
                                                        className="rounded-lg border px-3 py-1.5 text-sm transition hover:border-cyan-400/40 hover:text-cyan-100 disabled:opacity-50"
                                                    >
                                                        {actionLoadingId === actionKey ? 'Procesando...' : action.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => toggleCard(item)}
                                            className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-left text-sm text-muted-foreground transition hover:border-cyan-400/30 hover:text-cyan-100"
                                        >
                                            {isExpanded ? 'Ocultar detalle' : 'Ver detalle'}
                                        </button>

                                        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Correos al usuario</p>
                                                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getEmailStatusClasses(item.emailStatus)}`}>
                                                    {getEmailStatusLabel(item.emailStatus)}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {manualEmailActions.map((action) => {
                                                    const emailKey = `${item.kind}-${item.id}-${action.template}`;
                                                    return (
                                                        <button
                                                            key={emailKey}
                                                            type="button"
                                                            onClick={() => sendCustomerEmail(item, action.template)}
                                                            disabled={Boolean(emailActionLoadingId) || authLoading}
                                                            className="rounded-xl border border-emerald-400/20 bg-emerald-500/5 px-3 py-2 text-sm transition hover:border-emerald-400/40 hover:text-emerald-100 disabled:opacity-50"
                                                        >
                                                            {emailActionLoadingId === emailKey ? 'Enviando...' : action.label}
                                                        </button>
                                                    );
                                                })}
                                                {manualEmailActions.length === 0 ? (
                                                    <span className="text-sm text-muted-foreground">Sin correos manuales para este estado.</span>
                                                ) : null}
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-cyan-400/10 bg-cyan-500/[0.04] p-3">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Proveedor</p>
                                                <span className={`rounded-full border px-2 py-0.5 text-[11px] ${getProviderStatusClasses(item)}`}>
                                                    {getProviderStatusLabel(item)}
                                                </span>
                                            </div>
                                            <div className="mt-2 min-w-0">
                                                <p className="truncate text-sm font-medium text-foreground">
                                                    {item.provider?.name || 'Sin proveedor asignado'}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                                    {item.provider?.email || 'Falta correo operativo'}
                                                </p>
                                                {providerNotification ? (
                                                    <p className="mt-1 text-[11px] text-muted-foreground">
                                                        Último envío: {getNotificationTemplateLabel(providerNotification.template)}
                                                    </p>
                                                ) : null}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => sendProviderEmail(item, 'provider_confirmation')}
                                                disabled={!canSendProviderConfirmation || Boolean(emailActionLoadingId) || authLoading}
                                                className="mt-3 w-full rounded-xl border border-cyan-400/20 bg-cyan-500/5 px-3 py-2 text-left text-sm text-cyan-100 transition hover:border-cyan-400/40 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {emailActionLoadingId === providerEmailKey
                                                    ? 'Enviando...'
                                                    : canSendProviderConfirmation
                                                        ? 'Reenviar confirmación al proveedor'
                                                        : normalizedStatus === 'confirmed' || normalizedStatus === 'completed'
                                                            ? 'Proveedor sin correo disponible'
                                                            : 'Se notificará al confirmar pago'}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 text-xs">
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
                                            <p className="text-xs text-rose-400">{item.emailLastError}</p>
                                        ) : null}
                                    </aside>
                                </div>

                                {isExpanded ? (
                                    <div className="space-y-4 border-t border-white/10 p-4 pt-4 sm:p-5 sm:pt-4">
                                        <div className="min-w-0 space-y-4">
                                                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_280px]">
                                                    <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5">
                                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Siguiente paso</p>
                                                        <p className="mt-1 text-sm text-muted-foreground">{getChecklist(normalizedStatus)}</p>
                                                    </div>
                                                    <div className="rounded-xl border border-white/10 bg-background/40 px-3 py-2.5">
                                                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Registro operativo</p>
                                                        <div className="mt-2">{renderQualityBadge(normalizedStatus, item.adminNotes)}</div>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                                        Creada: {formatTimestamp(item.createdAt)}
                                                    </span>
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
                                                                ? (expandedNotes[itemKey] ? getReadableAdminNote(item.adminNotes) || 'Sin nota operativa registrada.' : getNotePreview(item.adminNotes))
                                                                : 'Sin nota operativa relevante.'}
                                                        </p>
                                                    </div>
                                                ) : null}
                                        </div>

                                        <section className="rounded-2xl border border-white/10 bg-background/40 p-3.5">
                                            <div className="flex items-center justify-between gap-3">
                                                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Notificaciones</p>
                                                <span className="text-[11px] text-muted-foreground">
                                                    {notifications.length} registro{notifications.length === 1 ? '' : 's'}
                                                </span>
                                            </div>
                                            <div className="mt-3 grid gap-2 lg:grid-cols-2 2xl:grid-cols-3">
                                                {notifications.length > 0 ? notifications.slice(0, 6).map((notification) => (
                                                    <div
                                                        key={notification.id}
                                                        className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs"
                                                    >
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`rounded-full border px-2 py-0.5 ${getNotificationStatusClasses(notification.delivery_status)}`}>
                                                                {notification.delivery_status === 'sent' ? 'Enviado' : 'Falló'}
                                                            </span>
                                                            <span className="rounded-full border border-white/10 bg-black/10 px-2 py-0.5 text-muted-foreground">
                                                                {getNotificationRecipientLabel(notification.recipient_type)}
                                                            </span>
                                                            <span className="text-foreground/90">{getNotificationTemplateLabel(notification.template)}</span>
                                                        </div>
                                                        <p className="mt-1 break-all text-muted-foreground">{notification.recipient_email}</p>
                                                    </div>
                                                )) : (
                                                    <span className="text-sm text-muted-foreground">Aún no hay trazabilidad registrada.</span>
                                                )}
                                            </div>
                                        </section>
                                    </div>
                                ) : null}
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

            <TransitionModal
                isOpen={modal.isOpen}
                onClose={() => setModal(prev => ({ ...prev, isOpen: false }))}
                onConfirm={(note) => {
                    if (modal.item && modal.nextStatus) {
                        executeStatusUpdate(modal.item, modal.nextStatus, note);
                    }
                }}
                title={modal.title}
                description={modal.description}
                confirmLabel={modal.confirmLabel}
                status={modal.modalStatus}
                showNoteInput={modal.showNoteInput}
                initialNote={modal.initialNote}
                isLoading={!!actionLoadingId}
                noteRequired={modal.noteRequired}
                noteMinLength={modal.noteMinLength}
                noteHelper={modal.noteHelper}
            />
        </div>
    );
}
