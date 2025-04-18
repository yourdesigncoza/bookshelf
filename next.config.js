const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['example.com', 'images.unsplash.com'],
  },
  // Add any other Next.js config options here
};

const sentryWebpackPluginOptions = {
  silent: true, // Suppresses all logs
};

// Apply bundle analyzer and Sentry configuration
module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions
);
