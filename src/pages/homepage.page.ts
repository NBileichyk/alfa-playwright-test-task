import { Page, Locator, expect } from '@playwright/test';
import { HOMEPAGE_CONSTANTS } from '../constants/homepage.constants';
import { BasePage } from './base.page';
import { ProductSectionComponent } from '../components/product-section.component';

export class HomePage extends BasePage {
  sliderWrapper: Locator;
  boxLogotypes: Locator;
  mostPopularSection: ProductSectionComponent;
  mostPopularTitle: Locator;
  campaignsSection: ProductSectionComponent;
  campaignsTitle: Locator;
  latestProductsSection: ProductSectionComponent;
  latestProductsTitle: Locator;
  recentlyViewedProductsBox: Locator;
  recentlyViewedProducts: Locator;
  recentlyViewedTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.sliderWrapper = page.locator('#slider-wrapper');
    this.boxLogotypes = page.locator('#box-logotypes');

    this.mostPopularSection = ProductSectionComponent.byName(
      page,
      HOMEPAGE_CONSTANTS.mostPopularTitle
    );
    this.mostPopularTitle = page
      .locator('#box-most-popular')
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.mostPopularTitle });

    this.campaignsSection = ProductSectionComponent.byName(page, HOMEPAGE_CONSTANTS.campaignsTitle);
    this.campaignsTitle = page
      .locator('#box-campaigns')
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.campaignsTitle });

    this.latestProductsSection = ProductSectionComponent.byName(
      page,
      HOMEPAGE_CONSTANTS.latestProductsTitle
    );
    this.latestProductsTitle = page
      .locator('#box-latest-products')
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.latestProductsTitle });
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
      // Extract the last segment of the URL (e.g. "purple-duck-p-5")
      const productSlug = productUrl.split('/').pop() || '';

      const linkElement = this.recentlyViewedProducts.nth(index).locator('a');
      const href = await linkElement.getAttribute('href');

      // Verify that the href ends with the product slug
      expect(href).toContain(productSlug);
    }
  }
}
