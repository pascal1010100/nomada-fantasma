import { supabaseAdmin } from '@/app/lib/supabase/server';

async function checkTable() {
    console.log('Checking "reservations" table...');
    const { data, error } = await supabaseAdmin
        .from('reservations')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching reservations:', error.message);
        if (error.message.includes('relation "public.reservations" does not exist')) {
            console.log('CONFIRMED: Table "reservations" does not exist in the current Supabase project.');
        }
    } else {
        console.log('SUCCESS: Table "reservations" exists.');
        console.log('Columns found:', Object.keys(data[0] || {}).join(', '));
    }

}

checkTable();
