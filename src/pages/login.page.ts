import { Page, Locator, expect } from '@playwright/test';
import { LOGIN_PAGE_CONSTANTS } from '../constants/login.constants';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
  invalidLoginErrorMessage: Locator;
  successfulLoginMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: LOGIN_PAGE_CONSTANTS.loginButton });
    this.invalidLoginErrorMessage = page.locator('.notice.errors');
    this.successfulLoginMessage = page.locator('.notice.success');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async logout() {
    const logoutLink = this.page
      .locator('#box-account')
      .getByRole('link', { name: LOGIN_PAGE_CONSTANTS.logoutLink });

    const logoutUrl = await logoutLink.getAttribute('href');
    if (!logoutUrl) {
      throw new Error('Could not find the logout URL in the account menu.');
    }

    const response = await this.page.request.get(logoutUrl);
    await expect(response).toBeOK();

    await this.page.reload();
    await expect(logoutLink).toHaveCount(0);
  }

  async verifySuccessfulLoginMessage(firstName?: string, lastName?: string) {
    await expect(this.successfulLoginMessage).toBeVisible();
    await expect(this.successfulLoginMessage).toContainText(
      LOGIN_PAGE_CONSTANTS.successfulLoginMessagePrefix
    );

    if (firstName && lastName) {
      await expect(this.successfulLoginMessage).toContainText(`${firstName} ${lastName}`);
    }

    await expect(this.successfulLoginMessage).toHaveCSS(
      'background-color',
      LOGIN_PAGE_CONSTANTS.successBackgroundColor
    );
  }

  async verifyInvalidLoginErrorMessage() {
    await expect(this.invalidLoginErrorMessage).toBeVisible();
    await expect(this.invalidLoginErrorMessage).toContainText(
      LOGIN_PAGE_CONSTANTS.invalidLoginMessage
    );
    await expect(this.invalidLoginErrorMessage).toHaveCSS(
      'background-color',
      LOGIN_PAGE_CONSTANTS.errorBackgroundColor
    );
  }
}
