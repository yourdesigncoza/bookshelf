import { Book } from './types';
import { logger } from './logger';

/**
 * Calculate the total number of books
 */
export function calculateTotalBooks(books: Book[]): number {
  return books.length;
}

/**
 * Calculate the average rating of all books
 * Returns 0 if no books have ratings
 */
export function calculateAverageRating(books: Book[]): number {
  const booksWithRatings = books.filter(book => typeof book.rating === 'number');
  
  if (booksWithRatings.length === 0) {
    return 0;
  }
  
  const totalRating = booksWithRatings.reduce((sum, book) => sum + (book.rating || 0), 0);
  return parseFloat((totalRating / booksWithRatings.length).toFixed(1));
}

/**
 * Find the most read genre
 * Returns null if no books have genres
 */
export function findMostReadGenre(books: Book[]): { genre: string; count: number } | null {
  const booksWithGenres = books.filter(book => book.genre);
  
  if (booksWithGenres.length === 0) {
    return null;
  }
  
  // Count books by genre
  const genreCounts: Record<string, number> = {};
  
  booksWithGenres.forEach(book => {
    const genre = book.genre as string;
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });
  
  // Find the genre with the highest count
  let mostReadGenre = '';
  let highestCount = 0;
  
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count > highestCount) {
      mostReadGenre = genre;
      highestCount = count;
    }
  });
  
  return { genre: mostReadGenre, count: highestCount };
}

/**
 * Calculate the total pages read
 * Returns 0 if no books have page counts
 */
export function calculateTotalPagesRead(books: Book[]): number {
  return books.reduce((sum, book) => sum + (book.pageCount || 0), 0);
}

/**
 * Calculate the number of books read per month in the current year
 */
export function calculateBooksPerMonth(books: Book[]): Record<string, number> {
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter(book => {
    if (!book.dateCompleted) return false;
    const completedDate = new Date(book.dateCompleted);
    return completedDate.getFullYear() === currentYear;
  });
  
  // Initialize months
  const months: Record<string, number> = {
    'January': 0,
    'February': 0,
    'March': 0,
    'April': 0,
    'May': 0,
    'June': 0,
    'July': 0,
    'August': 0,
    'September': 0,
    'October': 0,
    'November': 0,
    'December': 0
  };
  
  // Count books by month
  booksThisYear.forEach(book => {
    if (!book.dateCompleted) return;
    
    const completedDate = new Date(book.dateCompleted);
    const monthIndex = completedDate.getMonth();
    const monthNames = Object.keys(months);
    
    months[monthNames[monthIndex]]++;
  });
  
  return months;
}

/**
 * Calculate the number of books read per year
 */
export function calculateBooksPerYear(books: Book[]): Record<number, number> {
  const booksWithDates = books.filter(book => book.dateCompleted);
  const yearCounts: Record<number, number> = {};
  
  booksWithDates.forEach(book => {
    if (!book.dateCompleted) return;
    
    const completedDate = new Date(book.dateCompleted);
    const year = completedDate.getFullYear();
    
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });
  
  // Sort years in descending order
  return Object.fromEntries(
    Object.entries(yearCounts)
      .sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA))
  );
}

/**
 * Calculate the distribution of ratings
 */
export function calculateRatingDistribution(books: Book[]): Record<number, number> {
  const distribution: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };
  
  books.forEach(book => {
    if (typeof book.rating === 'number' && book.rating >= 1 && book.rating <= 5) {
      distribution[book.rating]++;
    }
  });
  
  return distribution;
}

/**
 * Calculate the distribution of genres
 */
export function calculateGenreDistribution(books: Book[]): Record<string, number> {
  const distribution: Record<string, number> = {};
  
  books.forEach(book => {
    if (book.genre) {
      distribution[book.genre] = (distribution[book.genre] || 0) + 1;
    }
  });
  
  // Sort genres by count (descending)
  return Object.fromEntries(
    Object.entries(distribution)
      .sort(([, countA], [, countB]) => countB - countA)
  );
}

/**
 * Calculate all statistics for the given books
 */
export function calculateAllStatistics(books: Book[]) {
  try {
    return {
      totalBooks: calculateTotalBooks(books),
      averageRating: calculateAverageRating(books),
      mostReadGenre: findMostReadGenre(books),
      totalPagesRead: calculateTotalPagesRead(books),
      booksPerMonth: calculateBooksPerMonth(books),
      booksPerYear: calculateBooksPerYear(books),
      ratingDistribution: calculateRatingDistribution(books),
      genreDistribution: calculateGenreDistribution(books)
    };
  } catch (error) {
    logger.error('Error calculating statistics', { error });
    return null;
  }
}
