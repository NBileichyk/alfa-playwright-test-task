import { Locator, Page } from '@playwright/test';

export class SiteMenuComponent {
  private readonly menu: Locator;
  private readonly homeLink: Locator;
  private readonly categoryLink: Locator;

  constructor(page: Page) {
    this.menu = page.locator('#nav.site-menu');
    this.homeLink = this.menu.locator('.general-0');
    this.categoryLink = this.menu.locator('category-1 > a');
  }

  async openHomePage(): Promise<void> {
    await this.homeLink.click();
  }

  async clickCategoryLink(): Promise<void> {
    await this.categoryLink.click();
  }
}
