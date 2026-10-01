import { Page, Locator } from '@playwright/test';
import { HOMEPAGE_CONSTANTS } from '../constants/homepage.constants';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly sliderWrapper: Locator;
  readonly boxLogotypes: Locator;
  readonly mostPopularSection: Locator;
  readonly mostPopularTitle: Locator;
  readonly boxCampaigns: Locator;
  readonly campaignsTitle: Locator;
  readonly latestProductsSection: Locator;
  readonly latestProductsTitle: Locator;
  readonly recentlyViewedProductsBox: Locator;
  readonly recentlyViewedProducts: Locator;
  readonly recentlyViewedTitle: Locator;

  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);

    this.sliderWrapper = page.locator('#slider-wrapper');
    this.boxLogotypes = page.locator('#box-logotypes');

    this.mostPopularSection = page.locator('#box-most-popular');
    this.mostPopularTitle = this.mostPopularSection
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.mostPopularTitle });

    this.boxCampaigns = page.locator('#box-campaigns');
    this.campaignsTitle = this.boxCampaigns
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.campaignsTitle });

    this.latestProductsSection = page.locator('#box-latest-products');
    this.latestProductsTitle = this.latestProductsSection
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.latestProductsTitle });
    this.recentlyViewedProductsBox = page.locator('#box-recently-viewed-products');
    this.recentlyViewedTitle = this.recentlyViewedProductsBox
      .locator('h3.title')
      .filter({ hasText: HOMEPAGE_CONSTANTS.recentlyViewedTitle });
    this.recentlyViewedProducts = this.recentlyViewedProductsBox.locator('.list-horizontal li');

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

  getMostPopularProduct(index: number = 0): Locator {
    return this.mostPopularSection.locator('.product.column.shadow.hover-light').nth(index);
  }

  async clickMostPopularProductByName(productName: string) {
    const products = this.mostPopularSection.locator('.product.column.shadow.hover-light');
    const productCount = await products.count();

    for (let index = 0; index < productCount; index++) {
      const product = products.nth(index);
      const name = await product.locator('.name').innerText();

      if (name.trim() === productName) {
        await product.locator('.image-wrapper').click();
        return;
      }
    }

    throw new Error(
      `Product "${productName}" was not found in the ${HOMEPAGE_CONSTANTS.mostPopularTitle} section.`
    );
  }

  async clickProductImage(productCardLocator: Locator) {
    await productCardLocator.locator('.image-wrapper').click();
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

  /**
   * Selects and opens a product at the given index within a section, filtered by whether it is discounted.
   * @param sectionLocator Locator of the product section to search.
   * @param isDiscounted Set to true to select a discounted product, or false to select a regular product.
   * @param productIndex Zero-based index among products matching the discount status.
   */
  async clickProductByDiscountStatus(
    sectionLocator: Locator,
    isDiscounted: boolean,
    productIndex: number = 0
  ) {
    const matchingProducts = await this.getFilteredProducts(sectionLocator, isDiscounted);
    const discountLabel = isDiscounted ? 'discounted' : 'regular (non-discounted)';

    if (matchingProducts.length === 0) {
      throw new Error(`No ${discountLabel} products found in the specified section.`);
    }

    if (
      !Number.isInteger(productIndex) ||
      productIndex < 0 ||
      productIndex >= matchingProducts.length
    ) {
      throw new Error(
        `Product index ${productIndex} is out of bounds. Only ${matchingProducts.length} ${discountLabel} products available.`
      );
    }

    await matchingProducts[productIndex].locator('.image-wrapper').click();
  }

  // Legacy fallback method
  async addFirstProductToCart() {
    await this.clickProductByDiscountStatus(this.mostPopularSection, false);
  }
}
