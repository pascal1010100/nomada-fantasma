
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Fix path to look for .env.local in the current working directory (root)
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPueblos() {
    const { data, error } = await supabase.from('pueblos').select('slug, title');
    if (error) {
        console.error('Error fetching pueblos:', error);
    } else {
        console.log('Pueblos found in DB:', data);
    }
}

checkPueblos();
