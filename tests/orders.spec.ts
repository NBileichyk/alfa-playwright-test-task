import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

test.describe('Order a product without discount', () => {
  test.use({ userRole: 'standardUser_1' });
  const expectedQuantity = 3;

  test('Order one product without discount', async ({
    homePage,
    productPage,
    checkoutPage,
  }) => {
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

      const itemPrice = await selectedProduct.getPrice();
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

test.describe('Standard user 2', () => {
  test.use({ userRole: 'standardUser_2' });

  test('Order one product with discount', async ({ homePage, productPage, checkoutPage }) => {
    const expectedQuantity = 2;
    let expectedTotal = 0;

    await test.step('Prepare an empty cart', async () => {
      await checkoutPage.clearExistingCart();
      await homePage.openHomePage();
    });

    await test.step('Select one product with discount', async () => {
      const selectedProduct = await ProductHelper.getProductByDiscountStatus(
        homePage.campaignsSection.locator,
        true
      );
      const itemPrice = await selectedProduct.getPrice();
      expectedTotal = itemPrice * expectedQuantity;
      await selectedProduct.clickImage();

      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.productTitle).toBeVisible();
    });

    await test.step('Add 2 units of the selected product to the cart', async () => {
      await productPage.addProducts(expectedQuantity);
      await homePage.cart.verifyCartSummary(expectedQuantity);
    });

    await test.step('Go to the cart', async () => {
      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.clickConfirmOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });
});
