# Phase 3: Azure Backend Integration - Implementation Plan

## Overview

This document outlines the implementation plan for Phase 3 of our Azure-integrated Wordle clone, focusing on backend development and Azure cloud services integration. It builds on the existing Express server structure while adding cloud database integration and game-specific API endpoints.

## 1. Project Architecture

### 1.1 System Architecture

```
Client (React) <--> Express API <--> Azure Cosmos DB
                     |
                     v
               Azure Key Vault
                     |
                     v
              Dictionary API
```

- **Client-Server Communication**: REST API with JSON payloads
- **Database Access**: MongoDB SDK with Cosmos DB
- **Secret Management**: Environment variables with Azure Key Vault references
- **Daily Word Generation**: Deterministic algorithm based on date

### 1.2 Directory Structure

Building on the existing structure:

```
wordle-game/
└── packages/
    └── server/
        ├── src/
        │   ├── controllers/         # Request handlers
        │   │   ├── wordController.ts  # Word retrieval and validation
        │   │   └── statsController.ts # Game statistics (future)
        │   ├── services/            # Business logic
        │   │   ├── wordService.ts     # Word selection logic
        │   │   ├── dictionaryService.ts # External API integration
        │   │   └── dbService.ts       # Database operations
        │   ├── models/              # Data models
        │   │   └── Word.ts            # Word schema and interface
        │   ├── routes/              # API routes
        │   │   ├── index.ts           # Route aggregation
        │   │   ├── wordRoutes.ts      # Word-related routes
        │   │   └── healthRoutes.ts    # Health check routes
        │   ├── middleware/          # Already exists
        │   ├── utils/               # Utility functions
        │   │   ├── logger.ts          # Logging utility
        │   │   └── seedGenerator.ts   # Word selection utilities
        │   ├── config/              # Configuration
        │   │   └── db.ts              # Database configuration
        │   ├── app.ts               # Express application setup
        │   └── index.ts             # Server entry point
        └── azure/                   # Azure deployment scripts
            ├── cosmos-db.js           # Cosmos DB setup script
            └── key-vault.js           # Key Vault setup script
```

## 2. Database Implementation with Azure Cosmos DB

### 2.1 Setting Up Azure Cosmos DB

Since we don't have Infrastructure as Code files yet, we'll use Azure Portal and CLI:

```powershell
# Login to Azure
az login

# Create Resource Group (if not exists)
$resourceGroup = "wordleClone"
$location = "eastus"
az group create --name $resourceGroup --location $location

# Create Cosmos DB Account with MongoDB API
$accountName = "wordle-cosmos-db"
az cosmosdb create `
  --name $accountName `
  --resource-group $resourceGroup `
  --kind MongoDB `
  --default-consistency-level Session `
  --enable-automatic-failover true

# Create Database
$dbName = "wordleDb"
az cosmosdb mongodb database create `
  --account-name $accountName `
  --name $dbName `
  --resource-group $resourceGroup

# Create Collections
az cosmosdb mongodb collection create `
  --account-name $accountName `
  --database-name $dbName `
  --name "words" `
  --resource-group $resourceGroup `
  --shard "word"
```

### 2.2 Database Connection Configuration

```typescript
// packages/server/src/config/db.ts
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

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
      throw new Error('Database connection string is not defined');
    }

    client = new MongoClient(connectionString);
    await client.connect();

    isConnected = true;
    logger.info('Connected to database');

    return {
      client,
      db: client.db(dbName)
    };
  } catch (error) {
    logger.error('Database connection error:', error);
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
    logger.info('Database connection closed');
  }
}
```

### 2.3 Word Model

```typescript
// packages/server/src/models/Word.ts
import { ObjectId } from 'mongodb';

/**
 * Word document structure
 */
export interface WordDocument {
  _id?: ObjectId;
  word: string;
  difficulty?: number;
  frequency?: number;
  lastUsed?: Date;
  categories?: string[];
}

/**
 * Collection name for words
 */
export const WORDS_COLLECTION = 'words';
```

## 3. Word Service Implementation

### 3.1 Core Word Service

```typescript
// packages/server/src/services/wordService.ts
import { getDatabase } from '../config/db';
import { WORDS_COLLECTION, WordDocument } from '../models/Word';
import { generateDateSeed } from '../utils/seedGenerator';
import { logger } from '../utils/logger';

/**
 * Word Service for database operations
 */
export class WordService {
  /**
   * Get daily word based on date
   */
  async getDailyWord(): Promise<string> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      // Generate a seed based on today's date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const seed = generateDateSeed(today);

