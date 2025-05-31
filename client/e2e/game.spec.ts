import { test, expect } from '@playwright/test';

test.describe('Wordle Game E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure the name entry modal is dismissed if it appears
    const nameEntryModal = page.locator('.name-entry-modal');
    if (await nameEntryModal.isVisible()) {
      await page.fill('input[placeholder="Enter your name"]', 'Playwright User');
      await page.click('button:has-text("Start Game")');
      await expect(nameEntryModal).not.toBeVisible();
    }
  });

  test('should allow a user to play a full game and win', async ({ page }) => {
    // Assuming a known word for testing, or a way to mock it
    // For now, we'll simulate a game with a common 5-letter word like 'APPLE'
    const wordToGuess = 'APPLE'; // This would ideally be mocked or known

    const typeWord = async (word: string) => {
      for (const char of word) {
        await page.click(`button[data-key="${char.toUpperCase()}"]`);
      }
      await page.click('button[data-key="ENTER"]');
    };

    // Attempt 1: WRONG
    await typeWord('CRANE');
    await expect(page.locator('.game-board .row').nth(0)).toHaveAttribute('data-status', 'evaluated');

    // Attempt 2: WRONG
    await typeWord('PLANT');
    await expect(page.locator('.game-board .row').nth(1)).toHaveAttribute('data-status', 'evaluated');

    // Attempt 3: WRONG
    await typeWord('GRAPE');
    await expect(page.locator('.game-board .row').nth(2)).toHaveAttribute('data-status', 'evaluated');

    // Attempt 4: WIN
    await typeWord(wordToGuess);
    await expect(page.locator('.game-board .row').nth(3)).toHaveAttribute('data-status', 'evaluated');

    // Expect game over message and play again button
    await expect(page.locator('.game-result')).toBeVisible();
    await expect(page.locator('.success-message')).toBeVisible();
    await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
  });

  test('should allow a user to play a full game and lose', async ({ page }) => {
    const typeWord = async (word: string) => {
      for (const char of word) {
        await page.click(`button[data-key="${char.toUpperCase()}"]`);
      }
      await page.click('button[data-key="ENTER"]');
    };

    // Simulate 6 incorrect guesses
    await typeWord('CRANE');
    await typeWord('PLANT');
    await typeWord('GRAPE');
    await typeWord('BRICK');
    await typeWord('HOUSE');
    await typeWord('DREAM');

    // Expect game over message and play again button
    await expect(page.locator('.game-result')).toBeVisible();
    await expect(page.locator('.failure-message')).toBeVisible();
    await expect(page.locator('button:has-text("Play Again")')).toBeVisible();
  });

  test('should show help modal', async ({ page }) => {
    await page.click('button[aria-label="Help"]');
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-content h2:has-text("How To Play")')).toBeVisible();
    await page.click('.modal-close-button');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('should show statistics modal', async ({ page }) => {
    await page.click('button[aria-label="Statistics"]');
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-content h2:has-text("Statistics")')).toBeVisible();
    await page.click('.modal-close-button');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });

  test('should show settings modal and allow theme change', async ({ page }) => {
    await page.click('button[aria-label="Settings"]');
    await expect(page.locator('.modal-overlay')).toBeVisible();
    await expect(page.locator('.modal-content h2:has-text("Settings")')).toBeVisible();

    // Toggle theme
    const body = page.locator('body');
    const initialTheme = await body.getAttribute('data-theme');
    await page.click('button:has-text("Toggle Theme")');
    const newTheme = await body.getAttribute('data-theme');
    expect(newTheme).not.toBe(initialTheme);

    await page.click('.modal-close-button');
    await expect(page.locator('.modal-overlay')).not.toBeVisible();
  });
});