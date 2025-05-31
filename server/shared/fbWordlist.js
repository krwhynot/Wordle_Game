/**
 * Food & Beverage Industry Word List for Wordle Game
 * 
 * This module provides a collection of F&B industry terms for the Wordle game.
 * All words are exactly 5 letters in length to match the game requirements.
 */

// 5-letter F&B industry terms
const FB_WORDS = [
  // Cooking methods
  'SAUTE', 'BRAZE', 'BROIL', 'GRILL', 'STEAM', 'POACH', 'ROAST', 'SMOKE', 'BRAIS',
  
  // Ingredients & Food Items
  'FLOUR', 'SUGAR', 'YEAST', 'WATER', 'OLIVE', 'HONEY', 'COCOA', 'LEMON', 'BASIL',
  'THYME', 'CLOVE', 'ONION', 'CHIVE', 'SALSA', 'CURRY', 'PASTA', 'BREAD', 'PIZZA',
  'BACON', 'MANGO', 'APPLE', 'GRAPE', 'MELON', 'PEACH', 'BERRY', 'STEAK', 'CHEEK',
  'CHUCK', 'FLANK', 'BRINE', 'GLAZE', 'BASTE', 'SAUCE', 'CREAM', 'CHEWY', 'CRISP',
  
  // Equipment
  'KNIFE', 'WHISK', 'MIXER', 'TONGS', 'TORCH', 'STOVE', 'SKIFF', 'GRATE', 'LADLE',
  'JUICER', 'BOARD', 'SCALE', 'TIMER', 'PLATE', 'GLASS', 'SPOON', 'FORK', 'SKEWL',
  
  // Restaurant terms
  'ENTREE', 'AMUSE', 'COVER', 'CHEFS', 'COMMIS', 'FLOOR', 'FRONT', 'GUEST', 'ORDER',
  'VENUE', 'WAIVE', 'TABLE', 'SEATS', 'BOOTH', 'PATIO', 'TASTE', 'MENU', 'CHECK',
  
  // Flavors & Qualities
  'UMAMI', 'SPICY', 'SWEET', 'SALTY', 'SOUR', 'TANGY', 'JUICY', 'FLAKY', 'SMOKY',
  'NUTTY', 'EARTHY', 'HERBY', 'BURNT', 'FRESH', 'DRIED', 'MOIST', 'CRISP', 'AGED',
  
  // Beverages
  'WATER', 'VODKA', 'WHISKY', 'JUICE', 'LAGER', 'CIDER', 'PINOT', 'MERLOT', 'BLEND',
  'DECAF', 'LATTE', 'MOCHA'
];

/**
 * Check if a word is a valid F&B industry term
 * 
 * @param {string} word - The word to validate
 * @returns {boolean} True if the word is a valid F&B term
 */
function isValidFBWord(word) {
  if (!word || typeof word !== 'string') {
    return false;
  }
  
  // Convert to uppercase for case-insensitive comparison
  const normalizedWord = word.toUpperCase();
  
  // Check if the word exists in our list
  return FB_WORDS.includes(normalizedWord);
}

/**
 * Get a random F&B word from the list
 * 
 * @returns {string} A random 5-letter F&B word
 */
function getRandomFBWord() {
  const randomIndex = Math.floor(Math.random() * FB_WORDS.length);
  return FB_WORDS[randomIndex];
}

/**
 * Get the entire F&B word list
 * 
 * @returns {string[]} Array of F&B words
 */
function getAllFBWords() {
  return [...FB_WORDS];
}

module.exports = {
  isValidFBWord,
  getRandomFBWord,
  getAllFBWords
};