      // Find word based on seed
      // Using the seed for consistent selection by date
      const wordDoc = await collection
        .find({
          lastUsed: { $lt: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) }
        })
        .sort({ _id: seed }) // Using seed for "random" but deterministic sorting
        .limit(1)
        .toArray();

      if (wordDoc.length === 0) {
        throw new Error('No words available for today');
      }

      // Update lastUsed date
      await collection.updateOne(
        { _id: wordDoc[0]._id },
        { $set: { lastUsed: today } }
      );

      return wordDoc[0].word;
    } catch (error) {
      logger.error('Error getting daily word:', error);
      // Fallback word in case of database error
      return 'react';
    }
  }

  /**
   * Check if a word exists in the dictionary
   */
  async validateWord(word: string): Promise<boolean> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      const wordDoc = await collection.findOne({
        word: word.toLowerCase()
      });

      return !!wordDoc;
    } catch (error) {
      logger.error('Error validating word:', error);
      return false;
    }
  }

  /**
   * Initialize word list with sample data (for development)
   */
  async initializeWordList(words: string[]): Promise<void> {
    try {
      const db = await getDatabase();
      const collection = db.collection<WordDocument>(WORDS_COLLECTION);

      // Check if collection is empty
      const count = await collection.countDocuments();
      if (count > 0) {
        logger.info('Word list already initialized');
        return;
      }

      // Insert sample words
      const wordDocs: WordDocument[] = words.map(word => ({
        word: word.toLowerCase(),
        lastUsed: new Date(0) // Never used
      }));

      await collection.insertMany(wordDocs);
      logger.info(`Initialized word list with ${wordDocs.length} words`);
    } catch (error) {
      logger.error('Error initializing word list:', error);
      throw error;
    }
  }
}

export default new WordService();
```

### 3.2 Dictionary Service

```typescript
// packages/server/src/services/dictionaryService.ts
import axios from 'axios';
import { logger } from '../utils/logger';

/**
 * Service for external dictionary API interactions
 */
export class DictionaryService {
  private apiBaseUrl: string;
  private apiKey: string;

  constructor() {
    this.apiBaseUrl = process.env.DICTIONARY_API_URL || '';
    this.apiKey = process.env.DICTIONARY_API_KEY || '';
  }

  /**
   * Check if a word exists in an external dictionary
   * This is a backup for words not in our database
   */
  async wordExists(word: string): Promise<boolean> {
    try {
      // If no API configuration, return false
      if (!this.apiBaseUrl || !this.apiKey) {
        logger.warn('Dictionary API not configured');
        return false;
      }

      const response = await axios.get(`${this.apiBaseUrl}/entries/en/${word.toLowerCase()}`, {
        headers: {
          'app_id': this.apiKey,
          'app_key': this.apiKey
        }
      });

      return response.status === 200;
    } catch (error) {
      logger.error('Dictionary API error:', error);
      return false;
    }
  }
}

export default new DictionaryService();
```

### 3.3 Seed Generator Utility

```typescript
// packages/server/src/utils/seedGenerator.ts
/**
 * Generate a deterministic seed from a date
 * This ensures the same word is selected for all users on the same day
 */
export function generateDateSeed(date: Date): number {
  // Format date as YYYYMMDD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const dateString = `${year}${month}${day}`;

  // Simple hash function to convert dateString to a number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Ensure positive value
  return Math.abs(hash);
}
```

## 4. API Endpoints Implementation

### 4.1 Word Controller

```typescript
// packages/server/src/controllers/wordController.ts
import { Request, Response } from 'express';
import wordService from '../services/wordService';
import dictionaryService from '../services/dictionaryService';
import { logger } from '../utils/logger';

/**
 * Word-related controller functions
 */
