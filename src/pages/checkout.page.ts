import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly backLink: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyCartMessage = page.getByText('There are no items in your cart.');
    this.backLink = page.getByRole('link').getByText('Back');
  }

  async clickBackLink() {
    await this.backLink.click();
  }

  async verifyCheckoutPageIsLoaded() {
    await expect(this.page).toHaveURL(/.*checkout/);
  }
}
