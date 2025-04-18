import { NextRequest, NextResponse } from 'next/server';
import { getAllBooks } from '@/lib/book-storage';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';

// GET /api/books/export - Export all books as JSON
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    // Get all books
    const books = await getAllBooks();

    // Create export data
    const exportData = {
      books,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    // Convert to JSON
    const jsonData = JSON.stringify(exportData, null, 2);

    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="bookshelf-export-${new Date().toISOString().split('T')[0]}.json"`);
    headers.set('Content-Type', 'application/json');

    return new NextResponse(jsonData, {
      status: 200,
      headers
    });
  } catch (error) {
    logger.error('Error in GET /api/books/export', { error });
    throw error;
  }
});
