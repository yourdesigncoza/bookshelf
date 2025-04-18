describe('Books Feature', () => {
  beforeEach(() => {
    // Visit the books page before each test
    cy.visit('/books');
  });

  it('should display the books list', () => {
    cy.findByRole('heading', { name: /Your Books/i }).should('be.visible');
    cy.findByRole('table').should('exist');
  });

  it('should navigate to add book page', () => {
    cy.findByRole('button', { name: /Add Book/i }).click();
    cy.url().should('include', '/books/add');
    cy.findByRole('heading', { name: /Add New Book/i }).should('be.visible');
  });

  it('should add a new book', () => {
    // Navigate to add book page
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Fill out the form
    cy.findByLabelText(/Title/i).type('Test Book');
    cy.findByLabelText(/Author/i).type('Test Author');
    cy.findByLabelText(/Genre/i).select('Fiction');
    
    // Set the date (using a date picker)
    cy.findByLabelText(/Date Completed/i).click();
    cy.findByRole('button', { name: /Today/i }).click();
    
    // Set rating
    cy.findByLabelText(/Rating/i).click();
    cy.findByRole('option', { name: /4 Stars/i }).click();
    
    // Add notes
    cy.findByLabelText(/Notes/i).type('This is a test book added by Cypress');
    
    // Submit the form
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Verify redirect to books page
    cy.url().should('include', '/books');
    
    // Verify the new book appears in the table
    cy.findByRole('table').within(() => {
      cy.findByText('Test Book').should('be.visible');
      cy.findByText('Test Author').should('be.visible');
      cy.findByText('Fiction').should('be.visible');
    });
  });

  it('should view book details', () => {
    // Find and click the view button for the first book
    cy.findByRole('table').within(() => {
      cy.findAllByLabelText(/View details/i).first().click();
    });
    
    // Verify we're on the book details page
    cy.url().should('include', '/books/');
    cy.findByRole('heading', { level: 1 }).should('be.visible');
    
    // Verify book details are displayed
    cy.findByText(/Author:/i).should('be.visible');
    cy.findByText(/Genre:/i).should('be.visible');
    cy.findByText(/Date Completed:/i).should('be.visible');
    cy.findByText(/Rating:/i).should('be.visible');
  });

  it('should edit a book', () => {
    // Find and click the edit button for the first book
    cy.findByRole('table').within(() => {
      cy.findAllByLabelText(/Edit/i).first().click();
    });
    
    // Verify we're on the edit page
    cy.url().should('include', '/books/edit/');
    cy.findByRole('heading', { name: /Edit Book/i }).should('be.visible');
    
    // Update the title
    cy.findByLabelText(/Title/i).clear().type('Updated Book Title');
    
    // Submit the form
    cy.findByRole('button', { name: /Update Book/i }).click();
    
    // Verify redirect to books page
    cy.url().should('include', '/books');
    
    // Verify the updated book appears in the table
    cy.findByRole('table').within(() => {
      cy.findByText('Updated Book Title').should('be.visible');
    });
  });

  it('should delete a book', () => {
    // Get the title of the first book for later verification
    let firstBookTitle: string;
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').eq(1).find('td').eq(0).invoke('text').then((text) => {
        firstBookTitle = text;
      });
    });
    
    // Find and click the delete button for the first book
    cy.findByRole('table').within(() => {
      cy.findAllByLabelText(/Delete/i).first().click();
    });
    
    // Confirm deletion in the dialog
    cy.findByRole('dialog').within(() => {
      cy.findByRole('button', { name: /Delete/i }).click();
    });
    
    // Verify the book is no longer in the table
    cy.findByRole('table').within(() => {
      cy.findByText(firstBookTitle).should('not.exist');
    });
  });

  it('should search for books', () => {
    // Type in the search box
    cy.findByPlaceholderText(/Search books/i).type('fiction');
    
    // Verify search results
    cy.findByRole('table').within(() => {
      cy.findAllByText('Fiction').should('be.visible');
    });
    
    // Clear search and verify all books are shown again
    cy.findByPlaceholderText(/Search books/i).clear();
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').should('have.length.greaterThan', 1);
    });
  });

  it('should filter books by genre', () => {
    // Open the filter dropdown
    cy.findByRole('button', { name: /Filter/i }).click();
    
    // Select a genre filter
    cy.findByText(/Genre/i).click();
    cy.findByText('Fiction').click();
    
    // Apply the filter
    cy.findByRole('button', { name: /Apply Filters/i }).click();
    
    // Verify filtered results
    cy.findByRole('table').within(() => {
      cy.findAllByText('Fiction').should('be.visible');
    });
    
    // Clear filters
    cy.findByRole('button', { name: /Clear Filters/i }).click();
    
    // Verify all books are shown again
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').should('have.length.greaterThan', 1);
    });
  });

  it('should sort books by different columns', () => {
    // Get the initial order of books
    let initialOrder: string[] = [];
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').each(($row, index) => {
        if (index > 0) { // Skip header row
          cy.wrap($row).find('td').eq(0).invoke('text').then((text) => {
            initialOrder.push(text);
          });
        }
      });
    });
    
    // Click on the title header to sort
    cy.findByRole('columnheader', { name: /Title/i }).click();
    
    // Get the new order of books
    let newOrder: string[] = [];
    cy.findByRole('table').within(() => {
      cy.findAllByRole('row').each(($row, index) => {
        if (index > 0) { // Skip header row
          cy.wrap($row).find('td').eq(0).invoke('text').then((text) => {
            newOrder.push(text);
          });
        }
      });
    });
    
    // Verify the order has changed
    cy.wrap(initialOrder).should('not.deep.equal', newOrder);
  });
});
