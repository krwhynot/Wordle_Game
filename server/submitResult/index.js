/**
 * SubmitResult Azure Function
 * 
 * Receives game results from clients and stores them (currently in-memory).
 * In a production environment, this would store data in Azure Cosmos DB.
 */
const { isValidWord } = require('../shared/fbWordlist');

// In-memory storage for game results (would be replaced by Azure Cosmos DB)
const gameResults = [];

module.exports = async function (context, req) {
    context.log('Processing game result submission');
    
    // Input validation
    if (!req.body) {
        return {
            status: 400,
            body: { 
                success: false,
                message: "Request body is required" 
            }
        };
    }
    
    const { sessionId, playerName, targetWord, guesses, isWin, attempts, date } = req.body;
    
    // Validate required fields
    if (!sessionId || !playerName || !targetWord || !Array.isArray(guesses)) {
        return {
            status: 400,
            body: { 
                success: false,
                message: "Missing required fields" 
            }
        };
    }
    
    // Validate target word is in our F&B dictionary
    if (!isValidWord(targetWord)) {
        return {
            status: 400,
            body: { 
                success: false,
                message: "Invalid target word" 
            }
        };
    }
    
    try {
        // Store the game result (in-memory for now)
        const gameResult = {
            id: `${sessionId}-${Date.now()}`,
            sessionId,
            playerName,
            targetWord,
            guesses,
            isWin,
            attempts,
            date: date || new Date().toISOString(),
            submittedAt: new Date().toISOString()
        };
        
        gameResults.push(gameResult);
        context.log(`Game result saved: ${gameResult.id}`);
        
        return {
            status: 200,
            body: { 
                success: true,
                message: "Game result saved successfully" 
            }
        };
    } catch (error) {
        context.log.error('Error saving game result:', error);
        return {
            status: 500,
            body: { 
                success: false,
                message: "Failed to save game result" 
            }
        };
    }
};
