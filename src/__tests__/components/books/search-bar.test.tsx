import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '@/components/books/search-bar';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Mock the Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

describe('SearchBar', () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
  };
  
  const mockSearchParams = {
    get: jest.fn(),
    toString: jest.fn().mockReturnValue(''),
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (usePathname as jest.Mock).mockReturnValue('/books');
    mockSearchParams.get.mockReturnValue('');
  });
  
  it('renders with default placeholder', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Search books...');
  });
  
  it('renders with custom placeholder', () => {
    render(<SearchBar placeholder="Find a book..." />);
    
    const searchInput = screen.getByRole('searchbox');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('placeholder', 'Find a book...');
  });
  
  it('updates search query when typing', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    expect(searchInput).toHaveValue('Harry Potter');
  });
  
  it('shows clear button when search query is not empty', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Initially, clear button should not be visible
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Clear button should now be visible
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
  });
  
  it('clears search query when clear button is clicked', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Click the clear button
    fireEvent.click(screen.getByLabelText('Clear search'));
    
    // Search input should be empty
    expect(searchInput).toHaveValue('');
  });
  
  it('redirects to search page with query when form is submitted', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    const form = screen.getByRole('form');
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // Should redirect to search page with query
    expect(mockRouter.push).toHaveBeenCalledWith('/books/search?q=Harry%20Potter');
  });
  
  it('calls onSearch callback when provided', () => {
    const onSearch = jest.fn();
    render(<SearchBar onSearch={onSearch} />);
    
    const searchInput = screen.getByRole('searchbox');
    const form = screen.getByRole('form');
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // onSearch callback should be called with the search query
    expect(onSearch).toHaveBeenCalledWith('Harry Potter');
  });
  
  it('updates URL with search query when redirectToSearchPage is false', () => {
    render(<SearchBar redirectToSearchPage={false} />);
    
    const searchInput = screen.getByRole('searchbox');
    const form = screen.getByRole('form');
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Submit the form
    fireEvent.submit(form);
    
    // Should update URL with search query
    expect(mockRouter.replace).toHaveBeenCalled();
  });
  
  it('clears search query when Escape key is pressed', () => {
    render(<SearchBar />);
    
    const searchInput = screen.getByRole('searchbox');
    
    // Type something in the search input
    fireEvent.change(searchInput, { target: { value: 'Harry Potter' } });
    
    // Press Escape key
    fireEvent.keyDown(searchInput, { key: 'Escape' });
    
    // Search input should be empty
    expect(searchInput).toHaveValue('');
  });
});
