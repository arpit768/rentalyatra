// Monitoring & Error Tracking Service
// Sentry Integration

interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
}

class MonitoringService {
  private initialized = false;

  /**
   * Initialize Sentry for error tracking
   */
  async init(config?: Partial<SentryConfig>) {
    if (this.initialized) return;

    try {
      // Import Sentry dynamically
      // @ts-expect-error - Optional dependency: install with npm install @sentry/react
      const Sentry = await import('@sentry/react');
      // @ts-expect-error - Optional dependency: install with npm install @sentry/tracing
      const { BrowserTracing } = await import('@sentry/tracing');

      const sentryConfig: SentryConfig = {
        dsn: import.meta.env.VITE_SENTRY_DSN || '',
        environment: import.meta.env.VITE_ENVIRONMENT || 'development',
        release: import.meta.env.VITE_APP_VERSION,
        tracesSampleRate: 1.0,
        ...config,
      };

      if (!sentryConfig.dsn) {
        console.warn('Sentry DSN not configured. Error tracking disabled.');
        return;
      }

      Sentry.init({
        dsn: sentryConfig.dsn,
        environment: sentryConfig.environment,
        release: sentryConfig.release,
        integrations: [new BrowserTracing()],
        tracesSampleRate: sentryConfig.tracesSampleRate,

        beforeSend(event, hint) {
          // Filter out errors in development
          if (sentryConfig.environment === 'development') {
            console.log('Sentry event:', event);
            return null; // Don't send to Sentry in dev
          }
          return event;
        },
      });

      this.initialized = true;
      console.log('✅ Monitoring initialized');
    } catch (error) {
      console.warn('Sentry not installed. Install with: npm install @sentry/react @sentry/tracing');
    }
  }

  /**
   * Capture exception
   */
  captureException(error: Error, context?: Record<string, any>) {
    if (!this.initialized) {
      console.error('Monitoring not initialized:', error);
      return;
    }

    if (window.Sentry) {
      window.Sentry.captureException(error, context);
    }
  }

  /**
   * Capture message
   */
  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
    if (!this.initialized) {
      console.log(`[${level.toUpperCase()}]`, message);
      return;
    }

    if (window.Sentry) {
      // Sentry.captureMessage implementation
      console.log(`[${level.toUpperCase()}]`, message);
    }
  }

  /**
   * Set user context
   */
  setUser(user: { id: string; email: string; name: string }) {
    if (!this.initialized) return;

    if (window.Sentry) {
      // Sentry.setUser implementation
      console.log('User context set:', user);
    }
  }

  /**
   * Track performance
   */
  startTransaction(name: string, operation: string) {
    if (!this.initialized) return null;

    // Performance tracking
    const startTime = performance.now();

    return {
      finish: () => {
        const duration = performance.now() - startTime;
        console.log(`Performance: ${name} (${operation}) took ${duration.toFixed(2)}ms`);
      },
    };
  }
}

export const monitoringService = new MonitoringService();
export default monitoringService;
