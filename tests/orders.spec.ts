import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

test.describe('Order one product with different quantity', () => {
  test('Order a product without discount', async ({ homePage, productPage, checkoutPage }) => {
    test.use({ userRole: 'standardUser_1' });
    const expectedQuantity = 3;
    let expectedTotal = 0;
    let productTitle: string;

    await test.step('Prepare an empty cart', async () => {
      await checkoutPage.clearExistingCart();
      await homePage.openHomePage();
    });

    await test.step('Select the product without discount', async () => {
      const selectedProduct = await ProductHelper.getProductByDiscountStatus(
        homePage.mostPopularSection.locator,
        false,
        0
      );

      const itemPrice = await ProductHelper.convertPriceToNumber(
        await selectedProduct.getRegularPrice()
      );
      expectedTotal = itemPrice * expectedQuantity;
      productTitle = await selectedProduct.getProductName();
      await selectedProduct.clickImage();

      await productPage.verifyProductTitle(productTitle);
      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.saleSticker).toHaveCount(0);
    });

    await test.step('Add 3 units of the selected product to the cart', async () => {
      await productPage.addProducts(expectedQuantity);

      await homePage.cart.verifyCartIsVisible();
      await homePage.cart.verifyCartQuantity(expectedQuantity);
    });

    await test.step('Go to the checkout page', async () => {
      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.clickConfirmOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });

  test('Order a product with discount', async ({ homePage, productPage, checkoutPage }) => {
    test.use({ userRole: 'standardUser_2' });
    const expectedQuantity = 2;
    let expectedTotal = 0;
    let productTitle: string;

    await test.step('Prepare an empty cart', async () => {
      await checkoutPage.clearExistingCart();
      await homePage.openHomePage();
    });

    await test.step('Select the product without discount', async () => {
      const selectedProduct = await ProductHelper.getProductByDiscountStatus(
        homePage.mostPopularSection.locator,
        true,
        0
      );

      const itemPrice = await ProductHelper.convertPriceToNumber(
        await selectedProduct.getRegularPrice()
      );
      expectedTotal = itemPrice * expectedQuantity;
      productTitle = await selectedProduct.getProductName();
      await selectedProduct.clickImage();

      await productPage.verifyProductTitle(productTitle);
      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.saleSticker).toHaveCount(0);
    });

    await test.step('Add 3 units of the selected product to the cart', async () => {
      await productPage.addProducts(expectedQuantity);

      await homePage.cart.verifyCartIsVisible();
      await homePage.cart.verifyCartQuantity(expectedQuantity);
    });

    await test.step('Go to the checkout page', async () => {
      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.clickConfirmOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });
});
