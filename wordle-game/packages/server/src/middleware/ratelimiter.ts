// Location: packages/server/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiMaxEnv = parseInt(process.env.API_RATE_LIMIT || '');
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isNaN(apiMaxEnv) ? 100 : apiMaxEnv,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
});

// Stricter limit for word validation endpoint
const validationMaxEnv = parseInt(process.env.VALIDATION_RATE_LIMIT || '');
export const wordValidationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: isNaN(validationMaxEnv) ? 10 : validationMaxEnv,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many word attempts, please try again later.',
  },
});

// Even stricter limit for auth-related endpoints (if we add them later)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many attempts, please try again later.',
  },
});
