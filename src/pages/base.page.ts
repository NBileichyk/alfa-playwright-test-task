import { expect, Page } from '@playwright/test';
import { CartComponent } from '../components/cart.component';
import { SiteMenuComponent } from '../components/site-menu.component';

export class BasePage {
  protected page: Page;
  readonly cart: CartComponent;
  readonly siteMenu: SiteMenuComponent;

  constructor(page: Page) {
    this.page = page;
    this.cart = new CartComponent(page);
    this.siteMenu = new SiteMenuComponent(page);
  }

  async navigate(path: string = '/') {
    await this.page.goto(path);
  }

  async openHomePage(): Promise<void> {
    await this.siteMenu.openHomePage();
  }

  async openCheckoutPage(): Promise<void> {
    await this.cart.clickCart();
    await expect(this.page).toHaveURL(/checkout/i);
  }
}
