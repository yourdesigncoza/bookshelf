export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Import and initialize Sentry for Node.js environment
    const Sentry = await import('@sentry/nextjs');
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      tracesSampleRate: 1.0,
      debug: process.env.NODE_ENV === 'development',
    });
  }
}
