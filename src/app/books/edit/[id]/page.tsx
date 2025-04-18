import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
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
      {/* Use dynamic import directly here for better SEO */}
      {dynamic(() => import('@/components/books/edit-book-form').then(mod => {
        const { EditBookForm } = mod;
        return { default: (props: any) => <EditBookForm {...props} /> };
      }), {
        loading: () => (
          <Card className="w-full max-w-2xl mx-auto p-4">
            <Skeleton className="w-full" style={{ height: '800px' }} />
          </Card>
        ),
        ssr: false,
      })({ book })}
    </div>
  );
}
