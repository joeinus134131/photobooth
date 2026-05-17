import * as Sentry from '@sentry/nextjs';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * Log a debug message
   */
  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: LogContext) {
    this.log('warn', message, context);
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      Sentry.captureMessage(message, 'warning');
    }
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | unknown, context?: LogContext) {
    this.log('error', message, context);

    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      if (error instanceof Error) {
        Sentry.captureException(error, {
          contexts: {
            custom: context,
          },
          tags: {
            logMessage: message,
          },
        });
      } else {
        Sentry.captureMessage(message, 'error');
      }
    }
  }

  /**
   * Internal logging method
   */
  private log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    // Always log in development
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? console.error : console.log;
      consoleMethod(logEntry, context || '');
    }

    // Store in sessionStorage for debugging (last 50 logs)
    try {
      const logs = JSON.parse(sessionStorage.getItem('__app_logs') || '[]');
      logs.push({
        timestamp,
        level,
        message,
        context,
      });

      // Keep only last 50 logs
      if (logs.length > 50) {
        logs.shift();
      }

      sessionStorage.setItem('__app_logs', JSON.stringify(logs));
    } catch (e) {
      // Silently fail if sessionStorage not available
    }

    // Add breadcrumb to Sentry for context
    if (process.env.NEXT_PUBLIC_SENTRY_DSN && level !== 'debug') {
      Sentry.addBreadcrumb({
        level: level as 'debug' | 'info' | 'warning' | 'error' | 'fatal',
        message,
        category: 'app',
        data: context,
      });
    }
  }

  /**
   * Get stored logs from sessionStorage
   */
  getLogs() {
    try {
      return JSON.parse(sessionStorage.getItem('__app_logs') || '[]');
    } catch (e) {
      return [];
    }
  }

  /**
   * Clear stored logs
   */
  clearLogs() {
    try {
      sessionStorage.removeItem('__app_logs');
    } catch (e) {
      // Silently fail if sessionStorage not available
    }
  }
}

// Export singleton instance
export const logger = new Logger();

export default logger;
