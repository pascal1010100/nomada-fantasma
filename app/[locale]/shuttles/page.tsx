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

    try {
        const { data, error } = await supabase
            .from('shuttle_routes')
            .select('*')
            .eq('origin', 'San Pedro La Laguna')
            .order('origin', { ascending: true });

        if (!error && data) {
            initialShuttles = data as ShuttleRoute[];
        }
    } catch (e) {
        console.error("Error SSR fetching shuttles:", e);
    }
    
    // Fallback to mocks if DB is empty or fails
    if (initialShuttles.length === 0) {
        const { shuttles } = await import('./mocks/shuttles');
        initialShuttles = shuttles.filter((shuttle) => shuttle.origin === 'San Pedro La Laguna');
    }

    return <ShuttlesClient initialShuttles={initialShuttles} />;
}
