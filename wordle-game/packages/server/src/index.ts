import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Basic route
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
// Location: packages/server/src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import {
  apiLimiter,
  wordValidationLimiter,
  errorHandler,
  notFoundHandler,
  configureSecurityMiddleware,
  validateWordGuess
} from './middleware';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure security middleware (CORS, helmet)
configureSecurityMiddleware(app);

// Parse JSON bodies
app.use(express.json());

// Apply general rate limiting
app.use('/api', apiLimiter);

// Basic routes
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

// Example word validation endpoint with stricter rate limiting and validation
app.post('/api/word/validate', wordValidationLimiter, validateWordGuess(), (req, res) => {
  const { word } = req.body;

  // Here we would check if the word exists in our dictionary
  // This is just a placeholder implementation
  const isValidWord = true; // This would be a real dictionary check

  if (!isValidWord) {
    return res.status(400).json({
      success: false,
      error: 'Not in word list'
    });
  }

  // Return success
  res.status(200).json({
    success: true,
    data: {
      word,
      valid: true
    }
  });
});

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
