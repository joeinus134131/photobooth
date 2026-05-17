import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true, // Suppress Sentry CLI debug messages
  widenClientFileUpload: true,
  // Disable source map uploads if SENTRY_AUTH_TOKEN is missing to avoid Vercel build crashes
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
