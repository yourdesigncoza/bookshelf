import {
  calculateTotalBooks,
  calculateAverageRating,
  findMostReadGenre,
  calculateTotalPagesRead,
  calculateBooksPerMonth,
  calculateBooksPerYear,
  calculateRatingDistribution,
  calculateGenreDistribution,
  calculateAllStatistics,
} from '@/lib/statistics';
import { Book } from '@/lib/types';

describe('Statistics Utility', () => {
  // Mock books data for testing
  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'Book 1',
      author: 'Author 1',
      genre: 'Fantasy',
      rating: 5,
      dateCompleted: '2023-01-15',
      pageCount: 300,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'Book 2',
      author: 'Author 2',
      genre: 'Fantasy',
      rating: 4,
      dateCompleted: '2023-02-20',
      pageCount: 250,
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
    },
    {
      id: '3',
      title: 'Book 3',
      author: 'Author 3',
      genre: 'Science Fiction',
      rating: 3,
      dateCompleted: '2023-03-10',
      pageCount: 400,
      createdAt: '2023-03-01T00:00:00.000Z',
      updatedAt: '2023-03-01T00:00:00.000Z',
    },
    {
      id: '4',
      title: 'Book 4',
      author: 'Author 4',
      genre: 'Mystery',
      rating: 4,
      dateCompleted: '2022-12-15',
      pageCount: 350,
      createdAt: '2022-12-01T00:00:00.000Z',
      updatedAt: '2022-12-01T00:00:00.000Z',
    },
  ];
  
  // Mock current date for consistent testing
  beforeEach(() => {
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(2023);
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('calculateTotalBooks', () => {
    it('should return the total number of books', () => {
      const result = calculateTotalBooks(mockBooks);
      expect(result).toBe(4);
    });
    
    it('should return 0 for empty array', () => {
      const result = calculateTotalBooks([]);
      expect(result).toBe(0);
    });
  });
  
  describe('calculateAverageRating', () => {
    it('should calculate the average rating correctly', () => {
      const result = calculateAverageRating(mockBooks);
      expect(result).toBe(4.0); // (5 + 4 + 3 + 4) / 4 = 4.0
    });
    
    it('should handle books without ratings', () => {
      const booksWithoutRatings = [
        { ...mockBooks[0], rating: undefined },
        { ...mockBooks[1], rating: undefined },
      ];
      const result = calculateAverageRating(booksWithoutRatings);
      expect(result).toBe(0);
    });
    
    it('should return 0 for empty array', () => {
      const result = calculateAverageRating([]);
      expect(result).toBe(0);
    });
  });
  
  describe('findMostReadGenre', () => {
    it('should find the most read genre', () => {
      const result = findMostReadGenre(mockBooks);
      expect(result).toBe('Fantasy'); // 2 Fantasy books vs 1 each for others
    });
    
    it('should handle books without genres', () => {
      const booksWithoutGenres = [
        { ...mockBooks[0], genre: undefined },
        { ...mockBooks[1], genre: undefined },
        mockBooks[2],
      ];
      const result = findMostReadGenre(booksWithoutGenres);
      expect(result).toBe('Science Fiction');
    });
    
    it('should return null for empty array', () => {
      const result = findMostReadGenre([]);
      expect(result).toBeNull();
    });
  });
  
  describe('calculateTotalPagesRead', () => {
    it('should calculate total pages read correctly', () => {
      const result = calculateTotalPagesRead(mockBooks);
      expect(result).toBe(1300); // 300 + 250 + 400 + 350 = 1300
    });
    
    it('should handle books without page counts', () => {
      const booksWithoutPageCounts = [
        { ...mockBooks[0], pageCount: undefined },
        mockBooks[1],
      ];
      const result = calculateTotalPagesRead(booksWithoutPageCounts);
      expect(result).toBe(250); // Only count books with page counts
    });
    
    it('should return 0 for empty array', () => {
      const result = calculateTotalPagesRead([]);
      expect(result).toBe(0);
    });
  });
  
  describe('calculateBooksPerMonth', () => {
    it('should calculate books read per month in current year', () => {
      const result = calculateBooksPerMonth(mockBooks);
      
      // Only books from 2023 should be counted
      expect(result['January']).toBe(1);
      expect(result['February']).toBe(1);
      expect(result['March']).toBe(1);
      expect(result['December']).toBe(0); // This book is from 2022
    });
    
    it('should handle books without completion dates', () => {
      const booksWithoutDates = [
        { ...mockBooks[0], dateCompleted: undefined },
        mockBooks[1],
      ];
      const result = calculateBooksPerMonth(booksWithoutDates);
      
      expect(result['January']).toBe(0); // Book without date should not be counted
      expect(result['February']).toBe(1);
    });
  });
  
  describe('calculateBooksPerYear', () => {
    it('should calculate books read per year', () => {
      const result = calculateBooksPerYear(mockBooks);
      
      expect(result['2022']).toBe(1);
      expect(result['2023']).toBe(3);
    });
    
    it('should handle books without completion dates', () => {
      const booksWithoutDates = [
        { ...mockBooks[0], dateCompleted: undefined },
        mockBooks[1],
      ];
      const result = calculateBooksPerYear(booksWithoutDates);
      
      expect(result['2023']).toBe(1);
      expect(Object.keys(result).length).toBe(1); // Only years with books should be included
    });
    
    it('should return empty object for empty array', () => {
      const result = calculateBooksPerYear([]);
      expect(Object.keys(result).length).toBe(0);
    });
  });
  
  describe('calculateRatingDistribution', () => {
    it('should calculate rating distribution correctly', () => {
      const result = calculateRatingDistribution(mockBooks);
      
      expect(result[3]).toBe(1); // 1 book with rating 3
      expect(result[4]).toBe(2); // 2 books with rating 4
      expect(result[5]).toBe(1); // 1 book with rating 5
      expect(result[1]).toBe(0); // No books with rating 1
      expect(result[2]).toBe(0); // No books with rating 2
    });
    
    it('should handle books without ratings', () => {
      const booksWithoutRatings = [
        { ...mockBooks[0], rating: undefined },
        mockBooks[1],
      ];
      const result = calculateRatingDistribution(booksWithoutRatings);
      
      expect(result[4]).toBe(1);
      expect(Object.values(result).reduce((a, b) => a + b)).toBe(1); // Only 1 book with rating
    });
  });
  
  describe('calculateGenreDistribution', () => {
    it('should calculate genre distribution correctly', () => {
      const result = calculateGenreDistribution(mockBooks);
      
      expect(result['Fantasy']).toBe(2);
      expect(result['Science Fiction']).toBe(1);
      expect(result['Mystery']).toBe(1);
    });
    
    it('should handle books without genres', () => {
      const booksWithoutGenres = [
        { ...mockBooks[0], genre: undefined },
        mockBooks[1],
        mockBooks[2],
      ];
      const result = calculateGenreDistribution(booksWithoutGenres);
      
      expect(result['Fantasy']).toBe(1);
      expect(result['Science Fiction']).toBe(1);
      expect(result['Unknown']).toBe(1); // Books without genre are counted as "Unknown"
    });
    
    it('should return empty object for empty array', () => {
      const result = calculateGenreDistribution([]);
      expect(Object.keys(result).length).toBe(0);
    });
  });
  
  describe('calculateAllStatistics', () => {
    it('should calculate all statistics correctly', () => {
      const result = calculateAllStatistics(mockBooks);
      
      expect(result).toEqual({
        totalBooks: 4,
        averageRating: 4.0,
        mostReadGenre: 'Fantasy',
        totalPagesRead: 1300,
        booksPerMonth: expect.any(Object),
        booksPerYear: expect.any(Object),
        ratingDistribution: expect.any(Object),
        genreDistribution: expect.any(Object),
      });
    });
    
    it('should handle errors gracefully', () => {
      // Mock an error in one of the calculation functions
      jest.spyOn(console, 'error').mockImplementation(() => {});
      jest.spyOn(global, 'Error').mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const result = calculateAllStatistics(mockBooks);
      
      expect(result).toBeNull();
    });
  });
});
