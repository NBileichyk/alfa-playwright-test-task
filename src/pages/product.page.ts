import { Page, Locator, expect } from '@playwright/test';
import { PRODUCT_PAGE_CONSTANTS } from '../constants/product.constants';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {
  readonly productTitle: Locator;
  readonly mainImage: Locator;
  readonly saleSticker: Locator;
  readonly addToCartButton: Locator;
  private readonly quantityInput: Locator;
  private readonly optionSelects: Locator;

  constructor(page: Page) {
    super(page);

    this.productTitle = page.locator('#box-product .title');
    this.mainImage = page.locator('.main-image');
    this.saleSticker = page.locator('#box-product .sticker.sale[title="On Sale"]');
    this.addToCartButton = page.getByRole('button', {
      name: PRODUCT_PAGE_CONSTANTS.addToCartButton,
    });
    this.quantityInput = page.locator('#box-product input[name="quantity"]');
    this.optionSelects = page.locator('#box-product select');
  }

  async verifyProductTitle(expectedTitle: string): Promise<void> {
    await expect(this.productTitle).toHaveText(expectedTitle);
  }

  async addProducts(count: number) {
    if (!Number.isInteger(count) || count < 1) {
      throw new Error(`Product quantity must be a positive integer; received "${count}".`);
    }

    await this.selectAvailableOptions();

    const quantityBeforeAdd = Number((await this.cart.quantity.textContent()) ?? 0);
    await this.quantityInput.fill(String(count));
    await this.addToCartButton.click();
    await expect(this.cart.quantity).toHaveText(String(quantityBeforeAdd + count));
  }

  async addProductToCart() {
    await this.addProducts(1);
  }

  private async selectAvailableOptions() {
    const selectCount = await this.optionSelects.count();

    for (let index = 0; index < selectCount; index++) {
      const select = this.optionSelects.nth(index);
      const availableOptions = select.locator('option:not([disabled])');
      const optionCount = await availableOptions.count();

      for (let optionIndex = 0; optionIndex < optionCount; optionIndex++) {
        const option = availableOptions.nth(optionIndex);
        const value = await option.getAttribute('value');
        const label = (await option.textContent())?.trim() ?? '';

        if ((value ?? label).trim() === '') {
          continue;
        }

        if (value !== null) {
          await select.selectOption(value);
        } else {
          await select.selectOption({ label });
        }
        break;
      }
    }
  }
}
