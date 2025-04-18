import { Book, CreateBookInput } from './types';

const API_BASE_URL = '/api/books';

/**
 * Fetches all books from the API
 * @returns Promise with array of books
 */
export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(API_BASE_URL);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch books');
  }

  const data = await response.json();
  return data.books || [];
}

/**
 * Fetches a single book by ID
 * @param id Book ID
 * @returns Promise with book data
 */
export async function fetchBookById(id: string): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch book');
  }

  const data = await response.json();
  return data.book;
}

/**
 * Creates a new book
 * @param bookData Book data to create
 * @returns Promise with created book
 */
export async function createBook(bookData: CreateBookInput): Promise<Book> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create book');
  }

  const data = await response.json();
  return data.book;
}

/**
 * Updates an existing book
 * @param id Book ID
 * @param bookData Book data to update
 * @returns Promise with updated book
 */
export async function updateBook(id: string, bookData: Partial<CreateBookInput>): Promise<Book> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to update book');
  }

  const data = await response.json();
  return data.book;
}

/**
 * Deletes a book
 * @param id Book ID
 * @returns Promise with success status
 */
export async function deleteBook(id: string): Promise<boolean> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to delete book');
  }

  return true;
}

/**
 * Searches for books by title or author
 * @param query Search query
 * @returns Promise with array of matching books
 */
export async function searchBooks(query: string): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to search books');
  }

  const data = await response.json();
  return data.books || [];
}

/**
 * Filters books by various criteria
 * @param filters Filter criteria
 * @returns Promise with array of filtered books
 */
export async function filterBooks(filters: {
  genre?: string;
  minRating?: number;
  fromDate?: string;
  toDate?: string;
}): Promise<Book[]> {
  const params = new URLSearchParams();

  if (filters.genre) params.append('genre', filters.genre);
  if (filters.minRating !== undefined) params.append('minRating', filters.minRating.toString());
  if (filters.fromDate) params.append('fromDate', filters.fromDate);
  if (filters.toDate) params.append('toDate', filters.toDate);

  const response = await fetch(`${API_BASE_URL}/filter?${params.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to filter books');
  }

  const data = await response.json();
  return data.books || [];
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
 * @returns Promise with array of backup details
 */
export async function getBackups(): Promise<{ filename: string; createdAt: string; size: number }[]> {
  const response = await fetch(`${API_BASE_URL}/backup`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to get backups');
  }

  const data = await response.json();
  return data.backups || [];
}
