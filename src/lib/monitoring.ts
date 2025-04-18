import * as Sentry from '@sentry/nextjs';

/**
 * Utility functions for application monitoring
 */

/**
 * Track a custom event in Sentry
 * @param eventName The name of the event to track
 * @param data Additional data to include with the event
 */
export function trackEvent(eventName: string, data?: Record<string, any>) {
  try {
    Sentry.captureMessage(`Event: ${eventName}`, {
      level: 'info',
      tags: { eventType: 'custom', eventName },
      extra: data,
    });
  } catch (error) {
    console.error('Failed to track event:', error);
  }
}

/**
 * Track an error in Sentry
 * @param error The error to track
 * @param context Additional context to include with the error
 */
export function trackError(error: Error, context?: Record<string, any>) {
  try {
    Sentry.captureException(error, {
      tags: { errorType: 'custom' },
      extra: context,
    });
  } catch (e) {
    console.error('Failed to track error:', e);
  }
}

/**
 * Set user information for Sentry
 * @param user User information
 */
export function setUserContext(user: { id: string; email?: string; username?: string }) {
  try {
    Sentry.setUser(user);
  } catch (error) {
    console.error('Failed to set user context:', error);
  }
}

/**
 * Clear user information from Sentry
 */
export function clearUserContext() {
  try {
    Sentry.setUser(null);
  } catch (error) {
    console.error('Failed to clear user context:', error);
  }
}

/**
 * Set additional context for Sentry
 * @param name Context name
 * @param data Context data
 */
export function setContext(name: string, data: Record<string, any>) {
  try {
    Sentry.setContext(name, data);
  } catch (error) {
    console.error('Failed to set context:', error);
  }
}

// Performance monitoring functions removed due to compatibility issues
