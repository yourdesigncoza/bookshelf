import {
  getAllBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  searchBooks,
  filterBooksByGenre,
} from '@/lib/book-storage';
import { readJsonFile, writeJsonFile } from '@/lib/json-storage';

// Mock the json-storage module
jest.mock('@/lib/json-storage', () => ({
  readJsonFile: jest.fn(),
  writeJsonFile: jest.fn(),
  backupJsonFile: jest.fn(),
  getBackupFiles: jest.fn(),
}));

// Mock crypto.randomUUID
const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
global.crypto = {
  ...global.crypto,
  randomUUID: jest.fn().mockReturnValue(mockUUID),
};

describe('Book Storage', () => {
  const mockBooks = [
    {
      id: '1',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      rating: 5,
      dateCompleted: '2023-01-15',
      notes: 'Great book!',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      rating: 4,
      dateCompleted: '2023-02-20',
      notes: 'Classic',
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
    },
  ];

  beforeEach(() => {
    jest.resetAllMocks();
    // Mock the current date
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2023-03-01T00:00:00.000Z');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllBooks', () => {
    it('should return all books', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce(mockBooks);

      const result = await getAllBooks();

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual(mockBooks);
    });

    it('should return empty array if there is an error', async () => {
      (readJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to read file'));

      const result = await getAllBooks();

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([]);
    });
  });

  describe('getBookById', () => {
    it('should return a book by ID', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce(mockBooks);

      const result = await getBookById('1');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual(mockBooks[0]);
    });

    it('should return null if book not found', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce(mockBooks);

      const result = await getBookById('999');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toBeNull();
    });

    it('should return null if there is an error', async () => {
      (readJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to read file'));

      const result = await getBookById('1');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toBeNull();
    });
  });

  describe('addBook', () => {
    it('should add a new book', async () => {
      const newBookData = {
        title: 'New Book',
        author: 'New Author',
        genre: 'Science Fiction',
      };

      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await addBook(newBookData);

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(writeJsonFile).toHaveBeenCalledWith('books.json', [
        ...mockBooks,
        {
          ...newBookData,
          id: mockUUID,
          createdAt: '2023-03-01T00:00:00.000Z',
          updatedAt: '2023-03-01T00:00:00.000Z',
        },
      ]);

      expect(result).toEqual({
        ...newBookData,
        id: mockUUID,
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      });
    });

    it('should throw an error if writing fails', async () => {
      const newBookData = {
        title: 'New Book',
        author: 'New Author',
      };

      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to write file'));

      await expect(addBook(newBookData)).rejects.toThrow('Failed to add book');
    });
  });

  describe('updateBook', () => {
    it('should update an existing book', async () => {
      const updateData = {
        title: 'Updated Title',
        notes: 'Updated notes',
      };

      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await updateBook('1', updateData);

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(writeJsonFile).toHaveBeenCalledWith('books.json', [
        {
          ...mockBooks[0],
          ...updateData,
          updatedAt: '2023-03-01T00:00:00.000Z',
        },
        mockBooks[1],
      ]);

      expect(result).toEqual({
        ...mockBooks[0],
        ...updateData,
        updatedAt: '2023-03-01T00:00:00.000Z',
      });
    });

    it('should return null if book not found', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await updateBook('999', updateData);

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(writeJsonFile).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should throw an error if writing fails', async () => {
      const updateData = {
        title: 'Updated Title',
      };

      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to write file'));

      await expect(updateBook('1', updateData)).rejects.toThrow('Failed to update book with ID 1');
    });
  });

  describe('deleteBook', () => {
    it('should delete a book', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockResolvedValueOnce(undefined);

      const result = await deleteBook('1');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(writeJsonFile).toHaveBeenCalledWith('books.json', [mockBooks[1]]);
      expect(result).toBe(true);
    });

    it('should return false if book not found', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await deleteBook('999');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(writeJsonFile).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should throw an error if writing fails', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);
      (writeJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to write file'));

      await expect(deleteBook('1')).rejects.toThrow('Failed to delete book with ID 1');
    });
  });

  describe('searchBooks', () => {
    it('should search books by title', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await searchBooks('hobbit');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([mockBooks[0]]);
    });

    it('should search books by author', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await searchBooks('harper');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([mockBooks[1]]);
    });

    it('should search books by genre', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await searchBooks('fantasy');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([mockBooks[0]]);
    });

    it('should return empty array if no matches', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await searchBooks('no matches');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([]);
    });

    it('should return empty array if there is an error', async () => {
      (readJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to read file'));

      const result = await searchBooks('hobbit');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([]);
    });
  });

  describe('filterBooksByGenre', () => {
    it('should filter books by genre', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await filterBooksByGenre('Fantasy');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([mockBooks[0]]);
    });

    it('should return empty array if no matches', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await filterBooksByGenre('Mystery');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([]);
    });

    it('should return all books if genre is empty', async () => {
      (readJsonFile as jest.Mock).mockResolvedValueOnce([...mockBooks]);

      const result = await filterBooksByGenre('');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual(mockBooks);
    });

    it('should return empty array if there is an error', async () => {
      (readJsonFile as jest.Mock).mockRejectedValueOnce(new Error('Failed to read file'));

      const result = await filterBooksByGenre('Fantasy');

      expect(readJsonFile).toHaveBeenCalledWith('books.json');
      expect(result).toEqual([]);
    });
  });
});
