import { authenticatedTest as test } from '../src/fixtures/authenticated-user.fixture';
import { expect } from '../src/fixtures/page.fixtures';
import { HOMEPAGE_CONSTANTS } from '../src/constants/homepage.constants';

test.describe('Authenticated order flows', () => {
  test.describe('Standard user 1', () => {
    test.use({ userRole: 'standardUser_1' });

    test('Order one product without discount', async ({
      page,
      homePage,
      productPage,
      checkoutPage,
    }) => {
      const expectedQuantity = 3;
      const itemPrice = 20;
      const expectedTotal = expectedQuantity * itemPrice;

      await test.step('Prepare an empty cart', async () => {
        await checkoutPage.clearExistingCart();
        await homePage.navigate('/');
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

      await test.step('Go to the cart', async () => {
        await homePage.cart.clickCheckoutLink();

        await expect(page).toHaveURL(/checkout|cart/i);
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

    test('Order one product with discount', async ({
      page,
      homePage,
      productPage,
      checkoutPage,
    }) => {
      const expectedQuantity = 2;
      const discountPrice = 18;
      const expectedTotal = expectedQuantity * discountPrice;

      await test.step('Prepare an empty cart', async () => {
        await checkoutPage.clearExistingCart();
        await homePage.navigate('/');
      });

      await test.step('Select one product with discount', async () => {
        await homePage.clickProductByDiscountStatus(homePage.boxCampaigns, true, 0);

        await expect(productPage.mainImage).toBeVisible();
        await expect(productPage.productTitle).toBeVisible();
      });

      await test.step('Add 2 units of the selected product to the cart', async () => {
        await productPage.addProducts(expectedQuantity);
        await homePage.cart.verifyCartSummary(expectedQuantity);
      });

      await test.step('Go to the cart', async () => {
        await homePage.cart.clickCheckoutLink();

        await expect(page).toHaveURL(/checkout|cart/i);
        await checkoutPage.verifyOrderSummary([expectedQuantity], expectedTotal);
      });

      await test.step('Confirm the order', async () => {
        await checkoutPage.clickConfirmOrder();
        await checkoutPage.verifyOrderSuccess();
      });
    });
  });
});
