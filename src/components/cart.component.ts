import { Page, Locator, expect } from '@playwright/test';
import { COMMON_CONSTANTS } from '../constants/common.constants';

export class CartComponent {
  private readonly cartWrapper: Locator;

  readonly image: Locator;
  readonly content: Locator;
  readonly cartText: Locator;
  readonly quantity: Locator;
  readonly formattedValue: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.cartWrapper = page.locator('#cart-wrapper > #cart');

    this.image = this.cartWrapper.locator('a.image');
    this.checkoutLink = this.cartWrapper
      .locator('a.link')
      .filter({ hasText: COMMON_CONSTANTS.checkoutLink });

    // Sub-elements inside the content block
    this.content = this.cartWrapper.locator('a.content');
    this.cartText = this.content.getByText(COMMON_CONSTANTS.cartLabel);
    this.quantity = this.content.locator('.quantity');
    this.formattedValue = this.content.locator('.formatted_value');
  }

  async clickCart() {
    await this.cartWrapper.click();
  }

  async clickCheckoutLink() {
    await this.checkoutLink.click();
  }

  async verifyCartIsVisible() {
    await expect(this.cartWrapper).toBeVisible();
  }

  async hasItems(): Promise<boolean> {
    const quantityText = await this.quantity.textContent();
    return Number(quantityText ?? 0) > 0;
  }

  async getTotal(): Promise<number> {
    const formattedTotal = await this.formattedValue.innerText();
    const amount = formattedTotal.replace(/[^0-9.-]/g, '');
    const total = Number(amount);

    if (amount === '' || !Number.isFinite(total)) {
      throw new Error(`Unable to read the cart total from "${formattedTotal}".`);
    }

    return total;
  }

  async verifyCartSummary(expectedQuantity: number, expectedTotal?: number) {
    await this.verifyCartQuantity(expectedQuantity);

    if (expectedTotal !== undefined) {
      await this.verifyCartTotal(expectedTotal);
    }
  }

  // Verify expected quantity of items in the cart
  async verifyCartQuantity(expectedQuantity: number) {
    await expect(this.quantity).toHaveText(expectedQuantity.toString());
  }

  // Verify expected total price formatted value
  async verifyCartTotal(expectedTotal: number) {
    await expect(this.formattedValue).toHaveText(`$${expectedTotal.toString()}`);
  }

  // Verify that the cart is empty
  async verifyCartIsEmpty() {
    await this.verifyCartQuantity(0);
  }
}
