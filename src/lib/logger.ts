// Centralized logging utility
// Use this instead of console.log/error/warn throughout the project

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'info';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isProduction = process.env.NODE_ENV === 'production';

  /**
   * Log a message (only in development)
   */
  log(message: string, data?: any, context?: string): void {
    if (this.isDevelopment) {
      const prefix = context ? `[${context}]` : '';
      if (data) {
        console.log(`${prefix} ${message}`, data);
      } else {
        console.log(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Log an error (always logged, should be sent to error tracking in production)
   */
  error(message: string, error?: Error | any, context?: string): void {
    const prefix = context ? `[${context}]` : '';
    
    if (error instanceof Error) {
      console.error(`${prefix} ${message}`, error);
      // In production, send to error tracking service (Sentry, etc.)
      if (this.isProduction) {
        // TODO: Integrate with error tracking service
        // Example: Sentry.captureException(error, { extra: { message, context } });
      }
    } else if (error) {
      console.error(`${prefix} ${message}`, error);
    } else {
      console.error(`${prefix} ${message}`);
    }
  }

  /**
   * Log a warning (only in development)
   */
  warn(message: string, data?: any, context?: string): void {
    if (this.isDevelopment) {
      const prefix = context ? `[${context}]` : '';
      if (data) {
        console.warn(`${prefix} ${message}`, data);
      } else {
        console.warn(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Debug logging (only in development)
   */
  debug(message: string, data?: any, context?: string): void {
    if (this.isDevelopment) {
      const prefix = context ? `[${context}]` : '';
      if (data) {
        console.debug(`${prefix} ${message}`, data);
      } else {
        console.debug(`${prefix} ${message}`);
      }
    }
  }

  /**
   * Info logging (always logged)
   */
  info(message: string, data?: any, context?: string): void {
    const prefix = context ? `[${context}]` : '';
    if (data) {
      console.info(`${prefix} ${message}`, data);
    } else {
      console.info(`${prefix} ${message}`);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export class for testing
export { Logger };
