import { setupGlobalErrorHandlers } from './logger';

// Initialize global error handlers
export function initializeApp() {
  // Set up global error handlers
  setupGlobalErrorHandlers();
  
  // Add any other initialization logic here
}

// Call this function in a server component or middleware
export default initializeApp;
