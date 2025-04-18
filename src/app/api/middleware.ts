import { NextRequest, NextResponse } from 'next/server';
import { logger, AppError } from '@/lib/logger';

type ApiHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>;

export function withErrorHandling(handler: ApiHandler): ApiHandler {
  return async (req: NextRequest, ...args: any[]) => {
    try {
      return await handler(req, ...args);
    } catch (error) {
      // Log the error
      if (error instanceof AppError) {
        // This is an expected operational error, already logged
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      } else {
        // This is an unexpected error
        const message = error instanceof Error ? error.message : 'An unexpected error occurred';
        logger.error('Unexpected API error', {
          path: req.nextUrl.pathname,
          method: req.method,
          error: message,
          stack: error instanceof Error ? error.stack : undefined
        });
        
        return NextResponse.json(
          { error: 'An unexpected error occurred' },
          { status: 500 }
        );
      }
    }
  };
}

// Helper function to validate request body
export async function validateRequestBody<T>(
  req: NextRequest,
  schema: { parse: (data: unknown) => T }
): Promise<{ data: T } | { error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { data };
  } catch (error) {
    logger.warn('Request validation failed', { 
      path: req.nextUrl.pathname,
      method: req.method,
      error
    });
    
    const errorResponse = NextResponse.json(
      { error: 'Invalid request data' },
      { status: 400 }
    );
    
    return { error: errorResponse };
  }
}
