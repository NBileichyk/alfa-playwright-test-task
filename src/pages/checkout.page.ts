import { Page, Locator, expect } from '@playwright/test';
import { CHECKOUT_PAGE_CONSTANTS } from '../constants/checkout.constants';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  backLink: Locator;
  emptyCartMessage: Locator;
  confirmOrderButton: Locator;
  orderSuccessMessage: Locator;
  billingAddressSection: Locator;
  shippingAddressSection: Locator;
  shippingAddressCheckBox: Locator;
  orderSummaryTable: Locator;
  commentSection: Locator;
  removeCartItemButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.backLink = page.getByRole('link').getByText(CHECKOUT_PAGE_CONSTANTS.backLink);
    this.emptyCartMessage = page.getByText(CHECKOUT_PAGE_CONSTANTS.emptyCartMessage);
    this.orderSuccessMessage = page.getByRole('heading', {
      name: CHECKOUT_PAGE_CONSTANTS.orderSuccessMessage,
    });
    this.billingAddressSection = page.locator('.billing-address');
    this.shippingAddressSection = page.locator('.shipping-address');
    this.shippingAddressCheckBox = page.locator('input[name="different_shipping_address"]');
    this.orderSummaryTable = page.locator('#order_confirmation-wrapper table.dataTable');
    this.commentSection = page.locator('textarea[name="comments"]');
    this.confirmOrderButton = page.locator('button[name="confirm_order"][value="Confirm Order"]');
    this.removeCartItemButtons = page.getByRole('button', { name: 'Remove', exact: true });
  }

  async verifyOrderSummary(expectedQuantities: number[], expectedTotal: number) {
    await expect(this.orderSummaryTable).toBeVisible();

    const quantityCounts = new Map<number, number>();
    for (const quantity of expectedQuantities) {
      quantityCounts.set(quantity, (quantityCounts.get(quantity) ?? 0) + 1);
    }

    for (const [quantity, count] of quantityCounts) {
      await expect(
        this.orderSummaryTable.getByRole('cell', { name: String(quantity), exact: true })
      ).toHaveCount(count);
    }

    await expect(this.orderSummaryTable).toContainText(`$${expectedTotal.toFixed(2)}`);
  }

  async clearCart() {
    while ((await this.removeCartItemButtons.count()) > 0) {
      const previousCount = await this.removeCartItemButtons.count();
      await this.removeCartItemButtons.first().click();
      await expect(this.removeCartItemButtons).toHaveCount(previousCount - 1);
    }

    //await expect(this.emptyCartMessage).toBeVisible();
  }

  async clearExistingCart() {
    if ((await this.removeCartItemButtons.count()) > 0) {
      await this.clearCart();
    }
  }

  async clickBackLink() {
    await this.backLink.click();
  }

  async clickConfirmOrder() {
    await this.confirmOrderButton.click();
  }

  async verifyOrderSuccess() {
    await expect(this.orderSuccessMessage).toBeVisible();
  }
}
