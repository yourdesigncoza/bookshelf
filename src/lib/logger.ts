// Define log levels
export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

// Define log entry interface
interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

// Format a log entry as a string
const formatLogEntry = (entry: LogEntry): string => {
  const { timestamp, level, message, context } = entry;
  let logString = `[${timestamp}] ${level}: ${message}`;

  if (context) {
    try {
      logString += ` | Context: ${JSON.stringify(context)}`;
    } catch (error) {
      logString += ` | Context: [Error serializing context: ${error}]`;
    }
  }

  return logString;
};

// Create a log entry
const createLogEntry = (level: LogLevel, message: string, context?: Record<string, any>): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    context
  };
};

// Logger functions
export const logger = {
  error: (message: string, context?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.ERROR, message, context);
    console.error(formatLogEntry(entry));
  },

  warn: (message: string, context?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.WARN, message, context);
    console.warn(formatLogEntry(entry));
  },

  info: (message: string, context?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.INFO, message, context);
    console.info(formatLogEntry(entry));
  },

  debug: (message: string, context?: Record<string, any>) => {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry(LogLevel.DEBUG, message, context);
      console.debug(formatLogEntry(entry));
    }
  },

  // Simplified version that just returns an empty array
  getRecentLogs: async (count: number = 100): Promise<LogEntry[]> => {
    return [];
  }
};

// Custom error class for application errors
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly context?: Record<string, any>;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    context?: Record<string, any>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.context = context;

    // Log the error
    logger.error(message, {
      statusCode,
      isOperational,
      stack: this.stack,
      ...context
    });

    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Global error handler for unhandled errors
export const setupGlobalErrorHandlers = () => {
  if (typeof window === 'undefined' && typeof process !== 'undefined') {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: Error | any) => {
      logger.error('Unhandled Promise Rejection', {
        reason: reason.message || reason,
        stack: reason.stack
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack
      });
    });
  }
};
