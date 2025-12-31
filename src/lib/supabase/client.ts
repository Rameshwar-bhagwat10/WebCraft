/**
 * Supabase Client Configuration
 * Browser client for public operations (anonymous inserts)
 *
 * Security:
 * - Uses anon key (safe for client)
 * - RLS enforces access control
 * - Never exposes service role key
 */

import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database';

/**
 * Create Supabase client for browser/client components
 * Uses anon key - safe for public exposure
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
