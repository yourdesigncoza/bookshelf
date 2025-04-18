import { Metadata } from 'next';
import { getAllBooks } from '@/lib/book-storage';
import { SearchClient } from './client';

export const metadata: Metadata = {
  title: 'Search Books | Bookshelf',
  description: 'Search for books in your personal bookshelf',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  // Get the search query from URL params
  const query = searchParams.q || '';
  
  // Fetch all books (we'll filter on the client side)
  const books = await getAllBooks();
  
  return (
    <div className="container py-8">
      <SearchClient initialBooks={books} initialQuery={query} />
    </div>
  );
}
