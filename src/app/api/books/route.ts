import { NextRequest, NextResponse } from 'next/server';
import {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
} from '@/lib/book-storage';
import { withErrorHandling } from '../middleware';
import { logger } from '@/lib/logger';
import { Book, CreateBookInput } from '@/lib/types';

// GET /api/books - Get all books
export const GET = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (id) {
      // Get a specific book by ID
      const book = await getBookById(id);

      if (!book) {
        return NextResponse.json(
          { error: 'Book not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ book });
    }

    // Get all books
    const books = await getAllBooks();
    return NextResponse.json({ books });
  } catch (error) {
    logger.error('Error in GET /api/books', { error });
    throw error;
  }
});

// POST /api/books - Create a new book
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    const bookData = await request.json();

    // Validate required fields
    if (!bookData.title || !bookData.author) {
      return NextResponse.json(
        { error: 'Title and author are required' },
        { status: 400 }
      );
    }

    // Extract book data from the request body
    const bookInput: Omit<Book, 'id' | 'createdAt' | 'updatedAt'> = {
      title: bookData.title,
      author: bookData.author,
      genre: bookData.genre,
      dateCompleted: bookData.dateCompleted,
      rating: bookData.rating,
      notes: bookData.notes
    };

    const newBook = await addBook(bookInput);
    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    logger.error('Error in POST /api/books', { error, bookData: request.body });
    throw error;
  }
});

// PUT /api/books?id=<bookId> - Update a book
export const PUT = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const bookData = await request.json();

    // Extract book data from the request body
    const updates: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>> = {};

    if (bookData.title !== undefined) updates.title = bookData.title;
    if (bookData.author !== undefined) updates.author = bookData.author;
    if (bookData.dateCompleted !== undefined) updates.dateCompleted = bookData.dateCompleted;
    if (bookData.genre !== undefined) updates.genre = bookData.genre;
    if (bookData.rating !== undefined) updates.rating = bookData.rating;
    if (bookData.notes !== undefined) updates.notes = bookData.notes;

    const updatedBook = await updateBook(id, updates);

    if (!updatedBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ book: updatedBook });
  } catch (error) {
    logger.error('Error in PUT /api/books', { error, id });
    throw error;
  }
});

// DELETE /api/books?id=<bookId> - Delete a book
export const DELETE = withErrorHandling(async (request: NextRequest) => {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const success = await deleteBook(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Error in DELETE /api/books', { error, id });
    throw error;
  }
});
