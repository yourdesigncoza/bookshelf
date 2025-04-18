# Integration Testing Guide

This document provides information about the integration testing setup and how to run integration tests for the Bookshelf application.

## Overview

Integration tests verify that different parts of the application work together correctly. Unlike unit tests, which test individual components in isolation, integration tests focus on the interactions between components and the overall user experience.

The Bookshelf application uses Cypress for integration testing, which allows us to:

- Simulate real user interactions with the application
- Test end-to-end workflows across multiple pages
- Verify that the UI, API, and data layers work together correctly
- Ensure the application meets accessibility and performance requirements

## Test Structure

Integration tests are organized in the following directories:

- `cypress/e2e/`: End-to-end test files
- `cypress/fixtures/`: Test data files
- `cypress/support/`: Helper functions and custom commands

### Test Files

Each test file focuses on a specific feature or aspect of the application:

- `smoke.cy.ts`: Basic smoke tests to verify the application loads correctly
- `books.cy.ts`: Tests for the books management feature
- `statistics.cy.ts`: Tests for the statistics feature
- `data-management.cy.ts`: Tests for data backup and restore features
- `navigation.cy.ts`: Tests for navigation and layout
- `accessibility.cy.ts`: Tests for accessibility compliance
- `error-handling.cy.ts`: Tests for error handling
- `performance.cy.ts`: Tests for performance metrics
- `test-data-management.cy.ts`: Tests that demonstrate test data management

### Test Data

Test data is managed through fixtures and utility functions:

- `cypress/fixtures/`: JSON files containing test data
- `cypress/support/test-data.ts`: Utility functions for managing test data

## Running Tests

### Prerequisites

Before running the tests, make sure you have:

1. Node.js installed (version 18.x or later)
2. The application dependencies installed (`npm install`)
3. Cypress installed (`npm install cypress @testing-library/cypress --save-dev`)

### Running Tests in the Cypress UI

To open the Cypress Test Runner UI:

```bash
npm run cypress
```

This will open the Cypress Test Runner, where you can select which tests to run and watch them execute in a browser.

### Running Tests Headlessly

To run all tests in headless mode (useful for CI/CD):

```bash
npm run cypress:headless
```

### Running Tests with the Development Server

To start the development server and run tests against it:

```bash
npm run test:e2e
```

This command uses `start-server-and-test` to:
1. Start the Next.js development server
2. Wait for it to be available at http://localhost:3000
3. Run the Cypress tests
4. Shut down the server when tests complete

## Writing Integration Tests

### Best Practices

1. **Focus on user workflows**: Write tests that simulate real user interactions and workflows.
2. **Use meaningful selectors**: Use accessible selectors like roles, labels, and text content rather than CSS selectors or test IDs when possible.
3. **Isolate tests**: Each test should be independent and not rely on the state from previous tests.
4. **Manage test data**: Use fixtures and API interceptions to control the test data environment.
5. **Handle asynchronous operations**: Wait for API requests, animations, and other asynchronous operations to complete before making assertions.
6. **Test error states**: Verify that the application handles errors gracefully.
7. **Check accessibility**: Include accessibility checks in your tests.
8. **Monitor performance**: Include performance checks for critical user flows.

### Example Test

Here's an example of a well-structured integration test:

```typescript
describe('Book Management', () => {
  beforeEach(() => {
    // Set up test data and API interceptions
    cy.setupTestData();
    
    // Visit the books page before each test
    cy.visit('/books');
  });
  
  it('should add a new book', () => {
    // Navigate to add book page
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Fill out the form
    cy.findByLabelText(/Title/i).type('Test Book');
    cy.findByLabelText(/Author/i).type('Test Author');
    cy.findByLabelText(/Genre/i).select('Fiction');
    
    // Submit the form
    cy.findByRole('button', { name: /Add Book/i }).click();
    
    // Wait for the API request to complete
    cy.wait('@createBook');
    
    // Verify redirect to books page
    cy.url().should('include', '/books');
    
    // Verify the new book appears in the table
    cy.findByRole('table').within(() => {
      cy.findByText('Test Book').should('be.visible');
      cy.findByText('Test Author').should('be.visible');
    });
  });
});
```

### Custom Commands

The Bookshelf application includes several custom Cypress commands to make testing easier:

- `cy.setupTestData()`: Sets up API interceptions with fixture data
- `cy.setupEmptyState()`: Sets up an empty state for testing
- `cy.setupLargeDataSet(count)`: Sets up a large data set for testing
- `cy.setupErrorStates()`: Sets up error states for testing
- `cy.clearAndType(text)`: Clears an input field and types text
- `cy.containsText(text)`: Checks if an element contains text
- `cy.waitForApi(method, url)`: Waits for an API request to complete

## Continuous Integration

Integration tests are run automatically in the CI/CD pipeline using GitHub Actions. The workflow is defined in `.github/workflows/test.yml`.

The CI pipeline:

1. Checks out the code
2. Sets up Node.js
3. Installs dependencies
4. Runs the unit tests
5. Runs the integration tests in headless mode
6. Reports test results

## Troubleshooting

### Common Issues

1. **Tests are flaky**: If tests sometimes pass and sometimes fail, it may be due to:
   - Race conditions: Add proper waiting for elements or API requests
   - Animations: Wait for animations to complete
   - Test isolation: Ensure tests don't depend on each other

2. **Selectors not finding elements**: If selectors aren't finding elements:
   - Check if the element is actually rendered
   - Try different selectors (role, label, text)
   - Check if the element is inside an iframe or shadow DOM

3. **API interceptions not working**: If API interceptions aren't working:
   - Check the URL pattern
   - Make sure the interception is set up before the request is made
   - Check if the API is called from the server side (which Cypress can't intercept)

### Debugging Tips

1. Use `cy.pause()` to pause test execution at a specific point
2. Use `cy.debug()` to open the browser's developer tools during test execution
3. Use `cy.log()` to add custom messages to the test output
4. Check the Cypress Test Runner's Command Log for details about each step
5. Use the Cypress Test Runner's Time Travel feature to see the state at each step
