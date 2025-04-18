# Testing Guide

This document provides information about the testing setup and how to run tests for the Bookshelf application.

## Testing Framework

The Bookshelf application uses the following testing tools:

### Unit Testing

- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **Jest DOM**: Custom Jest matchers for DOM testing

### Integration Testing

- **Cypress**: End-to-end testing framework
- **Testing Library Cypress**: Testing Library extensions for Cypress
- **Cypress Accessibility**: Accessibility testing in Cypress

For detailed information about integration testing, see the [Integration Testing Guide](integration-testing.md).

## Running Tests

### Running Unit Tests

To run all unit tests:

```bash
npm test
```

#### Watch Mode

To run unit tests in watch mode (tests will re-run when files change):

```bash
npm run test:watch
```

#### Coverage Report

To run unit tests with coverage reporting:

```bash
npm run test:coverage
```

To generate and view a detailed HTML coverage report:

```bash
npm run coverage
```

This will run the tests with coverage enabled and open the HTML report in your default browser.

### Running Integration Tests

To open the Cypress Test Runner UI:

```bash
npm run cypress
```

This will open the Cypress Test Runner, where you can select which tests to run and watch them execute in a browser.

To run all integration tests headlessly (useful for CI/CD):

```bash
npm run cypress:headless
```

To start the development server and run integration tests against it:

```bash
npm run test:e2e
```

## Test Structure

### Unit Tests

Unit tests are organized in the following directories:

- `src/__tests__/components/`: Tests for React components
- `src/__tests__/lib/`: Tests for utility functions and data handling
- `src/__tests__/integration/`: Integration tests for API and component interactions

### Integration Tests

Integration tests are organized in the following directories:

- `cypress/e2e/`: End-to-end test files
- `cypress/fixtures/`: Test data files
- `cypress/support/`: Helper functions and custom commands

## Writing Tests

### Component Tests

Component tests should focus on user interactions and component behavior. Use React Testing Library to query elements by their accessibility roles, labels, or text content.

Example:

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /Click me/i })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole('button', { name: /Click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Utility Tests

Utility tests should verify that functions produce the expected output for various inputs, including edge cases.

Example:

```js
import { formatDate } from '@/lib/utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = '2023-01-15T00:00:00.000Z';
    expect(formatDate(date)).toBe('January 15, 2023');
  });

  it('handles invalid date', () => {
    expect(formatDate('invalid-date')).toBe('Invalid date');
  });

  it('returns default value when date is undefined', () => {
    expect(formatDate()).toBe('Not specified');
  });
});
```

### Integration Tests

Integration tests should verify that components interact correctly with APIs and other parts of the application.

Example:

```jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookForm } from '@/components/books/book-form';
import * as api from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  createBook: jest.fn(),
}));

describe('BookForm integration', () => {
  it('submits form data to the API', async () => {
    api.createBook.mockResolvedValueOnce({ id: '123', title: 'Test Book' });

    render(<BookForm />);

    fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Test Book' } });
    fireEvent.change(screen.getByLabelText(/Author/i), { target: { value: 'Test Author' } });

    fireEvent.click(screen.getByRole('button', { name: /Add Book/i }));

    await waitFor(() => {
      expect(api.createBook).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Test Book',
        author: 'Test Author',
      }));
    });
  });
});
```

## Coverage Requirements

The project aims to maintain the following code coverage thresholds:

- **Statements**: 70%
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%

These thresholds are enforced in the Jest configuration and CI pipeline.
