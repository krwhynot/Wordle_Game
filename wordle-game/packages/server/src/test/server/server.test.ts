/// <reference types="jest" />
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { errorHandler, notFoundHandler, AppError } from '../../middleware/errorHandler';
import { logger } from '../../utils/logger';

// Mock external dependencies
const mockedLogger = {
  info: jest.fn() as jest.Mock,
  warn: jest.fn() as jest.Mock,
  error: jest.fn() as jest.Mock,
  debug: jest.fn() as jest.Mock,
};

jest.mock('../../utils/logger', () => ({
  logger: mockedLogger,
}));
jest.mock('../../middleware/rateLimiter', () => ({
  apiLimiter: jest.fn((req: Request, res: Response, next: NextFunction) => next()) as jest.Mock, // Mock rate limiter to just call next
}));
jest.mock('../../routes', () => ({
  __esModule: true,
  default: express.Router(), // Mock the routes module to return an empty router
}));

// Import the mocked modules after jest.mock calls
import { apiLimiter } from '../../middleware/rateLimiter';
import routes from '../../routes';


describe('Server Core Functionality', () => {
  let testApp: express.Application;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a fresh Express app for each test
    testApp = express();
    testApp.use(express.json());

    // Apply middleware and routes in the correct order
    testApp.use('/api', (apiLimiter as jest.MockedFunction<typeof apiLimiter>)); // Apply mocked rate limiter

    // Define health check route
    testApp.get('/api/health', (req, res) => {
      res.status(200).json({
        success: true,
        data: {
          status: 'healthy',
          environment: process.env.NODE_ENV || 'development',
          timestamp: new Date().toISOString()
        }
      });
    });

    // Define error-throwing routes within the main app instance
    testApp.get('/api/error-test', (req: Request, res: Response, next: NextFunction) => {
      next(new Error('Something went wrong'));
    });

    testApp.get('/api/app-error-test', (req: Request, res: Response, next: NextFunction) => {
      next(new AppError('Custom error message', 403));
    });

    testApp.use('/api', routes); // Apply main API routes

    // Error handling middleware should be applied last
    testApp.use(notFoundHandler);
    testApp.use(errorHandler);
  });

  describe('GET /api/health', () => {
    it('should return 200 OK with status, environment, and timestamp', async () => {
      const response = await request(testApp).get('/api/health');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('status', 'healthy');
      expect(response.body.data).toHaveProperty('environment');
      expect(response.body.data).toHaveProperty('timestamp');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent endpoints (notFoundHandler)', async () => {
      const response = await request(testApp).get('/api/nonexistent');

      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({ success: false, error: 'Resource not found' });
    });

    it('should return 500 for unhandled errors (errorHandler)', async () => {
      const response = await request(testApp).get('/api/error-test');

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Internal server error');
      expect(mockedLogger.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });

    it('should return custom status and message for AppError', async () => {
      const response = await request(testApp).get('/api/app-error-test');

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ success: false, error: 'Custom error message' });
      expect(mockedLogger.error).toHaveBeenCalledWith('Error:', expect.any(AppError));
    });
  });
});
