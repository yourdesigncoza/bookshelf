'use client';

import { useEffect, useState } from 'react';

/**
 * SkipLink component for keyboard accessibility
 * 
 * This component provides a way for keyboard users to skip to the main content,
 * bypassing navigation and other repetitive elements. It's only visible when focused,
 * making it unobtrusive for mouse users while being essential for keyboard users.
 */
export function SkipLink() {
  const [mounted, setMounted] = useState(false);

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
    >
      Skip to main content
    </a>
  );
}
