// Utility functions for managing test data

/**
 * Intercepts API requests and returns fixture data
 */
export const setupApiInterceptions = () => {
  // Intercept GET /api/books
  cy.intercept('GET', '/api/books', { fixture: 'books.json' }).as('getBooks');
  
  // Intercept GET /api/books/:id
  cy.intercept('GET', '/api/books/*', { fixture: 'book-details.json' }).as('getBookDetails');
  
  // Intercept POST /api/books
  cy.intercept('POST', '/api/books', (req) => {
    const newBook = {
      ...req.body,
      id: '999',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    req.reply({
      statusCode: 201,
      body: { book: newBook },
    });
  }).as('createBook');
  
  // Intercept PUT /api/books/:id
  cy.intercept('PUT', '/api/books/*', (req) => {
    const updatedBook = {
      ...req.body,
      id: req.url.split('/').pop(),
      updatedAt: new Date().toISOString(),
    };
    
    req.reply({
      statusCode: 200,
      body: { book: updatedBook },
    });
  }).as('updateBook');
  
  // Intercept DELETE /api/books/:id
  cy.intercept('DELETE', '/api/books/*', {
    statusCode: 200,
    body: { success: true },
  }).as('deleteBook');
  
  // Intercept GET /api/statistics
  cy.intercept('GET', '/api/statistics', { fixture: 'statistics.json' }).as('getStatistics');
  
  // Intercept GET /api/books/search
  cy.intercept('GET', '/api/books/search*', (req) => {
    const query = req.query.q?.toLowerCase() || '';
    
    // Load the books fixture
    cy.fixture('books.json').then((data) => {
      // Filter books based on the search query
      const filteredBooks = data.books.filter((book) => 
        book.title.toLowerCase().includes(query) || 
        book.author.toLowerCase().includes(query) || 
        (book.genre && book.genre.toLowerCase().includes(query))
      );
      
      req.reply({
        statusCode: 200,
        body: { books: filteredBooks },
      });
    });
  }).as('searchBooks');
  
  // Intercept GET /api/books/filter
  cy.intercept('GET', '/api/books/filter*', (req) => {
    const genre = req.query.genre;
    
    // Load the books fixture
    cy.fixture('books.json').then((data) => {
      // Filter books based on the genre
      const filteredBooks = genre 
        ? data.books.filter((book) => book.genre === genre)
        : data.books;
      
      req.reply({
        statusCode: 200,
        body: { books: filteredBooks },
      });
    });
  }).as('filterBooks');
  
  // Intercept GET /api/backups
  cy.intercept('GET', '/api/backups', { fixture: 'backups.json' }).as('getBackups');
  
  // Intercept POST /api/backups
  cy.intercept('POST', '/api/backups', {
    statusCode: 200,
    body: {
      success: true,
      filename: `books_backup_${Date.now()}.json`,
      message: 'Backup created successfully',
    },
  }).as('createBackup');
};

/**
 * Generates a random book for testing
 */
export const generateRandomBook = () => {
  const id = Math.floor(Math.random() * 1000).toString();
  const now = new Date().toISOString();
  
  return {
    id,
    title: `Test Book ${id}`,
    author: `Test Author ${id}`,
    genre: ['Fiction', 'Fantasy', 'Mystery', 'Science Fiction', 'Romance'][Math.floor(Math.random() * 5)],
    dateCompleted: now.split('T')[0],
    rating: Math.floor(Math.random() * 5) + 1,
    notes: `This is a test book with ID ${id}`,
    coverUrl: `https://example.com/covers/test-${id}.jpg`,
    pageCount: Math.floor(Math.random() * 500) + 100,
    createdAt: now,
    updatedAt: now,
  };
};

/**
 * Generates a list of random books for testing
 */
export const generateRandomBooks = (count: number) => {
  return Array.from({ length: count }, () => generateRandomBook());
};

/**
 * Sets up empty state for testing
 */
export const setupEmptyState = () => {
  cy.intercept('GET', '/api/books', { fixture: 'empty-books.json' }).as('getEmptyBooks');
};

/**
 * Sets up large data set for testing
 */
export const setupLargeDataSet = (count: number = 100) => {
  const books = generateRandomBooks(count);
  
  cy.intercept('GET', '/api/books', {
    statusCode: 200,
    body: { books },
  }).as('getLargeBooksList');
};

/**
 * Sets up error states for testing
 */
export const setupErrorStates = () => {
  // API error
  cy.intercept('GET', '/api/books', {
    statusCode: 500,
    body: { error: 'Internal Server Error' },
  }).as('getBooksError');
  
  // Network error
  cy.intercept('GET', '/api/statistics', {
    forceNetworkError: true,
  }).as('networkError');
  
  // Not found error
  cy.intercept('GET', '/api/books/*', {
    statusCode: 404,
    body: { error: 'Book not found' },
  }).as('bookNotFound');
};

/**
 * Cleans up test data after tests
 */
export const cleanupTestData = () => {
  // This is a placeholder for any cleanup needed after tests
  // In a real application, this might reset the database or clear local storage
  cy.log('Cleaning up test data');
};

// Add custom commands for test data management
Cypress.Commands.add('setupTestData', setupApiInterceptions);
Cypress.Commands.add('setupEmptyState', setupEmptyState);
Cypress.Commands.add('setupLargeDataSet', setupLargeDataSet);
Cypress.Commands.add('setupErrorStates', setupErrorStates);
Cypress.Commands.add('cleanupTestData', cleanupTestData);

// Declare the custom commands for TypeScript
declare global {
  namespace Cypress {
    interface Chainable {
      setupTestData(): Chainable<Element>;
      setupEmptyState(): Chainable<Element>;
      setupLargeDataSet(count?: number): Chainable<Element>;
      setupErrorStates(): Chainable<Element>;
      cleanupTestData(): Chainable<Element>;
    }
  }
}
