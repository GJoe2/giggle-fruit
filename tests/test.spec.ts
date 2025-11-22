import { test, expect } from '@playwright/test';

test('gameplay flow and ranking persistence', async ({ page }) => {
  await page.goto('/');

  // --- 1. Start Menu ---
  await expect(page.locator('h1')).toContainText('Atrapa Frutas - Edición Premium');
  await expect(page.getByPlaceholder('Tu nombre')).toBeVisible();

  // Test validation
  await page.getByRole('button', { name: 'Empezar' }).click();
  await expect(page.getByText('Por favor, introduce un nombre para jugar.')).toBeVisible();

  await page.getByPlaceholder('Tu nombre').fill('Tester');
  await page.getByRole('button', { name: 'Empezar' }).click();

  // --- 2. Game Screen ---
  // Wait for the game canvas to be visible after the start menu disappears
  await expect(page.locator('#gameCanvas')).toBeVisible({ timeout: 5000 });
  await expect(page.getByText(/Objetivo:/)).toBeVisible(); // Check for the objective text

  // --- 3. End Game Simulation ---
  // We can't directly interact with the canvas, but we can call the function
  // that the game uses to signal its end state to React.
  await page.evaluate(() => {
    window.gameAPI.endGame('victoria', 250); // Simulate a win with 250 points
  });

  // --- 4. End Menu ---
  await expect(page.getByText('¡Victoria! Puntos: 250')).toBeVisible();
  await page.getByRole('button', { name: 'Volver al Menú' }).click();

  // --- 5. Ranking Verification ---
  await expect(page.getByPlaceholder('Tu nombre')).toBeVisible(); // Back to start menu
  await page.getByRole('button', { name: 'Rankings' }).click();

  await expect(page.getByRole('heading', { name: 'Rankings' })).toBeVisible();

  // Check if the new score is in the ranking
  const playerRankEntry = page.locator('ol > li', { hasText: 'Tester' });
  await expect(playerRankEntry).toContainText('250 pts');

  // Check local storage persistence
  const rankingsFromStorage = await page.evaluate(() => {
    return localStorage.getItem('rankings');
  });
  expect(rankingsFromStorage).toContain('{"name":"Tester","score":250}');

  // --- 6. Level Progression ---
  await page.getByRole('button', { name: 'Volver al Menú' }).click();

  // The level selector should now contain Level 2
  const levelSelector = page.locator('select');
  await expect(levelSelector.locator('option')).toHaveCount(2); // Level 1 and 2
  await expect(levelSelector).toHaveValue('1');

  // Check local storage for max level
  const maxLevelFromStorage = await page.evaluate(() => {
    return localStorage.getItem('maxNivelDesbloqueado');
  });
  expect(maxLevelFromStorage).toBe('2');
});
