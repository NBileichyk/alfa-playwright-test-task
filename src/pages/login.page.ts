import { Page, Locator, expect } from '@playwright/test';
import { LOGIN_PAGE_CONSTANTS } from '../constants/login.constants';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  readonly invalidLoginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.getByRole('button', { name: LOGIN_PAGE_CONSTANTS.loginButton });
    this.invalidLoginErrorMessage = page.locator('.notice.errors, .notice.warning, .notice');
  }

  async login(email: string, pass: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(pass);
    await this.loginButton.click();
  }

  async loginWithCredentials(email: string, pass: string) {
    await this.login(email, pass);
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

  // Method to verify the successful login message with dynamic first and last name
  async verifySuccessfulLogin(firstName: string, lastName: string) {
    await expect(this.getSuccessfulLoginMessage(firstName, lastName)).toBeVisible();
  }

  getSuccessfulLoginMessage(firstName: string, lastName: string): Locator {
    return this.page.locator('.notice.success').filter({
      hasText: `${LOGIN_PAGE_CONSTANTS.successfulLoginMessagePrefix} ${firstName} ${lastName}`,
    });
  }
}
