import { NextRequest } from 'next/server';
import { GET, POST, PUT } from '@/app/api/books/route';
import { GET as GET_BOOK_BY_ID, PUT as UPDATE_BOOK, DELETE as DELETE_BOOK } from '@/app/api/books/[id]/route';
import { GET as SEARCH_BOOKS } from '@/app/api/books/search/route';
import * as bookStorage from '@/lib/book-storage';

// Mock the book storage module
jest.mock('@/lib/book-storage', () => ({
  getAllBooks: jest.fn(),
  getBookById: jest.fn(),
  addBook: jest.fn(),
  updateBook: jest.fn(),
  deleteBook: jest.fn(),
  searchBooks: jest.fn(),
}));

describe('Books API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  const mockBooks = [
    {
      id: '1',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      createdAt: '2023-02-01T00:00:00.000Z',
      updatedAt: '2023-02-01T00:00:00.000Z',
    },
  ];
  
  describe('GET /api/books', () => {
    it('should return all books', async () => {
      // Mock the getAllBooks function
      (bookStorage.getAllBooks as jest.Mock).mockResolvedValueOnce(mockBooks);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books');
      
      // Call the handler
      const response = await GET(request);
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ books: mockBooks });
      expect(bookStorage.getAllBooks).toHaveBeenCalledTimes(1);
    });
    
    it('should handle errors', async () => {
      // Mock the getAllBooks function to throw an error
      (bookStorage.getAllBooks as jest.Mock).mockRejectedValueOnce(new Error('Database error'));
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books');
      
      // Call the handler and expect it to throw
      await expect(GET(request)).rejects.toThrow();
    });
  });
  
  describe('POST /api/books', () => {
    it('should create a new book', async () => {
      const newBook = {
        title: 'New Book',
        author: 'New Author',
        genre: 'Science Fiction',
      };
      
      const createdBook = {
        id: '3',
        ...newBook,
        createdAt: '2023-03-01T00:00:00.000Z',
        updatedAt: '2023-03-01T00:00:00.000Z',
      };
      
      // Mock the addBook function
      (bookStorage.addBook as jest.Mock).mockResolvedValueOnce(createdBook);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify(newBook),
      });
      
      // Call the handler
      const response = await POST(request);
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(201);
      expect(data).toEqual({ book: createdBook });
      expect(bookStorage.addBook).toHaveBeenCalledWith(newBook);
    });
    
    it('should validate required fields', async () => {
      const invalidBook = {
        // Missing title and author
        genre: 'Science Fiction',
      };
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books', {
        method: 'POST',
        body: JSON.stringify(invalidBook),
      });
      
      // Call the handler
      const response = await POST(request);
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Title and author are required' });
      expect(bookStorage.addBook).not.toHaveBeenCalled();
    });
  });
  
  describe('GET /api/books/[id]', () => {
    it('should return a book by ID', async () => {
      // Mock the getBookById function
      (bookStorage.getBookById as jest.Mock).mockResolvedValueOnce(mockBooks[0]);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/1');
      
      // Call the handler
      const response = await GET_BOOK_BY_ID(request, { params: { id: '1' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ book: mockBooks[0] });
      expect(bookStorage.getBookById).toHaveBeenCalledWith('1');
    });
    
    it('should return 404 if book not found', async () => {
      // Mock the getBookById function to return null
      (bookStorage.getBookById as jest.Mock).mockResolvedValueOnce(null);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/999');
      
      // Call the handler
      const response = await GET_BOOK_BY_ID(request, { params: { id: '999' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Book not found' });
    });
  });
  
  describe('PUT /api/books/[id]', () => {
    it('should update a book', async () => {
      const updateData = {
        title: 'Updated Title',
        notes: 'Updated notes',
      };
      
      const updatedBook = {
        ...mockBooks[0],
        ...updateData,
        updatedAt: '2023-03-01T00:00:00.000Z',
      };
      
      // Mock the updateBook function
      (bookStorage.updateBook as jest.Mock).mockResolvedValueOnce(updatedBook);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      // Call the handler
      const response = await UPDATE_BOOK(request, { params: { id: '1' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ book: updatedBook });
      expect(bookStorage.updateBook).toHaveBeenCalledWith('1', updateData);
    });
    
    it('should return 404 if book not found', async () => {
      const updateData = {
        title: 'Updated Title',
      };
      
      // Mock the updateBook function to return null
      (bookStorage.updateBook as jest.Mock).mockResolvedValueOnce(null);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/999', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });
      
      // Call the handler
      const response = await UPDATE_BOOK(request, { params: { id: '999' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Book not found' });
    });
  });
  
  describe('DELETE /api/books/[id]', () => {
    it('should delete a book', async () => {
      // Mock the deleteBook function
      (bookStorage.deleteBook as jest.Mock).mockResolvedValueOnce(true);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/1', {
        method: 'DELETE',
      });
      
      // Call the handler
      const response = await DELETE_BOOK(request, { params: { id: '1' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ success: true });
      expect(bookStorage.deleteBook).toHaveBeenCalledWith('1');
    });
    
    it('should return 404 if book not found', async () => {
      // Mock the deleteBook function to return false
      (bookStorage.deleteBook as jest.Mock).mockResolvedValueOnce(false);
      
      // Create a mock request
      const request = new NextRequest('http://localhost/api/books/999', {
        method: 'DELETE',
      });
      
      // Call the handler
      const response = await DELETE_BOOK(request, { params: { id: '999' } });
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(404);
      expect(data).toEqual({ error: 'Book not found' });
    });
  });
  
  describe('GET /api/books/search', () => {
    it('should search books by query', async () => {
      const query = 'hobbit';
      const searchResults = [mockBooks[0]];
      
      // Mock the searchBooks function
      (bookStorage.searchBooks as jest.Mock).mockResolvedValueOnce(searchResults);
      
      // Create a mock request with search params
      const url = new URL('http://localhost/api/books/search');
      url.searchParams.set('q', query);
      const request = new NextRequest(url);
      
      // Call the handler
      const response = await SEARCH_BOOKS(request);
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ books: searchResults });
      expect(bookStorage.searchBooks).toHaveBeenCalledWith(query);
    });
    
    it('should handle empty query', async () => {
      // Mock the searchBooks function
      (bookStorage.searchBooks as jest.Mock).mockResolvedValueOnce([]);
      
      // Create a mock request with empty search params
      const request = new NextRequest('http://localhost/api/books/search');
      
      // Call the handler
      const response = await SEARCH_BOOKS(request);
      const data = await response.json();
      
      // Check the response
      expect(response.status).toBe(200);
      expect(data).toEqual({ books: [] });
      expect(bookStorage.searchBooks).toHaveBeenCalledWith('');
    });
  });
});
