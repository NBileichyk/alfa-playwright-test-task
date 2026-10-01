# Playwright tests

## Allure report locally

Allure results are collected automatically whenever you run the Playwright tests:

```bash
npm ci
npx playwright install chromium
npm test
```

Java is required to generate and open the report. Then run:

```bash
npm run allure:generate
npm run allure:open
```

The generated HTML report is in `allure-report/`; raw test results are in
`allure-results/`. Both directories are ignored by Git.

## Allure report in GitHub Actions

The Playwright workflow runs on pushes, pull requests, manual dispatch, and its
weekday schedule. It generates the Allure report even when tests fail and uploads
it as the `allure-report` workflow artifact. Download the artifact from the
completed workflow run to view the report locally. Test results, traces, and
screenshots are uploaded separately for debugging.
