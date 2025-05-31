import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/F&B Wordle/);
});

test('get started link', async ({ page }) => {
  await page.goto('/');

  // Expects page to have a heading with the name of Playwright.
  await expect(page.getByRole('heading', { name: 'F&B Wordle' })).toBeVisible();
});