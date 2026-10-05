# Litecart end-to-end tests

Automated browser tests for the Litecart demo shop, written in TypeScript with
Playwright Test. The suite covers login, guest checkout, and order flows for
products with and without discounts.

## Requirements

- Node.js 20 or later and npm
- Chromium (installed through Playwright)
- Java 17 or later to generate or open the Allure report

## Installation

Install dependencies and the browser used by the current Playwright
configuration:

```bash
npm ci
npx playwright install chromium
```

The default shop URL is `https://litecart.stqa.ru/`. Copy `.env.example` to
`.env` and provide the test-account values there. The Playwright configuration
loads this file with `dotenv`; account credentials and names are read from
environment variables and are not stored in the repository:

```dotenv
BASE_URL=https://your-test-shop.example/
TEST_USER_1_EMAIL=
TEST_USER_1_PASSWORD=
TEST_USER_1_FIRST_NAME=
TEST_USER_1_LAST_NAME=
TEST_USER_2_EMAIL=
TEST_USER_2_PASSWORD=
TEST_USER_2_FIRST_NAME=
TEST_USER_2_LAST_NAME=
```

Use dedicated test accounts only; never put real or production credentials in
source control. Configure the same `TEST_USER_*` values as GitHub Actions
repository secrets to run the CI workflow. For compatibility, account 1 also
accepts the legacy `TEST_USER_EMAIL` and `TEST_USER_PASSWORD` names. Account
first and last names are optional and are only used to check the displayed name
in the successful-login notice.

## Running tests

Run the complete suite:

```bash
npm test
```

Run a specific test file or match tests by title:

```bash
npx playwright test tests/login.spec.ts
npm test -- --grep "Order a product without discount"
```

Run tests in a visible browser, use Playwright's interactive UI, or start the
debugger:

```bash
npm run test:headed
npm run test:ui
npm run test:debug
```

Run the linter and TypeScript check:

```bash
npm run lint
npm run typecheck
```

The Playwright configuration runs Chromium. Tests run in parallel locally; on
CI they run with one worker and up to two retries. Screenshots are captured for
tests, videos are retained on failure, and traces are collected on the first
retry.

## Test coverage

- `tests/login.spec.ts` — successful and rejected login attempts, including
  CSS selectors.
- `src/pages/base.page.ts` — URL checks using regular expressions.
- `tests/guest-orders.spec.ts` — adding multiple products to the cart as a
  guest and checking the independently calculated order total.
- `tests/orders.spec.ts` — parameterized authenticated order scenarios,
  including products with and without discounts and cart quantity checks.
- `src/pages/checkout.page.ts` — checkout summary located with XPath.

The page objects, UI components, reusable fixtures, test data, and selectors
are organized under `src/`:

- `src/pages/` — page-level actions and assertions.
- `src/components/` — reusable UI components such as the cart.
- `src/fixtures/` — Playwright fixtures and authenticated-user setup.
- `src/constants/` — page and UI text constants.
- `src/data/` — test account configuration loaded from environment variables.

## Test reports

Playwright's HTML report is generated automatically when tests run. Open the
latest report with:

```bash
npm run report
```

Allure results are also collected automatically. Java is required to generate
and open the Allure HTML report:

```bash
npm run allure:generate
npm run allure:open
```

Generated reports and raw results are written to `playwright-report/`,
`allure-report/`, and `allure-results/`. Playwright failure artifacts, such as
screenshots, videos, and traces, are written to `test-results/`. These generated
directories are ignored by Git and ESLint.

## GitHub Actions

The workflow in `.github/workflows/playwright.yml` runs on pushes, pull
requests, manual dispatch, and weekdays at 06:17 UTC (09:17 Minsk time). GitHub
scheduled workflows run only from the repository's default branch and may be
delayed during periods of high Actions load. It installs Node.js 20, Chromium,
and Java 17, runs the tests, and uploads:

- `allure-report` — Allure HTML report (30-day retention).
- `playwright-html-report` — Playwright HTML report (30-day retention).
- `test-results-debug` — screenshots, videos, traces, and other test artifacts
  (7-day retention).

Download these artifacts from the completed workflow run in the GitHub Actions
tab. Manual, push, pull-request, and scheduled runs all use Chromium.
