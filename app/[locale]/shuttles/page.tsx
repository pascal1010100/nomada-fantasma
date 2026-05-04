import ShuttlesClient from './ShuttlesClient';
import { createClient } from '@/app/lib/supabase/server';
import { ShuttleRoute } from '@/types/shuttle';

export const metadata = {
    title: 'Transporte y Shuttles - Nómada Fantasma',
    description: 'Reserva transporte compartido y privado entre los mejores destinos de Guatemala.',
};

export default async function ShuttlesPage() {
    const supabase = await createClient();
    let initialShuttles: ShuttleRoute[] = [];
    let dataSource: 'live' | 'mock' | 'empty' = 'live';
    let fetchWarning: string | null = null;

    try {
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
    } catch (e) {
        console.error("Error SSR fetching shuttles:", e);
        fetchWarning = 'db_error';
    }

    // Keep mocks only as an explicit development safety net.
    if (initialShuttles.length === 0) {
        if (process.env.NODE_ENV !== 'production') {
            const { shuttles } = await import('./mocks/shuttles');
            initialShuttles = shuttles;
            dataSource = 'mock';
        } else {
            dataSource = 'empty';
        }
    }

    return (
        <ShuttlesClient
            initialShuttles={initialShuttles}
            dataSource={dataSource}
            fetchWarning={fetchWarning}
        />
    );
}
