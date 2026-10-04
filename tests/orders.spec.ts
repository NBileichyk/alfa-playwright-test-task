import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { ProductHelper } from '../src/helpers/product.helper';

test.describe('Order a product without discount', () => {
  test.use({ userRole: 'standardUser_1' });

  test('Order a product without discount and change the quantity', async ({
    homePage,
    categoryPage,
    checkoutPage,
    productPage,
  }) => {
    const expectedQuantity = 3;
    let expectedTotal = 0;
    let productTitle: string;

    await test.step('Prepare an empty cart', async () => {
      await homePage.navigate('/checkout');
      await checkoutPage.clearExistingCart();
      await checkoutPage.openCategoryPage();
    });

    await test.step('Select the product without discount', async () => {
      const selectedProduct = await ProductHelper.getProductByDiscountStatus(
        categoryPage.products.locator,
        false,
        1
      );

      const itemPrice = await ProductHelper.convertPriceToNumber(
        await selectedProduct.getPriceText('price')
      );
      expectedTotal = itemPrice * expectedQuantity;
      productTitle = await selectedProduct.getProductName();
      await selectedProduct.clickImage();

      await productPage.verifyProductTitle(productTitle);
      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.saleSticker).toHaveCount(0);
    });

    await test.step(`Add ${expectedQuantity} units of the selected product to the cart`, async () => {
      await productPage.addProducts(expectedQuantity);

      await homePage.cart.verifyCartIsVisible();
      await homePage.cart.verifyCartQuantity(expectedQuantity);
    });

    await test.step('Go to the checkout page and verify the order data', async () => {
      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.clickConfirmOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });
});

test.describe('Order a product with discount', () => {
  test.use({ userRole: 'standardUser_2' });

  test('Order a product with discount and change the quantity', async ({
    homePage,
    productPage,
    categoryPage,
    checkoutPage,
  }) => {
    const expectedQuantity = 2;
    let expectedTotal = 0;
    let productTitle: string;

    await test.step('Prepare an empty cart', async () => {
      await homePage.navigate('/checkout');
      await checkoutPage.clearExistingCart();
      await checkoutPage.openCategoryPage();
    });

    await test.step('Select the product with discount', async () => {
      const selectedProduct = await ProductHelper.getProductByDiscountStatus(
        categoryPage.products.locator,
        true,
        0
      );

      const itemPrice = await ProductHelper.convertPriceToNumber(
        await selectedProduct.getPriceText('campaign')
      );
      expectedTotal = itemPrice * expectedQuantity;
      productTitle = await selectedProduct.getProductName();
      await selectedProduct.clickImage();

      await productPage.verifyProductTitle(productTitle);
      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.saleSticker).toHaveCount(1);
    });

    await test.step(`Add ${expectedQuantity} units of the selected product to the cart`, async () => {
      await productPage.addProducts(expectedQuantity);

      await homePage.cart.verifyCartIsVisible();
      await homePage.cart.verifyCartQuantity(expectedQuantity);
    });

    await test.step('Go to the checkout page and verify the order data', async () => {
      await checkoutPage.openCheckoutPage();
      await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
    });

    await test.step('Confirm the order', async () => {
      await checkoutPage.clickConfirmOrder();
      await checkoutPage.verifyOrderSuccess();
    });
  });
});
