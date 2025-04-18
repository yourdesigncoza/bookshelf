import Link from 'next/link';
import dynamic from 'next/dynamic';
import { getAllBooks } from '@/lib/book-storage';
import { calculateTotalBooks, calculateAverageRating, findMostReadGenre } from '@/lib/statistics';
import { Button } from '@/components/ui/button';

// Dynamically import the featured books component
const FeaturedBooks = dynamic(() => import('@/components/books/featured-books').then(mod => mod.FeaturedBooks), {
  loading: () => (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-48"></div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-64 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  ),
  ssr: false,
});
import { BookOpen, PlusCircle, Search, BarChart3, Star } from 'lucide-react';

export default async function Home() {
  // Fetch books for statistics
  const books = await getAllBooks();

  // Calculate basic statistics
  const totalBooks = calculateTotalBooks(books);
  const averageRating = calculateAverageRating(books);
  const mostReadGenre = findMostReadGenre(books);
  return (
    <div className="container py-8 md:py-12 lg:py-24 space-y-12 md:space-y-16 lg:space-y-20">
      <section className="flex flex-col items-center text-center space-y-4" aria-labelledby="main-heading">
        <div className="inline-block p-3 rounded-full bg-primary/10 text-primary">
          <BookOpen className="h-10 w-10" />
        </div>
        <h1 id="main-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Track Your Reading Journey
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] mx-auto">
          Keep track of books you've read, organize your collection, and discover new favorites.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Button size="lg" asChild>
            <Link href="/books">
              <BookOpen className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>View My Books</span>
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/books/add">
              <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
              <span>Add New Book</span>
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8" aria-label="Features">
        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <PlusCircle className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Add Books</h2>
          <p className="text-muted-foreground">
            Easily add books to your collection with details like title, author, genre, and your personal rating.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Organize Collection</h2>
          <p className="text-muted-foreground">
            Keep your reading list organized with sorting, filtering, and search capabilities.
          </p>
        </div>

        <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-card">
          <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
            <Search className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Search & Filter</h2>
          <p className="text-muted-foreground">
            Quickly find books in your collection with powerful search and filtering options.
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="rounded-lg border bg-card p-6" aria-labelledby="stats-heading">
        <div className="flex flex-col md:flex-row items-center justify-between mb-4 md:mb-6 space-y-3 md:space-y-0">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 rounded-full bg-primary/10 text-primary mr-2 sm:mr-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h2 id="stats-heading" className="text-xl sm:text-2xl font-semibold">Your Reading Statistics</h2>
          </div>
          <Button asChild>
            <Link href="/books/statistics">
              <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>View Detailed Statistics</span>
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {/* Total Books */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
            <h3 className="text-lg font-medium mb-2">Total Books</h3>
            <p className="text-3xl font-bold">{totalBooks}</p>
          </div>

          {/* Average Rating */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
            <h3 className="text-lg font-medium mb-2">Average Rating</h3>
            <div className="flex items-center">
              <p className="text-3xl font-bold mr-2">{averageRating}</p>
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>

          {/* Most Read Genre */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg border bg-card">
            <h3 className="text-lg font-medium mb-2">Most Read Genre</h3>
            <p className="text-3xl font-bold capitalize">
              {mostReadGenre ? mostReadGenre.genre : 'None'}
            </p>
            {mostReadGenre && (
              <p className="text-sm text-muted-foreground">
                {mostReadGenre.count} books
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      {books.length > 0 && (
        <section className="rounded-lg border bg-card p-6" aria-labelledby="featured-books-heading">
          <FeaturedBooks books={books} limit={5} />
        </section>
      )}

      <section className="text-center" aria-labelledby="cta-heading">
        <h2 id="cta-heading" className="text-2xl font-bold mb-4">Ready to start tracking your books?</h2>
        <Button size="lg" asChild>
          <Link href="/books/add">
            <PlusCircle className="mr-2 h-5 w-5" aria-hidden="true" />
            <span>Add Your First Book</span>
          </Link>
        </Button>
      </section>
    </div>
  );
}
