import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EditBookForm } from '@/components/books/edit-book-form';
import { getBookById } from '@/lib/book-storage';

export const metadata: Metadata = {
  title: 'Edit Book | Bookshelf',
  description: 'Edit a book in your reading list',
};

interface EditBookPageProps {
  params: {
    id: string;
  };
}

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = params;
  
  // Fetch the book data
  const book = await getBookById(id);
  
  // If the book doesn't exist, show a 404 page
  if (!book) {
    notFound();
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Edit Book</h1>
      <EditBookForm book={book} />
    </div>
  );
}
