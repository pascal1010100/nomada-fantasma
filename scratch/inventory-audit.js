const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function runAudit() {
    console.log('--- AUDITORÍA DE INVENTARIO: NÓMADA FANTASMA ---');
    
    // 1. Tours
    const { data: tours } = await supabase.from('tours').select('title, price, pickup_time, is_active');
    console.log('\n[TOURS]');
    tours?.forEach(t => console.log(`- ${t.title}: Q${t.price} (Pickup: ${t.pickup_time}) [${t.is_active ? 'ACTIVO' : 'INACTIVO'}]`));

    // 2. Shuttles
    const { data: shuttles } = await supabase.from('shuttle_routes').select('origin, destination, price, type');
    console.log('\n[SHUTTLE ROUTES]');
    shuttles?.forEach(s => console.log(`- ${s.origin} -> ${s.destination} (${s.type}): Q${s.price}`));

    // 3. Agencies
    const { data: agencies } = await supabase.from('agencies').select('name, email, is_active');
    console.log('\n[AGENCIES]');
    agencies?.forEach(a => console.log(`- ${a.name}: ${a.email} [${a.is_active ? 'ACTIVA' : 'INACTIVA'}]`));
}

runAudit();
