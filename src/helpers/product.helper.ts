import { Locator } from '@playwright/test';
import { ProductCardComponent } from '../components/product-card.component';

/**
 * Helper functions for product-related operations used across multiple pages.
 * Handles product filtering, selection, and interaction logic.
 */
export class ProductHelper {
  /**
   * Filters products within a section based on discount status.
   * @param sectionLocator Locator of the target section (e.g., homepage sections)
   * @param isDiscounted true - for discounted products, false - for non-discounted products
   * @returns Array of ProductCardComponent instances matching the discount status
   */
  static async getFilteredProducts(
    sectionLocator: Locator,
    isDiscounted: boolean
  ): Promise<ProductCardComponent[]> {
    const allProductsInSection = sectionLocator.locator('.product.column.shadow.hover-light');
    const totalCount = await allProductsInSection.count();
    const filteredProducts: ProductCardComponent[] = [];

    for (let i = 0; i < totalCount; i++) {
      const productLocator = allProductsInSection.nth(i);
      const productCard = new ProductCardComponent(productLocator);

      const productIsDiscounted = await productCard.isDiscounted();

      if (isDiscounted === productIsDiscounted) {
        filteredProducts.push(productCard);
      }
    }

    return filteredProducts;
  }

  /**
   * Gets all product cards from a section.
   * @param sectionLocator Locator of the target section
   * @returns Array of ProductCardComponent instances
   */
  static async getAllProducts(sectionLocator: Locator): Promise<ProductCardComponent[]> {
    const allProductsInSection = sectionLocator.locator('.product.column.shadow.hover-light');
    const totalCount = await allProductsInSection.count();
    const products: ProductCardComponent[] = [];

    for (let i = 0; i < totalCount; i++) {
      const productLocator = allProductsInSection.nth(i);
      products.push(new ProductCardComponent(productLocator));
    }

    return products;
  }

  /**
   * Finds a product by name within a section.
   * @param sectionLocator Locator of the target section
   * @param productName Name of the product to find
   * @returns ProductCardComponent instance or null if not found
   */
  static async findProductByName(
    sectionLocator: Locator,
    productName: string
  ): Promise<ProductCardComponent | null> {
    const products = await ProductHelper.getAllProducts(sectionLocator);

    for (const product of products) {
      const name = await product.getProductName();
      if (name === productName) {
        return product;
      }
    }

    return null;
  }

  /**
   * Gets a product at a specific index within a section.
   * @param sectionLocator Locator of the target section
   * @param index Zero-based index
   * @returns ProductCardComponent instance or null if index is out of bounds
   */
  static async getProductByIndex(
    sectionLocator: Locator,
    index: number = 0
  ): Promise<ProductCardComponent | null> {
    const products = await ProductHelper.getAllProducts(sectionLocator);

    if (index < 0 || index >= products.length) {
      return null;
    }

    return products[index];
  }

  /**
   * Gets a product by discount status at a specific index.
   * @param sectionLocator Locator of the target section
   * @param isDiscounted Whether to get a discounted product (true) or non-discounted (false)
   * @param index Zero-based index among products matching the discount status
   * @returns ProductCardComponent instance
   * @throws Error if product not found or index out of bounds
   */
  static async getProductByDiscountStatus(
    sectionLocator: Locator,
    isDiscounted: boolean,
    index: number = 0
  ): Promise<ProductCardComponent> {
    const matchingProducts = await ProductHelper.getFilteredProducts(sectionLocator, isDiscounted);
    const discountLabel = isDiscounted ? 'discounted' : 'regular (non-discounted)';

    if (matchingProducts.length === 0) {
      throw new Error(`No ${discountLabel} products found in the specified section.`);
    }

    if (!Number.isInteger(index) || index < 0 || index >= matchingProducts.length) {
      throw new Error(
        `Product index ${index} is out of bounds. Only ${matchingProducts.length} ${discountLabel} products available.`
      );
    }

    return matchingProducts[index];
  }

  /**
   * Clicks a product by its discount status and optional index.
   * @param sectionLocator Locator of the target section
   * @param isDiscounted Whether to select a discounted product (true) or non-discounted (false)
   * @param index Zero-based index among products matching the discount status
   * @throws Error if product not found or index out of bounds
   */
  static async clickProductByDiscountStatus(
    sectionLocator: Locator,
    isDiscounted: boolean,
    index: number = 0
  ): Promise<void> {
    const product = await ProductHelper.getProductByDiscountStatus(
      sectionLocator,
      isDiscounted,
      index
    );
    await product.clickImage();
  }

  /**
   * Clicks a product by name within a section.
   * @param sectionLocator Locator of the target section
   * @param productName Name of the product to click
   * @throws Error if product not found
   */
  static async clickProductByName(sectionLocator: Locator, productName: string): Promise<void> {
    const product = await ProductHelper.findProductByName(sectionLocator, productName);

    if (!product) {
      throw new Error(`Product "${productName}" not found in the specified section.`);
    }

    await product.clickImage();
  }

  /**
   * Clicks a product at a specific index within a section.
   * @param sectionLocator Locator of the target section
   * @param index Zero-based index
   * @throws Error if product not found
   */
  static async clickProductByIndex(sectionLocator: Locator, index: number = 0): Promise<void> {
    const product = await ProductHelper.getProductByIndex(sectionLocator, index);

    if (!product) {
      throw new Error(`No product found at index ${index} in the specified section.`);
    }

    await product.clickImage();
  }
}
