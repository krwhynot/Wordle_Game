// Location: packages/server/src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// Custom error class with status code
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Indicates a known operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Default status code and error message
  let statusCode = 500;
  let message = 'Internal server error';

  // If it's our custom error with status code
  if ('statusCode' in err) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle validation errors
  else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation error';
  }
  // Handle duplicate keys in database (if we add DB later)
  else if ((err as any).code === 11000) {
    statusCode = 409;
    message = 'Duplicate value';
  }

  // Determine if we're in development or production
  const isDev = process.env.NODE_ENV === 'development';

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: message,
    ...(isDev && { stack: err.stack }), // Only include stack trace in development
  });
};

// 404 handler for routes that don't exist
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Resource not found',
  });
};
