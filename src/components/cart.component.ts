import { Page, Locator, expect } from '@playwright/test';

export class CartComponent {
  cartWrapper: Locator;
  content: Locator;
  quantity: Locator;
  totalPrice: Locator;

  constructor(page: Page) {
    this.cartWrapper = page.locator('#cart-wrapper > #cart');
    this.content = this.cartWrapper.locator('a.content');
    this.quantity = this.content.locator('.quantity');
    this.totalPrice = this.content.locator('.formatted_value');
  }

  async clickCart() {
    await this.cartWrapper.click();
  }

  async verifyCartIsVisible() {
    await expect(this.cartWrapper).toBeVisible();
  }

  async getTotal(): Promise<number> {
    const formattedTotal = await this.totalPrice.innerText();
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

  async verifyCartQuantity(expectedQuantity: number) {
    await expect(this.quantity).toHaveText(expectedQuantity.toString());
  }

  async verifyCartTotal(expectedTotal: number) {
    await expect(this.totalPrice).toHaveText(`$${expectedTotal.toFixed(0)}`);
  }
}
