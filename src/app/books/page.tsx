import { Metadata } from 'next';
import { getAllBooks } from '@/lib/book-storage';
import { BooksClient } from './client';

export const metadata: Metadata = {
  title: 'My Books | Bookshelf',
  description: 'View all your books in your personal bookshelf',
};

export default async function BooksPage() {
  // Fetch books from the server
  const books = await getAllBooks();

  return (
    <div className="container py-8">
      <BooksClient initialBooks={books} />
    </div>
  );
}
