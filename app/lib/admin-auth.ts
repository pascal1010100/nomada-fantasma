import type { User } from '@supabase/supabase-js';
import logger from '@/app/lib/logger';
import { createClient } from '@/app/lib/supabase/server';
import { supabaseAdmin } from '@/app/lib/supabase/server';

export type InternalAdminRole = 'admin' | 'ops';

export type AuthorizedAdminContext = {
    user: User;
    email: string;
    actor: string;
    displayName: string;
    role: InternalAdminRole;
    source: 'directory' | 'env_fallback';
};

type AdminAccessResult =
    | { status: 'authorized'; context: AuthorizedAdminContext }
    | { status: 'unauthenticated' }
    | { status: 'forbidden'; email: string | null };

function normalizeEmail(value: string | null | undefined): string | null {
    const email = value?.trim().toLowerCase();
    return email || null;
}

function normalizeActor(value: string | null | undefined): string {
    const trimmed = value?.trim();
    return trimmed ? trimmed.slice(0, 80) : 'recepcion';
}

function getDisplayName(user: User): string | null {
    const metadata = user.user_metadata;
    if (!metadata || typeof metadata !== 'object') return null;

    const fullName = typeof metadata.full_name === 'string' ? metadata.full_name.trim() : '';
    if (fullName) return fullName;

    const name = typeof metadata.name === 'string' ? metadata.name.trim() : '';
    if (name) return name;

    return null;
}

type InternalAdminProfileRow = {
    email: string;
    role: InternalAdminRole;
    is_active: boolean;
    display_name: string | null;
};

async function getInternalAdminProfile(email: string | null): Promise<InternalAdminProfileRow | null> {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return null;

    const result = await supabaseAdmin
        .from('internal_admin_users' as never)
        .select('email, role, is_active, display_name')
        .eq('email', normalizedEmail)
        .maybeSingle<InternalAdminProfileRow>();

    if (result.error) {
        logger.warn('Unable to load internal admin profile, falling back to env allowlist', {
            email: normalizedEmail,
            error: result.error,
        });
        return null;
    }

    return result.data ?? null;
}

function getAllowedAdminEmails(): string[] {
    const raw = process.env.INTERNAL_ADMIN_EMAILS || process.env.ADMIN_EMAIL || '';
    return raw
        .split(',')
        .map((email) => normalizeEmail(email))
        .filter((email): email is string => Boolean(email));
}

function isEmailAllowed(email: string | null | undefined): email is string {
    const normalized = normalizeEmail(email);
    if (!normalized) return false;
    return getAllowedAdminEmails().includes(normalized);
}

export async function getAdminAccessResult(request?: Request): Promise<AdminAccessResult> {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error) {
        logger.warn('Unable to resolve Supabase auth user for internal access:', error);
        return { status: 'unauthenticated' };
    }

    if (!user) {
        return { status: 'unauthenticated' };
    }

    const email = normalizeEmail(user.email);
    const internalProfile = await getInternalAdminProfile(email);

    const role: InternalAdminRole | null =
        internalProfile?.is_active
            ? internalProfile.role
            : isEmailAllowed(email)
              ? 'admin'
              : null;
    const source: AuthorizedAdminContext['source'] | null =
        internalProfile?.is_active
            ? 'directory'
            : role
              ? 'env_fallback'
              : null;

    if (!role) {
        logger.warn('Blocked internal access for non-allowlisted user', { email });
        return { status: 'forbidden', email };
    }

    const displayName = internalProfile?.display_name?.trim() || getDisplayName(user) || email || 'Operador';
    const requestedActor = request?.headers.get('x-admin-actor');
    const actorFallback = email?.split('@')[0] ?? displayName;

    return {
        status: 'authorized',
        context: {
            user,
            email: email!,
            displayName,
            actor: normalizeActor(requestedActor ?? displayName ?? actorFallback),
            role,
            source: source!,
        },
    };
}

export async function getAuthorizedAdminContext(request?: Request): Promise<AuthorizedAdminContext | null> {
    const result = await getAdminAccessResult(request);
    return result.status === 'authorized' ? result.context : null;
}

export async function isAdminRequestAuthorized(request: Request): Promise<boolean> {
    const context = await getAuthorizedAdminContext(request);
    return Boolean(context);
}
