import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

console.log('Testing connection to:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        // 1. Test basic select to verify connection
        console.log('1. Testing Select...');
        const { data: selectData, error: selectError } = await supabase
            .from('reservations')
            .select('count')
            .limit(1);

        if (selectError) {
            console.error('Select failed:', selectError);
        } else {
            console.log('Select success. Data:', selectData);
        }

        // 2. Test Insertion
        console.log('\n2. Testing Insert...');
        const testReservation = {
            full_name: 'Test Debugger',
            email: 'debugger@test.com',
            whatsapp: '1234567890',
            date: new Date().toISOString().split('T')[0],
            number_of_people: 1,
            status: 'new_request',
            // Leaving tour_id null as per fix
            tour_name: 'Debug Tour',
            reservation_type: 'tour'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('reservations')
            .insert(testReservation)
            .select()
            .single();

        if (insertError) {
            console.error('Insert failed:', insertError);
            console.error('Details:', JSON.stringify(insertError, null, 2));
        } else {
            console.log('Insert success! ID:', insertData.id);

            // Clean up
            console.log('\n3. Cleaning up test record...');
            await supabase.from('reservations').delete().eq('id', insertData.id);
            console.log('Cleanup done.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
