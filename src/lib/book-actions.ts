'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

import { 
  getAllBooks, 
  getBookById, 
  addBook, 
  updateBook, 
  deleteBook,
  searchBooks,
  filterBooksByGenre,
  backupBooks,
  exportBooks,
  importBooks
} from './book-storage';
import { logger, AppError } from './logger';
import { Book, CreateBookInput } from './types';

// Book form schema
const bookFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  genre: z.string().optional(),
  dateCompleted: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
  coverUrl: z.string().url('Invalid URL format').optional().or(z.literal('')),
  pageCount: z.number().positive('Page count must be positive').optional(),
});

// Create a new book
export async function createBookAction(formData: FormData) {
  try {
    // Parse form data
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const genre = formData.get('genre') as string;
    const dateCompleted = formData.get('dateCompleted') as string;
    const ratingStr = formData.get('rating') as string;
    const notes = formData.get('notes') as string;
    const coverUrl = formData.get('coverUrl') as string;
    const pageCountStr = formData.get('pageCount') as string;

    // Validate form data
    const validatedData = bookFormSchema.parse({
      title,
      author,
      genre: genre || undefined,
      dateCompleted: dateCompleted || undefined,
      rating: ratingStr ? parseInt(ratingStr) : undefined,
      notes: notes || undefined,
      coverUrl: coverUrl || undefined,
      pageCount: pageCountStr ? parseInt(pageCountStr) : undefined,
    });

    // Add the book
    const newBook = await addBook(validatedData);

    // Revalidate the books page
    revalidatePath('/books');

    // Return success
    return { success: true, book: newBook };
  } catch (error) {
    logger.error('Error creating book', { error });
    
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid form data', details: error.errors };
    }
    
    return { success: false, error: 'Failed to create book' };
  }
}

// Update an existing book
export async function updateBookAction(id: string, formData: FormData) {
  try {
    // Parse form data
    const title = formData.get('title') as string;
    const author = formData.get('author') as string;
    const genre = formData.get('genre') as string;
    const dateCompleted = formData.get('dateCompleted') as string;
    const ratingStr = formData.get('rating') as string;
    const notes = formData.get('notes') as string;
    const coverUrl = formData.get('coverUrl') as string;
    const pageCountStr = formData.get('pageCount') as string;

    // Validate form data
    const validatedData = bookFormSchema.parse({
      title,
      author,
      genre: genre || undefined,
      dateCompleted: dateCompleted || undefined,
      rating: ratingStr ? parseInt(ratingStr) : undefined,
      notes: notes || undefined,
      coverUrl: coverUrl || undefined,
      pageCount: pageCountStr ? parseInt(pageCountStr) : undefined,
    });

    // Update the book
    const updatedBook = await updateBook(id, validatedData);

    if (!updatedBook) {
      return { success: false, error: 'Book not found' };
    }

    // Revalidate the books page
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);

    // Return success
    return { success: true, book: updatedBook };
  } catch (error) {
    logger.error(`Error updating book ${id}`, { error, id });
    
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid form data', details: error.errors };
    }
    
    return { success: false, error: 'Failed to update book' };
  }
}

// Delete a book
export async function deleteBookAction(id: string) {
  try {
    // Delete the book
    const success = await deleteBook(id);

    if (!success) {
      return { success: false, error: 'Book not found' };
    }

    // Revalidate the books page
    revalidatePath('/books');

    // Return success
    return { success: true };
  } catch (error) {
    logger.error(`Error deleting book ${id}`, { error, id });
    return { success: false, error: 'Failed to delete book' };
  }
}

// Get all books
export async function getBooksAction() {
  try {
    const books = await getAllBooks();
    return { success: true, books };
  } catch (error) {
    logger.error('Error getting books', { error });
    return { success: false, error: 'Failed to get books', books: [] };
  }
}

// Get a book by ID
export async function getBookAction(id: string) {
  try {
    const book = await getBookById(id);

    if (!book) {
      return { success: false, error: 'Book not found' };
    }

    return { success: true, book };
  } catch (error) {
    logger.error(`Error getting book ${id}`, { error, id });
    return { success: false, error: 'Failed to get book' };
  }
}

// Search books
export async function searchBooksAction(query: string) {
  try {
    const books = await searchBooks(query);
    return { success: true, books };
  } catch (error) {
    logger.error(`Error searching books with query "${query}"`, { error, query });
    return { success: false, error: 'Failed to search books', books: [] };
  }
}

// Filter books by genre
export async function filterBooksByGenreAction(genre: string) {
  try {
    const books = await filterBooksByGenre(genre);
    return { success: true, books };
  } catch (error) {
    logger.error(`Error filtering books by genre "${genre}"`, { error, genre });
    return { success: false, error: 'Failed to filter books', books: [] };
  }
}

// Backup books
export async function backupBooksAction() {
  try {
    await backupBooks();
    return { success: true };
  } catch (error) {
    logger.error('Error backing up books', { error });
    return { success: false, error: 'Failed to backup books' };
  }
}

// Export books
export async function exportBooksAction() {
  try {
    const exportPath = await exportBooks();
    return { success: true, exportPath };
  } catch (error) {
    logger.error('Error exporting books', { error });
    return { success: false, error: 'Failed to export books' };
  }
}

// Import books
export async function importBooksAction(importPath: string) {
  try {
    await importBooks(importPath);
    
    // Revalidate the books page
    revalidatePath('/books');
    
    return { success: true };
  } catch (error) {
    logger.error('Error importing books', { error, importPath });
    return { success: false, error: 'Failed to import books' };
  }
}
