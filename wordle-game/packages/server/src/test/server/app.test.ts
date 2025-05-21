/// <reference types="jest" />
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { AppError } from '../../middleware/errorHandler';

// Mock external dependencies first, before importing the modules that use them
const mockedConnectToDatabase = jest.fn() as jest.Mock;
const mockedCloseDatabaseConnection = jest.fn() as jest.Mock;
const mockedWordService = {
  initializeWordList: jest.fn() as jest.Mock,
};
const mockedLogger = {
  info: jest.fn() as jest.Mock,
  warn: jest.fn() as jest.Mock,
  error: jest.fn() as jest.Mock,
  debug: jest.fn() as jest.Mock,
};

jest.mock('../../config/db', () => ({
  connectToDatabase: mockedConnectToDatabase,
  closeDatabaseConnection: mockedCloseDatabaseConnection,
}));
jest.mock('../../services/wordService', () => ({
  __esModule: true,
  default: mockedWordService,
}));
jest.mock('../../utils/logger', () => ({
  logger: mockedLogger,
}));

// Declare testApp and initialize as 'let' so they can be reassigned
let testApp: express.Application;
let initialize: () => Promise<void>;

describe('Server Configuration and Middleware', () => {
  let server: any;
  let originalProcessExit: any;
  let originalConsoleError: any;
  let originalConsoleLog: any;
  let originalNodeEnv: string | undefined;

  beforeAll(() => {
    // Store original process.env.NODE_ENV
    originalNodeEnv = process.env.NODE_ENV;
    // Set NODE_ENV to 'test' to prevent index.ts from starting the server
    process.env.NODE_ENV = 'test';

    // Store original process.exit and console methods
    originalProcessExit = process.exit;
    originalConsoleError = console.error;
    originalConsoleLog = console.log;

    // Mock process.exit to prevent tests from exiting
    (process as any).exit = jest.fn();
    // Suppress console output during tests
    console.error = jest.fn();
    console.log = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset modules to ensure a fresh app instance for each test
    // This is crucial when testing Express apps that might retain state
    jest.resetModules();

    // Re-import the app and initialize function after resetting modules
    // This ensures they pick up the fresh mocks and middleware configuration
    const appModule = jest.requireActual('../../app');
    const indexModule = jest.requireActual('../../index');
    const errorHandlerModule = jest.requireActual('../../middleware/errorHandler');

    testApp = appModule.default;
    initialize = indexModule.initialize; // Re-assign initialize

    // Re-apply error handling middleware to the testApp instance
    testApp.use(errorHandlerModule.notFoundHandler);
    testApp.use(errorHandlerModule.errorHandler);

    // Start the server for each test
    server = testApp.listen(0);
  });

  afterEach(async () => {
    if (server) {
      await new Promise(resolve => server.close(resolve));
    }
  });

  afterAll(() => {
    // Restore original process.exit and console methods
    process.exit = originalProcessExit;
    console.error = originalConsoleError;
    console.log = originalConsoleLog;
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
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
      // Temporarily add a route that throws an error
      testApp.get('/api/error-test', (req: Request, res: Response, next: NextFunction) => {
        next(new Error('Something went wrong'));
      });

      const response = await request(testApp).get('/api/error-test');

      expect(response.statusCode).toBe(500);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Internal server error');
      expect(mockedLogger.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });

    it('should return custom status and message for AppError', async () => {
      // Temporarily add a route that throws an AppError
      testApp.get('/api/app-error-test', (req: Request, res: Response, next: NextFunction) => {
        next(new AppError('Custom error message', 403));
      });

      const response = await request(testApp).get('/api/app-error-test');

      expect(response.statusCode).toBe(403);
      expect(response.body).toEqual({ success: false, error: 'Custom error message' });
      expect(mockedLogger.error).toHaveBeenCalledWith('Error:', expect.any(AppError));
    });
  });

  describe('Graceful Shutdown', () => {
    it('should close database connection on SIGINT/SIGTERM', async () => {
      // Mock the initialize function's dependencies
      mockedConnectToDatabase.mockResolvedValueOnce({ client: {} as any, db: {} as any });
      mockedWordService.initializeWordList.mockResolvedValueOnce();

      // Call the initialize function from index.ts to set up process listeners
      await initialize();

      // Simulate SIGINT signal
      process.emit('SIGINT');

      // Wait for the closeDatabaseConnection to be called
      await new Promise(resolve => setTimeout(resolve, 100)); // Give some time for async operations

      expect(mockedCloseDatabaseConnection).toHaveBeenCalledTimes(1);
      expect(mockedLogger.info).toHaveBeenCalledWith('SIGINT received, shutting down gracefully');
      expect(process.exit).toHaveBeenCalledWith(0);
    });
  });
});
