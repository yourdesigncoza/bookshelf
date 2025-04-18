'use client';

import { useCallback } from 'react';
import { fetchBookById } from '@/lib/api';
import { Book } from '@/lib/types';
import { useOptimizedFetch } from './use-optimized-fetch';

interface UseBookDetailsOptions {
  initialBook?: Book;
  bookId: string;
  forceRefresh?: boolean;
}

export function useBookDetails(options: UseBookDetailsOptions) {
  const { initialBook, bookId, forceRefresh = false } = options;
  
  // Create a memoized fetch function for the book details
  const fetchData = useCallback(async () => {
    return await fetchBookById(bookId, forceRefresh);
  }, [bookId, forceRefresh]);
  
  // Use the optimized fetch hook
  const { data: book, isLoading, error, refetch } = useOptimizedFetch<Book>({
    initialData: initialBook,
    fetchFn: fetchData,
    deps: [bookId],
    skip: !bookId,
  });
  
  return {
    book,
    isLoading,
    error: error ? error.message : null,
    refetch,
  };
}
