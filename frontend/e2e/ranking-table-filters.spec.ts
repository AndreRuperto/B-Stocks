import { test, expect } from '@playwright/test';

test.describe('B3 Stocks Ranking Table and Filters', () => {
  test('filters stocks by ticker search and toggles cut filter switch', async ({
    page,
  }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('PETR4');

    const petrRow = page.getByTestId('stock-row-PETR4');
    await expect(petrRow).toBeVisible({ timeout: 10000 });
    await expect(petrRow).toContainText('PETR4');

    const cutFilterSwitch = page.getByTestId('cut-filter-switch');
    await expect(cutFilterSwitch).toBeVisible();
    await cutFilterSwitch.click();
    await expect(petrRow).toBeVisible();
  });
});
