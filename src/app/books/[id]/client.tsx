'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Book } from '@/lib/types';
import { useBookDetails } from '@/hooks/use-book-details';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Pencil, Star, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { BookCover } from '@/components/books/book-cover';

interface BookDetailsClientProps {
  initialBook: Book;
  bookId: string;
}

export function BookDetailsClient({ initialBook, bookId }: BookDetailsClientProps) {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the optimized book details hook
  const { book, isLoading, error, refetch } = useBookDetails({
    initialBook,
    bookId,
  });
  
  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };
  
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
            aria-hidden="true"
          />
        ))}
        <span className="ml-2">{rating} / 5</span>
      </div>
    );
  };
  
  // Loading state
  if (isLoading && !initialBook) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Back to Books</span>
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex justify-center">
            <Skeleton className="w-full h-[400px] rounded-lg" />
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-6 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-6 w-32" />
                    </div>
                  ))}
                </div>
                
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error && !book) {
    return (
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/books">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Back to Books</span>
            </Link>
          </Button>
        </div>
        
        <Card className="p-6 border-destructive/50 bg-destructive/10">
          <h2 className="text-xl font-bold mb-2">Error Loading Book</h2>
          <p className="mb-4">{error}</p>
          <Button onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? 'Refreshing...' : 'Try Again'}
          </Button>
        </Card>
      </div>
    );
  }
  
  // Use the initial book as fallback
  const displayBook = book || initialBook;
  
  return (
    <div className="container py-8">
      <div className="mb-6 flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/books">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>Back to Books</span>
          </Link>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          title="Refresh book data"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Book cover or placeholder */}
        <div className="flex justify-center">
          <BookCover
            coverUrl={displayBook.coverUrl}
            title={displayBook.title}
            author={displayBook.author}
            genre={displayBook.genre}
            width={300}
            height={450}
            priority
            className="w-full h-auto max-h-[450px]"
          />
        </div>
        
        {/* Book details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl sm:text-2xl md:text-3xl leading-tight">{displayBook.title}</CardTitle>
                  <CardDescription className="text-base sm:text-lg mt-1">by {displayBook.author}</CardDescription>
                </div>
                <Button variant="outline" asChild className="h-10 sm:h-9">
                  <Link href={`/books/edit/${bookId}`}>
                    <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
                    <span>Edit</span>
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Genre</h3>
                  {displayBook.genre ? (
                    <Badge variant="outline" className="text-sm capitalize">
                      {displayBook.genre}
                    </Badge>
                  ) : (
                    <p>Not specified</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Date Completed</h3>
                  <p>{formatDate(displayBook.dateCompleted)}</p>
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Rating</h3>
                  <div>{renderRating(displayBook.rating)}</div>
                </div>
                
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Pages</h3>
                  <p>{displayBook.pageCount ? `${displayBook.pageCount} pages` : 'Not specified'}</p>
                </div>
              </div>
              
              {displayBook.notes && (
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                  <div className="bg-muted/50 p-4 rounded-md">
                    <p className="whitespace-pre-line">{displayBook.notes}</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="text-xs sm:text-sm text-muted-foreground">
              <div className="w-full flex justify-between">
                <span>Added: {formatDate(displayBook.createdAt)}</span>
                {displayBook.updatedAt !== displayBook.createdAt && (
                  <span>Last updated: {formatDate(displayBook.updatedAt)}</span>
                )}
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
