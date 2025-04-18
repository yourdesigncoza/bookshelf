import { Metadata } from 'next';
import { BookForm } from '@/components/books/book-form';

export const metadata: Metadata = {
  title: 'Add New Book | Bookshelf',
  description: 'Add a new book to your reading list',
};

export default function AddBookPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Add New Book</h1>
      <BookForm />
    </div>
  );
}
