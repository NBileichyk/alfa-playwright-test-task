import { Page, Locator, expect } from '@playwright/test';
import { HOMEPAGE_CONSTANTS } from '../constants/homepage.constants';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  recentlyViewedProductsBox: Locator;
  recentlyViewedProducts: Locator;
  recentlyViewedTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.recentlyViewedProductsBox = page.locator('#box-recently-viewed-products');
    this.recentlyViewedTitle = this.recentlyViewedProductsBox
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.recentlyViewedTitle });
    this.recentlyViewedProducts = this.recentlyViewedProductsBox.locator('.list-horizontal li');
  }

  async verifyRecentlyViewedProductsInOrder(productUrls: string[]): Promise<void> {
    await expect(this.recentlyViewedProductsBox).toBeVisible();
    await expect(this.recentlyViewedTitle).toBeVisible();
    await expect(this.recentlyViewedProducts).toHaveCount(productUrls.length);

    for (const [index, productUrl] of productUrls.entries()) {
      const productSlug = productUrl.split('/').pop() || '';

      const linkElement = this.recentlyViewedProducts.nth(index).locator('a');
      const href = await linkElement.getAttribute('href');

      expect(href).toContain(productSlug);
    }
  }
}
