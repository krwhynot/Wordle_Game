import { validateWord, isInDictionary } from '@/utils/gameLogic/wordValidation';

describe('wordValidation', () => {
  // Test for word length constraints.
  test('validateWord should return valid for a 5-letter word', () => {
    const result = validateWord('APPLE');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('validateWord should return invalid for a word shorter than 5 letters', () => {
    const result = validateWord('APP');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Word must be 5 letters');
  });

  test('validateWord should return invalid for a word longer than 5 letters', () => {
    const result = validateWord('APPLES');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Word must be 5 letters');
  });

  // Test for allowed characters (e.g., only letters).
  test('validateWord should return invalid for a word with numbers', () => {
    const result = validateWord('APP1E');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Word must contain only letters');
  });

  test('validateWord should return invalid for a word with special characters', () => {
    const result = validateWord('APP!E');
    expect(result.valid).toBe(false);
    expect(result.error).toBe('Word must contain only letters');
  });

  test('validateWord should return valid for a word with mixed case letters', () => {
    const result = validateWord('ApPlE');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  // isInDictionary tests (placeholder implementation)
  test('isInDictionary should return true for a valid 5-letter word', async () => {
    const result = await isInDictionary('CRANE');
    expect(result).toBe(true);
  });

  test('isInDictionary should return false for a word shorter than 5 letters', async () => {
    const result = await isInDictionary('APP');
    expect(result).toBe(false);
  });

  test('isInDictionary should return false for a word with numbers', async () => {
    const result = await isInDictionary('WORD1');
    expect(result).toBe(false);
  });
});
