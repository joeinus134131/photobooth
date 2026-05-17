import * as Sentry from '@sentry/nextjs';

/**
 * Initialize Sentry for error tracking and performance monitoring
 * This should be called early in the application lifecycle
 */
export function initSentry() {
  // Sentry is auto-initialized by @sentry/nextjs in Next.js apps
  // This function is here for explicit control if needed
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      // Tracing
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      // Release tracking
      release: process.env.NEXT_PUBLIC_APP_VERSION,
    });
  }
}

/**
 * Capture an exception with additional context
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * Capture a message with a severity level
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Add breadcrumb for debugging
 */
export function addBreadcrumb(message: string, data?: Record<string, any>, category?: string) {
  Sentry.addBreadcrumb({
    message,
    data,
    category: category || 'custom',
    level: 'info',
  });
}

/**
 * Set user context for tracking
 */
export function setUserContext(userId: string, userEmail?: string, userName?: string) {
  Sentry.setUser({
    id: userId,
    email: userEmail,
    username: userName,
  });
}

/**
 * Clear user context
 */
export function clearUserContext() {
  Sentry.setUser(null);
}
