/**
 * Checks if a word is valid for the game
 * @param word - The word to validate
 * @returns Validation result with status and error message if applicable
 */
export function validateWord(word: string): { valid: boolean; error?: string } {
  // Check length
  if (word.length !== 5) {
    return { valid: false, error: 'Word must be 5 letters' };
  }

  // Check if contains only letters
  if (!/^[a-zA-Z]+$/.test(word)) {
    return { valid: false, error: 'Word must contain only letters' };
  }

  // In the future, this would check against a dictionary API
  // For now, consider it valid if it passes basic checks
  return { valid: true };
}

/**
 * In future phases, this function would call the dictionary API
 * For now, it's a placeholder
 */
export async function isInDictionary(word: string): Promise<boolean> {
  // TODO: Implement API call to validate word against dictionary
  // For now, return true if it's a valid word format
  return validateWord(word).valid;
}
