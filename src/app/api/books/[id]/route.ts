import { NextRequest, NextResponse } from 'next/server';
import { getBookById, updateBook, deleteBook } from '@/lib/book-storage';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';
import { Book } from '@/lib/types';

// GET /api/books/[id] - Get a book by ID
export const GET = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    
    // Get the book by ID
    const book = await getBookById(id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ book });
  } catch (error) {
    logger.error(`Error in GET /api/books/${params.id}`, { error, id: params.id });
    throw error;
  }
});

// PUT /api/books/[id] - Update a book
export const PUT = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    const bookData = await request.json();
    
    // Extract book data from the request body
    const updates: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>> = {};

    if (bookData.title !== undefined) updates.title = bookData.title;
    if (bookData.author !== undefined) updates.author = bookData.author;
    if (bookData.dateCompleted !== undefined) updates.dateCompleted = bookData.dateCompleted;
    if (bookData.genre !== undefined) updates.genre = bookData.genre;
    if (bookData.rating !== undefined) updates.rating = bookData.rating;
    if (bookData.notes !== undefined) updates.notes = bookData.notes;
    
    // Update the book
    const updatedBook = await updateBook(id, updates);
    
    if (!updatedBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ book: updatedBook });
  } catch (error) {
    logger.error(`Error in PUT /api/books/${params.id}`, { error, id: params.id });
    throw error;
  }
});

// DELETE /api/books/[id] - Delete a book
export const DELETE = withErrorHandling(async (
  request: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const id = params.id;
    
    // Delete the book
    const success = await deleteBook(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(`Error in DELETE /api/books/${params.id}`, { error, id: params.id });
    throw error;
  }
});
