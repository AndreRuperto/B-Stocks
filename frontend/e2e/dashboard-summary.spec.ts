import { test, expect } from '@playwright/test';

test.describe('Landing Page and Terminal Market Summary UI', () => {
  test('renders standalone landing page with ticker carousel, ibov chart and zero gradients', async ({
    page,
  }) => {
    await page.goto('/');

    const htmlElement = page.locator('html');
    await expect(htmlElement).toHaveClass(/dark/);

    const tickerEl = page.getByTestId('stock-ticker-carousel');
    await expect(tickerEl).toBeVisible();
    await expect(tickerEl).toContainText('BBAS3');
    await expect(tickerEl).toContainText('-2,02%');

    const ibovOverview = page.getByTestId('ibov-market-overview');
    await expect(ibovOverview).toBeVisible();
    await expect(ibovOverview).toContainText('IBOVESPA');
    await expect(ibovOverview).toContainText('Maiores Altas (24h)');
    await expect(ibovOverview).toContainText('Maiores Baixas (24h)');

    const heroExplore = page.getByTestId('hero-explore-button');
    await expect(heroExplore).toBeVisible();

    const gradientElements = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).filter((el) => {
        const bg = window.getComputedStyle(el).backgroundImage;
        return bg && bg.includes('gradient');
      }).length;
    });
    expect(gradientElements).toBe(0);
  });

  test('renders terminal market summary cards and enforces zero CSS gradients', async ({
    page,
  }) => {
    await page.goto('/terminal');

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
