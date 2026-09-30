import { Page, Locator, expect } from '@playwright/test';

export class CartComponent {
  private readonly page: Page;
  private readonly cartWrapper: Locator;

  readonly image: Locator;
  readonly content: Locator;
  readonly cartText: Locator;
  readonly quantity: Locator;
  readonly formattedValue: Locator;
  readonly checkoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartWrapper = page.locator('#cart-wrapper > #cart');

    this.image = this.cartWrapper.locator('a.image');

    // Sub-elements inside the content block
    this.content = this.cartWrapper.locator('a.content');
    this.cartText = this.content.locator('text=Cart:');
    this.quantity = this.content.locator('.quantity');
    this.formattedValue = this.content.locator('.formatted_value');

    // Selector for the link with the exact text "Checkout"
    this.checkoutLink = this.cartWrapper.locator('a.link').filter({ hasText: 'Checkout' });
  }

  async clickCheckoutLink() {
    await this.checkoutLink.click();
  }

  async verifyCartIsVisible() {
    await expect(this.cartWrapper).toBeVisible();
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
    this.verifyCartQuantity(0);
    this.verifyCartQuantity(0);
  }
}
