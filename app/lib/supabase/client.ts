// Supabase client for client-side usage (browser)
// Use this in Client Components and browser-side code

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';
import logger from '../logger';


let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fallback for build time if credentials are missing or invalid
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    logger.warn('Invalid or missing Supabase URL, using placeholder for build');
    supabaseUrl = 'https://placeholder.supabase.co';
    supabaseAnonKey = 'placeholder-key';
}

if (!supabaseAnonKey) {
    supabaseAnonKey = 'placeholder-key';
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database, 'public'>(supabaseUrl, supabaseAnonKey, {
    db: {
        schema: 'public',
    },
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});
