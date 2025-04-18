import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { getBookById } from '@/lib/book-storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Star } from 'lucide-react';

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

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    try {
      return format(parseISO(dateString), 'MMMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  // Render rating stars
  const renderRating = (rating?: number) => {
    if (!rating) return 'Not rated';

    return (
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-5 w-5 ${
              i < (rating || 0) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-2">{rating} / 5</span>
      </div>
    );
  };

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Book cover or placeholder */}
        <div className="flex justify-center">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`Cover of ${book.title}`}
              className="rounded-lg shadow-md max-h-[400px] object-contain"
            />
          ) : (
            <div className="bg-muted flex items-center justify-center rounded-lg w-full h-[400px]">
              <p className="text-muted-foreground">No cover image</p>
            </div>
          )}
        </div>

        {/* Book details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl leading-tight">{book.title}</CardTitle>
                  <CardDescription className="text-base sm:text-lg mt-1">by {book.author}</CardDescription>
                </div>
                <Button variant="outline" asChild className="h-10 sm:h-9">
                  <Link href={`/books/edit/${id}`}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Genre</h3>
                  {book.genre ? (
                    <Badge variant="outline" className="text-sm capitalize">
                      {book.genre}
                    </Badge>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Date Completed</h3>
                  <p>{formatDate(book.dateCompleted)}</p>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Rating</h3>
                  <div>{renderRating(book.rating)}</div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Pages</h3>
                  <p>{book.pageCount ? `${book.pageCount} pages` : 'Not specified'}</p>
                </div>
              </div>

              {book.notes && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="whitespace-pre-line">{book.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs sm:text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Added: {formatDate(book.createdAt)}</span>
                {book.updatedAt !== book.createdAt && (
                  <span>Last updated: {formatDate(book.updatedAt)}</span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
