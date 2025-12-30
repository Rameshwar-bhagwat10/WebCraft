/**
 * Health Check API Route
 * Used for monitoring, load balancers, and deployment verification
 *
 * GET /api/health
 */

import { NextResponse } from 'next/server';

import type { ApiResponse, HealthCheckResponse } from '@/types';

export async function GET(): Promise<
  NextResponse<ApiResponse<HealthCheckResponse>>
> {
  const response: ApiResponse<HealthCheckResponse> = {
    success: true,
    data: {
      status: 'healthy',
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString(),
    },
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}
