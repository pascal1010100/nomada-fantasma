import { createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
    supabaseUrl = 'https://placeholder.supabase.co';
}
if (!supabaseAnonKey) {
    supabaseAnonKey = 'placeholder-key';
}
if (!supabaseServiceKey) {
    supabaseServiceKey = 'placeholder-key';
}

/**
 * Creates an authenticated Supabase client for Server Components and Server Actions.
 * Safely accesses the cookie store.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    supabaseUrl!,
    supabaseAnonKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from a Server Component
          }
        },
      },
    }
  );
}

// Create a supabase client with service role key (bypasses RLS)
// USE WITH CAUTION: This has full access to your database
export const supabaseAdmin: SupabaseClient<Database, 'public'> = createSupabaseClient<Database, 'public'>(
    supabaseUrl,
    supabaseServiceKey,
    {
        db: { schema: 'public' },
        auth: { persistSession: false, autoRefreshToken: false },
    }
);
