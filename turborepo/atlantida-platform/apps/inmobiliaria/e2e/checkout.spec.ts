import { test, expect } from '@playwright/test';

test.describe('Checkout & Pricing Flow', () => {
    test('should load the pricing page and display all plans', async ({ page }) => {
        await page.goto('/publish/pricing');

        // Check for page title
        await expect(page.getByText('Escalabilidad para tu Inmobiliaria')).toBeVisible();

        // Check for the three plans
        await expect(page.getByText('Plan Base')).toBeVisible();
        await expect(page.getByText('Plan Pro')).toBeVisible();
        await expect(page.getByText('Plan Premium')).toBeVisible();

        // Check for pricing
        await expect(page.getByText('Gratis')).toBeVisible();
        await expect(page.getByText('USD 40')).toBeVisible();
        await expect(page.getByText('USD 90')).toBeVisible();
    });

    test('should show toast error when trying to subscribe without being logged in', async ({ page }) => {
        await page.goto('/publish/pricing');

        // Click on the Pro plan button
        const proButton = page.getByRole('button', { name: /Suscribirme/i }).first();
        await proButton.click();

        // Check for the error toast
        // Depending on Sonner implementation, we look for text
        await expect(page.getByText(/Debes iniciar sesión para contratar un plan/i)).toBeVisible();
    });

    test('should show informative toast for free plan', async ({ page }) => {
        await page.goto('/publish/pricing');

        const freeButton = page.getByRole('button', { name: /Plan Actual/i }).first();
        await freeButton.click();

        await expect(page.getByText(/Ya tienes el plan base o puedes comenzar a publicar directamente/i)).toBeVisible();
    });
});
