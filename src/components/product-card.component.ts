import { Locator } from '@playwright/test';

export class ProductCardComponent {
  searchIcon: Locator;
  imageWrapper: Locator;
  name: Locator;
  manufacturer: Locator;
  regularPrice: Locator;
  campaignPrice: Locator;
  price: Locator;
  saleSticker: Locator;

  constructor(private productCardLocator: Locator) {
    this.searchIcon = productCardLocator.locator('.fa-search');
    this.imageWrapper = productCardLocator.locator('.image-wrapper');
    this.name = productCardLocator.locator('.name');
    this.manufacturer = productCardLocator.locator('.manufacturer');
    this.regularPrice = productCardLocator.locator('.regular-price');
    this.campaignPrice = productCardLocator.locator('.campaign-price');
    this.price = productCardLocator.locator('.price');
    this.saleSticker = productCardLocator.locator('.sticker.sale[title="On Sale"]');
  }

  async clickImage() {
    await this.imageWrapper.click();
  }

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

  async isDiscounted(): Promise<boolean> {
    const hasCampaignPrice = await this.campaignPrice.isVisible();
    const hasSaleSticker = await this.saleSticker.isVisible();
    return hasCampaignPrice && hasSaleSticker;
  }

  async getPriceText(type: 'regular' | 'campaign' | 'price' = 'price'): Promise<string> {
    let targetLocator: Locator;

    switch (type) {
      case 'regular':
        targetLocator = this.regularPrice;
        break;
      case 'campaign':
        targetLocator = this.campaignPrice;
        break;
      case 'price':
      default:
        targetLocator = this.price;
        break;
    }

    const priceText = await targetLocator.innerText();
    return priceText.trim();
  }
}
