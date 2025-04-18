describe('Performance', () => {
  beforeEach(() => {
    // Reset the performance metrics before each test
    cy.window().then((win) => {
      win.performance.mark('start-test');
    });
  });
  
  it('should load the books page quickly', () => {
    // Start timing
    cy.window().then((win) => {
      win.performance.mark('start-load');
    });
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the page to be fully loaded
    cy.findByRole('heading', { name: /Your Books/i }).should('be.visible');
    
    // End timing and calculate duration
    cy.window().then((win) => {
      win.performance.mark('end-load');
      win.performance.measure('page-load', 'start-load', 'end-load');
      const measure = win.performance.getEntriesByName('page-load')[0];
      
      // Assert that the page loads in less than 3 seconds
      expect(measure.duration).to.be.lessThan(3000);
    });
  });
  
  it('should render large lists efficiently', () => {
    // Intercept the API request and return a large number of books
    const largeBooksList = Array.from({ length: 100 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Book ${i + 1}`,
      author: `Author ${i + 1}`,
      genre: 'Fiction',
      dateCompleted: '2023-01-01',
      rating: 4,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
    }));
    
    cy.intercept('GET', '/api/books', {
      statusCode: 200,
      body: { books: largeBooksList },
    }).as('largeBooksList');
    
    // Start timing
    cy.window().then((win) => {
      win.performance.mark('start-render');
    });
    
    // Visit the books page
    cy.visit('/books');
    
    // Wait for the API request to complete
    cy.wait('@largeBooksList');
    
    // Wait for the table to be rendered
    cy.findByRole('table').should('be.visible');
    
    // End timing and calculate duration
    cy.window().then((win) => {
      win.performance.mark('end-render');
      win.performance.measure('table-render', 'start-render', 'end-render');
      const measure = win.performance.getEntriesByName('table-render')[0];
      
      // Assert that the table renders in less than 2 seconds
      expect(measure.duration).to.be.lessThan(2000);
    });
    
    // Check that pagination is working
    cy.findByLabelText('Pagination').should('be.visible');
    cy.findByText(/Showing 1-10 of 100 books/i).should('be.visible');
  });
  
  it('should handle form submissions efficiently', () => {
    // Visit the add book page
    cy.visit('/books/add');
    
    // Fill out the form
    cy.findByLabelText(/Title/i).type('Performance Test Book');
    cy.findByLabelText(/Author/i).type('Performance Tester');
    cy.findByLabelText(/Genre/i).select('Fiction');
    
    // Intercept the form submission
    cy.intercept('POST', '/api/books', {
      statusCode: 201,
      body: {
        book: {
          id: '123',
          title: 'Performance Test Book',
          author: 'Performance Tester',
          genre: 'Fiction',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
      },
    }).as('addBook');
    
    // Start timing
    cy.window().then((win) => {
      win.performance.mark('start-submit');
    });
    
    // Submit the form
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Wait for the API request to complete
    cy.wait('@addBook');
    
    // Wait for the redirect
    cy.url().should('include', '/books');
    
    // End timing and calculate duration
    cy.window().then((win) => {
      win.performance.mark('end-submit');
      win.performance.measure('form-submit', 'start-submit', 'end-submit');
      const measure = win.performance.getEntriesByName('form-submit')[0];
      
      // Assert that the form submission and redirect happens in less than 2 seconds
      expect(measure.duration).to.be.lessThan(2000);
    });
  });
  
  it('should load images efficiently', () => {
    // Intercept image requests
    cy.intercept('GET', '**/*.{png,jpg,jpeg,gif,webp}').as('imageRequest');
    
    // Visit the home page
    cy.visit('/');
    
    // Wait for all images to load
    cy.wait('@imageRequest', { timeout: 10000 }).then((interception) => {
      // Check that images have width and height attributes
      cy.get('img').each(($img) => {
        expect($img).to.have.attr('width');
        expect($img).to.have.attr('height');
      });
    });
  });
});
