'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchBooks, searchBooks } from '@/lib/api';
import { Book } from '@/lib/types';
import { useOptimizedFetch } from './use-optimized-fetch';

interface UseBooksOptions {
  initialBooks?: Book[];
  searchQuery?: string;
  forceRefresh?: boolean;
}

export function useBooks(options: UseBooksOptions = {}) {
  const { initialBooks = [], searchQuery = '', forceRefresh = false } = options;

  // Create a memoized fetch function based on the search query
  const fetchData = useCallback(async () => {
    if (searchQuery) {
      return await searchBooks(searchQuery, forceRefresh);
    } else {
      return await fetchBooks(forceRefresh);
    }
  }, [searchQuery, forceRefresh]);

  // Use the optimized fetch hook
  const { data: fetchedBooks, isLoading, error, refetch } = useOptimizedFetch<Book[]>({
    initialData: initialBooks,
    fetchFn: fetchData,
    deps: [searchQuery],
  });

  // Create a setter function for books that also updates the cache
  const setBooks = useCallback((newBooks: Book[]) => {
    // This is a no-op since we're using the optimized fetch hook
    // If you need to update books manually, you should refetch instead
    console.warn('setBooks is deprecated, use refetch instead');
    refetch();
  }, [refetch]);

  return {
    books: fetchedBooks || initialBooks,
    isLoading,
    error: error ? error.message : null,
    setBooks,
    refetch,
  };
}
