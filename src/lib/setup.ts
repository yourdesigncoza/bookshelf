import { setupGlobalErrorHandlers } from './logger';

// Initialize global error handlers
export function initializeApp() {
  // Only set up global error handlers in Node.js environment, not in Edge runtime
  if (typeof process !== 'undefined' && process.on) {
    setupGlobalErrorHandlers();
  }

  // Add any other initialization logic here
}

// Call this function in a server component or middleware
export default initializeApp;
