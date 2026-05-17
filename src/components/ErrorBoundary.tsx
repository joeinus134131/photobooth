'use client';

import React, { Component, ReactNode } from 'react';
import * as Sentry from '@sentry/nextjs';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch React errors
 * Automatically reports to Sentry and shows fallback UI
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    // Report to Sentry with additional context
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    // Optionally reload the page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
            <div className="bg-slate-800/50 border border-red-500/20 rounded-lg p-8 max-w-md w-full text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-400 mb-2">Oops! Something went wrong</h1>
              <p className="text-slate-400 text-sm mb-4">
                We've been notified about this issue. Please try again or go back to home.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-4 p-3 bg-slate-900/50 rounded text-xs text-red-300">
                  <summary className="cursor-pointer font-mono text-red-400">Error Details</summary>
                  <pre className="mt-2 whitespace-pre-wrap break-words overflow-auto max-h-40">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}

              <button
                onClick={this.handleReset}
                className="w-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-300 rounded px-4 py-2 font-medium transition-colors"
              >
                Go Home
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
