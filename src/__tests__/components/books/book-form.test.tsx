import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '@/components/books/book-form';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the API service
jest.mock('@/lib/api', () => ({
  addBook: jest.fn().mockResolvedValue({ id: '123' }),
  updateBook: jest.fn().mockResolvedValue({ id: '123' }),
}));

describe('BookForm', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  
  const mockBook = {
    id: '123',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    dateCompleted: '2023-01-15',
    rating: 5,
    coverUrl: 'https://example.com/cover.jpg',
    pageCount: 295,
    notes: 'Great book!',
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });
  
  it('renders the form with default values for new book', () => {
    render(<BookForm />);
    
    // Check if form elements are rendered
    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Author/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Genre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date Completed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cover URL/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Page Count/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Notes/i)).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Book/i })).toBeInTheDocument();
    
    // Check if form title is correct
    expect(screen.getByText('Add New Book')).toBeInTheDocument();
  });
  
  it('renders the form with book data for editing', () => {
    render(<BookForm book={mockBook} />);
    
    // Check if form elements are filled with book data
    expect(screen.getByLabelText(/Title/i)).toHaveValue('The Hobbit');
    expect(screen.getByLabelText(/Author/i)).toHaveValue('J.R.R. Tolkien');
    expect(screen.getByLabelText(/Cover URL/i)).toHaveValue('https://example.com/cover.jpg');
    expect(screen.getByLabelText(/Page Count/i)).toHaveValue('295');
    expect(screen.getByLabelText(/Notes/i)).toHaveValue('Great book!');
    
    // Check if form title is correct
    expect(screen.getByText('Edit Book')).toBeInTheDocument();
    
    // Check if buttons are rendered
    expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Update Book/i })).toBeInTheDocument();
  });
  
  it('validates required fields', async () => {
    render(<BookForm />);
    
    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: /Add Book/i });
    fireEvent.click(submitButton);
    
    // Check if validation errors are displayed
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Author is required')).toBeInTheDocument();
    });
  });
  
  it('submits the form with valid data for a new book', async () => {
    const { addBook } = require('@/lib/api');
    render(<BookForm />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'The Hobbit' } });
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'J.R.R. Tolkien' } });
    fireEvent.change(screen.getByLabelText(/Cover URL/i), { target: { value: 'https://example.com/cover.jpg' } });
    fireEvent.change(screen.getByLabelText(/Page Count/i), { target: { value: '295' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'Great book!' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Add Book/i });
    fireEvent.click(submitButton);
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(addBook).toHaveBeenCalledWith(expect.objectContaining({
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://example.com/cover.jpg',
        pageCount: 295,
        notes: 'Great book!',
      }));
    });
    
    // Check if user is redirected to books page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/books');
    });
  });
  
  it('submits the form with valid data for updating a book', async () => {
    const { updateBook } = require('@/lib/api');
    render(<BookForm book={mockBook} />);
    
    // Change some values in the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'The Hobbit (Updated)' } });
    fireEvent.change(screen.getByLabelText(/Notes/i), { target: { value: 'Updated notes!' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /Update Book/i });
    fireEvent.click(submitButton);
    
    // Check if API was called with correct data
    await waitFor(() => {
      expect(updateBook).toHaveBeenCalledWith('123', expect.objectContaining({
        title: 'The Hobbit (Updated)',
        author: 'J.R.R. Tolkien',
        notes: 'Updated notes!',
      }));
    });
    
    // Check if user is redirected to books page
    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/books');
    });
  });
  
  it('resets the form when reset button is clicked', () => {
    render(<BookForm book={mockBook} />);
    
    // Change some values in the form
    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Changed Title' } });
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Changed Author' } });
    
    // Click the reset button
    const resetButton = screen.getByRole('button', { name: /Reset/i });
    fireEvent.click(resetButton);
    
    // Check if form values are reset to original book data
    expect(screen.getByLabelText(/Title/i)).toHaveValue('The Hobbit');
    expect(screen.getByLabelText(/Author/i)).toHaveValue('J.R.R. Tolkien');
  });
  
  it('navigates back to books page when back button is clicked', () => {
    render(<BookForm />);
    
    // Click the back button
    const backButton = screen.getByRole('button', { name: /View all books/i });
    fireEvent.click(backButton);
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/books');
  });
});
