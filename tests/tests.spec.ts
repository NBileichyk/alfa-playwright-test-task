import { test, expect } from '../src/fixtures/myFixtures';

test('case 1 - Заказ одного товара без скидки', async ({
  catalogPage,
  checkoutPage,
  productPage,
  loginAsUser,
}) => {
  await test.step('Login with an existed user', async () => {
    await loginAsUser('standardUser');
  });

  await test.step('Check that the Cart is empty', async () => {
    await catalogPage.cart.verifyCartIsVisible();
    await catalogPage.cart.verifyCartIsEmpty();
  });

  await test.step('Go to the Checkout to recheck that there is no orders', async () => {
    await catalogPage.cart.clickCheckoutLink();
    await expect(checkoutPage.emptyCartMessage).toBeVisible();
    await checkoutPage.clickBackLink();
  });

  await test.step('Check main store blocks visibility', async () => {
    await expect(catalogPage.sliderWrapper).toBeVisible();
    await expect(catalogPage.boxLogotypes).toBeVisible();
    await expect(catalogPage.mostPopularTitle).toBeVisible();
  });

  await test.step('Verify first product card elements in Most Popular section', async () => {
    // Get the first product card inside Most Popular section
    const firstCard = catalogPage.mostPopularSection
      .locator('.product.column.shadow.hover-light')
      .first();
    const product = catalogPage.getProductElements(firstCard);

    // Verify product elements are visible and contain data
    await expect(product.imageWrapper).toBeVisible();
    await expect(product.name).not.toBeEmpty();
    // await expect(product.regularPrice).not.toBeEmpty();
  });

  await test.step('Click on the 1st product (index 0) with discount in Campaigns section', async () => {
    await catalogPage.clickProductWithDiscount(catalogPage.boxCampaigns, 0);
    await expect(productPage.mainImage).toBeVisible();
  });

  // await test.step('Click on the 1st product (index 0) without discount in Most Popular section', async () => {
  //   // Передаем секцию (Most Popular) и индекс товара (1 — второй в списке)
  //   await catalogPage.clickProductWithoutDiscount(catalogPage.mostPopularSection, 0);

  //   await expect(productPage.mainImage).toBeVisible();
  // });
});
