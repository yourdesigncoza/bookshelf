import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BooksTable } from '@/components/books/books-table';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock the DeleteBookButton component
jest.mock('@/components/books/delete-book-button', () => ({
  DeleteBookButton: ({ bookId, bookTitle, onDeleted }) => (
    <button 
      data-testid={`delete-button-${bookId}`}
      onClick={() => onDeleted && onDeleted()}
    >
      Delete {bookTitle}
    </button>
  ),
}));

describe('BooksTable', () => {
  const mockRouter = {
    push: jest.fn(),
  };
  
  const mockBooks = [
    {
      id: '1',
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      genre: 'Fantasy',
      dateCompleted: '2023-01-15',
      rating: 5,
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      dateCompleted: '2023-02-20',
      rating: 4,
    },
    {
      id: '3',
      title: '1984',
      author: 'George Orwell',
      genre: 'Dystopian',
      dateCompleted: '2023-03-10',
      rating: 5,
    },
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
  });
  
  it('renders loading state when isLoading is true', () => {
    render(<BooksTable books={[]} isLoading={true} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('renders empty state when no books are provided', () => {
    render(<BooksTable books={[]} />);
    
    expect(screen.getByText(/No books found/i)).toBeInTheDocument();
    expect(screen.getByText(/You haven't added any books to your bookshelf yet./i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Your First Book/i })).toBeInTheDocument();
  });
  
  it('renders books in a table on desktop view', () => {
    render(<BooksTable books={mockBooks} />);
    
    // Check if table headers are rendered
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Genre')).toBeInTheDocument();
    expect(screen.getByText('Date Completed')).toBeInTheDocument();
    expect(screen.getByText('Rating')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
    
    // Check if book data is rendered
    expect(screen.getByText('The Hobbit')).toBeInTheDocument();
    expect(screen.getByText('J.R.R. Tolkien')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    
    expect(screen.getByText('To Kill a Mockingbird')).toBeInTheDocument();
    expect(screen.getByText('Harper Lee')).toBeInTheDocument();
    expect(screen.getByText('Fiction')).toBeInTheDocument();
    
    expect(screen.getByText('1984')).toBeInTheDocument();
    expect(screen.getByText('George Orwell')).toBeInTheDocument();
    expect(screen.getByText('Dystopian')).toBeInTheDocument();
  });
  
  it('navigates to book details page when view button is clicked', () => {
    render(<BooksTable books={mockBooks} />);
    
    // Find and click the view button for the first book
    const viewButtons = screen.getAllByLabelText(/View details for/i);
    fireEvent.click(viewButtons[0]);
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/books/1');
  });
  
  it('navigates to edit book page when edit button is clicked', () => {
    render(<BooksTable books={mockBooks} />);
    
    // Find and click the edit button for the first book
    const editButtons = screen.getAllByLabelText(/Edit/i);
    fireEvent.click(editButtons[0]);
    
    // Check if router.push was called with the correct path
    expect(mockRouter.push).toHaveBeenCalledWith('/books/edit/1');
  });
  
  it('calls onDelete callback when delete button is clicked', () => {
    const onDeleteMock = jest.fn();
    render(<BooksTable books={mockBooks} onDelete={onDeleteMock} />);
    
    // Find and click the delete button for the first book
    const deleteButton = screen.getByTestId('delete-button-1');
    fireEvent.click(deleteButton);
    
    // Check if onDelete callback was called with the correct book ID
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });
  
  it('sorts books when a sortable column header is clicked', () => {
    render(<BooksTable books={mockBooks} />);
    
    // Initially, books should be sorted by dateCompleted in descending order
    const rows = screen.getAllByRole('row');
    
    // Click on the title column header to sort by title
    const titleHeader = screen.getByText('Title');
    fireEvent.click(titleHeader);
    
    // Books should now be sorted by title in ascending order
    const rowsAfterSort = screen.getAllByRole('row');
    
    // The order of books should have changed
    expect(rowsAfterSort).not.toEqual(rows);
  });
  
  it('shows pagination when there are books', () => {
    // Create more books to trigger pagination
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`,
      genre: 'Fiction',
      dateCompleted: `2023-01-${i + 1}`,
      rating: 4,
    }));
    
    render(<BooksTable books={manyBooks} />);
    
    // Check if pagination is rendered
    expect(screen.getByLabelText('Pagination')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
    
    // Check if pagination info is rendered
    expect(screen.getByText(/Showing 1-10 of 15 books/i)).toBeInTheDocument();
  });
  
  it('changes page when pagination controls are clicked', () => {
    // Create more books to trigger pagination
    const manyBooks = Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`,
      genre: 'Fiction',
      dateCompleted: `2023-01-${i + 1}`,
      rating: 4,
    }));
    
    render(<BooksTable books={manyBooks} />);
    
    // Initially, should show books 1-10
    expect(screen.getByText(/Showing 1-10 of 15 books/i)).toBeInTheDocument();
    
    // Click on the next page button
    const nextPageButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextPageButton);
    
    // Should now show books 11-15
    expect(screen.getByText(/Showing 11-15 of 15 books/i)).toBeInTheDocument();
    
    // Click on the previous page button
    const prevPageButton = screen.getByLabelText('Go to previous page');
    fireEvent.click(prevPageButton);
    
    // Should go back to showing books 1-10
    expect(screen.getByText(/Showing 1-10 of 15 books/i)).toBeInTheDocument();
  });
});
