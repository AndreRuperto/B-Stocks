import { test, expect } from '@playwright/test';

test.describe('Stock Detail Modal, Bazin Simulator and AI Thesis', () => {
  test('opens stock analysis modal, recalculates Bazin ceiling and renders AI thesis', async ({
    page,
  }) => {
    await page.goto('/');

    const searchInput = page.getByTestId('search-input');
    await expect(searchInput).toBeVisible({ timeout: 15000 });
    await searchInput.fill('PETR4');

    await page.getByTestId('analyze-btn-PETR4').click();

    const modal = page.getByTestId('stock-detail-modal');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText('PETR4');

    const initialSimPrice = await page
      .getByTestId('simulated-bazin-price')
      .innerText();
    await page.getByTestId('bazin-simulator-input').fill('10');
    const updatedSimPrice = await page
      .getByTestId('simulated-bazin-price')
      .innerText();
    expect(initialSimPrice).not.toEqual(updatedSimPrice);

    await page.getByTestId('tab-technical').click();
    await expect(modal).toContainText('Média Móvel Simples 50 (SMA 50)');
    await expect(modal).toContainText('Composição do Score Único');

    await page.getByTestId('tab-thesis').click();
    const thesisContent = page.getByTestId('thesis-content');
    await expect(thesisContent).toBeVisible({ timeout: 15000 });
    await expect(thesisContent).toContainText('Pontos Fortes');
    await expect(thesisContent).toContainText('Riscos Mapeados');
    await expect(thesisContent).toContainText('Veredito de Longo Prazo');
  });
});
