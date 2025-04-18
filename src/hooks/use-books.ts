'use client';

import { useState, useEffect } from 'react';
import { fetchBooks, searchBooks } from '@/lib/api';
import { Book } from '@/lib/types';

interface UseBooksOptions {
  initialBooks?: Book[];
  searchQuery?: string;
}

export function useBooks(options: UseBooksOptions = {}) {
  const { initialBooks = [], searchQuery = '' } = options;
  
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [isLoading, setIsLoading] = useState<boolean>(initialBooks.length === 0);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let fetchedBooks: Book[];
        
        if (searchQuery) {
          fetchedBooks = await searchBooks(searchQuery);
        } else {
          fetchedBooks = await fetchBooks();
        }
        
        setBooks(fetchedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch books');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [searchQuery]);
  
  return {
    books,
    isLoading,
    error,
    setBooks,
  };
}
