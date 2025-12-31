/**
 * Request Utilities
 * Safe request parsing with size limits and validation
 *
 * HARDENED:
 * - Request body size limits
 * - Safe JSON parsing
 * - Consistent error handling
 */

import { NextResponse } from 'next/server';

/**
 * Maximum request body size (100KB)
 */
const MAX_BODY_SIZE = 100 * 1024;

/**
 * Parse result type
 */
export interface ParseResult<T> {
  success: boolean;
  data?: T;
  error?: NextResponse;
}

/**
 * Safely parse JSON request body with size limit
 * Returns NextResponse error if parsing fails
 */
export async function parseJsonBody<T = Record<string, unknown>>(
  request: Request,
  maxSize: number = MAX_BODY_SIZE
): Promise<ParseResult<T>> {
  try {
    // Check Content-Length header first (fast rejection)
    const contentLength = request.headers.get('content-length');
    if (contentLength) {
      const size = parseInt(contentLength, 10);
      if (!isNaN(size) && size > maxSize) {
        return {
          success: false,
          error: NextResponse.json(
            { success: false, error: 'Request body too large' },
            { status: 413 }
          ),
        };
      }
    }

    // Read body with size limit
    const reader = request.body?.getReader();
    if (!reader) {
      return {
        success: false,
        error: NextResponse.json(
          { success: false, error: 'Request body is required' },
          { status: 400 }
        ),
      };
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      totalSize += value.length;
      if (totalSize > maxSize) {
        reader.cancel();
        return {
          success: false,
          error: NextResponse.json(
            { success: false, error: 'Request body too large' },
            { status: 413 }
          ),
        };
      }

      chunks.push(value);
    }

    // Combine chunks and decode
    const combined = new Uint8Array(totalSize);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    const text = new TextDecoder().decode(combined);

    // Parse JSON safely
    try {
      const data = JSON.parse(text) as T;
      return { success: true, data };
    } catch {
      return {
        success: false,
        error: NextResponse.json(
          { success: false, error: 'Invalid JSON in request body' },
          { status: 400 }
        ),
      };
    }
  } catch (error) {
    console.error('[RequestUtils] Parse error:', error);
    return {
      success: false,
      error: NextResponse.json(
        { success: false, error: 'Failed to read request body' },
        { status: 400 }
      ),
    };
  }
}

/**
 * Create standardized error response
 */
export function errorResponse(
  message: string,
  status: number = 500,
  errors?: Record<string, string>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}

/**
 * Create standardized success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  headers?: Record<string, string>
): NextResponse {
  const responseInit: ResponseInit = { status };
  if (headers) {
    responseInit.headers = headers;
  }
  return NextResponse.json({ success: true, ...data }, responseInit);
}

/**
 * Create rate limit error response
 */
export function rateLimitResponse(
  headers: Record<string, string>,
  isServiceError: boolean = false
): NextResponse {
  const status = isServiceError ? 503 : 429;
  const message = isServiceError
    ? 'Service temporarily unavailable. Please try again.'
    : 'Too many requests. Please try again later.';

  return NextResponse.json(
    { success: false, error: message },
    { status, headers }
  );
}
