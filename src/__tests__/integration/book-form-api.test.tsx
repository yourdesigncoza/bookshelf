import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '@/components/books/book-form';
import { useRouter } from 'next/navigation';
import * as api from '@/lib/api';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the API module
jest.mock('@/lib/api', () => ({
  createBook: jest.fn(),
  updateBook: jest.fn(),
  fetchBookById: jest.fn(),
}));

describe('Book Form and API Integration', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });
  
  describe('Creating a new book', () => {
    it('should submit form data to the API and redirect on success', async () => {
      // Mock the API response
      const mockResponse = {
        id: '123',
        title: 'Test Book',
        author: 'Test Author',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };
      (api.createBook as jest.Mock).mockResolvedValueOnce(mockResponse);
      
      // Render the form
      render(<BookForm />);
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Test Author' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));
      
      // Wait for the API call and redirect
      await waitFor(() => {
        expect(api.createBook).toHaveBeenCalledWith(expect.objectContaining({
          title: 'Test Book',
          author: 'Test Author',
        }));
        expect(mockRouter.push).toHaveBeenCalledWith('/books');
      });
    });
    
    it('should display error message on API failure', async () => {
      // Mock the API to throw an error
      (api.createBook as jest.Mock).mockRejectedValueOnce(new Error('Failed to create book'));
      
      // Render the form
      render(<BookForm />);
      
      // Fill in the form
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Test Author' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));
      
      // Wait for the error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to create book/i)).toBeInTheDocument();
      });
      
      // Should not redirect
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
  
  describe('Updating an existing book', () => {
    const existingBook = {
      id: '123',
      title: 'Existing Book',
      author: 'Existing Author',
      genre: 'Fantasy',
      dateCompleted: '2023-01-15T00:00:00.000Z',
      rating: 4,
      notes: 'Great book!',
      coverUrl: 'https://example.com/cover.jpg',
      pageCount: 300,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    };
    
    it('should load existing book data and submit updates to the API', async () => {
      // Mock the API responses
      (api.updateBook as jest.Mock).mockResolvedValueOnce({
        ...existingBook,
        title: 'Updated Title',
        updatedAt: '2023-02-01T00:00:00.000Z',
      });
      
      // Render the form with existing book
      render(<BookForm book={existingBook} />);
      
      // Check if form is pre-filled with existing data
      expect(screen.getByLabelText(/Title/i)).toHaveValue('Existing Book');
      expect(screen.getByLabelText(/Author/i)).toHaveValue('Existing Author');
      
      // Update the title
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Update Book/i }));
      
      // Wait for the API call and redirect
      await waitFor(() => {
        expect(api.updateBook).toHaveBeenCalledWith('123', expect.objectContaining({
          title: 'Updated Title',
          author: 'Existing Author',
        }));
        expect(mockRouter.push).toHaveBeenCalledWith('/books');
      });
    });
    
    it('should display error message on API update failure', async () => {
      // Mock the API to throw an error
      (api.updateBook as jest.Mock).mockRejectedValueOnce(new Error('Failed to update book'));
      
      // Render the form with existing book
      render(<BookForm book={existingBook} />);
      
      // Update the title
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Updated Title' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Update Book/i }));
      
      // Wait for the error message
      await waitFor(() => {
        expect(screen.getByText(/Failed to update book/i)).toBeInTheDocument();
      });
      
      // Should not redirect
      expect(mockRouter.push).not.toHaveBeenCalled();
    });
  });
  
  describe('Form validation', () => {
    it('should validate required fields before API call', async () => {
      // Render the form
      render(<BookForm />);
      
      // Submit the form without filling required fields
      fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));
      
      // Wait for validation errors
      await waitFor(() => {
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Author is required/i)).toBeInTheDocument();
      });
      
      // API should not be called
      expect(api.createBook).not.toHaveBeenCalled();
    });
    
    it('should validate URL format for cover URL', async () => {
      // Render the form
      render(<BookForm />);
      
      // Fill in required fields
      fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Book' } });
      fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Test Author' } });
      
      // Enter invalid URL
      fireEvent.change(screen.getByLabelText(/Cover URL/i), { target: { value: 'invalid-url' } });
      
      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));
      
      // Wait for validation error
      await waitFor(() => {
        expect(screen.getByText(/Invalid URL format/i)).toBeInTheDocument();
      });
      
      // API should not be called
      expect(api.createBook).not.toHaveBeenCalled();
    });
  });
});
