import { Page, Locator, expect } from '@playwright/test';
import { CHECKOUT_PAGE_CONSTANTS } from '../constants/checkout.constants';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  readonly backLink: Locator;
  readonly emptyCartMessage: Locator;
  readonly confirmOrderButton: Locator;
  readonly orderSuccessMessage: Locator;
  private readonly homeLink: Locator;
  private readonly orderSummaryTable: Locator;
  private readonly removeCartItemButtons: Locator;

  constructor(page: Page) {
    super(page);
    this.emptyCartMessage = page.getByText(CHECKOUT_PAGE_CONSTANTS.emptyCartMessage);
    this.backLink = page.getByRole('link').getByText(CHECKOUT_PAGE_CONSTANTS.backLink);
    this.confirmOrderButton = page.getByRole('button', {
      name: CHECKOUT_PAGE_CONSTANTS.confirmOrderButton,
    });
    this.orderSuccessMessage = page.getByRole('heading', {
      name: CHECKOUT_PAGE_CONSTANTS.orderSuccessMessage,
    });
    this.homeLink = page.getByRole('link', {
      name: CHECKOUT_PAGE_CONSTANTS.homeLink,
      exact: true,
    });
    this.orderSummaryTable = page.locator('#order_confirmation-wrapper table.dataTable');
    this.removeCartItemButtons = page.getByRole('button', {
      name: CHECKOUT_PAGE_CONSTANTS.removeCartItemButton,
    });
  }

  async clickBackLink() {
    await this.backLink.click();
  }

  async clickConfirmOrder() {
    await this.confirmOrderButton.click();
  }

  async verifyCheckoutPageIsLoaded() {
    await expect(this.page).toHaveURL(/.*checkout/);
  }

  async verifyOrderSuccess() {
    await expect(this.orderSuccessMessage).toBeVisible();
  }

  async clickHomeAfterSuccessfulOrder() {
    if (await this.orderSuccessMessage.isVisible()) {
      await this.homeLink.click();
    }
  }

  async clearCart() {
    while ((await this.removeCartItemButtons.count()) > 0) {
      const previousCount = await this.removeCartItemButtons.count();
      await this.removeCartItemButtons.first().click();
      await expect(this.removeCartItemButtons).toHaveCount(previousCount - 1);
    }

    await expect(this.emptyCartMessage).toBeVisible();
  }

  async clearExistingCart() {
    if (await this.cart.hasItems()) {
      await this.cart.clickCheckoutLink();
      await this.clearCart();
    }
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
}
