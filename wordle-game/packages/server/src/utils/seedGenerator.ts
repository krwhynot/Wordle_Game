/**
 * Generate a deterministic seed from a date
 * This ensures the same word is selected for all users on the same day
 */
export function generateDateSeed(date: Date): number {
  // Format date as YYYYMMDD
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  const dateString = `${year}${month}${day}`;

  // Simple hash function to convert dateString to a number
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = ((hash << 5) - hash) + dateString.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  // Ensure positive value
  return Math.abs(hash);
}