export const wordController = {
  /**
   * Get daily word
   */
  async getDailyWord(req: Request, res: Response) {
    try {
      const word = await wordService.getDailyWord();

      return res.status(200).json({
        success: true,
        data: { word }
      });
    } catch (error) {
      logger.error('Error in getDailyWord:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to retrieve daily word'
      });
    }
  },

  /**
   * Validate a word
   */
  async validateWord(req: Request, res: Response) {
    try {
      const { word } = req.body;

      // First check our database
      let isValid = await wordService.validateWord(word);

      // If not in our database, check external dictionary API
      if (!isValid) {
        isValid = await dictionaryService.wordExists(word);
      }

      return res.status(200).json({
        success: true,
        data: {
          word,
          valid: isValid
        }
      });
    } catch (error) {
      logger.error('Error in validateWord:', error);
      return res.status(500).json({
        success: false,
        error: 'Word validation failed'
      });
    }
  }
};
```

### 4.2 Word Routes

```typescript
// packages/server/src/routes/wordRoutes.ts
import { Router } from 'express';
import { wordController } from '../controllers/wordController';
import { validateWordGuess } from '../middleware/validation';
import { wordValidationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Get daily word (protected with rate limiting)
router.get('/daily', wordValidationLimiter, wordController.getDailyWord);

// Validate word (protected with validation middleware and rate limiting)
router.post('/validate', wordValidationLimiter, validateWordGuess(), wordController.validateWord);

export default router;
```

### 4.3 API Routes Index

```typescript
// packages/server/src/routes/index.ts
import { Router } from 'express';
import wordRoutes from './wordRoutes';

const router = Router();

// Word-related routes
router.use('/word', wordRoutes);

export default router;
```

## 5. Server Configuration

### 5.1 Express App Configuration

```typescript
// packages/server/src/app.ts
import express from 'express';
import * as dotenv from 'dotenv';
import {
  apiLimiter,
  errorHandler,
  notFoundHandler,
  configureSecurityMiddleware
} from './middleware';
import routes from './routes';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Configure security middleware (CORS, Helmet)
configureSecurityMiddleware(app);

// Parse JSON bodies
app.use(express.json());

// Apply general rate limiting
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    }
  });
});

// API routes
app.use('/api', routes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
```

### 5.2 Server Entry Point

```typescript
// packages/server/src/index.ts
import app from './app';
import { connectToDatabase, closeDatabaseConnection } from './config/db';
import wordService from './services/wordService';
import { logger } from './utils/logger';

// Port from environment variable or default
const PORT = process.env.PORT || 3001;

// Sample words for development (ideally, this would be loaded from a file or API)
const sampleWords = [
  'react', 'cloud', 'azure', 'board', 'chess', 'earth',
  'flame', 'globe', 'heart', 'image', 'joker', 'knife',
  'lemon', 'music', 'night', 'ocean', 'piano', 'queen',
  'radio', 'storm', 'tiger', 'unity', 'video', 'water',
  'yacht', 'zebra'
];

/**
 * Initialize the server
 */
async function initialize() {
  try {
    // Connect to database
    await connectToDatabase();

    // Initialize word list if empty
    await wordService.initializeWordList(sampleWords);

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });

    // Handle shutdown
    setupGracefulShutdown();
  } catch (error) {
    logger.error('Server initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Setup graceful shutdown
 */
function setupGracefulShutdown() {
  // Handle termination signals
  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach(signal => {
    process.on(signal, async () => {
      logger.info(`${signal} received, shutting down gracefully`);

      // Close database connection
      await closeDatabaseConnection();

      // Exit process
      process.exit(0);
    });
  });
}

// Start the server
if (process.env.NODE_ENV !== 'test') {
  initialize();
}

export default app;
```

## 6. Environment Configuration

```
# packages/server/.env.example
# Server Configuration
PORT=3001
NODE_ENV=development

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Cosmos DB
COSMOS_DB_CONNECTION_STRING=your_connection_string
COSMOS_DB_NAME=wordleDb

# Dictionary API (optional)
DICTIONARY_API_URL=https://dictionary-api-example.com
DICTIONARY_API_KEY=your_api_key

# Rate Limiting
API_RATE_LIMIT=100
VALIDATION_RATE_LIMIT=10
```

## 7. Logger Utility

```typescript
// packages/server/src/utils/logger.ts
/**
 * Simple logger utility
 * This would be replaced with a more robust solution in production
 */
export const logger = {
  info: (message: string, ...args: any[]) => {
    console.log(`[INFO] ${message}`, ...args);
  },

  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },

  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },

  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};
```

## 8. Frontend Integration

### 8.1 Update API Service

```typescript
// packages/client/src/services/api.ts
/**
 * API service for making requests to the backend
 */
