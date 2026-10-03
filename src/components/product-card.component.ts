import { Locator } from '@playwright/test';

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
   * Checks if the product is discounted (has campaign price and sale sticker)
   */
  async isDiscounted(): Promise<boolean> {
    const hasCampaignPrice = await this.campaignPrice.isVisible();
    const hasSaleSticker = await this.saleSticker.isVisible();
    return hasCampaignPrice && hasSaleSticker;
  }
}
