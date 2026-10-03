import { expect, Locator, Page } from '@playwright/test';
import { ProductSectionComponent } from '../components/product-section.component';
import { COMMON_CONSTANTS } from '../constants/common.constants';
import { BasePage } from './base.page';

export type SelectedProduct = {
  name: string;
  url: string;
};

export class CategoryPage extends BasePage {
  readonly categoryTitle: Locator;
  readonly filters: Locator;
  readonly categoriesListing: Locator;
  readonly productsListing: Locator;
  readonly products: ProductSectionComponent;

  constructor(page: Page) {
    super(page);

    this.categoryTitle = page.locator('h1.title');
    this.filters = page.locator('nav.filter');
    this.categoriesListing = page.locator('.listing-wrapper.categories');
    this.productsListing = page.locator('.listing-wrapper.products');
    this.products = new ProductSectionComponent(this.productsListing, 'Category products');
  }

  async openCategory(): Promise<void> {
    await this.siteMenu.clickCategoryLink();
    await expect(this.categoryTitle).toHaveText(COMMON_CONSTANTS.categoryName);
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async openProductByIndex(index: number): Promise<SelectedProduct> {
    const product = await this.products.getProductByIndex(index);
    const selectedProduct = {
      name: await product.getProductName(),
      url: await product.getProductUrl(),
    };

    await product.clickImage();
    return selectedProduct;
  }
}
