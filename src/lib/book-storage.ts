import { readJsonFile, writeJsonFile, backupJsonFile, exportJsonFile, importJsonFile, getBackupFiles } from './json-storage-client';
import { logger, AppError } from './logger';

// Define the Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  readDate?: string;
  notes?: string;
  coverUrl?: string;
  pageCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Constants
const BOOKS_FILENAME = 'books.json';

// Function to get all books
export async function getAllBooks(): Promise<Book[]> {
  try {
    return await readJsonFile<Book[]>(BOOKS_FILENAME);
  } catch (error) {
    logger.error('Error getting all books', { error });
    return [];
  }
}

// Function to get a book by ID
export async function getBookById(id: string): Promise<Book | null> {
  try {
    const books = await getAllBooks();
    return books.find(book => book.id === id) || null;
  } catch (error) {
    logger.error(`Error getting book with ID ${id}`, { error, id });
    return null;
  }
}

// Function to add a new book
export async function addBook(bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<Book> {
  try {
    const books = await getAllBooks();

    // Generate a unique ID
    const id = crypto.randomUUID();

    // Create the new book with timestamps
    const now = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id,
      createdAt: now,
      updatedAt: now
    };

    // Add to the collection and save
    books.push(newBook);
    await writeJsonFile(BOOKS_FILENAME, books);

    return newBook;
  } catch (error) {
    logger.error('Error adding book', { error, bookData });
    throw new AppError('Failed to add book', 500, true, { bookData });
  }
}

// Function to update a book
export async function updateBook(id: string, bookData: Partial<Omit<Book, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Book | null> {
  try {
    const books = await getAllBooks();
    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
      return null;
    }

    // Update the book with new data and update timestamp
    const updatedBook: Book = {
      ...books[bookIndex],
      ...bookData,
      updatedAt: new Date().toISOString()
    };

    books[bookIndex] = updatedBook;
    await writeJsonFile(BOOKS_FILENAME, books);

    return updatedBook;
  } catch (error) {
    logger.error(`Error updating book with ID ${id}`, { error, id, bookData });
    throw new AppError(`Failed to update book with ID ${id}`, 500, true, { id, bookData });
  }
}

// Function to delete a book
export async function deleteBook(id: string): Promise<boolean> {
  try {
    const books = await getAllBooks();
    const filteredBooks = books.filter(book => book.id !== id);

    // If no books were removed, the ID didn't exist
    if (filteredBooks.length === books.length) {
      return false;
    }

    await writeJsonFile(BOOKS_FILENAME, filteredBooks);
    return true;
  } catch (error) {
    logger.error(`Error deleting book with ID ${id}`, { error, id });
    throw new AppError(`Failed to delete book with ID ${id}`, 500, true, { id });
  }
}

// Function to backup the books data
export async function backupBooks(): Promise<string> {
  try {
    return await backupJsonFile(BOOKS_FILENAME);
  } catch (error) {
    logger.error('Error backing up books', { error });
    throw new AppError('Failed to backup books data', 500, true);
  }
}

// Function to export books data
export async function exportBooks(): Promise<string> {
  try {
    const books = await getAllBooks();

    // Create a Blob from the JSON data
    const exportData = {
      books,
      exportedAt: new Date().toISOString(),
      version: '1.0',
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a URL for the Blob
    return URL.createObjectURL(blob);
  } catch (error) {
    logger.error('Error exporting books', { error });
    throw new AppError('Failed to export books data', 500, true);
  }
}

// Function to save all books (used for importing)
export async function saveAllBooks(books: Book[]): Promise<void> {
  try {
    // Ensure all books have required fields
    const now = new Date().toISOString();
    const validatedBooks = books.map(book => ({
      ...book,
      id: book.id || crypto.randomUUID(),
      createdAt: book.createdAt || now,
      updatedAt: book.updatedAt || now
    }));

    await writeJsonFile(BOOKS_FILENAME, validatedBooks);
  } catch (error) {
    logger.error('Error saving all books', { error });
    throw new AppError('Failed to save books data', 500, true);
  }
}

// Function to search books by title or author
export async function searchBooks(query: string): Promise<Book[]> {
  try {
    const books = await getAllBooks();
    const lowerQuery = query.toLowerCase();

    return books.filter(book =>
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.genre && book.genre.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    logger.error(`Error searching books with query "${query}"`, { error, query });
    return [];
  }
}

// Function to filter books by genre
export async function filterBooksByGenre(genre: string): Promise<Book[]> {
  try {
    const books = await getAllBooks();
    return books.filter(book => book.genre === genre);
  } catch (error) {
    logger.error(`Error filtering books by genre "${genre}"`, { error, genre });
    return [];
  }
}

// Function to get a list of all backups
export async function getBackupsList() {
  try {
    return await getBackupFiles();
  } catch (error) {
    logger.error('Error getting backups list', { error });
    throw new AppError('Failed to get backups list', 500, true);
  }
}

// Function to get all unique genres
export async function getAllGenres(): Promise<string[]> {
  try {
    const books = await getAllBooks();
    const genres = new Set<string>();

    books.forEach(book => {
      if (book.genre) {
        genres.add(book.genre);
      }
    });

    return Array.from(genres);
  } catch (error) {
    logger.error('Error getting all genres', { error });
    return [];
  }
}
