'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

interface BookCoverProps {
  coverUrl?: string;
  title: string;
  author: string;
  genre?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

export function BookCover({
  coverUrl,
  title,
  author,
  genre,
  width = 200,
  height = 300,
  priority = false,
  className = '',
}: BookCoverProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const imageId = `book-cover-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div
      className={`relative ${className}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {coverUrl && !hasError ? (
        <>
          {isLoading && (
            <Skeleton
              className="absolute inset-0 rounded-md"
              style={{ width: `${width}px`, height: `${height}px` }}
            />
          )}
          <Image
            src={coverUrl}
            alt={`Cover of ${title} by ${author}`}
            fill
            sizes={`(max-width: 768px) 100vw, ${width}px`}
            className={`rounded-md object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
            aria-describedby={imageId}
          />
          <span id={imageId} className="sr-only">
            Book cover image for {title} by {author}
            {genre ? `, in the ${genre} genre` : ''}
          </span>
        </>
      ) : (
        <div
          className="bg-muted flex items-center justify-center rounded-md w-full h-full"
          role="img"
          aria-label={`No cover image available for ${title} by ${author}`}
        >
          <div className="text-center p-4">
            <p className="font-medium text-sm truncate max-w-full">{title}</p>
            <p className="text-muted-foreground text-xs truncate max-w-full">
              {author}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
