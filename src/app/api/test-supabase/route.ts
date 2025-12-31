/**
 * Supabase Connection Test
 * GET /api/test-supabase
 *
 * Tests database connectivity and returns status
 */

import { NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/server';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Missing',
  };

  // Test database connection
  try {
    const supabase = createAdminClient();

    // Try to query a table
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('id')
      .limit(1);

    if (error) {
      results.database = '❌ Error';
      results.dbError = error.message;
      results.dbCode = error.code;
    } else {
      results.database = '✅ Connected';
      results.tableExists = true;
      results.rowCount = data?.length ?? 0;
    }

    // Test auth service
    const { error: authError } = await supabase.auth.getSession();
    if (authError) {
      results.auth = '❌ Error';
      results.authError = authError.message;
    } else {
      results.auth = '✅ Working';
    }

  } catch (err) {
    results.database = '❌ Connection Failed';
    results.error = err instanceof Error ? err.message : 'Unknown error';
  }

  // Overall status
  const allGood = 
    results.supabaseUrl === '✅ Set' &&
    results.anonKey === '✅ Set' &&
    results.serviceKey === '✅ Set' &&
    results.database === '✅ Connected';

  results.status = allGood ? '✅ ALL SYSTEMS GO' : '⚠️ ISSUES DETECTED';

  return NextResponse.json(results, {
    status: allGood ? 200 : 500,
  });
}
