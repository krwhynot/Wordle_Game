/* validateGuess Azure Function */
const { isValidFBWord } = require('../shared/fbWordlist');

module.exports = async function (context, req) {
  context.log('validateGuess function invoked');
  const { guess } = (req.body || {});

  if (!guess || typeof guess !== 'string') {
    context.res = {
      status: 400,
      body: { error: 'Missing or invalid "guess" in request body' }
    };
    return;
  }

  // Validate the guess against our F&B wordlist
  const isValidWord = isValidFBWord(guess);
  
  // Additional validation - ensure it's exactly 5 letters
  const isCorrectLength = guess.length === 5;
  
  // Word is valid if it's in our dictionary and has correct length
  const valid = isValidWord && isCorrectLength;

  // Return validation result
  context.res = {
    status: 200,
    body: { 
      guess, 
      valid,
      reason: !valid ? (!isValidWord ? 'Not a valid F&B term' : 'Must be exactly 5 letters') : null
    }
  };
};
