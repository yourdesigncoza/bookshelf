'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  redirectToSearchPage?: boolean;
  onSearch?: (query: string) => void;
  className?: string;
}

export function SearchBar({
  placeholder = 'Search books...',
  redirectToSearchPage = true,
  onSearch,
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Update search query when URL parameter changes
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (onSearch) {
      onSearch(searchQuery);
    }

    if (redirectToSearchPage) {
      // Redirect to search page with query
      if (searchQuery.trim()) {
        router.push(`/books/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/books/search');
      }
    } else {
      // Update URL with search query
      const params = new URLSearchParams(searchParams);
      if (searchQuery.trim()) {
        params.set('q', searchQuery.trim());
      } else {
        params.delete('q');
      }

      // Update URL
      router.replace(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative flex w-full max-w-sm items-center">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="pl-8 pr-10 h-10 sm:h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search books"
          onKeyDown={(e) => {
            // Clear search on Escape key
            if (e.key === 'Escape' && searchQuery) {
              e.preventDefault();
              setSearchQuery('');
            }
          }}
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-2 -mr-2"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </form>
  );
}
