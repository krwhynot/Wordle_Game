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
