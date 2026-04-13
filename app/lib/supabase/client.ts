import { createBrowserClient } from '@supabase/ssr';
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

// Create a single browser client for interacting with your database at the edge/client
export const supabase = createBrowserClient<Database>(
    supabaseUrl, 
    supabaseAnonKey
);
