'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Book, BOOK_GENRES } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { CalendarIcon, FilterX, Star, X } from 'lucide-react';

interface FilterBarProps {
  books: Book[];
  onFilter?: (filteredBooks: Book[]) => void;
  className?: string;
}

export function FilterBar({ books, onFilter, className = '' }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get unique genres from books
  const genres = [...new Set(books.map(book => book.genre).filter(Boolean))];

  // Get filter values from URL
  const initialGenre = searchParams.get('genre') || '';
  const initialRating = searchParams.get('rating') ? parseInt(searchParams.get('rating') as string) : 0;
  const initialFromDate = searchParams.get('fromDate') ? new Date(searchParams.get('fromDate') as string) : undefined;
  const initialToDate = searchParams.get('toDate') ? new Date(searchParams.get('toDate') as string) : undefined;

  // State for filters
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedRating, setSelectedRating] = useState(initialRating);
  const [fromDate, setFromDate] = useState<Date | undefined>(initialFromDate);
  const [toDate, setToDate] = useState<Date | undefined>(initialToDate);

  // Track if any filters are active
  const hasActiveFilters = selectedGenre || selectedRating > 0 || fromDate || toDate;

  // Apply filters to books
  const applyFilters = () => {
    let filteredBooks = [...books];

    // Filter by genre
    if (selectedGenre) {
      filteredBooks = filteredBooks.filter(book => book.genre === selectedGenre);
    }

    // Filter by rating
    if (selectedRating > 0) {
      filteredBooks = filteredBooks.filter(book => (book.rating || 0) >= selectedRating);
    }

    // Filter by date range
    if (fromDate) {
      const fromTimestamp = fromDate.getTime();
      filteredBooks = filteredBooks.filter(book => {
        if (!book.dateCompleted) return false;
        return new Date(book.dateCompleted).getTime() >= fromTimestamp;
      });
    }

    if (toDate) {
      const toTimestamp = toDate.getTime();
      filteredBooks = filteredBooks.filter(book => {
        if (!book.dateCompleted) return false;
        return new Date(book.dateCompleted).getTime() <= toTimestamp;
      });
    }

    // Call onFilter callback if provided
    if (onFilter) {
      onFilter(filteredBooks);
    }

    // Update URL with filter params
    const params = new URLSearchParams(searchParams);

    if (selectedGenre) {
      params.set('genre', selectedGenre);
    } else {
      params.delete('genre');
    }

    if (selectedRating > 0) {
      params.set('rating', selectedRating.toString());
    } else {
      params.delete('rating');
    }

    if (fromDate) {
      params.set('fromDate', fromDate.toISOString());
    } else {
      params.delete('fromDate');
    }

    if (toDate) {
      params.set('toDate', toDate.toISOString());
    } else {
      params.delete('toDate');
    }

    // Update URL
    router.replace(`${pathname}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedGenre('');
    setSelectedRating(0);
    setFromDate(undefined);
    setToDate(undefined);

    // Update URL by removing filter params
    const params = new URLSearchParams(searchParams);
    params.delete('genre');
    params.delete('rating');
    params.delete('fromDate');
    params.delete('toDate');

    // Update URL
    router.replace(`${pathname}?${params.toString()}`);

    // Call onFilter callback if provided
    if (onFilter) {
      onFilter(books);
    }
  };

  // Apply filters when they change
  useEffect(() => {
    applyFilters();
  }, [selectedGenre, selectedRating, fromDate, toDate]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Genre filter */}
        <Select value={selectedGenre} onValueChange={setSelectedGenre}>
          <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-9">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Genres</SelectItem>
            {genres.map((genre) => (
              <SelectItem key={genre} value={genre || ''}>
                {genre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Rating filter */}
        <Select
          value={selectedRating ? selectedRating.toString() : ''}
          onValueChange={(value) => setSelectedRating(value ? parseInt(value) : 0)}
        >
          <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-9">
            <SelectValue placeholder="Any Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any Rating</SelectItem>
            {[5, 4, 3, 2, 1].map((rating) => (
              <SelectItem key={rating} value={rating.toString()}>
                {rating}+ <Star className="inline-block h-3 w-3 ml-1 fill-yellow-500 text-yellow-500" />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date range filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* From date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal h-10 sm:h-9"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {fromDate ? format(fromDate, 'PP') : 'From Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={fromDate}
                onSelect={setFromDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* To date */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[180px] justify-start text-left font-normal h-10 sm:h-9"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {toDate ? format(toDate, 'PP') : 'To Date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={toDate}
                onSelect={setToDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto h-10 sm:h-9">
            <FilterX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedGenre && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Genre: {selectedGenre}
              <button
                onClick={() => setSelectedGenre('')}
                className="ml-1 rounded-full hover:bg-muted p-1.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {selectedRating > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Rating: {selectedRating}+
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <button
                onClick={() => setSelectedRating(0)}
                className="ml-1 rounded-full hover:bg-muted p-1.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {fromDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              From: {format(fromDate, 'PP')}
              <button
                onClick={() => setFromDate(undefined)}
                className="ml-1 rounded-full hover:bg-muted p-1.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}

          {toDate && (
            <Badge variant="secondary" className="flex items-center gap-1">
              To: {format(toDate, 'PP')}
              <button
                onClick={() => setToDate(undefined)}
                className="ml-1 rounded-full hover:bg-muted p-1.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
