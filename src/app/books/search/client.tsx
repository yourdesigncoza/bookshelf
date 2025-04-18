'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { BooksTable } from '@/components/books/books-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, X } from 'lucide-react';

interface SearchClientProps {
  initialBooks: Book[];
  initialQuery: string;
}

export function SearchClient({ initialBooks, initialQuery }: SearchClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filter books based on search query
  const filteredBooks = debouncedQuery
    ? initialBooks.filter(book => {
        const query = debouncedQuery.toLowerCase();
        return (
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query) ||
          (book.genre && book.genre.toLowerCase().includes(query)) ||
          (book.notes && book.notes.toLowerCase().includes(query))
        );
      })
    : [];
  
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
      router.replace(`/books/search?${params.toString()}`);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, router, searchParams]);
  
  // Show searching state briefly
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      setIsSearching(true);
    } else {
      const timer = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [searchQuery, debouncedQuery]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
    
    // Update URL with search query
    const params = new URLSearchParams(searchParams);
    if (searchQuery) {
      params.set('q', searchQuery);
    } else {
      params.delete('q');
    }
    
    // Update URL
    router.replace(`/books/search?${params.toString()}`);
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Search Books</h1>
        <Button variant="outline" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by title, author, genre, or notes..."
            className="pl-8 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
      
      {debouncedQuery && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {isSearching
              ? 'Searching...'
              : `Search results for "${debouncedQuery}"`}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {!isSearching && `Found ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'}`}
          </p>
        </div>
      )}
      
      {!debouncedQuery ? (
        <div className="text-center py-12">
          <p className="text-lg font-medium">Enter a search term to find books</p>
          <p className="text-muted-foreground mt-1">
            You can search by title, author, genre, or notes
          </p>
        </div>
      ) : (
        <BooksTable books={filteredBooks} isLoading={isSearching} />
      )}
    </div>
  );
}
