describe('Error Handling', () => {
  it('should validate form inputs', () => {
    cy.visit('/books/add');
    
    // Submit the form without filling required fields
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Check for validation error messages
    cy.findByText(/Title is required/i).should('be.visible');
    cy.findByText(/Author is required/i).should('be.visible');
    
    // Fill in one field but not the other
    cy.findByLabelText(/Title/i).type('Test Book');
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Check that only the remaining validation error is shown
    cy.findByText(/Title is required/i).should('not.exist');
    cy.findByText(/Author is required/i).should('be.visible');
    
    // Fill in the remaining field
    cy.findByLabelText(/Author/i).type('Test Author');
    
    // Enter invalid data in optional fields
    cy.findByLabelText(/Cover URL/i).type('not-a-valid-url');
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Check for validation error for the URL field
    cy.findByText(/Invalid URL format/i).should('be.visible');
    
    // Fix the URL
    cy.findByLabelText(/Cover URL/i).clear().type('https://example.com/cover.jpg');
    
    // Form should now be valid
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Should redirect to books page after successful submission
    cy.url().should('include', '/books');
  });
  
  it('should handle API errors gracefully', () => {
    // Intercept API requests and force them to fail
    cy.intercept('GET', '/api/books', {
      statusCode: 500,
      body: { error: 'Internal Server Error' },
    }).as('getBooksError');
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@getBooksError');
    
    // Check that an error message is displayed
    cy.findByText(/Error loading books/i).should('be.visible');
    cy.findByText(/Please try again later/i).should('be.visible');
    
    // Check that a retry button is available
    cy.findByRole('button', { name: /Retry/i }).should('be.visible');
    
    // Intercept the retry request and make it succeed
    cy.intercept('GET', '/api/books', {
      statusCode: 200,
      body: { books: [] },
    }).as('getBooksSuccess');
    
    // Click the retry button
    cy.findByRole('button', { name: /Retry/i }).click();
    
    // Wait for the API request to complete
    cy.wait('@getBooksSuccess');
    
    // Check that the error message is no longer displayed
    cy.findByText(/Error loading books/i).should('not.exist');
  });
  
  it('should handle 404 errors', () => {
    // Visit a non-existent page
    cy.visit('/non-existent-page', { failOnStatusCode: false });
    
    // Check that the 404 page is displayed
    cy.findByRole('heading', { name: /Page Not Found/i }).should('be.visible');
    cy.findByText(/The page you're looking for doesn't exist/i).should('be.visible');
    
    // Check that there's a link to go back to the home page
    cy.findByRole('link', { name: /Go Home/i }).should('be.visible');
    
    // Click the link to go back to the home page
    cy.findByRole('link', { name: /Go Home/i }).click();
    
    // Check that we're back on the home page
    cy.url().should('not.include', '/non-existent-page');
  });
  
  it('should handle network errors', () => {
    // Intercept all API requests and simulate a network error
    cy.intercept('GET', '/api/**', {
      forceNetworkError: true,
    }).as('networkError');
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to fail
    cy.wait('@networkError');
    
    // Check that an error message is displayed
    cy.findByText(/Network Error/i).should('be.visible');
    cy.findByText(/Please check your internet connection/i).should('be.visible');
  });
  
  it('should handle empty states', () => {
    // Intercept the API request and return an empty array
    cy.intercept('GET', '/api/books', {
      statusCode: 200,
      body: { books: [] },
    }).as('emptyBooks');
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@emptyBooks');
    
    // Check that the empty state is displayed
    cy.findByText(/No books found/i).should('be.visible');
    cy.findByText(/You haven't added any books to your bookshelf yet/i).should('be.visible');
    
    // Check that there's a button to add a book
    cy.findByRole('button', { name: /Add Your First Book/i }).should('be.visible');
  });
});
