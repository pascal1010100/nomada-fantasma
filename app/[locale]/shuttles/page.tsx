import ShuttlesClient from './ShuttlesClient';
import { createClient } from '@supabase/supabase-js';
import { ShuttleRoute } from '@/types/shuttle';
import type { Database } from '@/types/database.types';

export const metadata = {
    title: 'Transporte y Shuttles - Nómada Fantasma',
    description: 'Reserva transporte compartido y privado entre los mejores destinos de Guatemala.',
};

function getSupabaseConfig() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
    const isConfigured = url.startsWith('http') && !url.includes('placeholder') && key.length > 0 && key !== 'placeholder-key';

    return isConfigured ? { url, key } : null;
}

export default async function ShuttlesPage() {
    let initialShuttles: ShuttleRoute[] = [];

    const supabaseConfig = getSupabaseConfig();

    if (supabaseConfig) {
        try {
            const supabase = createClient<Database>(supabaseConfig.url, supabaseConfig.key, {
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false,
                },
            });
            const { data, error } = await supabase
                .from('shuttle_routes')
                .select('*')
                .order('origin', { ascending: true })
                .order('destination', { ascending: true });

            if (error) {
                throw error;
            }

            if (data) {
                initialShuttles = data as ShuttleRoute[];
            }
        } catch {
            // Development can continue with the local fallback catalog below.
        }
    }

    // Keep mocks only as an explicit development safety net.
    if (initialShuttles.length === 0) {
        if (process.env.NODE_ENV !== 'production') {
            const { shuttles } = await import('./mocks/shuttles');
            initialShuttles = shuttles;
        }
    }

    return (
        <ShuttlesClient
            initialShuttles={initialShuttles}
        />
    );
}
