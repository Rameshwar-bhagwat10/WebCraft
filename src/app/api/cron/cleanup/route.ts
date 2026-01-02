/**
 * Scheduled Cleanup API Route
 * POST /api/cron/cleanup
 *
 * SECURITY:
 * - Protected by CRON_SECRET header
 * - Only callable by authorized cron services
 *
 * USAGE:
 * - Call hourly via external cron (Vercel Cron, GitHub Actions, etc.)
 * - Header: Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from 'next/server';

import { cleanupExpiredKeys } from '@/lib/idempotency';
import { createAdminClient } from '@/lib/supabase/server';

/**
 * Verify cron authorization
 */
function verifyCronAuth(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  
  // Skip auth in development
  if (!cronSecret && process.env.NODE_ENV === 'development') {
    return true;
  }
  
  if (!cronSecret) {
    console.error('[Cron] CRON_SECRET not configured');
    return false;
  }
  
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return false;
  }
  
  // Support both "Bearer <token>" and just "<token>"
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;
    
  return token === cronSecret;
}

export async function POST(request: NextRequest) {
  // Verify authorization
  if (!verifyCronAuth(request)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const supabase = createAdminClient();
    const results: Record<string, unknown> = {};

    // Run database cleanup function
    const { data: dbCleanup, error: dbError } = await supabase
      .rpc('run_all_cleanups' as never);

    if (dbError) {
      console.error('[Cron] Database cleanup error:', dbError.message);
      results.database = { error: dbError.message };
    } else {
      results.database = dbCleanup;
    }

    // Run idempotency cleanup (TypeScript side)
    const idempotencyDeleted = await cleanupExpiredKeys();
    results.idempotency_ts = { deleted: idempotencyDeleted };

    // Log cleanup results in development only
    if (process.env.NODE_ENV !== 'production') {
      console.info('[Cron] Cleanup completed:', results);
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Cron] Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: error instanceof Error ? error.message : 'Unknown' },
      { status: 500 }
    );
  }
}

// Also support GET for simple health checks
export async function GET(request: NextRequest) {
  if (!verifyCronAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({ 
    status: 'ready',
    endpoint: '/api/cron/cleanup',
    method: 'POST',
  });
}
