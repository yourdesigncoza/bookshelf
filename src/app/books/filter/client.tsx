'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { DynamicBooksTable, DynamicVirtualizedBooksTable } from '@/lib/dynamic-import';
import { TableViewToggle } from '@/components/books/table-view-toggle';
import { FilterBar } from '@/components/books/filter-bar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface FilterClientProps {
  initialBooks: Book[];
  initialGenre: string;
  initialRating: number;
  initialFromDate?: Date;
  initialToDate?: Date;
}

export function FilterClient({
  initialBooks,
  initialGenre,
  initialRating,
  initialFromDate,
  initialToDate
}: FilterClientProps) {
  const router = useRouter();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(initialBooks);
  const [isFiltering, setIsFiltering] = useState(false);
  const [useVirtualized, setUseVirtualized] = useState(false);

  // Handle filter changes
  const handleFilter = (filtered: Book[]) => {
    setFilteredBooks(filtered);
    setIsFiltering(false);
  };

  // Check if any filters are active
  const hasActiveFilters = initialGenre || initialRating > 0 || initialFromDate || initialToDate;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Filter Books</h1>
        <div className="flex items-center gap-4">
          <TableViewToggle onToggle={setUseVirtualized} />
          <Button variant="outline" asChild>
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Books
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <FilterBar
          books={initialBooks}
          onFilter={handleFilter}
        />
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">
          {isFiltering ? 'Filtering...' : 'Filter Results'}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {!isFiltering && (
            hasActiveFilters
              ? `Found ${filteredBooks.length} ${filteredBooks.length === 1 ? 'book' : 'books'} matching your filters`
              : 'No filters applied. Showing all books.'
          )}
        </p>
      </div>

      {useVirtualized ? (
        <DynamicVirtualizedBooksTable books={filteredBooks} isLoading={isFiltering} />
      ) : (
        <DynamicBooksTable books={filteredBooks} isLoading={isFiltering} />
      )}
    </div>
  );
}
