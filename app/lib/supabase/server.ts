// Supabase client for server-side usage
// Use this in Server Components, API Routes, and Server Actions

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Fallback to placeholder if URL is invalid (missing http) or keys are missing
// This allows build to pass even with invalid .env.local placeholders
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://placeholder.supabase.co';
}
if (!supabaseServiceKey) {
    supabaseServiceKey = 'placeholder-key';
}

// Create a supabase client with service role key (bypasses RLS)
// USE WITH CAUTION: This has full access to your database
// Note: Empty credentials will cause runtime errors, but allow build to pass
export const supabaseAdmin: SupabaseClient<Database, 'public'> = createClient<Database, 'public'>(
    supabaseUrl,
    supabaseServiceKey,
    {
        db: {
            schema: 'public',
        },
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
);
