'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { BookCover } from './book-cover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, ArrowRight } from 'lucide-react';

interface FeaturedBooksProps {
  books: Book[];
  limit?: number;
}

export function FeaturedBooks({ books, limit = 5 }: FeaturedBooksProps) {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);

  // Select featured books based on rating and recency
  useEffect(() => {
    if (!books || books.length === 0) {
      setFeaturedBooks([]);
      return;
    }

    // Sort by rating (highest first) and then by date completed (most recent first)
    const sorted = [...books].sort((a, b) => {
      // First sort by rating (highest first)
      const ratingDiff = (b.rating || 0) - (a.rating || 0);
      if (ratingDiff !== 0) return ratingDiff;

      // Then sort by date completed (most recent first)
      if (!a.readDate) return 1;
      if (!b.readDate) return -1;
      return new Date(b.readDate).getTime() - new Date(a.readDate).getTime();
    });

    // Take the top N books
    setFeaturedBooks(sorted.slice(0, limit));
  }, [books, limit]);

  if (featuredBooks.length === 0) {
    return null;
  }

  // Render rating stars
  const renderRating = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center" aria-label={`Rating: ${rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Featured Books</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/books">
            <span>View all</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {featuredBooks.map((book) => (
          <Card key={book.id} className="overflow-hidden h-full flex flex-col">
            <Link href={`/books/${book.id}`} className="flex-1 flex flex-col">
              <div className="p-3 flex justify-center">
                <BookCover
                  coverUrl={book.coverUrl}
                  title={book.title}
                  author={book.author}
                  genre={book.genre}
                  width={120}
                  height={180}
                  priority={true}
                />
              </div>
              <CardContent className="p-3 pt-0 flex-1 flex flex-col">
                <h3 className="font-medium text-sm line-clamp-2 mb-1" title={book.title}>
                  {book.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2" title={book.author}>
                  {book.author}
                </p>
                {renderRating(book.rating)}
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
