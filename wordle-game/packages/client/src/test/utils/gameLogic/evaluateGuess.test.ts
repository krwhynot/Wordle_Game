import { evaluateGuess } from '@/utils/gameLogic/evaluateGuess';
import { EvaluationResult } from '@/types/game';

describe('evaluateGuess', () => {
  // Test with all letters correct.
  test('should return all correct for an exact match', () => {
    const guess = 'APPLE';
    const solution = 'APPLE';
    const expected: EvaluationResult[] = ['correct', 'correct', 'correct', 'correct', 'correct'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  // Test with all letters present but in wrong positions.
  test('should return all present for letters in wrong positions', () => {
    const guess = 'AROSE';
    const solution = 'ROSEA';
    const expected: EvaluationResult[] = ['present', 'present', 'present', 'present', 'present'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  // Test with all letters absent.
  test('should return all absent for no matching letters', () => {
    const guess = 'BRICK';
    const solution = 'APPLE';
    const expected: EvaluationResult[] = ['absent', 'absent', 'absent', 'absent', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  // Test with a mix of correct, present, and absent letters.
  test('should return a mix of correct, present, and absent letters', () => {
    const guess = 'CRANE';
    const solution = 'CRONY';
    const expected: EvaluationResult[] = ['correct', 'correct', 'absent', 'correct', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  // Test scenarios with duplicate letters in the guess and/or solution.
  test('should handle duplicate letters correctly (guess has duplicates, solution has one)', () => {
    const guess = 'APPLE';
    const solution = 'APPLY';
    const expected: EvaluationResult[] = ['correct', 'correct', 'correct', 'correct', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  test('should handle duplicate letters correctly (solution has duplicates, guess has one)', () => {
    const guess = 'RIVER';
    const solution = 'ERROR';
    const expected: EvaluationResult[] = ['present', 'absent', 'absent', 'present', 'correct'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  test('should handle duplicate letters correctly (both have duplicates, some correct, some present)', () => {
    const guess = 'FLOOD';
    const solution = 'WOODS';
    const expected: EvaluationResult[] = ['absent', 'absent', 'correct', 'present', 'present'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  test('should handle duplicate letters correctly (guess has more duplicates than solution)', () => {
    const guess = 'PAPER';
    const solution = 'APPLE';
    const expected: EvaluationResult[] = ['present', 'present', 'correct', 'present', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  test('should handle duplicate letters correctly (solution has more duplicates than guess)', () => {
    const guess = 'EERIE';
    const solution = 'EXCEL';
    const expected: EvaluationResult[] = ['correct', 'present', 'absent', 'absent', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });

  test('should handle case insensitivity', () => {
    const guess = 'crane';
    const solution = 'CRONY';
    const expected: EvaluationResult[] = ['correct', 'correct', 'absent', 'correct', 'absent'];
    expect(evaluateGuess(guess, solution)).toEqual(expected);
  });
});