export const api = {
  /**
   * Get daily word
   */
  async getDailyWord(): Promise<string> {
    try {
      const response = await fetch('/api/word/daily');

      if (!response.ok) {
        throw new Error('Failed to fetch daily word');
      }

      const data = await response.json();
      return data.data.word;
    } catch (error) {
      console.error('Error fetching daily word:', error);
      // Fallback word in case of API failure
      return 'react';
    }
  },

  /**
   * Validate a word
   */
  async validateWord(word: string): Promise<boolean> {
    try {
      const response = await fetch('/api/word/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });

      if (!response.ok) {
        throw new Error('Word validation failed');
      }

      const data = await response.json();
      return data.data.valid;
    } catch (error) {
      console.error('Error validating word:', error);
      return false;
    }
  }
};

export default api;
```

### 8.2 Update GameContext to Use API

```typescript
// In packages/client/src/contexts/GameContext/GameContext.tsx

// Import the API service
import api from '../../services/api';

// In the GameProvider component, update to fetch the daily word

// Replace the hard-coded solution with an API call
useEffect(() => {
  const fetchDailyWord = async () => {
    try {
      const dailyWord = await api.getDailyWord();
      dispatch({
        type: 'SET_SOLUTION',
        payload: dailyWord.toLowerCase()
      });
    } catch (error) {
      console.error('Error fetching daily word:', error);
      // Keep the default word if API fails
    }
  };

  fetchDailyWord();
}, []);

// And update the submitGuess function to validate words with the API

const submitGuess = useCallback(async () => {
  // Check if guess is complete and game is still active
  if (state.currentGuess.length !== WORD_LENGTH || state.gameStatus !== 'playing') {
    return;
  }

  // Validate word against dictionary API
  const isValidWord = await api.validateWord(state.currentGuess);

  if (!isValidWord) {
    dispatch({
      type: 'SET_INVALID_GUESS',
      payload: { isInvalid: true, rowIndex: state.guesses.length }
    });

    // Reset invalid state after shake animation
    setTimeout(() => {
      dispatch({
        type: 'SET_INVALID_GUESS',
        payload: { isInvalid: false, rowIndex: -1 }
      });
    }, 600);

    return;
  }

  // Rest of the existing submitGuess function...
}, [state.currentGuess, state.gameStatus, state.guesses.length, evaluateGuess]);
```

## 9. Implementation Steps

1. **Database Setup**
   - Create Azure Cosmos DB with MongoDB API
   - Configure connection in the server
   - Create database models

2. **Core Services**
   - Implement Word Service
   - Create Dictionary Service (with fallback)
   - Develop Seed Generator utility

3. **API Endpoints**
   - Build Word Controller
   - Configure API Routes
   - Test endpoints with Postman/Insomnia

4. **Frontend Integration**
   - Update Frontend API service to call actual endpoints
   - Modify GameContext to use backend API
   - Add error handling for API failures

5. **Testing and Deployment**
   - Test full application flow
   - Deploy to Azure App Service
   - Configure monitoring and logging

## 10. Success Criteria: Phase 3 Completion

Phase 3 will be considered complete when:

1. **Azure Infrastructure**
   - Azure Cosmos DB with MongoDB API is provisioned
   - Database and collection structure is created with appropriate indexes
   - Connection to Cosmos DB is successfully established from the Express server

2. **Backend Functionality**
   - Word Service successfully retrieves and validates words using Cosmos DB
   - Daily word selection algorithm is implemented and returns deterministic results
   - Express API endpoints respond with proper status codes and data formats
   - External dictionary API integration is functioning (if applicable)
   - Error handling is implemented throughout the backend

3. **API Implementation**
   - `/api/word/daily` endpoint returns the word of the day
   - `/api/word/validate` endpoint validates submitted words against the dictionary
   - Rate limiting is properly applied to API endpoints
   - API responses follow a consistent structure with success/error handling

4. **Frontend Integration**
   - Frontend API service is updated to call actual backend endpoints
   - GameContext is modified to fetch the daily word from the API
   - Word validation uses the backend API instead of client-side logic
   - Appropriate error handling and fallbacks are implemented

5. **Data Management**
   - Word collection is populated with at least 100 valid five-letter words
   - Word selection algorithm avoids repeating words until all words are used
   - Database queries are optimized for performance

6. **Security & Configuration**
   - Sensitive connection strings and keys are stored as environment variables
   - CORS is properly configured for the frontend domain
   - Basic security headers are implemented
   - Rate limiting is in place to prevent abuse

7. **Quality Assurance**
   - Endpoints pass integration tests
   - Game works correctly with the API integration
   - Performance is acceptable (API responses under 500ms)
   - Error scenarios are properly handled and provide meaningful feedback

## 11. Future Considerations

1. **Azure Key Vault Integration**
   - Move sensitive configuration to Azure Key Vault
   - Use Managed Identity for secure access

2. **Infrastructure as Code**
   - Implement Azure Bicep templates for infrastructure
   - Create deployment scripts

3. **API Improvements**
   - Add authentication/authorization
   - Implement API versioning
   - Enhance API documentation

4. **Advanced Word Selection**
   - Improve word selection algorithm
   - Add difficulty categorization
   - Implement themed word collections

## 12. Additional Resources

- [Azure Cosmos DB Documentation](https://docs.microsoft.com/en-us/azure/cosmos-db/)
- [Express.js API Documentation](https://expressjs.com/en/4x/api.html)
- [MongoDB Node.js Driver](https://docs.mongodb.com/drivers/node/current/)
- [Axios HTTP Client](https://axios-http.com/docs/intro)
- [Azure Key Vault Documentation](https://docs.microsoft.com/en-us/azure/key-vault/)
