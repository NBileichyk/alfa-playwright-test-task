import { Locator, Page } from '@playwright/test';
import { ProductCardComponent } from './product-card.component';
import { ProductHelper } from '../helpers/product.helper';

export class ProductSectionComponent {
  locator: Locator;
  sectionName: string;

  constructor(locator: Locator, sectionName: string) {
    this.locator = locator;
    this.sectionName = sectionName;
  }

  static byName(page: Page, sectionName: string): ProductSectionComponent {
    const title = page.getByRole('heading', { name: sectionName, exact: true });
    const locator = page.locator('[id^="box-"]').filter({ has: title });

    return new ProductSectionComponent(locator, sectionName);
  }

  async getProducts(): Promise<ProductCardComponent[]> {
    return ProductHelper.getAllProducts(this.locator);
  }

  async getProductByIndex(index: number = 0): Promise<ProductCardComponent> {
    const product = await ProductHelper.getProductByIndex(this.locator, index);

    if (!product) {
      throw new Error(`No product at index ${index} in the "${this.sectionName}" section.`);
    }

    return product;
  }

  async findProductByName(productName: string): Promise<ProductCardComponent | null> {
    return ProductHelper.findProductByName(this.locator, productName);
  }

  async getProductByDiscountStatus(
    isDiscounted: boolean,
    index: number = 0
  ): Promise<ProductCardComponent> {
    return ProductHelper.getProductByDiscountStatus(this.locator, isDiscounted, index);
  }

  async clickProductByIndex(index: number = 0): Promise<void> {
    const product = await this.getProductByIndex(index);
    await product.clickImage();
  }

  async clickProductByName(productName: string): Promise<void> {
    const product = await this.findProductByName(productName);

    if (!product) {
      throw new Error(`Product "${productName}" not found in the "${this.sectionName}" section.`);
    }

    await product.clickImage();
  }
}
