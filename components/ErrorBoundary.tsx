// Error Boundary Component
// Catches React errors and displays fallback UI

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service (Sentry, etc.)
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Send to error tracking service
    if (window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack,
          },
        },
      });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Oops! Something went wrong</h1>
                <p className="text-gray-600">We encountered an unexpected error</p>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6">
                <details className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    Error Details (Development Only)
                  </summary>
                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Error:</p>
                      <p className="text-sm text-red-600 font-mono">{this.state.error.toString()}</p>
                    </div>
                    {this.state.errorInfo && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Component Stack:</p>
                        <pre className="text-xs text-gray-600 overflow-auto bg-white p-2 rounded border border-gray-200">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={this.handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                If this problem persists, please contact support at{' '}
                <a href="mailto:support@yatrarentals.com" className="text-blue-600 hover:underline">
                  support@yatrarentals.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Extend Window interface for Sentry
declare global {
  interface Window {
    Sentry?: {
      captureException: (error: Error, context?: any) => void;
    };
  }
}
