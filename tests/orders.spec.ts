import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { HOMEPAGE_CONSTANTS } from '../src/constants/homepage.constants';
import { ProductHelper } from '../src/helpers/product.helper';

test.describe('Order a product without discount', () => {
  test.use({ userRole: 'standardUser_1' });
  const expectedQuantity = 3;
  const itemPrice = 20;
  const expectedTotal = expectedQuantity * itemPrice;
  let productName: string;

  test('Order one product without discount', async ({
    homePage,
    categoryPage,
    productPage,
    checkoutPage,
  }) => {
    await test.step('Prepare an empty cart', async () => {
      await checkoutPage.clearExistingCart();
      await homePage.openHomePage();
    });

    await test.step('Add a product with discount to the cart', async () => {
      await categoryPage.openCategory();
      const firstProduct = await ProductHelper.getProductByDiscountStatus(
        categoryPage.productsListing,
        true,
        0
      );
      productName = await firstProduct.getProductName();
      await firstProduct.clickImage();
    });

    await test.step('Check the product details on the product page', async () => {
      await productPage.verifyProductTitle(productName);
      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.saleSticker).toHaveCount(1);
    });

    await test.step('Select one product without discount', async () => {
      await homePage.clickMostPopularProductByName(HOMEPAGE_CONSTANTS.greenDuckProduct);

      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.productTitle).toHaveText(HOMEPAGE_CONSTANTS.greenDuckProduct);
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
    const discountPrice = 18;
    const expectedTotal = expectedQuantity * discountPrice;

    await test.step('Prepare an empty cart', async () => {
      await checkoutPage.clearExistingCart();
      await homePage.openHomePage();
    });

    await test.step('Select one product with discount', async () => {
      await ProductHelper.clickProductByDiscountStatus(homePage.campaignsSection.locator, true, 0);

      await expect(productPage.mainImage).toBeVisible();
      await expect(productPage.productTitle).toBeVisible();
    });

    await test.step('Add 2 units of the selected product to the cart', async () => {
      await productPage.addProducts(expectedQuantity);
      await homePage.cart.verifyCartSummary(expectedQuantity);
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
