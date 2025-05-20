// Location: packages/server/src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { AppError } from './errorHandler';

// Reusable validation middleware
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    // Return validation errors
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  };
};

// Word validation for Wordle (5 letter word)
export const validateWordGuess = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { word } = req.body;

    // Check if word exists
    if (!word) {
      return next(new AppError('Word is required', 400));
    }

    // Check if word is a string
    if (typeof word !== 'string') {
      return next(new AppError('Word must be a string', 400));
    }

    // Check if word is 5 letters
    if (word.length !== 5) {
      return next(new AppError('Word must be exactly 5 letters', 400));
    }

    // Check if word contains only letters
    if (!/^[a-zA-Z]+$/.test(word)) {
      return next(new AppError('Word must contain only letters', 400));
    }

    // Convert to lowercase for consistency
    req.body.word = word.toLowerCase();

    next();
  };
};
