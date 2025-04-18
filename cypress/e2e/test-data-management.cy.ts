describe('Test Data Management', () => {
  beforeEach(() => {
    // Reset any previous interceptions
    cy.intercept('GET', '/api/books').as('getBooks');
    cy.intercept('GET', '/api/books/*').as('getBookDetails');
  });
  
  it('should use fixture data for books list', () => {
    // Set up API interceptions
    cy.setupTestData();
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getBooks');
    
    // Verify that the fixture data is displayed
    cy.findByRole('table').within(() => {
      cy.findByText('The Hobbit').should('be.visible');
      cy.findByText('J.R.R. Tolkien').should('be.visible');
      cy.findByText('To Kill a Mockingbird').should('be.visible');
      cy.findByText('Harper Lee').should('be.visible');
    });
  });
  
  it('should use fixture data for book details', () => {
    // Set up API interceptions
    cy.setupTestData();
    
    // Visit a book details page
    cy.visit('/books/1');
    
    // Wait for the API request to complete
    cy.wait('@getBookDetails');
    
    // Verify that the fixture data is displayed
    cy.findByRole('heading', { name: 'The Hobbit' }).should('be.visible');
    cy.findByText('J.R.R. Tolkien').should('be.visible');
    cy.findByText('Fantasy').should('be.visible');
    cy.findByText('A classic fantasy adventure').should('be.visible');
  });
  
  it('should handle empty state', () => {
    // Set up empty state
    cy.setupEmptyState();
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getEmptyBooks');
    
    // Verify that the empty state is displayed
    cy.findByText(/No books found/i).should('be.visible');
    cy.findByText(/You haven't added any books to your bookshelf yet/i).should('be.visible');
    cy.findByRole('button', { name: /Add Your First Book/i }).should('be.visible');
  });
  
  it('should handle large data sets', () => {
    // Set up large data set
    cy.setupLargeDataSet(50);
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getLargeBooksList');
    
    // Verify that pagination is displayed
    cy.findByLabelText('Pagination').should('be.visible');
    cy.findByText(/Showing 1-10 of 50 books/i).should('be.visible');
    
    // Navigate to the next page
    cy.findByLabelText('Go to next page').click();
    
    // Verify that the second page is displayed
    cy.findByText(/Showing 11-20 of 50 books/i).should('be.visible');
  });
  
  it('should handle error states', () => {
    // Set up error states
    cy.setupErrorStates();
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getBooksError');
    
    // Verify that the error state is displayed
    cy.findByText(/Error loading books/i).should('be.visible');
    cy.findByText(/Please try again later/i).should('be.visible');
    cy.findByRole('button', { name: /Retry/i }).should('be.visible');
    
    // Visit a book details page
    cy.visit('/books/999');
    
    // Wait for the API request to complete
    cy.wait('@bookNotFound');
    
    // Verify that the not found state is displayed
    cy.findByText(/Book not found/i).should('be.visible');
    cy.findByRole('link', { name: /Back to Books/i }).should('be.visible');
    
    // Visit the statistics page
    cy.visit('/statistics');
    
    // Wait for the API request to complete
    cy.wait('@networkError');
    
    // Verify that the network error state is displayed
    cy.findByText(/Network Error/i).should('be.visible');
    cy.findByText(/Please check your internet connection/i).should('be.visible');
  });
  
  it('should create and update books', () => {
    // Set up API interceptions
    cy.setupTestData();
    
    // Visit the add book page
    cy.visit('/books/add');
    
    // Fill out the form
    cy.findByLabelText(/Title/i).type('New Test Book');
    cy.findByLabelText(/Author/i).type('Test Author');
    cy.findByLabelText(/Genre/i).select('Fiction');
    
    // Submit the form
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Wait for the API request to complete
    cy.wait('@createBook');
    
    // Verify redirect to books page
    cy.url().should('include', '/books');
    
    // Visit the books page again to see the updated list
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getBooks');
    
    // Visit a book edit page
    cy.visit('/books/edit/1');
    
    // Wait for the API request to complete
    cy.wait('@getBookDetails');
    
    // Update the book
    cy.findByLabelText(/Title/i).clear().type('Updated Book Title');
    
    // Submit the form
    cy.findByRole('button', { name: /Update Book/i }).click();
    
    // Wait for the API request to complete
    cy.wait('@updateBook');
    
    // Verify redirect to books page
    cy.url().should('include', '/books');
  });
});
