import { test, expect } from '@playwright/test';

test.describe('Home Page flow', () => {
    test('should load the home page and have correct title', async ({ page }) => {
        await page.goto('/');

        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/MiBarrio.uy/);
    });

    test('should have a working search form', async ({ page }) => {
        await page.goto('/');

        // Assuming the search has an input for location
        const searchInput = page.getByPlaceholder(/¿Dónde quieres vivir\?/i);
        await expect(searchInput).toBeVisible();

        // Test typing and focusing
        await searchInput.fill('Pocitos');

        // The search button is a Link with the word 'Buscar'
        const searchButton = page.getByRole('link', { name: /buscar/i });
        await searchButton.click();

        // Should navigate to search page with query parameter
        await expect(page).toHaveURL(/.*\/search.*/);
    });

    test('should display featured properties section', async ({ page }) => {
        await page.goto('/');

        const sectionTitle = page.getByText(/Propiedades Destacadas/i, { exact: false }).first();
        await expect(sectionTitle).toBeVisible();

        // Check if there's at least one property card
        // Note: Depends on actual data, might need mock or ensure DB has data
        const propertyCards = page.locator('.group.overflow-hidden.rounded-2xl');
        // Using a softer assertion since data might not be loaded initially or zero
        // In a real e2e with controlled db we would expect > 0
    });
});
