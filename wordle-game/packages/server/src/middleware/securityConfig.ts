// Location: packages/server/src/middleware/securityConfig.ts
import cors from 'cors';
import helmet from 'helmet';
import { Express } from 'express';

// Configure security middlewares
export const configureSecurityMiddleware = (app: Express) => {
  // Enhanced CORS configuration
  const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (like mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      // List of allowed origins
      const allowedOrigins = [
        'http://localhost:3000', // Local development frontend
        process.env.FRONTEND_URL, // Production frontend URL
      ].filter(Boolean); // Filter out undefined values

      // Check if origin is allowed
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies
    maxAge: 86400, // Cache preflight requests for 24 hours
  };

  // Apply CORS middleware
  app.use(cors(corsOptions));

  // Enhanced Helmet configuration
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"], // Needed for some frontend frameworks
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "blob:"],
          connectSrc: ["'self'", process.env.FRONTEND_URL].filter(Boolean),
        },
      },
      xssFilter: true, // Enable XSS protection
      noSniff: true, // Prevent MIME type sniffing
      referrerPolicy: { policy: 'same-origin' }, // Restrict referrer information
      hsts: {
        maxAge: 15552000, // 180 days
        includeSubDomains: true,
        preload: true,
      },
    })
  );
};
