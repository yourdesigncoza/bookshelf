'use client';

import { useState, useMemo, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
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
import { Star, ArrowUpDown, ArrowUp, ArrowDown, Pencil, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { DeleteBookButton } from './delete-book-button';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface BooksTableProps {
  books: Book[];
  isLoading?: boolean;
  onDelete?: (id: string) => void;
}

type SortField = 'title' | 'author' | 'genre' | 'dateCompleted' | 'rating';
type SortDirection = 'asc' | 'desc';

export function BooksTable({ books, isLoading = false, onDelete }: BooksTableProps) {
  const router = useRouter();
  const [sortField, setSortField] = useState<SortField>('dateCompleted');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when books change
  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

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
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
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

  // Calculate pagination
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of table
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Get current page of books
  const currentBooks = useMemo(() => {
    return sortedBooks.slice(startIndex, endIndex);
  }, [sortedBooks, startIndex, endIndex]);

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

  // Responsive design - show different views based on screen size
  return (
    <div>
      {/* Desktop view - Full table */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableCaption>A list of your books.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[250px] cursor-pointer"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center">
                  Title
                  {renderSortIcon('title')}
                </div>
              </TableHead>
              <TableHead
                className="w-[180px] cursor-pointer"
                onClick={() => handleSort('author')}
              >
                <div className="flex items-center">
                  Author
                  {renderSortIcon('author')}
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => handleSort('genre')}
              >
                <div className="flex items-center">
                  Genre
                  {renderSortIcon('genre')}
                </div>
              </TableHead>
              <TableHead
                className="w-[150px] cursor-pointer"
                onClick={() => handleSort('dateCompleted')}
              >
                <div className="flex items-center">
                  Date Completed
                  {renderSortIcon('dateCompleted')}
                </div>
              </TableHead>
              <TableHead
                className="w-[120px] cursor-pointer"
                onClick={() => handleSort('rating')}
              >
                <div className="flex items-center">
                  Rating
                  {renderSortIcon('rating')}
                </div>
              </TableHead>
              <TableHead className="text-right w-[100px]">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentBooks.map((book) => (
              <TableRow key={book.id}>
                <TableCell className="font-medium">
                  <div className="truncate max-w-[250px]" title={book.title}>
                    {book.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="truncate max-w-[180px]" title={book.author}>
                    {book.author}
                  </div>
                </TableCell>
                <TableCell>{renderGenreBadge(book.genre)}</TableCell>
                <TableCell>{formatDate(book.dateCompleted)}</TableCell>
                <TableCell>{renderRating(book.rating)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/books/${book.id}`)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => router.push(`/books/edit/${book.id}`)}
                      title="Edit book"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <DeleteBookButton
                      bookId={book.id}
                      bookTitle={book.title}
                      onDeleted={() => handleDeleteBook(book.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view - Card-based layout */}
      <div className="md:hidden space-y-4">
        {currentBooks.map((book) => (
          <div key={book.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium truncate max-w-[200px]" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={book.author}>
                  {book.author}
                </p>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-8 sm:w-8"
                  onClick={() => router.push(`/books/${book.id}`)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 sm:h-8 sm:w-8"
                  onClick={() => router.push(`/books/edit/${book.id}`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <DeleteBookButton
                  bookId={book.id}
                  bookTitle={book.title}
                  variant="ghost"
                  onDeleted={() => handleDeleteBook(book.id)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Genre:</p>
                <p>{book.genre || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date Completed:</p>
                <p>{formatDate(book.dateCompleted)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Rating:</p>
                <div className="mt-1">{renderRating(book.rating)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!isLoading && books.length > 0 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>

              {/* First page */}
              {currentPage > 3 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(1);
                    }}
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {currentPage > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Previous page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage - 1);
                    }}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => e.preventDefault()}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              {/* Next page */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(currentPage + 1);
                    }}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Ellipsis */}
              {currentPage < totalPages - 3 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Last page */}
              {currentPage < totalPages - 2 && totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(totalPages);
                    }}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="mt-2 text-center text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(endIndex, books.length)} of {books.length} books
          </div>
        </div>
      )}
    </div>
  );
}
