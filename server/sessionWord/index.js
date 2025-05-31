const { getAllFBWords } = require('../shared/fbWordlist');

// Define the 30-word rotation list from the existing F&B word list
const ROTATION_WORDS = getAllFBWords().slice(0, 30); // Take the first 30 words for rotation

module.exports = async function (context, req) {
    context.log('Processing session word request.');

    const sessionId = (req.query.sessionId || (req.body && req.body.sessionId));

    if (!sessionId) {
        context.res = {
            status: 400,
            body: "Please pass a sessionId on the query string or in the request body"
        };
        return;
    }

    let sessionData = context.bindings.sessionDocumentIn;
    let wordIndex = 0;

    if (sessionData) {
        wordIndex = sessionData.wordIndex || 0;
        context.log(`Existing session found for ${sessionId}. Current word index: ${wordIndex}`);
    } else {
        sessionData = {
            id: sessionId,
            wordIndex: 0,
            createdAt: new Date().toISOString()
        };
        context.log(`New session created for ${sessionId}.`);
    }

    // Get the current word from the rotation list
    const currentWord = ROTATION_WORDS[wordIndex % ROTATION_WORDS.length];

    // Prepare for next word: increment index and handle wrap-around
    const nextWordIndex = (wordIndex + 1) % ROTATION_WORDS.length;
    sessionData.wordIndex = nextWordIndex;
    sessionData.lastAccessedAt = new Date().toISOString();

    // Output the updated session data to Cosmos DB
    context.bindings.sessionDocumentOut = sessionData;

    context.res = {
        status: 200,
        body: {
            sessionId: sessionId,
            word: currentWord,
            nextWordIndex: nextWordIndex // For debugging/client info
        }
    };
};