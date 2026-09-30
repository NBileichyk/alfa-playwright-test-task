import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  // Main page sections
  readonly sliderWrapper: Locator;
  readonly boxLogotypes: Locator;

  // Section: Most Popular
  readonly mostPopularSection: Locator;
  readonly mostPopularTitle: Locator;

  // Section: Campaigns
  readonly campaignsSection: Locator;
  readonly campaignsTitle: Locator;

  // Section: Latest Products
  readonly latestProductsSection: Locator;
  readonly latestProductsTitle: Locator;

  // Global product card elements (can be used inside any products container)
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    // 1 & 2. Main top blocks
    this.sliderWrapper = page.locator('#slider-wrapper');
    this.boxLogotypes = page.locator('#box-logotypes');

    // 3. Most Popular block
    this.mostPopularSection = page.locator('#box-most-popular');
    this.mostPopularTitle = this.mostPopularSection
      .locator('h3.title')
      .filter({ hasText: 'Most Popular' });

    // 4. Campaigns block
    this.campaignsSection = page.locator('#box-campaigns');
    this.campaignsTitle = this.campaignsSection
      .locator('h3.title')
      .filter({ hasText: 'Campaigns' });

    // 5. Latest Products block
    this.latestProductsSection = page.locator('#box-latest-products');
    this.latestProductsTitle = this.latestProductsSection
      .locator('h3.title')
      .filter({ hasText: 'Latest Products' });

    // General selector for product cards across the page or inside product wrappers
    this.productCards = page.locator(
      '.listing-wrapper.products .product.column.shadow.hover-light'
    );
  }

  // Helper getters for elements inside a specific product card
  // index - 0-based index of the product card on the page
  getProductElements(productCardLocator: Locator) {
    return {
      searchIcon: productCardLocator.locator('.fa-search'),
      imageWrapper: productCardLocator.locator('.image-wrapper'),
      name: productCardLocator.locator('.name'),
      manufacturer: productCardLocator.locator('.manufacturer'),
      price: productCardLocator.locator('.price'),
    };
  }

  // Actions
  async clickFirstMostPopularProduct() {
    const firstProduct = this.mostPopularSection
      .locator('.product.column.shadow.hover-light')
      .first();
    await firstProduct.locator('.image-wrapper').click();
  }

  async addFirstProductToCart() {
    // Legacy support for your previous steps: clicks the first product in Most Popular
    await this.clickFirstMostPopularProduct();
  }
}
