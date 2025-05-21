/// <reference types="jest" />
import { MongoClient, Db } from 'mongodb';
import { connectToDatabase, getDatabase, closeDatabaseConnection } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';

// Mock MongoClient and its methods directly
const mockConnect = jest.fn();
const mockClose = jest.fn();
const mockCollection = jest.fn();
const mockDb = {
  collection: mockCollection,
} as unknown as Db;

jest.mock('mongodb', () => ({
  MongoClient: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    db: jest.fn(() => mockDb),
    close: mockClose,
  })),
}));

describe('Database Connection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv }; // Make a copy of process.env
    jest.resetModules(); // Reset the internal state of db.ts module
  });

  afterAll(() => {
    process.env = originalEnv; // Restore original process.env
  });

  describe('connectToDatabase', () => {
    it('should connect to the database successfully', async () => {
      process.env.COSMOS_DB_CONNECTION_STRING = 'mongodb://localhost:27017';
      process.env.COSMOS_DB_NAME = 'testDb';

      // Re-import connectToDatabase after mocks are set up
      const { connectToDatabase } = require('../../config/db');
      const { client, db } = await connectToDatabase();

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(db).toBeDefined();
      expect(mockDb.collection).toBeDefined(); // Ensure db object has collection method
    });

    it('should throw AppError if connection string is not defined', async () => {
      delete process.env.COSMOS_DB_CONNECTION_STRING;

      // Re-import connectToDatabase after mocks are set up
      const { connectToDatabase } = require('../../config/db');
      await expect(connectToDatabase()).rejects.toThrow(
        new AppError('Database connection string is not defined', 500)
      );
      expect(mockConnect).not.toHaveBeenCalled();
    });

    it('should throw an error if database connection fails', async () => {
      process.env.COSMOS_DB_CONNECTION_STRING = 'invalid_connection_string';
      mockConnect.mockRejectedValueOnce(new Error('Connection failed'));

      // Re-import connectToDatabase after mocks are set up
      const { connectToDatabase } = require('../../config/db');
      await expect(connectToDatabase()).rejects.toThrow('Connection failed');
    });
  });

  describe('getDatabase', () => {
    it('should return the database instance without reconnecting if already connected', async () => {
      process.env.COSMOS_DB_CONNECTION_STRING = 'mongodb://localhost:27017';
      process.env.COSMOS_DB_NAME = 'testDb';

      // Re-import connectToDatabase and getDatabase after mocks are set up
      const { connectToDatabase, getDatabase } = require('../../config/db');

      // First call to establish connection
      await connectToDatabase();
      expect(mockConnect).toHaveBeenCalledTimes(1);

      // Second call should not reconnect
      const db = await getDatabase();
      expect(mockConnect).toHaveBeenCalledTimes(1); // Still 1
      expect(db).toBeDefined();
    });

    it('should connect and return database instance if not already connected', async () => {
      process.env.COSMOS_DB_CONNECTION_STRING = 'mongodb://localhost:27017';
      process.env.COSMOS_DB_NAME = 'testDb';

      // Re-import getDatabase after mocks are set up
      const { getDatabase } = require('../../config/db');
      const db = await getDatabase();
      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(db).toBeDefined();
    });
  });

  describe('closeDatabaseConnection', () => {
    it('should close the database connection if it is open', async () => {
      process.env.COSMOS_DB_CONNECTION_STRING = 'mongodb://localhost:27017';
      process.env.COSMOS_DB_NAME = 'testDb';

      // Re-import connectToDatabase and closeDatabaseConnection after mocks are set up
      const { connectToDatabase, closeDatabaseConnection } = require('../../config/db');

      await connectToDatabase(); // Establish connection
      expect(mockConnect).toHaveBeenCalledTimes(1);

      await closeDatabaseConnection();
      expect(mockClose).toHaveBeenCalledTimes(1);
    });

    it('should not attempt to close if no client is initialized', async () => {
      // Re-import closeDatabaseConnection after mocks are set up
      const { closeDatabaseConnection } = require('../../config/db');
      await closeDatabaseConnection(); // Call without prior connection
      expect(mockClose).not.toHaveBeenCalled();
    });
  });
});
