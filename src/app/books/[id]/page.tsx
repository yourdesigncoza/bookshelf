import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBookById } from '@/lib/book-storage';
import { BookDetailsClient } from './client';



export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const book = await getBookById(params.id);

  if (!book) {
    return {
      title: 'Book Not Found | Bookshelf',
    };
  }

  return {
    title: `${book.title} | Bookshelf`,
    description: `Details about ${book.title} by ${book.author}`,
  };
}

interface BookPageProps {
  params: {
    id: string;
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = params;

  // Fetch the book data
  const book = await getBookById(id);

  // If the book doesn't exist, show a 404 page
  if (!book) {
    notFound();
  }

  return <BookDetailsClient initialBook={book} bookId={id} />;
}
