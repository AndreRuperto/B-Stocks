import { test, expect } from '@playwright/test';

test.describe('Landing Page and Terminal Market Summary UI', () => {
  test('renders standalone landing page with ticker carousel, real recharts ibov chart and company logos', async ({
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
    await expect(page.getByTestId('ibov-current-points')).toContainText(
      '169.186,42',
    );
    await expect(page.getByTestId('ibov-recharts-container')).toBeVisible();
    await expect(page.getByTestId('ibov-top-gainers-card')).toContainText(
      'Maiores Altas do Pregão',
    );
    await expect(page.getByTestId('ibov-top-losers-card')).toContainText(
      'Maiores Baixas do Pregão',
    );

    const anyLogo = ibovOverview.locator('[data-testid^="company-logo-"]');
    await expect(anyLogo.first()).toBeVisible();

    const heroExplore = page.getByTestId('hero-explore-button');
    await expect(heroExplore).toBeVisible();
  });

  test('renders terminal market summary cards and enforces zero CSS gradients on terminal', async ({
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
