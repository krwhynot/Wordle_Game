import { generateDateSeed } from '../../utils/seedGenerator';

describe('generateDateSeed', () => {
  it('should return a consistent positive integer for the same date', () => {
    const date1 = new Date('2023-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-01T00:00:00.000Z'); // Same date, different time

    // Normalize dates to start of day for consistent seeding
    date1.setUTCHours(0, 0, 0, 0);
    date2.setUTCHours(0, 0, 0, 0);

    const seed1 = generateDateSeed(date1);
    const seed2 = generateDateSeed(date2);

    expect(seed1).toBeGreaterThanOrEqual(0);
    expect(seed2).toBeGreaterThanOrEqual(0);
    expect(seed1).toBe(seed2);
  });

  it('should return different integers for different dates', () => {
    const date1 = new Date('2023-01-01T12:00:00.000Z');
    const date2 = new Date('2023-01-02T12:00:00.000Z');

    // Normalize dates to start of day for consistent seeding
    date1.setUTCHours(0, 0, 0, 0);
    date2.setUTCHours(0, 0, 0, 0);

    const seed1 = generateDateSeed(date1);
    const seed2 = generateDateSeed(date2);

    expect(seed1).not.toBe(seed2);
  });

  it('should handle leap years correctly', () => {
    const date1 = new Date('2024-02-29T12:00:00.000Z');
    const date2 = new Date('2024-02-29T00:00:00.000Z');

    // Normalize dates to start of day for consistent seeding
    date1.setUTCHours(0, 0, 0, 0);
    date2.setUTCHours(0, 0, 0, 0);

    const seed1 = generateDateSeed(date1);
    const seed2 = generateDateSeed(date2);

    expect(seed1).toBe(seed2);
  });

  it('should return a positive integer for any valid date', () => {
    const date = new Date();
    // Normalize date to start of day for consistent seeding
    date.setUTCHours(0, 0, 0, 0);
    const seed = generateDateSeed(date);
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(seed)).toBe(true);
  });
});
