import { EvaluationResult } from '../../types/game';

/**
 * Evaluates a guess against the solution
 * @param guess - The player's guess (5-letter word)
 * @param solution - The target word to guess
 * @returns Array of evaluation results for each letter
 */
export function evaluateGuess(guess: string, solution: string): EvaluationResult[] {
  // Convert input to uppercase for consistency
  const guessArray = guess.toUpperCase().split('');
  const solutionArray = solution.toUpperCase().split('');

  // Initialize all positions as 'absent'
  const result: EvaluationResult[] = Array(guessArray.length).fill('absent');

  // Track which letters in solution have been matched
  const solutionMap = solutionArray.reduce<Record<string, number>>((map, letter) => {
    map[letter] = (map[letter] || 0) + 1;
    return map;
  }, {});

  // First pass: Find exact matches (correct position)
  for (let i = 0; i < guessArray.length; i++) {
    if (guessArray[i] === solutionArray[i]) {
      result[i] = 'correct';
      solutionMap[guessArray[i]]--;
    }
  }

  // Second pass: Find partial matches (wrong position)
  for (let i = 0; i < guessArray.length; i++) {
    if (result[i] === 'absent' && solutionMap[guessArray[i]] > 0) {
      result[i] = 'present';
      solutionMap[guessArray[i]]--;
    }
  }

  return result;
}
