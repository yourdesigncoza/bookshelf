import { NextRequest, NextResponse } from 'next/server';
import { searchBooks } from '@/lib/book-storage';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';

// GET /api/books/search?q=<query> - Search books by title or author
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || '';
    
    // Search for books
    const books = await searchBooks(query);
    
    return NextResponse.json({ books });
  } catch (error) {
    logger.error('Error in GET /api/books/search', { error });
    throw error;
  }
});
