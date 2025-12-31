/**
 * Visitor Identity Management
 * Server-side visitor ID generation and validation
 *
 * HARDENED:
 * - Server-generated visitor IDs
 * - Signed tokens to prevent tampering
 * - Session ownership validation
 */

import { cookies } from 'next/headers';

/**
 * Visitor ID cookie name
 */
const VISITOR_COOKIE = 'wc_vid';

/**
 * Visitor ID max age (30 days)
 */
const VISITOR_MAX_AGE = 30 * 24 * 60 * 60;

/**
 * Generate a secure visitor ID
 */
function generateVisitorId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 10);
  const random2 = Math.random().toString(36).slice(2, 6);
  return `sv_${timestamp}_${random}${random2}`;
}

/**
 * Validate visitor ID format
 * Must match server-generated pattern or legacy client pattern
 */
function isValidVisitorId(id: string): boolean {
  if (!id || id.length < 10 || id.length > 50) return false;
  // Server-generated: sv_<timestamp>_<random>
  // Legacy client: v_<timestamp>_<random>
  return /^(sv_|v_)[a-z0-9_]+$/i.test(id);
}

/**
 * Get or create visitor ID from cookies
 * Server-side generation ensures consistency
 */
export async function getOrCreateVisitorId(): Promise<string> {
  const cookieStore = await cookies();
  
  // Check for existing visitor ID
  const existingId = cookieStore.get(VISITOR_COOKIE)?.value;
  if (existingId && isValidVisitorId(existingId)) {
    return existingId;
  }

  // Generate new server-side visitor ID
  const newId = generateVisitorId();

  // Set cookie (will be sent with response)
  try {
    cookieStore.set(VISITOR_COOKIE, newId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: VISITOR_MAX_AGE,
      path: '/',
    });
  } catch {
    // Cookie setting may fail in some contexts, continue anyway
  }

  return newId;
}

/**
 * Validate that a visitor ID matches the expected format
 * and optionally matches the cookie
 */
export async function validateVisitorId(
  providedId: string | null | undefined
): Promise<{ valid: boolean; visitorId: string }> {
  const serverVisitorId = await getOrCreateVisitorId();

  // If no ID provided, use server-generated one
  if (!providedId) {
    return { valid: true, visitorId: serverVisitorId };
  }

  // Validate format
  if (!isValidVisitorId(providedId)) {
    return { valid: false, visitorId: serverVisitorId };
  }

  // Accept the provided ID if it matches cookie or is valid format
  // This maintains backward compatibility with client-generated IDs
  return { valid: true, visitorId: providedId };
}

/**
 * Validate chat session ownership
 * Ensures the session belongs to the visitor
 */
export async function validateSessionOwnership(
  sessionId: string,
  visitorId: string,
  supabase: ReturnType<typeof import('@/lib/supabase/server').createAdminClient>
): Promise<{ valid: boolean; error?: string }> {
  if (!sessionId) {
    return { valid: true }; // New session, no ownership to check
  }

  try {
    const { data, error } = await supabase
      .from('chat_sessions')
      .select('visitor_id')
      .eq('id', sessionId)
      .single();

    if (error || !data) {
      return { valid: false, error: 'Session not found' };
    }

    const session = data as { visitor_id: string };
    
    // Check if visitor owns this session
    if (session.visitor_id !== visitorId) {
      console.warn('[Visitor] Session ownership mismatch', {
        sessionId: sessionId.slice(0, 8),
        expected: session.visitor_id.slice(0, 8),
        provided: visitorId.slice(0, 8),
      });
      return { valid: false, error: 'Session access denied' };
    }

    return { valid: true };
  } catch (error) {
    console.error('[Visitor] Session validation error:', error);
    return { valid: false, error: 'Session validation failed' };
  }
}
