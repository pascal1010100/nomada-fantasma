// Supabase client for server-side usage
// Use this in Server Components, API Routes, and Server Actions

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
        'Missing Supabase service role key. Please check your .env.local file.'
    );
}

// Create a supabase client with service role key (bypasses RLS)
// USE WITH CAUTION: This has full access to your database
export const supabaseAdmin = createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);
