import { Metadata } from 'next';
import { getAllBooks } from '@/lib/book-storage';
import { FilterClient } from './client';

export const metadata: Metadata = {
  title: 'Filter Books | Bookshelf',
  description: 'Filter books in your personal bookshelf',
};

export default async function FilterPage({
  searchParams,
}: {
  searchParams: { genre?: string; rating?: string; fromDate?: string; toDate?: string };
}) {
  // Get the filter params from URL
  const { genre, rating, fromDate, toDate } = searchParams;
  
  // Fetch all books (we'll filter on the client side)
  const books = await getAllBooks();
  
  return (
    <div className="container py-8">
      <FilterClient 
        initialBooks={books} 
        initialGenre={genre || ''} 
        initialRating={rating ? parseInt(rating) : 0}
        initialFromDate={fromDate ? new Date(fromDate) : undefined}
        initialToDate={toDate ? new Date(toDate) : undefined}
      />
    </div>
  );
}
