import { fetchBooks, fetchBookById, createBook, updateBook, deleteBook, searchBooks, filterBooks } from '@/lib/api';

// Mock the fetch function
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchBooks', () => {
    it('should fetch all books successfully', async () => {
      const mockBooks = [
        { id: '1', title: 'Book 1', author: 'Author 1' },
        { id: '2', title: 'Book 2', author: 'Author 2' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ books: mockBooks }),
      });

      const result = await fetchBooks();

      expect(global.fetch).toHaveBeenCalledWith('/api/books');
      expect(result).toEqual(mockBooks);
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Failed to fetch books' }),
      });

      await expect(fetchBooks()).rejects.toThrow('Failed to fetch books');
      expect(global.fetch).toHaveBeenCalledWith('/api/books');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchBooks()).rejects.toThrow('Network error');
      expect(global.fetch).toHaveBeenCalledWith('/api/books');
    });
  });

  describe('fetchBookById', () => {
    it('should fetch a book by ID successfully', async () => {
      const mockBook = { id: '1', title: 'Book 1', author: 'Author 1' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ book: mockBook }),
      });

      const result = await fetchBookById('1');

      expect(global.fetch).toHaveBeenCalledWith('/api/books/1');
      expect(result).toEqual(mockBook);
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Book not found' }),
      });

      await expect(fetchBookById('999')).rejects.toThrow('Book not found');
      expect(global.fetch).toHaveBeenCalledWith('/api/books/999');
    });
  });

  describe('createBook', () => {
    it('should create a book successfully', async () => {
      const bookData = { title: 'New Book', author: 'New Author' };
      const mockResponse = { id: '3', ...bookData, createdAt: '2023-01-01', updatedAt: '2023-01-01' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ book: mockResponse }),
      });

      const result = await createBook(bookData);

      expect(global.fetch).toHaveBeenCalledWith('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle validation errors', async () => {
      const bookData = { title: '', author: '' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Title and author are required' }),
      });

      await expect(createBook(bookData)).rejects.toThrow('Title and author are required');
    });
  });

  describe('updateBook', () => {
    it('should update a book successfully', async () => {
      const bookId = '1';
      const updateData = { title: 'Updated Title' };
      const mockResponse = { id: bookId, title: 'Updated Title', author: 'Author 1' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ book: mockResponse }),
      });

      const result = await updateBook(bookId, updateData);

      expect(global.fetch).toHaveBeenCalledWith(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should handle book not found error', async () => {
      const bookId = '999';
      const updateData = { title: 'Updated Title' };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Book not found' }),
      });

      await expect(updateBook(bookId, updateData)).rejects.toThrow('Book not found');
    });
  });

  describe('deleteBook', () => {
    it('should delete a book successfully', async () => {
      const bookId = '1';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ success: true }),
      });

      const result = await deleteBook(bookId);

      expect(global.fetch).toHaveBeenCalledWith(`/api/books/${bookId}`, {
        method: 'DELETE',
      });
      expect(result).toBe(true);
    });

    it('should handle book not found error', async () => {
      const bookId = '999';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: jest.fn().mockResolvedValueOnce({ error: 'Book not found' }),
      });

      await expect(deleteBook(bookId)).rejects.toThrow('Book not found');
    });
  });

  describe('searchBooks', () => {
    it('should search books successfully', async () => {
      const query = 'Harry Potter';
      const mockBooks = [
        { id: '1', title: 'Harry Potter 1', author: 'J.K. Rowling' },
        { id: '2', title: 'Harry Potter 2', author: 'J.K. Rowling' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ books: mockBooks }),
      });

      const result = await searchBooks(query);

      expect(global.fetch).toHaveBeenCalledWith(`/api/books/search?q=${encodeURIComponent(query)}`);
      expect(result).toEqual(mockBooks);
    });

    it('should return empty array when no matches found', async () => {
      const query = 'No matches';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ books: [] }),
      });

      const result = await searchBooks(query);

      expect(result).toEqual([]);
    });
  });

  describe('filterBooks', () => {
    it('should filter books by genre', async () => {
      const filters = { genre: 'Fantasy' };
      const mockBooks = [
        { id: '1', title: 'Book 1', author: 'Author 1', genre: 'Fantasy' },
        { id: '2', title: 'Book 2', author: 'Author 2', genre: 'Fantasy' },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ books: mockBooks }),
      });

      const result = await filterBooks(filters);

      expect(global.fetch).toHaveBeenCalledWith(`/api/books/filter?genre=Fantasy`);
      expect(result).toEqual(mockBooks);
    });

    it('should filter books by multiple criteria', async () => {
      const filters = {
        genre: 'Fantasy',
        minRating: 4,
        fromDate: '2023-01-01',
        toDate: '2023-12-31',
      };
      const mockBooks = [
        { id: '1', title: 'Book 1', author: 'Author 1', genre: 'Fantasy', rating: 5 },
      ];

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: jest.fn().mockResolvedValueOnce({ books: mockBooks }),
      });

      const result = await filterBooks(filters);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/books/filter?genre=Fantasy&minRating=4&fromDate=2023-01-01&toDate=2023-12-31`
      );
      expect(result).toEqual(mockBooks);
    });
  });
});
