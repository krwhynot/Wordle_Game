import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { AppError } from '../middleware/errorHandler';

dotenv.config();

// Connection string from environment variable
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const dbName = process.env.COSMOS_DB_NAME || 'wordleDb';

// MongoDB Client
let client: MongoClient;
let isConnected = false;

/**
 * Connect to MongoDB (Cosmos DB with MongoDB API)
 */
export async function connectToDatabase() {
  try {
    if (!connectionString) {
      throw new AppError('Database connection string is not defined', 500);
    }

    client = new MongoClient(connectionString);
    await client.connect();

    isConnected = true;
    console.log('Connected to database');

    return {
      client,
      db: client.db(dbName)
    };
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
}

/**
 * Get database connection
 */
export async function getDatabase() {
  if (!isConnected) {
    await connectToDatabase();
  }
  return client.db(dbName);
}

/**
 * Close database connection
 */
export async function closeDatabaseConnection() {
  if (client && isConnected) {
    await client.close();
    isConnected = false;
    console.log('Database connection closed');
  }
}
