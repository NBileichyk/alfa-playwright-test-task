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

The default shop URL is `https://litecart.stqa.ru/`. To use another test
instance, set `BASE_URL` in a `.env` file at the project root (the Playwright
configuration loads it with `dotenv`):

```dotenv
BASE_URL=https://your-test-shop.example/
```

Use test accounts only; authenticated test data is maintained in
`src/data/users.json`. Do not put real or production credentials in source
control.

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

Run the linter:

```bash
npm run lint
```

The Playwright configuration runs Chromium by default. Tests run in parallel
locally; on CI they run with one worker and up to two retries. Screenshots are
captured for tests, videos are retained on failure, and traces are collected on
the first retry.

## Test coverage

- `tests/login.spec.ts` — successful and rejected login attempts.
- `tests/guest-orders.spec.ts` — adding multiple products to the cart as a
  guest and checking the order summary.
- `tests/orders.spec.ts` — authenticated order scenarios, including products
  with and without discounts and cart quantity checks.

The page objects, UI components, reusable fixtures, test data, and selectors
are organized under `src/`:

- `src/pages/` — page-level actions and assertions.
- `src/components/` — reusable UI components such as the cart.
- `src/fixtures/` — Playwright fixtures and authenticated-user setup.
- `src/constants/` — page and UI text constants.
- `src/data/` — test account data.

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
directories are ignored by Git.

## GitHub Actions

The workflow in `.github/workflows/playwright.yml` runs on pushes, pull
requests, manual dispatch, and weekdays at 08:00 UTC. It installs Node.js 20,
Chromium, and Java 17, runs the tests, and uploads:

- `allure-report` — Allure HTML report (30-day retention).
- `playwright-html-report` — Playwright HTML report (30-day retention).
- `test-results-debug` — screenshots, videos, traces, and other test artifacts
  (7-day retention).

Download these artifacts from the completed workflow run in the GitHub Actions
tab. The workflow's manual browser selector currently does not change the
configured project: the Playwright configuration runs Chromium.
