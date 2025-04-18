import { NextRequest, NextResponse } from 'next/server';
import { saveAllBooks, backupBooks } from '@/lib/book-storage';
import { Book } from '@/lib/types';
import { withErrorHandling } from '../../middleware';
import { logger } from '@/lib/logger';

// POST /api/books/import - Import books from a JSON file
export const POST = withErrorHandling(async (request: NextRequest) => {
  try {
    // Create a backup before importing
    await backupBooks();

    // Get the form data with the uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read the file content
    const fileContent = await file.text();

    // Parse the JSON
    let importData;
    try {
      importData = JSON.parse(fileContent);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
    }

    // Extract books from the import data
    let books: Book[];

    if (Array.isArray(importData)) {
      // Handle case where the file is just an array of books
      books = importData;
    } else if (importData.books && Array.isArray(importData.books)) {
      // Handle case where the file has a books property
      books = importData.books;
    } else {
      return NextResponse.json({ error: 'Invalid import format' }, { status: 400 });
    }

    // Validate books
    if (!books.every(book =>
      typeof book === 'object' &&
      book !== null &&
      typeof book.title === 'string' &&
      typeof book.author === 'string'
    )) {
      return NextResponse.json({ error: 'Invalid book data format' }, { status: 400 });
    }

    // Save the books
    await saveAllBooks(books);

    return NextResponse.json({ success: true, count: books.length });
  } catch (error) {
    logger.error('Error in POST /api/books/import', { error });
    throw error;
  }
});
