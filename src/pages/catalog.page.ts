import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class CatalogPage extends BasePage {
  readonly sliderWrapper: Locator;
  readonly boxLogotypes: Locator;
  readonly mostPopularSection: Locator;
  readonly mostPopularTitle: Locator;
  readonly boxCampaigns: Locator;
  readonly campaignsTitle: Locator;
  readonly latestProductsSection: Locator;
  readonly latestProductsTitle: Locator;

  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    this.sliderWrapper = page.locator('#slider-wrapper');
    this.boxLogotypes = page.locator('#box-logotypes');

    this.mostPopularSection = page.locator('#box-most-popular');
    this.mostPopularTitle = this.mostPopularSection
      .locator('h3.title')
      .filter({ hasText: 'Most Popular' });

    this.boxCampaigns = page.locator('#box-campaigns');
    this.campaignsTitle = this.boxCampaigns.locator('h3.title').filter({ hasText: 'Campaigns' });

    this.latestProductsSection = page.locator('#box-latest-products');
    this.latestProductsTitle = this.latestProductsSection
      .locator('h3.title')
      .filter({ hasText: 'Latest Products' });

    this.productCards = page.locator(
      '.listing-wrapper.products .product.column.shadow.hover-light'
    );
  }

  getProductElements(productCardLocator: Locator) {
    return {
      searchIcon: productCardLocator.locator('.fa-search'),
      imageWrapper: productCardLocator.locator('.image-wrapper'),
      name: productCardLocator.locator('.name'),
      manufacturer: productCardLocator.locator('.manufacturer'),
      regularPrice: productCardLocator.locator('.regular-price'),
      campaignPrice: productCardLocator.locator('.campaign-price'),
      saleSticker: productCardLocator.locator('.sticker.sale[title="On Sale"]'),
    };
  }

  /**
   * Filters products strictly within the specified section based on the discount status.
   * @param sectionLocator Locator of the target section (e.g., this.latestProductsSection)
   * @param isDiscounted true - for discounted products, false - for non-discounted products
   */
  private async getFilteredProducts(
    sectionLocator: Locator,
    isDiscounted: boolean
  ): Promise<Locator[]> {
    const allProductsInSection = sectionLocator.locator('.product.column.shadow.hover-light');
    const totalCount = await allProductsInSection.count();
    const filteredLocators: Locator[] = [];

    for (let i = 0; i < totalCount; i++) {
      const product = allProductsInSection.nth(i);
      const hasCampaignPrice = await product.locator('.campaign-price').isVisible();
      const hasSaleSticker = await product.locator('.sticker.sale[title="On Sale"]').isVisible();

      // Determine if the product is on sale
      const productIsDiscounted = hasCampaignPrice && hasSaleSticker;

      // Match against the requested isDiscounted flag
      if (isDiscounted === productIsDiscounted) {
        filteredLocators.push(product);
      }
    }

    return filteredLocators;
  }

  // 1. Select a product WITHOUT discount by index from the filtered section list
  async clickProductWithoutDiscount(sectionLocator: Locator, productIndex: number = 0) {
    const nonDiscountedProducts = await this.getFilteredProducts(sectionLocator, false);

    if (nonDiscountedProducts.length === 0) {
      throw new Error('No regular (non-discounted) products found in the specified section.');
    }

    if (productIndex >= nonDiscountedProducts.length) {
      throw new Error(
        `Product index ${productIndex} is out of bounds. Only ${nonDiscountedProducts.length} non-discounted products available.`
      );
    }

    await nonDiscountedProducts[productIndex].locator('.image-wrapper').click();
  }

  // 2. Select a product WITH discount by index from the filtered section list
  async clickProductWithDiscount(sectionLocator: Locator, productIndex: number = 0) {
    const discountedProducts = await this.getFilteredProducts(sectionLocator, true);

    if (discountedProducts.length === 0) {
      throw new Error('No discounted products found in the specified section.');
    }

    if (productIndex >= discountedProducts.length) {
      throw new Error(
        `Product index ${productIndex} is out of bounds. Only ${discountedProducts.length} discounted products available.`
      );
    }

    await discountedProducts[productIndex].locator('.image-wrapper').click();
  }

  // Legacy fallback method
  async addFirstProductToCart() {
    await this.clickProductWithoutDiscount(this.mostPopularSection, 0);
  }
}
