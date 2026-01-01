/**
 * Request Idempotency
 * Prevents duplicate submissions on network retries
 *
 * USAGE:
 * - Client sends X-Idempotency-Key header with unique ID
 * - Server checks if key was already processed
 * - Returns cached response if duplicate
 * - Stores response for 24 hours
 */

import { headers } from 'next/headers';

import { createAdminClient } from '@/lib/supabase/server';

/**
 * Idempotency key TTL (24 hours in milliseconds)
 */
const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Maximum key length
 */
const MAX_KEY_LENGTH = 64;

export interface IdempotencyCheckResult {
  isDuplicate: boolean;
  cachedResponse?: unknown;
  key: string | null;
}

/**
 * Get idempotency key from request headers
 */
export async function getIdempotencyKey(): Promise<string | null> {
  try {
    const headersList = await headers();
    const key = headersList.get('x-idempotency-key');
    
    if (!key || key.length > MAX_KEY_LENGTH) {
      return null;
    }
    
    // Sanitize: only allow alphanumeric, dashes, underscores
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) {
      return null;
    }
    
    return key;
  } catch {
    return null;
  }
}

/**
 * Check if request is a duplicate based on idempotency key
 */
export async function checkIdempotency(
  endpoint: string
): Promise<IdempotencyCheckResult> {
  const key = await getIdempotencyKey();
  
  // No key provided - not a duplicate
  if (!key) {
    return { isDuplicate: false, key: null };
  }

  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('idempotency_keys')
      .select('response, created_at')
      .eq('key', key)
      .eq('endpoint', endpoint)
      .single();

    if (error) {
      // Not found or error - treat as new request
      if (error.code === 'PGRST116') {
        return { isDuplicate: false, key };
      }
      console.error('[Idempotency] Check error:', error.message);
      return { isDuplicate: false, key };
    }

    const record = data as { response: unknown; created_at: string } | null;
    if (!record) {
      return { isDuplicate: false, key };
    }

    // Check if expired
    const createdAt = new Date(record.created_at).getTime();
    if (Date.now() - createdAt > IDEMPOTENCY_TTL_MS) {
      // Expired - delete and treat as new
      await supabase
        .from('idempotency_keys')
        .delete()
        .eq('key', key)
        .eq('endpoint', endpoint);
      return { isDuplicate: false, key };
    }

    // Valid duplicate
    return {
      isDuplicate: true,
      cachedResponse: record.response,
      key,
    };
  } catch (error) {
    console.error('[Idempotency] Exception:', error);
    return { isDuplicate: false, key };
  }
}

/**
 * Store idempotency result for future duplicate detection
 */
export async function storeIdempotencyResult(
  key: string | null,
  endpoint: string,
  response: unknown
): Promise<void> {
  if (!key) return;

  try {
    const supabase = createAdminClient();
    
    await supabase
      .from('idempotency_keys')
      .upsert({
        key,
        endpoint,
        response,
        created_at: new Date().toISOString(),
      } as never, {
        onConflict: 'key,endpoint',
      });
  } catch (error) {
    // Don't fail the request if storage fails
    console.error('[Idempotency] Store error:', error);
  }
}

/**
 * Clean up expired idempotency keys
 * Call this periodically (e.g., hourly via cron)
 */
export async function cleanupExpiredKeys(): Promise<number> {
  try {
    const supabase = createAdminClient();
    const cutoff = new Date(Date.now() - IDEMPOTENCY_TTL_MS).toISOString();
    
    const { data, error } = await supabase
      .from('idempotency_keys')
      .delete()
      .lt('created_at', cutoff)
      .select('key');

    if (error) {
      console.error('[Idempotency] Cleanup error:', error.message);
      return 0;
    }

    return data?.length ?? 0;
  } catch (error) {
    console.error('[Idempotency] Cleanup exception:', error);
    return 0;
  }
}
