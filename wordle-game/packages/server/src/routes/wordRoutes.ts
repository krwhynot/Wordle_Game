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
