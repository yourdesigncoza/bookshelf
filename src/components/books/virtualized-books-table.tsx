'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/lib/types';
import { Star, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Eye } from 'lucide-react';
import { DeleteBookButton } from './delete-book-button';
import { BookCover } from './book-cover';

interface VirtualizedBooksTableProps {
  books: Book[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

type SortField = 'title' | 'author' | 'genre' | 'dateCompleted' | 'rating';
type SortDirection = 'asc' | 'desc';

export function VirtualizedBooksTable({ books, isLoading = false, onDelete }: VirtualizedBooksTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('dateCompleted');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const tableRef = useRef<HTMLDivElement>(null);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Render rating stars
  const renderRating = (rating?: number) => {
    if (!rating) return 'Not rated';

    return (
      <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  // Render genre badge
  const renderGenreBadge = (genre?: string) => {
    if (!genre) return null;

    return (
      <Badge variant="outline" className="capitalize">
        {genre}
      </Badge>
    );
  };

  // Handle book deletion
  const handleDeleteBook = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  // Sort books
  const sortedBooks = useMemo(() => {
    if (!books || books.length === 0) return [];

    return [...books].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'author':
          comparison = (a.author || '').localeCompare(b.author || '');
          break;
        case 'genre':
          comparison = (a.genre || '').localeCompare(b.genre || '');
          break;
        case 'dateCompleted':
          // Handle missing dates
          if (!a.dateCompleted) return 1;
          if (!b.dateCompleted) return -1;
          comparison = new Date(a.dateCompleted).getTime() - new Date(b.dateCompleted).getTime();
          break;
        case 'rating':
          // Handle missing ratings
          if (!a.rating) return 1;
          if (!b.rating) return -1;
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [books, sortField, sortDirection]);

  // Row renderer for virtualized list
  const Row = useCallback(
    ({ index, style }: { index: number; style: React.CSSProperties }) => {
      const book = sortedBooks[index];
      if (!book) return null;

      return (
        <div style={style} className="flex items-center border-b border-border">
          <div className="flex-1 flex items-center p-2">
            <div className="flex items-center gap-3 w-[250px]">
              <BookCover
                coverUrl={book.coverUrl}
                title={book.title}
                author={book.author}
                genre={book.genre}
                width={40}
                height={60}
                className="hidden sm:block"
              />
              <div className="truncate max-w-[200px]" title={book.title}>
                {book.title}
              </div>
            </div>
          </div>
          <div className="flex-1 p-2 w-[180px]">
            <div className="truncate max-w-[180px]" title={book.author}>
              {book.author}
            </div>
          </div>
          <div className="flex-1 p-2 w-[120px]">
            {renderGenreBadge(book.genre)}
          </div>
          <div className="flex-1 p-2 w-[150px]">
            {formatDate(book.dateCompleted)}
          </div>
          <div className="flex-1 p-2 w-[120px]">
            {renderRating(book.rating)}
          </div>
          <div className="p-2 w-[100px] flex justify-end gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/books/${book.id}`)}
              title="View details"
              aria-label={`View details for ${book.title}`}
            >
              <Eye className="h-4 w-4" aria-hidden="true" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/books/edit/${book.id}`)}
              title="Edit book"
              aria-label={`Edit ${book.title}`}
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
            </Button>

            <DeleteBookButton
              bookId={book.id}
              bookTitle={book.title}
              onDeleted={() => handleDeleteBook(book.id)}
            />
          </div>
        </div>
      );
    },
    [sortedBooks, router, handleDeleteBook]
  );

  // Placeholder for empty state
  if (!isLoading && (!books || books.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium mb-2">No books found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't added any books to your bookshelf yet.
        </p>
        <Button onClick={() => router.push('/books/add')}>
          Add Your First Book
        </Button>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-pulse flex flex-col w-full space-y-4">
          <div className="h-8 bg-muted rounded w-full"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center p-4 bg-muted/50 border-b">
        <div className="flex-1 flex items-center cursor-pointer" onClick={() => handleSort('title')}>
          <div className="flex items-center">
            Title
            {renderSortIcon('title')}
          </div>
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => handleSort('author')}>
          <div className="flex items-center">
            Author
            {renderSortIcon('author')}
          </div>
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => handleSort('genre')}>
          <div className="flex items-center">
            Genre
            {renderSortIcon('genre')}
          </div>
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => handleSort('dateCompleted')}>
          <div className="flex items-center">
            Date Completed
            {renderSortIcon('dateCompleted')}
          </div>
        </div>
        <div className="flex-1 cursor-pointer" onClick={() => handleSort('rating')}>
          <div className="flex items-center">
            Rating
            {renderSortIcon('rating')}
          </div>
        </div>
        <div className="w-[100px] text-right">
          Actions
        </div>
      </div>

      <div className="w-full" style={{ height: 'calc(100vh - 300px)', minHeight: '400px' }}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              width={width}
              itemCount={sortedBooks.length}
              itemSize={80}
              overscanCount={5}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
