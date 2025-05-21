import app from './app';
import { connectToDatabase, closeDatabaseConnection } from './config/db';
import wordService from './services/wordService';
import { logger } from './utils/logger';

// Port from environment variable or default
const PORT = process.env.PORT || 3001;

// Sample words for development
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
export async function initialize() {
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
