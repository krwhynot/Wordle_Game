import { evaluateGuess } from '../gameLogic';

describe('evaluateGuess', () => {
  it('should correctly evaluate a guess with all correct letters', () => {
    const guess = 'apple';
    const target = 'apple';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct']);
  });

  it('should correctly evaluate a guess with all present letters', () => {
    const guess = 'pleap';
    const target = 'apple';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['present', 'present', 'present', 'present', 'present']);
  });

  it('should correctly evaluate a guess with all absent letters', () => {
    const guess = 'brick';
    const target = 'apple';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent']);
  });

  it('should correctly evaluate a mixed guess', () => {
    const guess = 'apron';
    const target = 'apple';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['correct', 'correct', 'absent', 'absent', 'present']);
  });

  it('should handle duplicate letters in guess and target', () => {
    const guess = 'balls';
    const target = 'apple';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['absent', 'present', 'absent', 'correct', 'absent']);
  });

  it('should handle duplicate letters in target correctly when guess has fewer duplicates', () => {
    const guess = 'apply';
    const target = 'pizza';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['absent', 'present', 'correct', 'absent', 'absent']);
  });

  it('should handle duplicate letters in target correctly when guess has more duplicates', () => {
    const guess = 'error';
    const target = 'robot';
    const result = evaluateGuess(guess, target);
    expect(result).toEqual(['absent', 'correct', 'absent', 'correct', 'absent']);
  });
});