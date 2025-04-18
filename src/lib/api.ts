import { Book, CreateBookInput } from './types';
import { cachedFetch, clearCacheEntry, clearCacheByPrefix } from './api-cache';

const API_BASE_URL = '/api/books';

// Cache prefixes
const CACHE_PREFIXES = {
  ALL_BOOKS: 'all-books',
  BOOK_DETAILS: 'book-details',
  SEARCH: 'search',
  FILTER: 'filter',
  BACKUPS: 'backups',
};

/**
 * Fetches all books from the API
 * @param forceRefresh Force refresh the cache
 * @returns Promise with array of books
 */
export async function fetchBooks(forceRefresh = false): Promise<Book[]> {
  try {
    const data = await cachedFetch<{ books: Book[] }>(API_BASE_URL, {
      prefix: CACHE_PREFIXES.ALL_BOOKS,
      forceRefresh,
      expirationTime: 2 * 60 * 1000, // 2 minutes
    });

    return data.books || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch books');
  }
}

/**
 * Fetches a single book by ID
 * @param id Book ID
 * @param forceRefresh Force refresh the cache
 * @returns Promise with book data
 */
export async function fetchBookById(id: string, forceRefresh = false): Promise<Book> {
  try {
    const data = await cachedFetch<{ book: Book }>(`${API_BASE_URL}/${id}`, {
      prefix: `${CACHE_PREFIXES.BOOK_DETAILS}:${id}`,
      forceRefresh,
      expirationTime: 5 * 60 * 1000, // 5 minutes
    });

    return data.book;
  } catch (error) {
    console.error(`Error fetching book ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch book');
  }
}

/**
 * Creates a new book
 * @param bookData Book data to create
 * @returns Promise with created book
 */
export async function createBook(bookData: CreateBookInput): Promise<Book> {
  try {
    const data = await cachedFetch<{ book: Book }>(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
      // Don't cache POST requests
      forceRefresh: true,
    });

    // Invalidate the books list cache
    clearCacheByPrefix(CACHE_PREFIXES.ALL_BOOKS);
    clearCacheByPrefix(CACHE_PREFIXES.SEARCH);
    clearCacheByPrefix(CACHE_PREFIXES.FILTER);

    return data.book;
  } catch (error) {
    console.error('Error creating book:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create book');
  }
}

/**
 * Updates an existing book
 * @param id Book ID
 * @param bookData Book data to update
 * @returns Promise with updated book
 */
export async function updateBook(id: string, bookData: Partial<CreateBookInput>): Promise<Book> {
  try {
    const data = await cachedFetch<{ book: Book }>(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
      // Don't cache PUT requests
      forceRefresh: true,
    });

    // Invalidate caches
    clearCacheByPrefix(CACHE_PREFIXES.ALL_BOOKS);
    clearCacheByPrefix(CACHE_PREFIXES.SEARCH);
    clearCacheByPrefix(CACHE_PREFIXES.FILTER);
    clearCacheEntry(`${CACHE_PREFIXES.BOOK_DETAILS}:${id}`);

    return data.book;
  } catch (error) {
    console.error(`Error updating book ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to update book');
  }
}

/**
 * Deletes a book
 * @param id Book ID
 * @returns Promise with success status
 */
export async function deleteBook(id: string): Promise<boolean> {
  try {
    const data = await cachedFetch<{ success: boolean }>(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      // Don't cache DELETE requests
      forceRefresh: true,
    });

    // Invalidate caches
    clearCacheByPrefix(CACHE_PREFIXES.ALL_BOOKS);
    clearCacheByPrefix(CACHE_PREFIXES.SEARCH);
    clearCacheByPrefix(CACHE_PREFIXES.FILTER);
    clearCacheEntry(`${CACHE_PREFIXES.BOOK_DETAILS}:${id}`);

    return data.success;
  } catch (error) {
    console.error(`Error deleting book ${id}:`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to delete book');
  }
}

/**
 * Searches for books by title or author
 * @param query Search query
 * @param forceRefresh Force refresh the cache
 * @returns Promise with array of matching books
 */
export async function searchBooks(query: string, forceRefresh = false): Promise<Book[]> {
  try {
    const data = await cachedFetch<{ books: Book[] }>(
      `${API_BASE_URL}/search?q=${encodeURIComponent(query)}`,
      {
        prefix: `${CACHE_PREFIXES.SEARCH}:${query}`,
        forceRefresh,
        expirationTime: 5 * 60 * 1000, // 5 minutes
      }
    );

    return data.books || [];
  } catch (error) {
    console.error(`Error searching books with query "${query}":`, error);
    throw new Error(error instanceof Error ? error.message : 'Failed to search books');
  }
}

/**
 * Filters books by various criteria
 * @param filters Filter criteria
 * @param forceRefresh Force refresh the cache
 * @returns Promise with array of filtered books
 */
export async function filterBooks(
  filters: {
    genre?: string;
    minRating?: number;
    fromDate?: string;
    toDate?: string;
  },
  forceRefresh = false
): Promise<Book[]> {
  try {
    const params = new URLSearchParams();

    if (filters.genre) params.append('genre', filters.genre);
    if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
    if (filters.fromDate) params.append('fromDate', filters.fromDate);
    if (filters.toDate) params.append('toDate', filters.toDate);

    // Generate a cache key based on the filters
    const filterKey = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => `${key}:${value}`)
      .join('_');

    const data = await cachedFetch<{ books: Book[] }>(
      `${API_BASE_URL}/filter?${params.toString()}`,
      {
        prefix: `${CACHE_PREFIXES.FILTER}:${filterKey || 'all'}`,
        forceRefresh,
        expirationTime: 5 * 60 * 1000, // 5 minutes
      }
    );

    return data.books || [];
  } catch (error) {
    console.error('Error filtering books:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to filter books');
  }
}

/**
 * Exports books data as a downloadable file
 * @returns Promise with the URL to download the file
 */
export async function exportBooks(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/export`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to export books');
  }

  return URL.createObjectURL(await response.blob());
}

/**
 * Creates a backup of the books data
 * @returns Promise with the backup filename
 */
export async function backupBooks(): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/backup`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to backup books');
  }

  const data = await response.json();
  return data.filename;
}

/**
 * Gets a list of available backups
 * @param forceRefresh Force refresh the cache
 * @returns Promise with array of backup details
 */
export async function getBackups(forceRefresh = false): Promise<{ filename: string; createdAt: string; size: number }[]> {
  try {
    const data = await cachedFetch<{ backups: { filename: string; createdAt: string; size: number }[] }>(
      `${API_BASE_URL}/backup`,
      {
        prefix: CACHE_PREFIXES.BACKUPS,
        forceRefresh,
        expirationTime: 5 * 60 * 1000, // 5 minutes
      }
    );

    return data.backups || [];
  } catch (error) {
    console.error('Error getting backups:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get backups');
  }
}
