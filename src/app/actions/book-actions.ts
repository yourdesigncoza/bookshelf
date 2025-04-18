'use server';

import { revalidatePath } from 'next/cache';
import { 
  getAllBooks, 
  getBookById, 
  addBook, 
  updateBook, 
  deleteBook, 
  searchBooks,
  filterBooksByGenre,
  getAllGenres,
  backupBooks,
  exportBooks,
  importBooks,
  type Book
} from '@/lib/book-storage';

// Type for the book form data (excludes system fields)
export type BookFormData = Omit<Book, 'id' | 'createdAt' | 'updatedAt'>;

// Get all books
export async function fetchAllBooks() {
  try {
    return await getAllBooks();
  } catch (error) {
    console.error('Error fetching all books:', error);
    throw new Error('Failed to fetch books');
  }
}

// Get a book by ID
export async function fetchBookById(id: string) {
  try {
    const book = await getBookById(id);
    if (!book) {
      throw new Error(`Book with ID ${id} not found`);
    }
    return book;
  } catch (error) {
    console.error(`Error fetching book with ID ${id}:`, error);
    throw new Error(`Failed to fetch book with ID ${id}`);
  }
}

// Create a new book
export async function createBook(formData: BookFormData) {
  try {
    const newBook = await addBook(formData);
    revalidatePath('/books');
    return newBook;
  } catch (error) {
    console.error('Error creating book:', error);
    throw new Error('Failed to create book');
  }
}

// Update an existing book
export async function updateExistingBook(id: string, formData: Partial<BookFormData>) {
  try {
    const updatedBook = await updateBook(id, formData);
    if (!updatedBook) {
      throw new Error(`Book with ID ${id} not found`);
    }
    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    return updatedBook;
  } catch (error) {
    console.error(`Error updating book with ID ${id}:`, error);
    throw new Error(`Failed to update book with ID ${id}`);
  }
}

// Delete a book
export async function removeBook(id: string) {
  try {
    const success = await deleteBook(id);
    if (!success) {
      throw new Error(`Book with ID ${id} not found`);
    }
    revalidatePath('/books');
    return success;
  } catch (error) {
    console.error(`Error deleting book with ID ${id}:`, error);
    throw new Error(`Failed to delete book with ID ${id}`);
  }
}

// Search for books
export async function searchForBooks(query: string) {
  try {
    return await searchBooks(query);
  } catch (error) {
    console.error(`Error searching for books with query "${query}":`, error);
    throw new Error('Failed to search for books');
  }
}

// Filter books by genre
export async function filterByGenre(genre: string) {
  try {
    return await filterBooksByGenre(genre);
  } catch (error) {
    console.error(`Error filtering books by genre "${genre}":`, error);
    throw new Error('Failed to filter books by genre');
  }
}

// Get all unique genres
export async function fetchAllGenres() {
  try {
    return await getAllGenres();
  } catch (error) {
    console.error('Error fetching all genres:', error);
    throw new Error('Failed to fetch genres');
  }
}

// Create a backup of the books data
export async function createBackup() {
  try {
    const backupFilename = await backupBooks();
    return { success: true, filename: backupFilename };
  } catch (error) {
    console.error('Error creating backup:', error);
    throw new Error('Failed to create backup');
  }
}

// Export books data to a file
export async function exportBooksData(exportPath: string) {
  try {
    await exportBooks(exportPath);
    return { success: true };
  } catch (error) {
    console.error('Error exporting books data:', error);
    throw new Error('Failed to export books data');
  }
}

// Import books data from a file
export async function importBooksData(importPath: string) {
  try {
    await importBooks(importPath);
    revalidatePath('/books');
    return { success: true };
  } catch (error) {
    console.error('Error importing books data:', error);
    throw new Error('Failed to import books data');
  }
}
