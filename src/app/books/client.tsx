'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { BooksTable } from '@/components/books/books-table';
import { FilterBar } from '@/components/books/filter-bar';
import { SearchBar } from '@/components/books/search-bar';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useBooks } from '@/hooks/use-books';

interface BooksClientProps {
  initialBooks: Book[];
}

export function BooksClient({ initialBooks }: BooksClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialGenre = searchParams.get('genre') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

  // Use the custom hook to fetch and filter books
  const { books, isLoading, error } = useBooks({
    initialBooks,
    searchQuery: debouncedQuery,
  });

  // Handle filter changes
  const handleFilter = (filtered: Book[]) => {
    setFilteredBooks(filtered);
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);

      // Update URL with search query
      const params = new URLSearchParams(searchParams);
      if (searchQuery) {
        params.set('q', searchQuery);
      } else {
        params.delete('q');
      }

      // Update URL
      router.replace(`/books?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);

  // Set filtered books when books change
  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  // Clear search query
  const clearSearch = () => {
    setSearchQuery('');
    router.replace('/books');
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Books</h1>
        <Button asChild>
          <Link href="/books/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Book
          </Link>
        </Button>
      </div>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <SearchBar
              placeholder="Search books..."
              redirectToSearchPage={false}
              onSearch={(query) => setSearchQuery(query)}
              className="w-full"
            />
          </div>
        </div>

        <FilterBar
          books={books}
          onFilter={handleFilter}
        />

        {searchQuery && (
          <div className="text-sm text-muted-foreground">
            {filteredBooks.length === 0 ? (
              <p>No books found matching your filters.</p>
            ) : (
              <p>
                Showing {filteredBooks.length} {filteredBooks.length === 1 ? 'book' : 'books'}
                {searchQuery && <span> matching &quot;{searchQuery}&quot;</span>}
              </p>
            )}
          </div>
        )}
      </div>

      <BooksTable books={filteredBooks} isLoading={isLoading} />

      {error && (
        <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md">
          <p>Error loading books: {error}</p>
        </div>
      )}
    </div>
  );
}
