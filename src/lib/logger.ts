import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';

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

// Define the base directory for logs
const LOGS_DIR = path.join(process.cwd(), 'logs');

// Ensure the logs directory exists
const ensureLogsDir = async (): Promise<void> => {
  try {
    await fsPromises.access(LOGS_DIR);
  } catch (error) {
    // Directory doesn't exist, create it
    await fsPromises.mkdir(LOGS_DIR, { recursive: true });
  }
};

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

// Write a log entry to the appropriate log file
const writeLog = async (entry: LogEntry): Promise<void> => {
  try {
    await ensureLogsDir();
    
    // Create a filename based on the current date
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `${date}.log`;
    const filePath = path.join(LOGS_DIR, filename);
    
    // Format the log entry
    const logString = formatLogEntry(entry) + '\n';
    
    // Append to the log file
    await fsPromises.appendFile(filePath, logString, 'utf8');
    
    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(logString);
    }
  } catch (error) {
    // Fallback to console logging if file logging fails
    console.error('Failed to write to log file:', error);
    console.error(formatLogEntry(entry));
  }
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
    writeLog(entry);
  },
  
  warn: (message: string, context?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.WARN, message, context);
    writeLog(entry);
  },
  
  info: (message: string, context?: Record<string, any>) => {
    const entry = createLogEntry(LogLevel.INFO, message, context);
    writeLog(entry);
  },
  
  debug: (message: string, context?: Record<string, any>) => {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development') {
      const entry = createLogEntry(LogLevel.DEBUG, message, context);
      writeLog(entry);
    }
  },
  
  // Get recent logs (for admin panel)
  getRecentLogs: async (count: number = 100): Promise<LogEntry[]> => {
    try {
      await ensureLogsDir();
      
      // Get all log files
      const files = await fsPromises.readdir(LOGS_DIR);
      const logFiles = files.filter(file => file.endsWith('.log'));
      
      // Sort by date (newest first)
      logFiles.sort().reverse();
      
      // Read the most recent log file
      if (logFiles.length === 0) {
        return [];
      }
      
      const mostRecentFile = logFiles[0];
      const filePath = path.join(LOGS_DIR, mostRecentFile);
      const content = await fsPromises.readFile(filePath, 'utf8');
      
      // Parse log entries
      const lines = content.split('\n').filter(line => line.trim() !== '');
      const entries: LogEntry[] = [];
      
      for (const line of lines.slice(-count)) {
        try {
          // Parse the log entry
          const timestampMatch = line.match(/\[(.*?)\]/);
          const levelMatch = line.match(/\] (ERROR|WARN|INFO|DEBUG): /);
          
          if (timestampMatch && levelMatch) {
            const timestamp = timestampMatch[1];
            const level = levelMatch[1] as LogLevel;
            const restOfLine = line.substring(line.indexOf(': ') + 2);
            
            let message = restOfLine;
            let context: Record<string, any> | undefined;
            
            // Check if there's a context part
            const contextIndex = restOfLine.indexOf(' | Context: ');
            if (contextIndex !== -1) {
              message = restOfLine.substring(0, contextIndex);
              const contextString = restOfLine.substring(contextIndex + 12);
              try {
                context = JSON.parse(contextString);
              } catch (error) {
                // If context can't be parsed, just use it as a string
                context = { raw: contextString };
              }
            }
            
            entries.push({ timestamp, level, message, context });
          }
        } catch (error) {
          console.error('Error parsing log entry:', error);
        }
      }
      
      return entries;
    } catch (error) {
      console.error('Error reading logs:', error);
      return [];
    }
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
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason: Error | any) => {
    logger.error('Unhandled Promise Rejection', {
      reason: reason.message || reason,
      stack: reason.stack
    });
    
    // In production, we might want to exit the process
    if (process.env.NODE_ENV === 'production') {
      // Give the logger time to write before exiting
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  });
  
  // Handle uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack
    });
    
    // In production, we should exit the process after an uncaught exception
    if (process.env.NODE_ENV === 'production') {
      // Give the logger time to write before exiting
      setTimeout(() => {
        process.exit(1);
      }, 1000);
    }
  });
};
