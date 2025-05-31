/**
 * Azure Function: dailyWord
 * 
 * Returns the current daily word for the Wordle game.
 * The word is deterministically selected based on the current date,
 * ensuring all players get the same word on the same day.
 */
const { getAllFBWords } = require('../shared/fbWordlist');

module.exports = async function (context, req) {
  context.log('dailyWord function invoked');
  
  try {
    // Get all F&B words
    const allWords = getAllFBWords();
    
    // Get current date in format YYYY-MM-DD
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Use the date string to deterministically select a word
    // This ensures the same word is returned for all players on the same day
    const dateHash = hashCode(dateString);
    const wordIndex = Math.abs(dateHash) % allWords.length;
    const dailyWord = allWords[wordIndex];
    
    // Return the daily word
    context.res = {
      status: 200,
      body: { 
        word: dailyWord,
        date: dateString
      }
    };
  } catch (error) {
    context.log.error('Error in dailyWord function:', error);
    context.res = {
      status: 500,
      body: { error: 'Failed to retrieve daily word' }
    };
  }
};

/**
 * Simple string hash function to convert a date string into a number
 * 
 * @param {string} str - The string to hash
 * @returns {number} A numeric hash value
 */
function hashCode(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash;
}
