// Book genres
export const BOOK_GENRES = [
  'Fiction',
  'Non-Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Romance',
  'Biography',
  'History',
  'Self-Help',
  'Business',
  'Technology',
  'Science',
  'Philosophy',
  'Poetry',
  'Other'
] as const;

export type BookGenre = typeof BOOK_GENRES[number];

// Book ratings (1-5 stars)
export const BOOK_RATINGS = [1, 2, 3, 4, 5] as const;

export type BookRating = typeof BOOK_RATINGS[number];

// Book interface
export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: string;
  rating?: number;
  dateCompleted?: string;  // ISO date string
  notes?: string;
  coverUrl?: string;
  pageCount?: number;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}

// Input for creating a new book
export interface CreateBookInput {
  title: string;
  author: string;
  genre?: string;
  dateCompleted?: string;  // ISO date string
  rating?: number;
  notes?: string;
  coverUrl?: string;
  pageCount?: number;
}
