/**
 * Health Check API Route
 * Used for monitoring, load balancers, and deployment verification
 *
 * GET /api/health - Basic health check
 * GET /api/health?deep=true - Deep health check with dependency verification
 */

import { NextRequest, NextResponse } from 'next/server';

import { createAdminClient } from '@/lib/supabase/server';
import type { ApiResponse, HealthCheckResponse } from '@/types';

interface DeepHealthCheck extends HealthCheckResponse {
  dependencies?: {
    database: { status: 'healthy' | 'unhealthy'; latency_ms?: number; error?: string };
    storage: { status: 'healthy' | 'unhealthy'; error?: string };
  };
}

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<DeepHealthCheck>>> {
  const searchParams = request.nextUrl.searchParams;
  const isDeepCheck = searchParams.get('deep') === 'true';

  const baseResponse: DeepHealthCheck = {
    status: 'healthy',
    version: process.env.npm_package_version ?? '0.1.0',
    timestamp: new Date().toISOString(),
  };

  // Deep health check - verify dependencies
  if (isDeepCheck) {
    baseResponse.dependencies = {
      database: { status: 'healthy' },
      storage: { status: 'healthy' },
    };

    try {
      const supabase = createAdminClient();
      
      // Check database connectivity
      const dbStart = Date.now();
      const { error: dbError } = await supabase
        .from('projects')
        .select('id')
        .limit(1);
      
      const dbLatency = Date.now() - dbStart;
      
      if (dbError) {
        baseResponse.dependencies.database = {
          status: 'unhealthy',
          error: dbError.message,
        };
        baseResponse.status = 'healthy'; // Degraded but still serving
      } else {
        baseResponse.dependencies.database = {
          status: 'healthy',
          latency_ms: dbLatency,
        };
      }

      // Check storage connectivity
      const { error: storageError } = await supabase.storage
        .from('project-images')
        .list('', { limit: 1 });

      if (storageError) {
        baseResponse.dependencies.storage = {
          status: 'unhealthy',
          error: storageError.message,
        };
      }
    } catch (error) {
      baseResponse.dependencies.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  const response: ApiResponse<DeepHealthCheck> = {
    success: true,
    data: baseResponse,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
