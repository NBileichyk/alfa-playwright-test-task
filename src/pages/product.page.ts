import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  // Page sections and elements
  readonly breadcrumbs: Locator;
  readonly productTitle: Locator;
  readonly mainImage: Locator;
  readonly saleSticker: Locator;
  readonly informationBlock: Locator;
  readonly tabsBlock: Locator;
  readonly alsoPurchasedProductsBox: Locator;
  readonly similarProductsBox: Locator;

  // Action elements on product page (e.g. Add to cart button)
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);

    this.breadcrumbs = page.locator('#breadcrumbs');
    this.productTitle = page.locator('#box-product .title');
    this.mainImage = page.locator('.main-image');
    this.saleSticker = page.locator('.sticker.sale[title="On Sale"]');
    this.informationBlock = page.locator('.information');
    this.tabsBlock = page.locator('.tabs');
    this.alsoPurchasedProductsBox = page.locator('#box-also-purchased-products');
    this.similarProductsBox = page.locator('#box-similar-products');

    // Common add to cart button on product page
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i });
  }

  // Actions
  async addProductToCart() {
    await this.addToCartButton.click();
  }

  // Verifications / Assertions
  async verifyProductPageIsLoaded() {
    await expect(this.productTitle).toBeVisible();
    await expect(this.mainImage).toBeVisible();
    await expect(this.informationBlock).toBeVisible();
  }

  async verifySaleStickerIsVisible() {
    await expect(this.saleSticker).toBeVisible();
  }
}
