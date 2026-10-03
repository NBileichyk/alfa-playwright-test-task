import { Locator, expect } from '@playwright/test';

/**
 * Represents a single product card component used across multiple pages.
 * Encapsulates all product card elements and their interactions.
 */
export class ProductCardComponent {
  readonly searchIcon: Locator;
  readonly imageWrapper: Locator;
  readonly name: Locator;
  readonly manufacturer: Locator;
  readonly regularPrice: Locator;
  readonly campaignPrice: Locator;
  readonly saleSticker: Locator;

  constructor(private productCardLocator: Locator) {
    this.searchIcon = productCardLocator.locator('.fa-search');
    this.imageWrapper = productCardLocator.locator('.image-wrapper');
    this.name = productCardLocator.locator('.name');
    this.manufacturer = productCardLocator.locator('.manufacturer');
    this.regularPrice = productCardLocator.locator('.regular-price');
    this.campaignPrice = productCardLocator.locator('.campaign-price');
    this.saleSticker = productCardLocator.locator('.sticker.sale[title="On Sale"]');
  }

  /**
   * Clicks on the product card image to navigate to the product page
   */
  async clickImage() {
    await this.imageWrapper.click();
  }

  /**
   * Clicks on the search icon to view product details
   */
  async clickSearchIcon() {
    await this.searchIcon.click();
  }

  /**
   * Gets the product name text
   */
  async getProductName(): Promise<string> {
    return (await this.name.innerText()).trim();
  }

  async getProductUrl(): Promise<string> {
    const productUrl = await this.productCardLocator.locator('a').first().getAttribute('href');

    if (!productUrl) {
      throw new Error('Could not read the product URL from the product card.');
    }

    return productUrl;
  }

  /**
   * Gets the manufacturer name text
   */
  async getManufacturer(): Promise<string> {
    return (await this.manufacturer.innerText()).trim();
  }

  /**
   * Gets the regular price text
   */
  async getRegularPrice(): Promise<string> {
    return (await this.regularPrice.innerText()).trim();
  }

  /**
   * Gets the campaign price text
   */
  async getCampaignPrice(): Promise<string> {
    return (await this.campaignPrice.innerText()).trim();
  }

  /**
   * Checks if the product has a sale sticker (is on sale)
   */
  async isOnSale(): Promise<boolean> {
    return await this.saleSticker.isVisible();
  }

  /**
   * Checks if the product is discounted (has campaign price and sale sticker)
   */
  async isDiscounted(): Promise<boolean> {
    const hasCampaignPrice = await this.campaignPrice.isVisible();
    const hasSaleSticker = await this.isOnSale();
    return hasCampaignPrice && hasSaleSticker;
  }

  /**
   * Verifies the product card is visible
   */
  async verifyCardIsVisible() {
    await expect(this.productCardLocator).toBeVisible();
  }

  /**
   * Verifies the sale sticker is visible
   */
  async verifySaleStickerIsVisible() {
    await expect(this.saleSticker).toBeVisible();
  }

  /**
   * Gets the underlying locator for the product card
   */
  getLocator(): Locator {
    return this.productCardLocator;
  }
}
