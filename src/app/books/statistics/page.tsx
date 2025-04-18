import { Metadata } from 'next';
import Link from 'next/link';
import { getAllBooks } from '@/lib/book-storage';
import { StatisticsDashboard } from '@/components/books/statistics-dashboard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Reading Statistics | Bookshelf',
  description: 'View statistics about your reading habits',
};

export default async function StatisticsPage() {
  // Fetch books from the server
  const books = await getAllBooks();
  
  return (
    <div className="container py-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Reading Statistics</h1>
        <Button variant="outline" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>
      
      <StatisticsDashboard books={books} />
    </div>
  );
}
