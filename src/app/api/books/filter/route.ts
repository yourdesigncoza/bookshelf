import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks } from '@/lib/book-storage';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';

// GET /api/books/filter - Filter books by various criteria
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const genre = url.searchParams.get('genre');
    const minRatingStr = url.searchParams.get('minRating');
    const fromDateStr = url.searchParams.get('fromDate');
    const toDateStr = url.searchParams.get('toDate');
    
    // Get all books
    const books = await getAllBooks();
    
    // Apply filters
    let filteredBooks = [...books];
    
    // Filter by genre
    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === genre);
    }
    
    // Filter by minimum rating
    if (minRatingStr) {
      const minRating = parseInt(minRatingStr);
      if (!isNaN(minRating)) {
        filteredBooks = filteredBooks.filter(book => (book.rating || 0) >= minRating);
      }
    }
    
    // Filter by date range
    if (fromDateStr) {
      try {
        const fromDate = new Date(fromDateStr);
        const fromTimestamp = fromDate.getTime();
        
        if (!isNaN(fromTimestamp)) {
          filteredBooks = filteredBooks.filter(book => {
            if (!book.dateCompleted) return false;
            return new Date(book.dateCompleted).getTime() >= fromTimestamp;
          });
        }
      } catch (error) {
        logger.warn('Invalid fromDate parameter', { fromDateStr });
      }
    }
    
    if (toDateStr) {
      try {
        const toDate = new Date(toDateStr);
        const toTimestamp = toDate.getTime();
        
        if (!isNaN(toTimestamp)) {
          filteredBooks = filteredBooks.filter(book => {
            if (!book.dateCompleted) return false;
            return new Date(book.dateCompleted).getTime() <= toTimestamp;
          });
        }
      } catch (error) {
        logger.warn('Invalid toDate parameter', { toDateStr });
      }
    }
    
    return NextResponse.json({ books: filteredBooks });
  } catch (error) {
    logger.error('Error in GET /api/books/filter', { error });
    throw error;
  }
});
