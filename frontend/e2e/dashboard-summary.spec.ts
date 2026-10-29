import { test, expect } from '@playwright/test';

test.describe('Dashboard Market Summary & Solid Neutral UI', () => {
  test('renders B3 market summary cards and enforces zero CSS gradients', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toContainText('B-STOCKS');

    const totalStocksEl = page.getByTestId('summary-total-stocks');
    await expect(totalStocksEl).toBeVisible({ timeout: 15000 });
    const totalCount = Number(await totalStocksEl.innerText());
    expect(totalCount).toBeGreaterThanOrEqual(30);

    await expect(page.getByTestId('summary-bazin-count')).toBeVisible();
    await expect(page.getByTestId('summary-graham-count')).toBeVisible();

    const gradientElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter((el) => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg && bg.includes('gradient');
      }).length;
    });
    expect(gradientElements).toBe(0);
  });
});
