import bundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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
const config = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  sentryWebpackPluginOptions
);

export default config;
